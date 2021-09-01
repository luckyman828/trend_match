import axios from 'axios'
import Vue from 'vue'
import roundDecimals from '../../helpers/roundDecimals'

export default {
    namespaced: true,

    state: {
        currentGroup: null,
        productGroups: [],
    },

    getters: {
        getProductGroups: state => state.productGroups,
        getCurrentProductGroup: state => state.currentGroup,
    },

    actions: {
        async fetchFileProductGroups({ commit, dispatch }, fileId) {
            let productGroups
            const apiUrl = `files/${fileId}/product-groups`
            await axios.get(apiUrl).then(async response => {
                productGroups = response.data
                await dispatch('initProductGroups', productGroups)
                commit('SET_PRODUCT_GROUPS', productGroups)
            })
            productGroups = await dispatch('cleanUpProductGroups', { fileId, productGroups })
            return productGroups
        },
        async cleanUpProductGroups({ dispatch, commit }, { fileId, productGroups }) {
            let deleteCount = 0
            for (let i = productGroups.length - 1; i >= 0; i--) {
                const productGroup = productGroups[i]
                for (let i = productGroup.variantMaps.length - 1; i >= 0; i--) {
                    // Remove variantmaps with no linked variant
                    const variantMap = productGroup.variantMaps[i]
                    if (!variantMap.variant) {
                        productGroup.variantMaps.splice(i, 1)
                    }
                }
                if (productGroup.variantMaps.length <= 0) {
                    deleteCount++
                    await dispatch('deleteProductGroup', { fileId, productGroup })
                    // productGroups.splice(i, 1)
                } else {
                    await dispatch('insertOrUpdateProductGroup', { fileId, productGroup })
                }
            }
            if (deleteCount > 0) {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: `Deleted ${deleteCount} empty product group${deleteCount > 1 ? 's' : ''}`,
                        iconClass: 'fa-trash',
                        type: 'danger',
                    },
                    { root: true }
                )
            }
            return productGroups
        },
        async insertOrUpdateProductGroup({ commit, dispatch }, { fileId, productGroup }) {
            const apiUrl = `files/${fileId}/product-groups`
            await axios
                .post(apiUrl, { product_groups: [productGroup] })
                .then(async response => {
                    const isNew = response.data.added_product_groups.length > 0
                    if (isNew) {
                        Vue.set(productGroup, 'id', response.data.added_product_groups[0].id)
                    }
                    if (!productGroup.initDone) {
                        await dispatch('initProductGroups', [productGroup])
                    }
                    if (isNew) {
                        commit('INSERT_PRODUCT_GROUPS', [productGroup])
                    }
                })
                .catch(err => {
                    console.log('error when inserting product groups', err)
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            type: 'warning',
                            msg: 'Something went wrong trying to insert product groups',
                            callback: () => {
                                dispatch('insertOrUpdateProductGroup', { fileId, productGroup })
                            },
                            callbackLabel: 'Retry',
                        },
                        { root: true }
                    )
                })
            return productGroup
        },
        deleteProductGroup({ commit }, { fileId, productGroup }) {
            const apiUrl = `files/${fileId}/product-groups`
            axios.delete(apiUrl, { data: { ids: [productGroup.id] } }).then(reponse => {
                commit('REMOVE_PRODUCT_GROUPS', [productGroup])
            })
        },
        async addVariantMap({ dispatch }, { productGroup, variant, productId, variantId }) {
            const newVariantMap = await dispatch('instantiateBaseVariantMap')
            newVariantMap.variant_id = variant ? variant.id : variantId
            newVariantMap.product_id = variant ? variant.product_id : productId
            productGroup.variantMaps.push(newVariantMap)
        },
        async removeVariantMap({}, { productGroup, variant }) {
            const index = productGroup.variantMaps.findIndex(variantMap => variantMap.variant_id == variant.id)
            productGroup.variantMaps.splice(index, 1)
        },
        async instantiateBaseProductGroup({ dispatch }) {
            const newGroup = {
                id: null,
                name: 'New group',
                description: '',
                variants: [],
            }
            await dispatch('initProductGroups', [newGroup])
            return newGroup
        },
        async instantiateBaseVariantMap({ dispatch }) {
            const newMap = {
                product_id: null,
                variant_id: null,
            }
            await dispatch('initVariantMaps', [newMap])
            return newMap
        },
        async initProductGroups({ dispatch }, productGroups) {
            productGroups.map(async group => {
                if (!group.variants) Vue.set(group, 'variants', [])
                Object.defineProperty(group, 'variantMaps', {
                    get() {
                        return group.variants
                    },
                    set(value) {
                        group.variants = value
                    },
                })
                await dispatch('initVariantMaps', group.variantMaps)

                // Prices
                Vue.set(group, 'yourPrice', {})
                Object.defineProperty(group.yourPrice, 'currency', {
                    get() {
                        if (group.variantMaps.length <= 0) return
                        return group.variantMaps[0].product.yourPrice.currency
                    },
                })
                Object.defineProperty(group.yourPrice, 'wholesale_price', {
                    get() {
                        return roundDecimals(
                            group.variantMaps.reduce((total, curr) => {
                                const price = curr.product.prices.find(
                                    price => price.currency == group.yourPrice.currency
                                )
                                if (!price) return total
                                return (total += price.wholesale_price)
                            }, 0),
                            2
                        )
                    },
                })
                Object.defineProperty(group.yourPrice, 'recommended_retail_price', {
                    get() {
                        return roundDecimals(
                            group.variantMaps.reduce((total, curr) => {
                                const price = curr.product.prices.find(
                                    price => price.currency == group.yourPrice.currency
                                )
                                if (!price) return total
                                return (total += price.recommended_retail_price)
                            }, 0),
                            2
                        )
                    },
                })
                Object.defineProperty(group.yourPrice, 'mark_up', {
                    get() {
                        return !group.yourPrice.wholesale_price
                            ? 0
                            : Number(
                                  Math.round(
                                      group.recommended_retail_price / group.yourPrice.wholesale_price +
                                          `e${amountOfDecimals}`
                                  ) + `e-${amountOfDecimals}`
                              )
                    },
                })
                Object.defineProperty(group.yourPrice, 'totalPrice', {
                    get() {
                        return roundDecimals(
                            group.variantMaps.reduce((total, curr) => {
                                const price = curr.product.prices.find(
                                    price => price.currency == group.yourPrice.currency
                                )
                                if (!price) return total
                                return (total += price.recommended_retail_price)
                            }, 0),
                            2
                        )
                    },
                })
                Object.defineProperty(group.yourPrice, 'currentPrice', {
                    get() {
                        return roundDecimals(
                            group.variantMaps.reduce((total, curr) => {
                                const price = curr.product.prices.find(
                                    price => price.currency == group.yourPrice.currency
                                )
                                if (!price) return total
                                return (total += price.wholesale_price
                                    ? price.wholesale_price
                                    : price.recommended_retail_price)
                            }, 0),
                            2
                        )
                    },
                })

                group.initDone = true
            })
        },
        initVariantMaps({ rootGetters }, variantMaps) {
            variantMaps.map(variantMap => {
                variantMap.isInit = true
                Object.defineProperty(variantMap, 'product', {
                    get() {
                        const products = rootGetters['products/products']
                        return products.find(product => product.id == variantMap.product_id)
                    },
                })
                Object.defineProperty(variantMap, 'variant', {
                    get() {
                        return (
                            variantMap.product &&
                            variantMap.product.variants.find(variant => variant.id == variantMap.variant_id)
                        )
                    },
                })
            })
        },
    },

    mutations: {
        SET_CURRENT_GROUP(state, productGroup) {
            state.currentGroup = productGroup
        },
        SET_PRODUCT_GROUPS(state, productGroups) {
            state.productGroups = productGroups
        },
        INSERT_PRODUCT_GROUPS(state, productGroups) {
            state.productGroups.push(...productGroups)
        },
        REMOVE_PRODUCT_GROUPS(state, productGroups) {
            for (let i = productGroups.length - 1; i >= 0; i--) {
                const productGroup = productGroups[i]
                const index = state.productGroups.findIndex(group => productGroup.id == group.id)
                state.productGroups.splice(index, 1)
            }
        },
    },
}
