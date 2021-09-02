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
            let endpoint = null
            const enabledFeatures = rootGetters['workspaces/getEnabledFeatures']
            if (enabledFeatures.play_shop_bap_qa) {
                endpoint = 'BapQA'
            }
            if (enabledFeatures.play_shop_bonaparte) {
                endpoint = 'Bonaparteshop'
            }
            if (enabledFeatures.play_shop_companys) {
                endpoint = 'Companys'
            }
            if (!endpoint) {
                console.error('No PLAY product integration')
                return
            }

            const apiUrl = `admins/search-bap-qa-search?sort=standard&from=0&take=40&q=${searchString}?endpoint="${endpoint}"`
            let searchResult
            await axios
                .get(apiUrl)
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

                    // Instantiate a new product variant
                    const newProductVariant = await dispatch(
                        'products/instantiateNewProductVariant',
                        {
                            color: product.colorName,
                            name: product.colorName,
                            pictures: [{ name: 'image_link', url: product.image_link }],
                            pictures: product.images.map(image => ({
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
                        // Calc prices
                        const newPrice = product.beforePrice
                            ? parseFloat(product.beforePrice.replaceAll(',', '.'))
                            : product.priceRaw
                        const newSalePrice = product.beforePrice ? product.priceRaw : 0

                        const newProduct = await dispatch(
                            'products/instantiateNewProduct',
                            {
                                datasource_id: productId,
                                sale_description: product.description,
                                category: product.styleShopItemGroup,
                                prices: [
                                    {
                                        currency: 'DKK',
                                        recommended_retail_price: newPrice,
                                        wholesale_price: newSalePrice,
                                    },
                                ],
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
            let endpoint = null
            const enabledFeatures = rootGetters['workspaces/getEnabledFeatures']
            if (enabledFeatures.play_shop_bap_qa) {
                endpoint = 'Bonaparteshop'
            }
            if (enabledFeatures.play_shop_bonaparte) {
                endpoint = 'Bonaparteshop'
            }
            if (enabledFeatures.play_shop_companys) {
                endpoint = 'Companys'
            }
            if (!endpoint) {
                console.error('No PLAY product integration')
                return
            }
            const apiUrl = `admins/search-bap-qa-getstyle?style=${product.datasource_id}&endpoint="${endpoint}"${
                locale ? `&locale=${locale}` : ''
            }`
            let fetchedProduct
            await axios
                .get(apiUrl)
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
                        sizeObj.quantity = newSizeData.stockCount
                    })
                })
            }
        },
    },
}
