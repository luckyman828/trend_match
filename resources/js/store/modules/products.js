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
        productsFilteredBySearch: [],
        status: null,
        currentFocusRowIndex: null,
    },

    getters: {
        loadingProducts: state => state.loading,
        productsStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        currentFocusRowIndex: state => state.currentFocusRowIndex,
        getProductsFilteredBySearch: state => state.productsFilteredBySearch,
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
        async fetchProducts({ commit }, { fileId, addToState = true }) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/files/${fileId}/products`

            let products
            await axios
                .get(apiUrl)
                .then(response => {
                    products = response.data
                    if (addToState) commit('insertProducts', { products, method: 'set' })
                    commit('PROCESS_PRODUCTS')
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    commit('setProductStatus', 'error')
                })
            return products
        },
        async fetchSelectionProducts({ commit, dispatch }, { selections, addToState = true }) {
            commit('setProductStatus', 'loading')

            const selectionProductArrayPairs = []
            let productsToReturn

            // Loop through the selections and fetch all the products
            await Promise.all(
                selections.map(async selection => {
                    const apiUrl = `/selections/${selection.id}/products`
                    await axios.get(apiUrl).then(async response => {
                        const products = response.data
                        await commit('PROCESS_SELECTION_PRODUCTS', products)
                        selectionProductArrayPairs.push({ selection, products })
                    })
                })
            )
                .then(async response => {
                    // Fetch fresh products
                    const freshProducts = await dispatch('fetchProducts', {
                        fileId: selections[0].file_id,
                        addToState: false,
                    })
                    await commit('PROCESS_PRODUCTS_FOR_MULTIPLE_SELECTIONS', {
                        products: freshProducts,
                        selectionProductArrayPairs,
                    })
                    productsToReturn = freshProducts
                    if (addToState) commit('insertProducts', { products: productsToReturn, method: 'set' })
                    commit('setProductStatus', 'success')
                })
                .catch(err => {
                    console.log(err)
                    commit('setProductStatus', 'error')
                })
            return productsToReturn
        },
        async showSelectionProductPDP({ getters, commit, dispatch }, { product, selection }) {
            // Set the current PDP selection
            commit('selections/SET_CURRENT_PDP_SELECTION', selection, { root: true })

            // Show the single PDP
            commit('setSingleVisisble', true)

            // If we have already fetched the product data from this selection as selectionInput on our current product, simply use that data
            // Find the product in our products map, to be sure we get the original product, since the current product will be overwritten by us now.
            const productMap = getters.products
            const stateProduct = productMap.find(x => x.id == product.id)
            const existingSelectionInput = stateProduct.selectionInputArray.find(x => x.selection.id == selection.id)
            if (existingSelectionInput) {
                // Set the current product
                commit('setCurrentProduct', existingSelectionInput.product)
                // Set our avaialble products to the products from the chosen selection so we can navigate back and forth
                const newAvailableProducts = productMap.map(product => {
                    const selectionInput = product.selectionInputArray.find(x => x.selection.id == selection.id)
                    return selectionInput.product
                })
                // Filter our products by search
                const selectionProductsFilteredBySearch = newAvailableProducts.filter(product =>
                    getters.getProductsFilteredBySearch.find(x => x.id == product.id)
                )
                commit('setAvailableProducts', selectionProductsFilteredBySearch)
            }

            // If we have not already fetched the data for this selection
            else {
                // Fetch the products for this selection, but don't save them to our state, since we only need them for our available products
                const selectionProducts = await dispatch('fetchSelectionProducts', {
                    selections: [selection],
                    addToState: false,
                })
                // Filter our products by search
                const selectionProductsFilteredBySearch = selectionProducts.filter(product =>
                    getters.getProductsFilteredBySearch.find(x => x.id == product.id)
                )
                // Set our available products equal to the recently fetched products
                commit('setAvailableProducts', selectionProductsFilteredBySearch)
                // Set the current product
                const newCurrentProduct = selectionProducts.find(x => x.id == product.id)
                commit('setCurrentProduct', newCurrentProduct)
            }
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
        async deleteProducts({ commit, dispatch }, { file, products }) {
            return new Promise((resolve, reject) => {
                commit('DELETE_PRODUCTS', products)
                const apiUrl = `/files/${file.id}/products`
                axios
                    .post(apiUrl, {
                        method: 'Remove',
                        products: products,
                    })
                    .then(response => {
                        // Add the created ID to the product, if we only have 1 product
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        // Re-add the products
                        commit('insertProducts', { products, method: 'add' })
                        dispatch(
                            'alerts/showAlert',
                            'Something went wrong when creating the product. Please try again.',
                            { root: true }
                        )
                    })
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
        DELETE_PRODUCTS(state, products) {
            products.forEach(product => {
                const index = state.products.findIndex(x => x.id == product.id)
                state.products.splice(index, 1)
            })
        },
        SET_PRODUCTS_FILTERED_BY_SEARCH(state, products) {
            state.productsFilteredBySearch = products
        },
        setCurrentProduct(state, product) {
            state.currentProduct = product
        },
        setCurrentFocusRowIndex(state, index) {
            state.currentFocusRowIndex = index
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
        PROCESS_PRODUCTS: state => {
            const products = state.products
            products.map(product => {
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
                            const preferredPrice = product.prices.find(x => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                            else return product.prices[0]
                        } else {
                            return product.prices[0]
                        }
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
            })
        },
        PROCESS_SELECTION_PRODUCTS(state, products) {
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
                        return product.feedbacks.filter(x => x.action == 'In')
                    },
                    configurable: true,
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'None')
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
                // Remove deleted comments
                Vue.set(product, 'comments', product.comments.filter(x => !x.is_deleted))
            })
        },
        PROCESS_PRODUCTS_FOR_MULTIPLE_SELECTIONS(state, { products, selectionProductArrayPairs }) {
            // Use the first product of the
            products.map((product, productIndex) => {
                // Attach the correct selection product to the base product
                Vue.set(
                    product,
                    'selectionInputArray',
                    selectionProductArrayPairs.map(x => {
                        return {
                            selection: x.selection,
                            product: x.products[productIndex],
                        }
                    })
                )

                // ---- START PRICES ----
                const preferred_currency = product.selectionInputArray[0].product.preferred_currency
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
                        if (preferred_currency) {
                            const preferredPrice = product.prices.find(x => (x.currency = preferred_currency))
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

                Object.defineProperty(product, 'feedbacks', {
                    get: function() {
                        return product.selectionInputArray.reduce((acc, selectionProductPair) => {
                            return acc.concat(
                                selectionProductPair.product.feedbacks.filter(
                                    action =>
                                        !acc.find(existingAction => existingAction.selection_id == action.selection_id)
                                )
                            )
                        }, [])
                    },
                })
                Object.defineProperty(product, 'actions', {
                    get: function() {
                        return product.selectionInputArray.reduce((acc, selectionProductPair) => {
                            return acc.concat(
                                selectionProductPair.product.actions.filter(
                                    action =>
                                        !acc.find(existingAction => existingAction.selection_id == action.selection_id)
                                )
                            )
                        }, [])
                    },
                })
                Object.defineProperty(product, 'comments', {
                    get: function() {
                        return product.selectionInputArray.reduce((acc, selectionProductPair) => {
                            return acc.concat(
                                selectionProductPair.product.comments.filter(
                                    comment =>
                                        !acc.find(existingComment => existingComment.id == comment.id) &&
                                        !comment.is_deleted
                                )
                            )
                        }, [])
                    },
                })
                Object.defineProperty(product, 'requests', {
                    get: function() {
                        return product.selectionInputArray.reduce((acc, selectionProductPair) => {
                            return acc.concat(
                                selectionProductPair.product.requests.filter(
                                    request => !acc.find(existingRequest => existingRequest.id == request.id)
                                )
                            )
                        }, [])
                    },
                })

                // Set the current action for the user
                Object.defineProperty(product, 'your_feedback', {
                    get: function() {
                        return product.feedbacks.find(
                            x => x.selection_id == product.selectionInputArray[0].selection.id
                        ).action
                    },
                    set: function(value) {
                        product.feedbacks.find(
                            x => x.selection_id == product.selectionInputArray[0].selection.id
                        ).action = value
                    },
                    configurable: true,
                })
                // Set the current action for the user
                Object.defineProperty(product, 'action', {
                    get: function() {
                        return product.actions.find(x => x.selection_id == product.selectionInputArray[0].selection.id)
                            .action
                    },
                    set: function(value) {
                        product.actions.find(
                            x => x.selection_id == product.selectionInputArray[0].selection.id
                        ).action = value
                    },
                    configurable: true,
                })
                // Set the current action for the user
                Object.defineProperty(product, 'action_author', {
                    get: function() {
                        return product.actions.find(x => x.selection_id == product.selectionInputArray[0].selection.id)
                            .user
                    },
                    set: function(value) {
                        product.actions.find(
                            x => x.selection_id == product.selectionInputArray[0].selection.id
                        ).user = value
                    },
                    configurable: true,
                })

                // Dynamically Calculated Actions
                // Feedback Actions
                Object.defineProperty(product, 'ins', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'In')
                    },
                    configurable: true,
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        return product.feedbacks.filter(x => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        return product.actions.filter(x => x.action == 'None')
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
            })
        },
    },
}
