import axios from 'axios'
import Vue from 'vue'

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
            return productGroups
        },
        async insertProductGroup({ commit, dispatch }, { fileId, productGroup }) {
            const apiUrl = `files/${fileId}/product-groups`
            await axios
                .post(apiUrl, { product_groups: [productGroup] })
                .then(async response => {
                    console.log('success inersting product group', response.data)
                    Vue.set(productGroup, 'id', response.data.added_product_groups[0].id)
                    if (!productGroup.initDone) {
                        await dispatch('initProductGroups', [productGroup])
                    }
                    commit('INSERT_PRODUCT_GROUPS', [productGroup])
                })
                .catch(err => {
                    console.log('error when inserting product groups', err)
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            type: 'warning',
                            msg: 'Something went wrong trying to insert product groups',
                            callback: () => {
                                dispatch('insertProductGroups', { fileId, productGroup })
                            },
                            callbackLabel: 'Retry',
                        },
                        { root: true }
                    )
                })
            return productGroup
        },
        async addVariantMap({ dispatch }, { productGroup, variant, productId, variantId }) {
            const newVaraintMap = await dispatch('instantiateBaseVariantMap')
            newVaraintMap.variant_id = variant ? variant.id : variantId
            newVaraintMap.product_id = variant ? variant.product_id : productId
            productGroup.variantMaps.push(newVaraintMap)
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
                Object.defineProperty(group, 'variantMaps', {
                    get() {
                        return group.variants
                    },
                    set(value) {
                        group.variants = value
                    },
                })
                await dispatch('initVariantMaps', group.variantMaps)
                group.initDone = true
            })
        },
        initVariantMaps({ rootGetters }, variantMaps) {
            variantMaps.map(variantMap => {
                Object.defineProperty(variantMap, 'product', {
                    get() {
                        const products = rootGetters['products/products']
                        return products.find(product => product.id == variantMap.product_id)
                    },
                })
                Object.defineProperty(variantMap, 'variant', {
                    get() {
                        return variantMap.product.variants.find(variant => variant.id == variantMap.variant_id)
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
    },
}
