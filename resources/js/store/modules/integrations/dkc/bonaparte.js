import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
    namespaced: true,
    actions: {
        async fetchWebshopProductsFromFeed({ dispatch }) {
            let products = []

            const apiUrl = `admins/bonaparte-products?force_refresh=false`
            await axios.get(apiUrl).then(async response => {
                const responseProducts = response.data

                // Transform the BAP products to Kollekt products
                for (const product of responseProducts) {
                    const productId = product.id.split('-')[0]
                    // Check if the product already exists
                    const existingProduct = products.find(x => x.datasource_id == productId)

                    // Instantiate a new product variant
                    const newProductVariant = await dispatch(
                        'products/instantiateNewProductVariant',
                        {
                            color: product.color,
                            name: product.color,
                            pictures: [{ name: 'image_link', url: product.image_link }],
                            ean_sizes: product.sizes.map(sizeDetail => ({
                                size: sizeDetail.size,
                                ref_id: sizeDetail.gtin,
                                ean: sizeDetail.gtin,
                            })),
                        },
                        {
                            root: true,
                        }
                    )

                    if (existingProduct) {
                        existingProduct.variants.push(newProductVariant)
                    } else {
                        const newProduct = await dispatch(
                            'products/instantiateNewProduct',
                            {
                                datasource_id: productId,
                                sale_description: product.description,
                                category: product.title,
                                prices: [
                                    {
                                        currency: product.price.currency,
                                        recommended_retail_price: product.price.price,
                                        wholesale_price: 0,
                                    },
                                ],
                                brand: product.brand,
                                title: product.long_title,
                                variants: [newProductVariant],
                            },
                            {
                                root: true,
                            }
                        )
                        products.push(newProduct)
                    }
                }
            })

            return products
        },
        async fetchProductsBySearch({ dispatch, rootGetters }, searchString) {
            const enabledFeatures = rootGetters['workspaces/getEnabledFeatures']
            let baseUrl = null
            const locale = 'DA_DK'
            const theLocale = locale ? locale.toLowerCase().replaceAll('_', '-') : 'da-dk'
            if (enabledFeatures.play_shop_bap_qa) {
                baseUrl = `https://search-bap-qa.bap-test.com/api/${theLocale}/v1.0/product/search`
            }
            if (enabledFeatures.play_shop_bonaparte) {
                baseUrl = `https://search.bonaparteshop.com/api/${theLocale}/v1.0/product/search`
            }
            if (enabledFeatures.play_shop_companys) {
                baseUrl = `https://search.companys.com/api/${theLocale}/v1.0/product/search`
            }
            if (!baseUrl) {
                console.error('No PLAY product integration')
                return
            }

            const apiUrl = `http-proxy/proxy`
            let searchResult
            await axios
                .post(apiUrl, {
                    proxy_url: `${baseUrl}?sort=standard&facet=styleBrand&facet=productColorGroupRGBMain&facet=productQualityDKC&facet=styleProgram&q=${searchString}&take=20&from=0`,
                })
                .then(response => {
                    searchResult = response.data
                })
                .catch(err => {
                    console.log('error when fetching products by search', err.message)
                })

            const searchProducts = searchResult.products ? searchResult.products : []

            // Init products from the search results
            const products = []
            // Transform the BAP products to Kollekt products
            for (const productGroup of searchProducts) {
                for (const product of productGroup) {
                    const productId = product.id.split('-')[0]
                    // Check if the product already exists
                    const existingProduct = products.find(x => x.datasource_id == productId)

                    if (
                        existingProduct &&
                        existingProduct.variants.find(variant => variant.color == product.colorName)
                    ) {
                        continue
                    }

                    // Update prices
                    const dkcLocaleMap = rootGetters['integrationDkc/getLocales']
                    const currency = locale
                        ? dkcLocaleMap.find(localeMap => localeMap.locale == locale).currency
                        : 'DKK'

                    const price = product.beforePrice
                        ? parseFloat(product.beforePrice.replaceAll(',', '.').replaceAll(/[^(0-9|.)]/g, ''))
                        : product.priceRaw
                    const currentPrice = product.beforePrice ? product.priceRaw : 0

                    // Instantiate a new product variant
                    const newProductVariant = await dispatch(
                        'products/instantiateNewProductVariant',
                        {
                            color: product.colorName,
                            name: product.colorName,
                            prices: [
                                {
                                    recommended_retail_price: price,
                                    wholesale_price: currentPrice,
                                    currency,
                                },
                            ],
                            pictures: product.images
                                .sort((a, b) => {
                                    if (a.type == 'Pack' && b.type != 'Pack') {
                                        return -1
                                    }
                                    if (a.perspectiveKey != b.perspectiveKey) {
                                        return parseInt(a.perspectiveKey) - parseInt(b.perspectiveKey)
                                    }
                                    return parseInt(a.viewKey) - parseInt(b.viewKey)
                                })
                                .map(image => ({
                                    url: `${image.url}&w=232&h=348`,
                                    name: `type=${image.type}&perspectiveKey=${image.perspectiveKey}&viewKey="${image.viewKey}`,
                                })),
                            ean_sizes: !product.availableSizes
                                ? []
                                : Object.keys(product.availableSizes).map((sizeDetail, index) => ({
                                      size: sizeDetail,
                                      ref_id: null,
                                      ean: null,
                                      quantity: Object.values(product.availableSizes)[index] == true ? 1 : 0,
                                  })),
                        },
                        {
                            root: true,
                        }
                    )

                    if (existingProduct) {
                        existingProduct.variants.push(newProductVariant)
                    } else {
                        const newProduct = await dispatch(
                            'products/instantiateNewProduct',
                            {
                                datasource_id: productId,
                                sale_description: product.description,
                                category: product.styleShopItemGroup,
                                brand: product.brand,
                                title: product.name,
                                variants: [newProductVariant],
                            },
                            {
                                root: true,
                            }
                        )
                        products.push(newProduct)
                    }
                }
            }
            // END Instantiate products

            await dispatch('products/initProducts', products, { root: true })

            return products
        },
        async fetchProduct({ rootGetters }, { product, locale }) {
            const enabledFeatures = rootGetters['workspaces/getEnabledFeatures']
            let baseUrl = null
            const theLocale = locale ? locale.toLowerCase().replaceAll('_', '-') : 'da-dk'
            if (enabledFeatures.play_shop_bap_qa) {
                baseUrl = `https://search-bap-qa.bap-test.com/api/${theLocale}/v2.0/Product/GetStyle`
                // ?style=30306309&includeVariantNo=194023`
            }
            if (enabledFeatures.play_shop_bonaparte) {
                baseUrl = `https://search.bonaparteshop.com/api/${theLocale}/v2.0/Product/GetStyle`
            }
            if (enabledFeatures.play_shop_companys) {
                baseUrl = `https://search.companys.com/api/${theLocale}/v2.0/Product/GetStyle`
            }
            if (!baseUrl) {
                console.error('No PLAY product integration')
                return
            }
            const apiUrl = `http-proxy/proxy`
            let fetchedProduct
            await axios
                .post(apiUrl, {
                    proxy_url: `${baseUrl}?style=${product.datasource_id}`,
                })
                .then(response => {
                    fetchedProduct = response.data
                })
                .catch(err => {
                    console.log('error fetching bonaparte product', err.message)
                })
            return fetchedProduct
        },
        async syncProducts({ dispatch, rootGetters }, { products, locale }) {
            for (const product of products) {
                const newProductData = await dispatch('fetchProduct', { product, locale })
                if (!newProductData || !newProductData.variants || newProductData.variants.length <= 0) continue
                const firstVariant = Object.values(newProductData.variants)[0]

                // Update base product
                // product.name =
                product.brand = newProductData.styleBrand
                product.name = firstVariant.productHeader
                product.composition = newProductData.productCompositionDKC
                product.sale_description = `${newProductData.styleFitting1 ? `${newProductData.styleFitting1}\n` : ''}${
                    newProductData.styleFitting2 ? `${newProductData.styleFitting2}\n` : ''
                }${newProductData.styleFitting3 ? `${newProductData.styleFitting3}\n` : ''}${
                    newProductData.styleFitting4 ? `${newProductData.styleFitting4}\n` : ''
                }${newProductData.styleFitting5 ? `${newProductData.styleFitting5}\n` : ''}`

                // Update variants
                product.variants.map(variant => {
                    const newVariantData = Object.values(newProductData.variants).find(newVariantData => {
                        return variant.ean_sizes.find(sizeObj =>
                            newVariantData.skUs.find(sku => sizeObj.ean == sku.ean)
                        )
                    })
                    if (!newVariantData) return

                    variant.name = newVariantData.productColorName

                    // Update prices
                    const dkcLocaleMap = rootGetters['integrationDkc/getLocales']
                    const currency = locale
                        ? dkcLocaleMap.find(localeMap => localeMap.locale == locale).currency
                        : 'DKK'

                    const newPrice = newVariantData.beforePrice
                        ? parseFloat(newVariantData.beforePrice.replaceAll(',', '.').replaceAll(/[^(0-9|.)]/g, ''))
                        : newVariantData.priceRaw
                    const newSalePrice = newVariantData.beforePrice ? newVariantData.priceRaw : 0

                    if (variant.prices.length <= 0) {
                        variant.prices.push({
                            recommended_retail_price: newPrice,
                            wholesale_price: newSalePrice,
                            currency,
                        })
                    } else {
                        variant.prices[0].recommended_retail_price = newPrice
                        variant.prices[0].wholesale_price = newSalePrice
                        variant.prices[0].currency = currency
                    }

                    // END Update prices

                    // Update stock
                    variant.ean_sizes.map(sizeObj => {
                        // Find the new size data
                        const newSizeData = newVariantData.skUs.find(sku => sizeObj.ean == sku.ean)
                        if (!newSizeData) return
                        sizeObj.quantity = newSizeData.inStock
                    })
                })
            }
        },
    },
}
