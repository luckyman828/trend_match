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

            console.log('here are the products', products)

            return products
        },
    },
}
