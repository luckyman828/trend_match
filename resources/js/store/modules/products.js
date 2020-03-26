import axios from 'axios'

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
        currentFocusIndex: null,
    },

    getters: {
        loadingProducts: state => state.loading,
        productsStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        currentFocusIndex: state => state.currentFocusIndex,
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
                    const theCategory = product.category.toLowerCase()
                    const found = uniqueCategories.includes(theCategory)
                    if (!found) uniqueCategories.push(theCategory)
                }
            })
            return uniqueCategories
        },
        availableDeliveryDates(state, getters) {
            const products = getters.products
            let uniqueDeliveryDates = []
            products.forEach(product => {
                if (product.delivery_date) {
                    // const found = uniqueDeliveryDates.find(x => x.value == product.delivery_date)
                    const found = uniqueDeliveryDates.find(x => x == product.delivery_date)
                    if (!found)
                        // uniqueDeliveryDates.push({
                        //     name: new Date(product.delivery_date).toLocaleDateString('en-GB', {
                        //         month: 'long',
                        //         year: 'numeric',
                        //     }),
                        //     value: product.delivery_date,
                        // })
                        uniqueDeliveryDates.push(product.delivery_date)
                }
            })
            return uniqueDeliveryDates
        },
        availableBuyerGroups(state, getters) {
            const products = getters.products
            let unique = []
            products.forEach(product => {
                if (product.buying_group) {
                    const theBuyingGroup = product.buying_group.toLowerCase()
                    const found = unique.includes(theBuyingGroup)
                    if (!found) unique.push(theBuyingGroup)
                }
            })
            return unique
        },
        productTotals(state, getters, rootState, rootGetters) {
            const products = getters.products
            const selection = rootGetters['selections/currentSelection']
            const currentAction = rootGetters['selections/currentSelectionModeAction']

            const totals = {
                all: 0,
                ins: 0,
                focus: 0,
                outs: 0,
                nds: 0,
                count: 0,
            }
            totals.all = products.length

            if (selection) {
                products.forEach(product => {
                    if (!product[currentAction] || product[currentAction] == 'None') totals.nds++
                    if (product[currentAction] == 'In') totals.ins++
                    if (product[currentAction] == 'Out') totals.outs++
                    if (product[currentAction] == 'Focus') totals.focus++
                })
            }
            return totals
        },
        productsFiltered(state, getters, rootState, rootGetters) {
            const currentAction = rootGetters['selections/currentSelectionModeAction']
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
                    return product.category && Array.from(categories).includes(product.category.toLowerCase())
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
                    return product.buying_group && Array.from(buyerGroups).includes(product.buying_group.toLowerCase())
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
                    if (actionFilter == 'nds') return !product[currentAction] || product[currentAction] == 'None'
                    if (actionFilter == 'outs') return product[currentAction] == 'Out'
                    if (actionFilter == 'ins')
                        return product[currentAction] == 'In' || product[currentAction] == 'Focus'
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
                    commit('procesProducts')
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    commit('setProductStatus', 'error')
                })
        },
        async fetchSelectionProducts({ commit, dispatch }, selectionId) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/selections/${selectionId}/products`

            await axios
                .get(apiUrl)
                .then(response => {
                    commit('insertProducts', { products: response.data, method: 'set' })
                    dispatch('procesSelectionProducts')
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    commit('setProductStatus', 'error')
                })
        },
        async insertProducts({ commit, dispatch }, { file, products, addToState }) {
            return new Promise((resolve, reject) => {
                if (addToState) commit('insertProducts', { products, method: 'add' })
                const apiUrl = `/files/${file.id}/products`
                axios
                    .post(apiUrl, {
                        method: 'Add',
                        products: products,
                    })
                    .then(response => {
                        // Add the created ID to the product, if we only have 1 product
                        if (products.length <= 1) {
                            const product = products[0]
                            product.id = response.data.added_product_id_map[product.datasource_id]
                        }
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        dispatch(
                            'alerts/showAlert',
                            'Something went wrong when creating the product. Please try again.',
                            { root: true }
                        )
                    })
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
        async updateProduct({ commit, dispatch }, product) {
            return new Promise((resolve, reject) => {
                const apiUrl = `/products/${product.id}`
                axios
                    .put(apiUrl, product)
                    .then(response => {
                        commit('updateProduct', product)
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        dispatch(
                            'alerts/showAlert',
                            'Something went wrong when updating the product. Please try again.',
                            { root: true }
                        )
                    })
            })
        },
        async uploadImage({ commit, dispatch }, { file, product, variant, image, callback }) {
            return new Promise(async (resolve, reject) => {
                // First generate presigned URL we can put the image to from the API
                const apiUrl = `/media/generate-persigned-url?file_id=${file.id}&datasource_id=${product.datasource_id}`
                let presignedUrl
                await axios
                    .get(apiUrl)
                    .then(response => {
                        presignedUrl = response.data
                    })
                    .catch(err => {
                        reject(err)
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
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
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
        procesSelectionProducts({ commit, state, rootGetters }) {
            console.log('process products')
            const authUser = rootGetters['auth/authUser']
            const products = state.products
            products.map(product => {
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
                            const preferredPrice = product.prices.find(x => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                })

                // Dynamically Calculated Actions
                // Feedback Actions
                Object.defineProperty(product, 'ins', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'None')
                    },
                })
                // All Actions
                Object.defineProperty(product, 'allIns', {
                    get: function() {
                        return product.ins.length + product.alignmentIns.length
                    },
                })
                Object.defineProperty(product, 'allOuts', {
                    get: function() {
                        return product.outs.length + product.alignmentOuts.length
                    },
                })
                Object.defineProperty(product, 'allFocus', {
                    get: function() {
                        return product.focus.length + product.alignmentFocus.length
                    },
                })
                Object.defineProperty(product, 'allNds', {
                    get: function() {
                        return product.nds.length + product.alignmentNds.length
                    },
                })

                // Hard Set Actions
                // Feedback Actions
                // Vue.set(
                //     product,
                //     'ins',
                //     product.selection_feedback.filter(x => x.action == 'In')
                // )
                // Vue.set(
                //     product,
                //     'outs',
                //     product.selection_feedback.filter(x => x.action == 'Outs')
                // )
                // Vue.set(
                //     product,
                //     'focus',
                //     product.selection_feedback.filter(x => x.action == 'Focus')
                // )
                // Vue.set(
                //     product,
                //     'nds',
                //     product.selection_feedback.filter(x => x.action == 'None')
                // )
                // // Alignment Actions
                // Vue.set(
                //     product,
                //     'alignmentIns',
                //     product.alignment_actions.filter(x => x.action == 'In')
                // )
                // Vue.set(
                //     product,
                //     'alignmentOuts',
                //     product.alignment_actions.filter(x => x.action == 'Outs')
                // )
                // Vue.set(
                //     product,
                //     'alignmentFocus',
                //     product.alignment_actions.filter(x => x.action == 'Focus')
                // )
                // Vue.set(
                //     product,
                //     'alignmentNds',
                //     product.alignment_actions.filter(x => x.action == 'None')
                // )
                // // All Actions
                // Vue.set(product, 'allIns', product.ins.length + product.alignmentIns.length)
                // Vue.set(product, 'allOuts', product.outs.length + product.alignmentOuts.length)
                // Vue.set(product, 'allFocus', product.focus.length + product.alignmentFocus.length)
                // Vue.set(product, 'allNds', product.nds.length + product.alignmentNds.length)

                // Comments / Requests
                Object.defineProperty(product, 'hasAuthUserRequest', {
                    get: function() {
                        return !!product.requests.find(x => x.author_id == authUser.id)
                    },
                })
                // Remove deleted comments
                Vue.set(
                    product,
                    'comments',
                    product.comments.filter(x => !x.is_deleted)
                )
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
            console.log('Done settings current product')
        },
        setCurrentFocusIndex(state, index) {
            state.currentFocusIndex = index
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
            // Check if we also need to update the current product
            if (state.currentProduct && state.currentProduct.id == product.id) {
                Object.assign(state.currentProduct, product)
            }
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        procesProducts: state => {
            const products = state.products
            products.map(product => {
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
                            const preferredPrice = product.prices.find(x => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                            else return product.prices[0]
                        } else {
                            return product.prices[0]
                        }
                    },
                })
            })
        },
        procesSelectionProducts: state => {
            const products = state.products
            products.map(product => {
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
                            const preferredPrice = product.prices.find(x => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                })

                // Actions
                // Feedback Actions
                Object.defineProperty(product, 'ins', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        return product.selection_feedback.filter(x => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        return product.alignment_actions.filter(x => x.action == 'None')
                    },
                })

                // Comments / Requests
                Object.defineProperty(product, 'hasAuthUserRequest', {
                    get: function() {
                        return !!product.requests.find(x => x.author_id == 'None')
                    },
                })
                // Remove deleted comments
                Vue.set(
                    product,
                    'comments',
                    product.comments.filter(x => !x.is_deleted)
                )
            })
        },
    },
}
