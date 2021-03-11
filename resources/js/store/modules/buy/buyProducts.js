import Vue from 'vue'

export default {
    namespaced: true,
    state: {},
    getters: {},
    actions: {
        async fetchProducts({ commit, dispatch }, selectionId) {
            // Fetch the selection input for the products
            let products = []
            const apiUrl = `/selections/${selectionId}/products-next`

            await axios
                .get(apiUrl)
                .then(async response => {
                    const selections = response.data.selections
                    await dispatch('selectionProducts/initSelections', selections, { root: true })
                    commit('selectionProducts/INSERT_SELECTIONS', selections, { root: true })
                    commit('selectionProducts/INSERT_SELECTION_USERS', response.data.users, { root: true })
                    products = response.data.products
                    // Process the selection products
                    await dispatch(
                        'actions/initActions',
                        products.reduce((acc, curr) => [...acc, ...curr.alignments], []),
                        { root: true }
                    )
                    await dispatch('initProducts', { products, selectionId })
                    commit('products/SET_PRODUCTS', products, { root: true })
                })
                .catch(err => {
                    console.log('Error in fetch buy products', err)
                })
            return products
        },
        async initProducts({ getters }, { products, selectionId }) {
            products.map(product => {
                // Cast datasource_id to a number
                product.datasource_id = parseInt(product.datasource_id)

                // Name
                product.title = product.title ? product.title : 'Unnamed'
                Object.defineProperty(product, 'name', {
                    get: function() {
                        return product.title
                    },
                    set: function(value) {
                        product.title = value
                    },
                })

                // Custom Props
                if (!product.extra_data) Vue.set(product, 'extra_data', {})

                // ---- START PRICES ----
                // Currency
                Object.defineProperty(product, 'yourPrice', {
                    get: function() {
                        // Check if the product has any prices
                        if (product.prices.length <= 0) {
                            // If no prices are available, return a default empty price object
                            return {
                                currency: 'Not set',
                                mark_up: null,
                                wholesale_price: null,
                                recommended_retail_price: null,
                            }
                        }
                        // Else check if we have a preferred currency set, and try to match that
                        if (product.preferred_currency) {
                            const preferredPrice = product.prices.find(x => x.currency == product.preferred_currency)
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                })
                //Define default prices directly on the product
                Object.defineProperty(product, 'wholesale_price', {
                    get: function() {
                        return product.yourPrice.wholesale_price
                    },
                })
                Object.defineProperty(product, 'recommended_retail_price', {
                    get: function() {
                        return product.yourPrice.recommended_retail_price
                    },
                })
                Object.defineProperty(product, 'mark_up', {
                    get: function() {
                        return product.yourPrice.mark_up
                    },
                })
                // ---- END PRICES ----

                // ACTIONS
                Object.defineProperty(product, 'selectionAlignment', {
                    get() {
                        return product.alignments.find(x => x.selection_id == selectionId)
                    },
                })
                Object.defineProperty(product, 'quantityInputs', {
                    get() {
                        return product.selectionAlignment ? product.selectionAlignment.quantity_details : []
                    },
                })

                // END ACTIONS

                // VARIANTS
                product.variants.forEach((variant, variantIndex) => {
                    // INSTANTIATE BASE VARIANT
                    if (variant.imageIndex == null) {
                        Vue.set(variant, 'imageIndex', 0)
                    }
                    Vue.set(variant, 'index', variantIndex)
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])
                    if (!variant.labels) Vue.set(variant, 'labels', [])
                    if (!variant.ean_sizes) Vue.set(variant, 'ean_sizes', [])
                    if (!variant.extra_data) Vue.set(variant, 'extra_data', {})
                    if (!variant.delivery_dates) Vue.set(variant, 'delivery_dates', [])
                    Object.defineProperty(variant, 'currentImg', {
                        get: function() {
                            return variant.pictures[variant.imageIndex]
                        },
                    })
                    Object.defineProperty(variant, 'product', {
                        get() {
                            return product
                        },
                    })
                    // END INSTANTIATE BASE VARIANT

                    // ACTIONS
                    Object.defineProperty(variant, 'selectionAlignment', {
                        get() {
                            return product.selectionAlignment.variants.find(x => x.id == variant.id)
                        },
                    })

                    // END ACTIONS

                    // QTY INPUT
                    Object.defineProperty(variant, 'quantityInputs', {
                        get() {
                            return product.quantityInputs.filter(detail => detail.variant_id == variant.id)
                        },
                    })
                    Object.defineProperty(variant, 'quantity', {
                        get() {
                            return variant.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                        },
                    })
                    variant.getQtyDetail = qtyDetail =>
                        variant.quantityInputs.find(qtyInput => {
                            if (qtyDetail.deliveryDate && qtyInput.delivery_date != qtyDetail.deliveryDate) return false
                            if (qtyDetail.size && qtyInput.variant_size != qtyDetail.size) return false
                            if (qtyDetail.assortment && qtyInput.assortment != qtyDetail.assortment) return false
                            return true
                        })

                    Vue.set(
                        variant,
                        'deliveries',
                        variant.delivery_dates.map(delivery_date => {
                            // Instantiate a variant delivery object
                            const deliveryObj = { delivery_date }
                            Object.defineProperty(deliveryObj, 'quantityInputs', {
                                get() {
                                    return variant.quantityInputs.filter(input => input.delivery_date == delivery_date)
                                },
                            })
                            Object.defineProperty(deliveryObj, 'quantity', {
                                get() {
                                    return deliveryObj.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                                },
                            })
                            return deliveryObj
                        })
                    )

                    Vue.set(variant, 'sizes', [
                        variant.ean_sizes.map(sizeObj => {
                            Object.defineProperty(sizeObj, 'quantityInputs', {
                                get() {
                                    return variant.quantityInputs.filter(input => input.variant_size == sizeObj.size)
                                },
                            })
                            Object.defineProperty(sizeObj, 'quantity', {
                                get() {
                                    return sizeObj.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                                },
                            })
                            return sizeObj
                        }),
                    ])
                    // END QTY INPUT
                })
            })
        },
    },
    mutations: {},
}
