import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentProduct: null,
        availableProducts: [],
        selectedCategories: [],
        selectedDeliveryDates: [],
        selectedBuyerGroups: [],
        unreadOnly: false,
        currentProductFilter: 'overview',
        singleVisible: false,
        products: [],
        status: null,
    },

    getters: {
        loadingProducts: state => state.loading,
        productsStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        availableProducts: state => {
            return state.availableProducts
        },
        nextProduct: state => {
            // Find the index of the current product
            const index = state.availableProducts.findIndex(x => x.id == state.currentProduct.id)
            // Check that the current is not the last in the array
            if (index + 1 < state.availableProducts.length) {
                return state.availableProducts[index + 1]
            }
        },
        prevProduct: state => {
            // Find the index of the current product
            const index = state.availableProducts.findIndex(x => x.id == state.currentProduct.id)
            // Check that the current is not the first in the array
            if (index > 0) {
                return state.availableProducts[index - 1]
            }
        },
        selectedCategories: state => {
            return state.selectedCategories
        },
        selectedDeliveryDates: state => {
            return state.selectedDeliveryDates
        },
        selectedBuyerGroups: state => {
            return state.selectedBuyerGroups
        },
        unreadOnly: state => {
            return state.unreadOnly
        },
        currentProductFilter: state => {
            return state.currentProductFilter
        },
        singleVisible: state => {
            return state.singleVisible
        },
        actionsUpdated: state => {
            return state.actionsUpdated
        },
        commentsUpdated: state => {
            return state.commentsUpdated
        },
        commentsCreated: state => {
            return state.commentsCreated
        },
        products: (state, getters, rootState, rootGetters) => {
            return state.products
        },
        availableCategories(state, getters) {
            const products = getters.products
            let uniqueCategories = []
            products.forEach(product => {
                if (product.category) {
                    const found = uniqueCategories.includes(product.category)
                    if (!found) uniqueCategories.push(product.category)
                }
            })
            return uniqueCategories
        },
        availableDeliveryDates(state, getters) {
            const products = getters.products
            let uniqueDeliveryDates = []
            products.forEach(product => {
                if (product.delivery_date) {
                    const found = uniqueDeliveryDates.find(x => x.value == product.delivery_date)
                    if (!found)
                        uniqueDeliveryDates.push({
                            name: new Date(product.delivery_date).toLocaleDateString('en-GB', {
                                month: 'long',
                                year: 'numeric',
                            }),
                            value: product.delivery_date,
                        })
                }
            })
            return uniqueDeliveryDates
        },
        availableBuyerGroups(state, getters) {
            const products = getters.products
            let unique = []
            products.forEach(product => {
                if (product.buyer_group) {
                    const found = unique.includes(product.buyer_group)
                    if (!found) unique.push(product.buyer_group)
                }
            })
            return unique
        },
        productTotals(state, getters, rootState, rootGetters) {
            const products = getters.products
            const totals = {
                all: 0,
                ins: 0,
                outs: 0,
                nds: 0,
            }
            totals.all = products.length
            products.forEach(product => {
                if (product.currentAction == null) {
                    totals.nds++
                } else if (product.currentAction.action > 0) {
                    totals.ins++
                } else {
                    totals.outs++
                }
            })
            return totals
        },
        productsFiltered(state, getters, rootState, rootGetters) {
            const products = getters.products
            const categories = getters.selectedCategories
            const deliveryDates = getters.selectedDeliveryDates
            const buyerGroups = getters.selectedBuyerGroups
            const unreadOnly = getters.unreadOnly
            const actionFilter = getters.currentProductFilter
            let productsToReturn = products

            // First filter by category
            if (categories.length > 0) {
                const filteredByCategory = productsToReturn.filter(product => {
                    return Array.from(categories).includes(product.category)
                })
                productsToReturn = filteredByCategory
            }
            // Filter by delivery date
            if (deliveryDates.length > 0) {
                const filteredByDeliveryDate = productsToReturn.filter(product => {
                    return Array.from(deliveryDates).includes(product.delivery_date)
                })
                productsToReturn = filteredByDeliveryDate
            }
            // Filter by buyer group
            if (buyerGroups.length > 0) {
                const filteredByBuyerGroups = productsToReturn.filter(product => {
                    return Array.from(buyerGroups).includes(product.buyer_group)
                })
                productsToReturn = filteredByBuyerGroups
            }

            // Filer by unread
            if (unreadOnly) {
                const filteredByUnread = productsToReturn.filter(product => product.newComment)
                productsToReturn = filteredByUnread
            }

            // Filter by actions
            if (['ins', 'outs', 'nds'].includes(actionFilter)) {
                const filteredByAction = productsToReturn.filter(product => {
                    if (actionFilter == 'nds') {
                        return product.currentAction == null
                    } else if (actionFilter == 'ins') {
                        return product.currentAction && product.currentAction.action >= 1
                    } else if (actionFilter == 'outs') {
                        return product.currentAction && product.currentAction.action < 1
                    }
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
    },

    actions: {
        async fetchProducts({ commit }, fileId) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/files/${fileId}/products`

            await axios
                .get(apiUrl)
                .then(response => {
                    commit('insertProducts', { products: response.data, method: 'set' })
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    commit('setProductStatus', 'error')
                })
        },
        async fetchSelectionProducts({ commit }, selectionId) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/selections/${selectionId}/products`

            await axios
                .get(apiUrl)
                .then(response => {
                    commit('insertProducts', { products: response.data, method: 'set' })
                    commit('procesSelectionProducts')
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    commit('setProductStatus', 'error')
                })
        },
        async insertProducts({ commit }, { file, products, addToState }) {
            if (addToState) commit('insertProducts', { products, method: 'add' })
            const apiUrl = `/files/${file.id}/products`
            await axios.post(apiUrl, {
                method: 'Add',
                products: products,
            })
        },
        instantiateNewProduct({ commit }) {
            return {
                title: 'Untitled product',
                datasource_id: null,
                short_description: null,
                sale_description: null,
                min_order: null,
                min_variant_order: null,
                brand: null,
                category: null,
                delivery_date: null,
                buying_group: null,
                is_editor_choice: null,
                compositions: null,
                prices: [],
                variants: [],
                assortments: [],
                eans: [],
            }
        },
        setCurrentProduct({ commit }, product) {
            commit('setCurrentProduct', product)
        },
        setAvailableProducts({ commit }, products) {
            commit('setAvailableProducts', products)
        },
        showNextProduct({ commit, getters }) {
            commit('setCurrentProduct', getters.nextProduct)
        },
        showPrevProduct({ commit, getters }) {
            commit('setCurrentProduct', getters.prevProduct)
        },
        showSingle({ commit }, product) {
            commit('setCurrentProduct', product)
            commit('setSingleVisisble', true)
        },
        async updateProduct({ commit }, product) {
            commit('updateProduct', product)

            const apiUrl = `/products/${product.id}`
            axios.put(apiUrl, product)
        },
        async uploadImage({ commit, dispatch }, { file, product, variant, image, callback }) {
            // First generate presigned URL we can put the image to from the API
            const apiUrl = `/media/generate-persigned-url?file_id=${file.id}&datasource_id=${product.datasource_id}`
            let presignedUrl
            await axios.get(apiUrl).then(response => {
                presignedUrl = response.data
            })

            // Next configure a request to the presigned URL
            const uploadUrl = presignedUrl.presigned_url

            let blob = new Blob([image], { type: image.type })
            let xhr = new XMLHttpRequest()
            await new Promise((resolve, reject) => {
                xhr.open('PUT', uploadUrl)
                xhr.setRequestHeader('x-amz-acl', 'public-read')
                xhr.setRequestHeader('Content-Type', 'image/jpeg')
                xhr.upload.onprogress = event => {
                    return callback(parseInt(Math.round((event.loaded / event.total) * 100)))
                }
                xhr.onload = () => resolve(xhr)
                xhr.onerror = () => reject(xhr)
                xhr.send(blob)
            })
                .then(response => {
                    // On success, set the image on the variant
                    variant.image = presignedUrl.url
                })
                .catch(err => {})
        },
        async deleteImages({ commit }, imagesToDelete) {
            await axios
                .delete(`/api/product/images`, {
                    data: {
                        ids: imagesToDelete,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async deleteProduct({ commit }, productId) {
            console.log('Deleting product in store')

            await axios
                .delete(`/api/product`, {
                    data: {
                        id: productId,
                    },
                })
                .then(response => {
                    console.log('product deleted!')
                    Product.delete(productId)
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setProductStatus(state, status) {
            state.status = status
        },
        insertProducts(state, { products, method }) {
            // Loop through the products and format their data as necessary
            products.forEach(product => {
                // Cast datasource_if to a number
                product.datasource_id = parseInt(product.datasource_id)
                // Format delivery_date
                if (product.delivery_date) {
                    product.delivery_date = new Date(product.delivery_date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                    })
                }
            })
            if (method == 'add') {
                // Add to existing products
                state.products = state.products.concat(products)
            } else {
                state.products = products
            }
        },
        setCurrentProduct(state, product) {
            state.currentProduct = product
        },
        setAvailableProducts(state, products) {
            state.availableProducts = products
        },
        updateSelectedCategories(state, payload) {
            state.selectedCategories = payload
        },
        updateSelectedDeliveryDates(state, payload) {
            state.selectedDeliveryDates = payload
        },
        updateSelectedBuyerGroups(state, payload) {
            state.selectedBuyerGroups = payload
        },
        setUnreadOnly(state, payload) {
            state.unreadOnly = payload
        },
        setCurrentProductFilter(state, payload) {
            state.currentProductFilter = payload
        },
        setSingleVisisble(state, bool) {
            state.singleVisible = bool
        },
        updateProduct(state, product) {
            // Replace the product with the new
            let stateProduct = state.products.find(x => x.id == product.id)
            Object.assign(stateProduct, product)
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        procesSelectionProducts: state => {
            const products = state.products
            products.map(product => {
                Vue.set(product, 'feedback', {
                    ins: product.feedbacks.filter(x => x.action == 'In'),
                    out: product.feedbacks.filter(x => x.action == 'Out'),
                    focus: product.feedbacks.filter(x => x.action == 'Focus'),
                })
                Vue.set(
                    product,
                    'ins',
                    product.feedbacks.filter(x => x.action == 'In')
                )
                Vue.set(
                    product,
                    'outs',
                    product.feedbacks.filter(x => x.action == 'Out')
                )
                Vue.set(
                    product,
                    'focus',
                    product.feedbacks.filter(x => x.action == 'Focus')
                )
                Vue.set(product, 'nds', [])
            })
        },
    },
}
