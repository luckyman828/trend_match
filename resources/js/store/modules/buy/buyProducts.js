import Vue from 'vue'
import compareSizes from '../../../helpers/compareSizes'

export default {
    namespaced: true,
    state: {},
    getters: {
        getProductViews: (state, getters, rootState, rootGetters) => {
            const products = rootGetters['products/getProducts']
            let productsToReturn = [...products]
            const selection = rootGetters['selections/getCurrentSelection']

            if (selection.type == 'Summed') {
                // Filter out variats with no QTY
                productsToReturn = productsToReturn.filter(product => product.quantity > 0)
            }

            return {
                get overview() {
                    return productsToReturn
                },
                get tbd() {
                    let tbdProducts = [...productsToReturn]
                    tbdProducts = tbdProducts.filter(
                        product => product.quantity <= 0 && ['Focus', 'In'].includes(product.selectionAlignment.action)
                    )
                    return tbdProducts
                },
                get purchase() {
                    let purchaseProducts = [...productsToReturn]
                    purchaseProducts = purchaseProducts.filter(product => product.quantity > 0)
                    return purchaseProducts
                },
            }
        },
    },
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
                    await Promise.all([
                        await dispatch(
                            'actions/initActions',
                            {
                                actions: products.reduce((acc, curr) => [...acc, ...curr.alignments], []),
                                type: 'action',
                            },
                            { root: true }
                        ),
                        await dispatch(
                            'comments/initComments',
                            products.reduce((acc, curr) => [...acc, ...curr.comments], []),
                            { root: true }
                        ),
                    ])
                    await dispatch('initProducts', { products, selectionId })
                    commit('products/SET_PRODUCTS', products, { root: true })
                })
                .catch(err => {
                    console.log('Error in fetch buy products', err)
                })
            return products
        },
        async updateQuantity({ dispatch }, { alignment, variantId, deliveryDate, size, assortment, quantity }) {
            if (!alignment) return
            const existingQuantityDetailIndex = alignment.quantity_details.findIndex(detail => {
                if (variantId && detail.variant_id != variantId) return false
                if (deliveryDate && detail.delivery_date != deliveryDate) return false
                if (size && detail.variant_size != size) return false
                if (assortment && detail.assortment != assortment) return false
                return true
            })
            const existingQuantityDetail = alignment.quantity_details[existingQuantityDetailIndex]
            if (existingQuantityDetail) {
                if (quantity <= 0) {
                    alignment.quantity_details.splice(existingQuantityDetailIndex, 1)
                } else {
                    existingQuantityDetail.quantity = quantity
                }
            } else if (quantity > 0) {
                const newQuantityInput = {
                    variant_id: variantId,
                    delivery_date: deliveryDate,
                    variant_size: size,
                    assortment,
                    quantity,
                }
                await dispatch('initQuantityInputs', { quantityInputs: [newQuantityInput], product: alignment.product })
                alignment.quantity_details.push(newQuantityInput)
            }
        },
        async initProducts({ getters, dispatch, rootGetters }, { products, selectionId }) {
            products.map(async product => {
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

                Vue.set(product, 'currentDeliveryDate', product.delivery_dates[0])

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
                // Object.defineProperty(product, 'purchase', {
                //     get() {
                //         return product.alignments.filter(x => [''] == selectionId)
                //     },
                // })
                Object.defineProperty(product, 'quantityInputs', {
                    get() {
                        // If we are summing, get them all
                        if (rootGetters['selections/getCurrentSelectionType'] == 'Summed')
                            return product.alignments.reduce(
                                (acc, alignment) => [...acc, ...alignment.quantity_details],
                                []
                            )
                        return product.selectionAlignment ? product.selectionAlignment.quantity_details : []
                    },
                })
                Object.defineProperty(product, 'quantity', {
                    get() {
                        return product.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                    },
                })

                await dispatch('initQuantityInputs', { quantityInputs: product.quantityInputs, product })

                product.alignments.map(alignment => {
                    // Add default variant action to alignments
                    product.variants.map(async variant => {
                        // Check if there is already a variant action
                        if (alignment.variants.find(variantAction => variantAction.id == variant.id)) return
                        const variantAction = {
                            id: variant.id,
                            feedback: 'None',
                            quantity: 0,
                        }
                        await dispatch(
                            'actions/initVariantActions',
                            {
                                productAction: alignment,
                                variantActions: [variantAction],
                            },
                            { root: true }
                        )
                        alignment.variants.push(variantAction)
                    })
                })

                // END ACTIONS

                // ASSORTMENTS
                product.assortments.map(assortment => {
                    if (!assortment.variant_ids) Vue.set(assortment, 'variant_ids', [])
                    if (!assortment.delivery_dates) Vue.set(assortment, 'delivery_dates', [])
                    Object.defineProperty(assortment, 'displayName', {
                        get() {
                            return assortment.name.split(';')[0]
                        },
                    })
                    Object.defineProperty(assortment, 'sizes', {
                        get() {
                            const sizes = assortment.name.split(';').slice(1) // exclude the first result
                            return sizes.map(size => {
                                const sizeComponents = size.split(':')
                                const assortmentSizeObj = {
                                    size: sizeComponents[0] ? sizeComponents[0] : sizes.length == 1 ? 'one size' : null,
                                    quantity: sizeComponents[1]
                                        ? sizeComponents[1]
                                        : sizes.length == 1
                                        ? assortment.box_size
                                        : 0,
                                }
                                Object.defineProperty(assortmentSizeObj, 'currentQuantity', {
                                    get() {
                                        return assortment.pcs * assortmentSizeObj.quantity
                                    },
                                })
                                return assortmentSizeObj
                            })
                        },
                    })
                    Object.defineProperty(assortment, 'sizeQuantities', {
                        get() {
                            return assortment.sizes
                        },
                    })
                    // QTY INPUT
                    Object.defineProperty(assortment, 'quantityInputs', {
                        get() {
                            return product.quantityInputs.filter(detail => {
                                if (
                                    assortment.variant_ids &&
                                    assortment.variant_ids.length > 0 &&
                                    !assortment.variant_ids.includes(detail.variant_id)
                                ) {
                                    return false
                                }
                                return detail.assortment == assortment.name
                            })
                        },
                    })
                    Object.defineProperty(assortment, 'quantity', {
                        get() {
                            return assortment.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                        },
                    })
                    Object.defineProperty(assortment, 'pcs', {
                        get() {
                            return !assortment.box_size || assortment.box_size == 0
                                ? 0
                                : Math.round(assortment.quantity / assortment.box_size)
                        },
                    })
                    Vue.set(
                        assortment,
                        'deliveries',
                        assortment.delivery_dates.map(delivery_date => {
                            // Instantiate an assortment delivery object
                            const deliveryObj = { delivery_date }
                            Object.defineProperty(deliveryObj, 'quantityInputs', {
                                get() {
                                    return assortment.quantityInputs.filter(
                                        input => input.delivery_date == delivery_date
                                    )
                                },
                            })
                            Object.defineProperty(deliveryObj, 'quantity', {
                                get() {
                                    return deliveryObj.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                                },
                            })
                            Object.defineProperty(deliveryObj, 'sizeQuantities', {
                                get() {
                                    return deliveryObj.quantityInputs.reduce((sizeQuantities, quantityInput) => {
                                        quantityInput.sizes.map(size => {
                                            const existingSize = sizeQuantities.find(x => x.size == size.size)
                                            if (existingSize) {
                                                existingSize.quantity += parseInt(size.quantity)
                                            } else {
                                                sizeQuantities.push({
                                                    size: size.size,
                                                    quantity: parseInt(size.quantity),
                                                })
                                            }
                                        })
                                        return sizeQuantities.sort((a, b) => compareSizes(a.size, b.size))
                                    }, [])
                                },
                            })
                            Object.defineProperty(deliveryObj, 'pcs', {
                                get() {
                                    return !assortment.box_size || assortment.box_size == 0
                                        ? 0
                                        : Math.round(deliveryObj.quantity / assortment.box_size)
                                },
                            })

                            return deliveryObj
                        })
                    )
                    // Find a specific qty detail belonging to the assortment
                    assortment.getQtyDetail = qtyDetail =>
                        assortment.quantityInputs.find(qtyInput => {
                            if (qtyDetail.deliveryDate && qtyInput.delivery_date != qtyDetail.deliveryDate) return false
                            return qtyInput.assortment == qtyDetail.assortment
                            // if (qtyDetail.assortment && qtyInput.assortment == qtyDetail.assortment) return false
                            // return true
                        })
                })
                // END ASSORTMENTS

                // PRODUCT DELIVERIES
                Vue.set(
                    product,
                    'deliveries',
                    product.delivery_dates.map(delivery_date => {
                        // Instantiate a variant delivery object
                        const deliveryObj = { delivery_date }
                        Object.defineProperty(deliveryObj, 'quantityInputs', {
                            get() {
                                return product.quantityInputs.filter(input => input.delivery_date == delivery_date)
                            },
                        })
                        Object.defineProperty(deliveryObj, 'quantity', {
                            get() {
                                return deliveryObj.quantityInputs.reduce((acc, curr) => (acc += curr.quantity), 0)
                            },
                        })
                        Object.defineProperty(deliveryObj, 'sizeQuantities', {
                            get() {
                                return deliveryObj.quantityInputs.reduce((sizeQuantities, quantityInput) => {
                                    quantityInput.sizes.map(size => {
                                        const existingSize = sizeQuantities.find(x => x.size == size.size)
                                        if (existingSize) {
                                            existingSize.quantity += parseInt(size.quantity)
                                        } else {
                                            sizeQuantities.push({
                                                size: size.size,
                                                quantity: parseInt(size.quantity),
                                            })
                                        }
                                    })
                                    return sizeQuantities.sort((a, b) => compareSizes(a.size, b.size))
                                }, [])
                            },
                        })

                        return deliveryObj
                    })
                )
                // END PRODUCT DELIVERIES

                // VARIANTS
                Object.defineProperty(product, 'variantsFiltered', {
                    get: function() {
                        return rootGetters['products/getFilteredVariants'](product.variants)
                    },
                })
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
                    Object.defineProperty(variant, 'alignments', {
                        get() {
                            const alignments = []
                            product.alignments.map(alignment => {
                                const variantAlignment = alignment.variants.find(x => x.id == variant.id)
                                if (variantAlignment) alignments.push(variantAlignment)
                            })
                            return alignments
                        },
                    })
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
                            Object.defineProperty(deliveryObj, 'sizeQuantities', {
                                get() {
                                    return deliveryObj.quantityInputs.reduce((sizeQuantities, quantityInput) => {
                                        quantityInput.sizes.map(size => {
                                            const existingSize = sizeQuantities.find(x => x.size == size.size)
                                            if (existingSize) {
                                                existingSize.quantity += parseInt(size.quantity)
                                            } else {
                                                sizeQuantities.push({
                                                    size: size.size,
                                                    quantity: parseInt(size.quantity),
                                                })
                                            }
                                        })
                                        return sizeQuantities.sort((a, b) => compareSizes(a.size, b.size))
                                    }, [])
                                },
                            })
                            // // Attach assortments to the delivery obj
                            // Vue.set(deliveryObj, 'assortments', () => {
                            //     // const deliveryObj = { delivery_date }
                            //     return variant.assortments
                            // })

                            return deliveryObj
                        })
                    )

                    Vue.set(
                        variant,
                        'sizes',
                        variant.ean_sizes.map(sizeObj => {
                            Object.defineProperty(sizeObj, 'quantityInputs', {
                                get() {
                                    return variant.quantityInputs.filter(input => input.variant_size == sizeObj.size)
                                },
                            })
                            Object.defineProperty(sizeObj, 'quantity', {
                                get() {
                                    const sizeInputSum = sizeObj.quantityInputs.reduce(
                                        (acc, curr) => (acc += curr.quantity),
                                        0
                                    )
                                    const assortmentInputSum = variant.assortments.reduce((total, assortment) => {
                                        // Find the corresponding size
                                        const assortmentSize = assortment.sizes.find(size => size.size == sizeObj.size)
                                        return (total += assortmentSize ? assortmentSize.currentQuantity : 0)
                                    }, 0)
                                    return sizeInputSum + assortmentInputSum
                                },
                            })
                            return sizeObj
                        })
                    )
                    // END QTY INPUT

                    // ASSORTMETNS
                    Object.defineProperty(variant, 'assortments', {
                        get() {
                            return product.assortments.filter(assortment => assortment.variant_ids.includes(variant.id))
                        },
                    })
                })
                // END Variants
                Object.defineProperty(product, 'rawSelectionInput', {
                    get() {
                        return product
                    },
                })
                Object.defineProperty(product, 'product_id', {
                    get() {
                        return product.id
                    },
                })
            })
        },
        async initQuantityInputs({}, { quantityInputs, product }) {
            // Work quantity inputs
            quantityInputs.map(quantityInput => {
                Object.defineProperty(quantityInput, 'sizes', {
                    get() {
                        if (quantityInput.variant_size)
                            return [{ size: quantityInput.variant_size, quantity: quantityInput.quantity }]
                        if (quantityInput.assortment) {
                            const assortment = product.assortments.find(
                                assortment =>
                                    assortment.name == quantityInput.assortment &&
                                    assortment.variant_ids.includes(quantityInput.variant_id)
                            )
                            if (assortment) {
                                return assortment.sizes.map(assortmentSize => {
                                    const pcs = assortment.box_size ? quantityInput.quantity / assortment.box_size : 0
                                    return {
                                        size: assortmentSize.size,
                                        quantity: assortmentSize.quantity * pcs,
                                    }
                                })
                            }
                        }
                        return []
                    },
                })
            })
        },
    },
    mutations: {},
}
