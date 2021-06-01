export default {
    namespaced: true,

    state: {
       currentGroup: null,
       productGroups: []
    },

    getters: {
        getProductGroups: state => state.productGroups,
        getCurrentProductGroup: state => state.currentGroup
    },

    actions: {
        async instantiateBaseProductGroup({dispatch}) {
            const newGroup = {
                name: 'Look #1 could also be called something longer than "look #1" i guess...',
                description: '',
                variants: []
            }
            await dispatch('initProductGroups', [newGroup])
            return newGroup
        },
        initProductGroups({rootGetters}, productGroups) {
            productGroups.map(group => {
                // group.variantMaps.map(variantMap => {
                //     Object.defineProperty(variantMap, 'product', {
                //         get() {
                //             const products = rootGetters['products/products']
                //             return products.find(product => product.id == variantMap.product_id)
                //         },
                //     })
                //     Object.defineProperty(variantMap, 'variant', {
                //         get() {
                //             return variantMap.product.variants.find(variant => variant.id == variantMap.variant_id)
                //         },
                //     })
                // })
                Object.defineProperty(group, 'variantMaps', {
                    get() {
                        return group.variants.map((variantMap, index) => {
                            const variantMapClone = JSON.parse(JSON.stringify(variantMap)) 
                            variantMapClone.index = index
                            Object.defineProperty(variantMapClone, 'product', {
                                get() {
                                    const products = rootGetters['products/products']
                                    return products.find(product => product.id == variantMapClone.product_id)
                                },
                            })
                            Object.defineProperty(variantMapClone, 'variant', {
                                get() {
                                    return variantMapClone.product.variants.find(variant => variant.id == variantMapClone.variant_id)
                                },
                            })
                            return variantMapClone
                        })
                    },
                })
            })
        }
    },

    mutations: {
        SET_CURRENT_GROUP(state, productGroup) {
            state.currentGroup = productGroup
        }
    },
}
