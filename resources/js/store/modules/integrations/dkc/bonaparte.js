import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
    namespaced: true,
    actions: {
        async fetchWebshopProductsFromFeed({ dispatch }) {
            let products = []
            console.log('fetchy fethcy')

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
        async fetchProductsBySearch({ dispatch }, searchString) {
            const apiUrl = `admins/search-bap-qa-search?sort=standard&from=0&take=40&q=${searchString}`
            let searchResult
            await axios.get(apiUrl).then(response => {
                searchResult = response.data
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
                        const newProduct = await dispatch(
                            'products/instantiateNewProduct',
                            {
                                datasource_id: productId,
                                sale_description: product.description,
                                category: product.styleShopItemGroup,
                                prices: [
                                    {
                                        currency: 'DKK',
                                        recommended_retail_price: product.priceRaw,
                                        wholesale_price: 0,
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
        async fetchProduct({}, product) {
            const apiUrl = `admins/search-bap-qa-getstyle?style=${product.datasource_id}`
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
        async syncProducts({ dispatch }, products) {
            for (const product of products) {
                const newProductData = await dispatch('fetchProduct', product)
                if (!newProductData || !newProductData.variants || newProductData.variants.length <= 0) continue

                // Update prices
                const newPrice = Object.values(newProductData.variants)[0].priceRaw
                if (product.prices.length <= 0) {
                    product.prices.push({
                        recommended_retail_price: newPrice,
                        currency: 'DKK',
                    })
                } else {
                    product.prices[0].recommended_retail_price = newPrice
                }

                // Update stock
                product.variants.map(variant => {
                    variant.ean_sizes.map(sizeObj => {
                        // Find the new size data
                        let newSizeData
                        Object.values(newProductData.variants).find(newVariantData => {
                            newSizeData = newVariantData.skUs.find(sku => sizeObj.ean == sku.ean)
                            return newSizeData
                        })
                        sizeObj.quantity = newSizeData.stockCount
                    })
                })
            }
            // products.map(async product => {
            //     const newProductData = await dispatch('fetchProduct', product)
            //     console.log('new product data', newProductData)
            // })
        },
    },
}
