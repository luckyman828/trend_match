import axios from 'axios'

export default {
    namespaced: true,
    actions: {
        async fetchWebshopProductsFromFeed() {
            let products = []
            console.log('fetchy fethcy')

            const apiUrl = `admins/bonaparte-products?force_refresh=false`
            await axios.get(apiUrl).then(response => {
                const responseProducts = response.data

                // Transform the BAP products to Kollekt products
                responseProducts.map(product => {
                    const productId = product.id.split('-')[0]
                    // Check if the product already exists
                    const existingProduct = products.find(x => x.datasource_id == productId)
                    const newProductVariant = {
                        color: product.color,
                        pictures: [{ name: 'image_link_large', url: product.image_link_large }],
                        ean_sizes: product.sizes.map(sizeDetail => ({
                            size: sizeDetail.size,
                            ref_id: sizeDetail.gtin,
                            ean: sizeDetail.gtin,
                        })),
                    }

                    if (existingProduct) {
                        existingProduct.variants.push(newProductVariant)
                    } else {
                        const newProduct = {
                            datasource_id: productId,
                            sale_description: product.description,
                            prices: [
                                { currency: product.price.currency, recommended_retail_price: product.price.price },
                            ],
                            brand: product.brand,
                            title: product.long_title,
                            variants: [newProductVariant],
                        }
                        products.push(newProduct)
                    }
                })
            })

            console.log('here are the products', products)

            return products
        },
    },
}
