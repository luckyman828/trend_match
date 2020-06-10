import axios from 'axios'
import sortArray from '../../mixins/sortArray'
import Compressor from 'compressorjs'

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
        lastSort: null,
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
        nextProduct: (state, getters, rootState, rootGetters) => {
            // If we have a nextProduct in our presenterQueue, then use that instead
            const nextPresentationQueueProduct = rootGetters['presenterQueue/getNextProduct']
            if (nextPresentationQueueProduct) {
                if (nextPresentationQueueProduct.selectionInputArray) {
                    return nextPresentationQueueProduct.selectionInputArray[0].product
                }
                return nextPresentationQueueProduct
            }

            // Find the index of the current product
            const index = state.availableProducts.findIndex(x => x.id == state.currentProduct.id)
            // Check that the current is not the last in the array
            if (index + 1 < state.availableProducts.length) {
                return state.availableProducts[index + 1]
            }
        },
        prevProduct: (state, getters, rootState, rootGetters) => {
            // If we have a prevProduct in our presenterQueue, then use that instead
            const prevPresentationQueueProduct = rootGetters['presenterQueue/getPrevProduct']
            if (prevPresentationQueueProduct) {
                if (prevPresentationQueueProduct.selectionInputArray) {
                    return prevPresentationQueueProduct.selectionInputArray[0].product
                }
                return prevPresentationQueueProduct
            }

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
            commit('SET_PRODUCTS_STATUS', 'loading')

            const apiUrl = `/files/${fileId}/products`

            let products
            await axios
                .get(apiUrl)
                .then(response => {
                    products = response.data
                    if (addToState) {
                        commit('insertProducts', { products, method: 'set' })
                        commit('PROCESS_PRODUCTS', products)
                    }
                    commit('SET_PRODUCTS_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_PRODUCTS_STATUS', 'error')
                })
            return products
        },
        async fetchSelectionProducts({ commit, dispatch, rootGetters }, { selections, addToState = true }) {
            commit('SET_PRODUCTS_STATUS', 'loading')
            const authUser = rootGetters['auth/authUser']

            const selectionProductArrayPairs = []
            let productsToReturn

            // Loop through the selections and fetch all the products
            await Promise.all(
                selections.map(async selection => {
                    const apiUrl = `/selections/${selection.id}/products`
                    await axios.get(apiUrl).then(async response => {
                        const products = response.data
                        await commit('PROCESS_SELECTION_PRODUCTS', { products, selection, authUser })
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
                        authUser,
                    })
                    productsToReturn = freshProducts
                    if (addToState) commit('insertProducts', { products: productsToReturn, method: 'set' })
                    commit('SET_PRODUCTS_STATUS', 'success')
                })
                .catch(err => {
                    console.log(err)
                    commit('SET_PRODUCTS_STATUS', 'error')
                })
            return productsToReturn
        },
        async showSelectionProductPDP({ getters, commit, dispatch }, { product, selection }) {
            // If the selection has no settings fetched, fetch the settings
            if (!selection.settings) await dispatch('selections/fetchSelectionSettings', selection, { root: true })

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
                commit('setCurrentProduct', newCurrentProduct.selectionInputArray[0].product)
            }

            // Set the current PDP selection
            commit('selections/SET_CURRENT_PDP_SELECTION', selection, { root: true })

            // Show the single PDP
            commit('setSingleVisisble', true)
        },
        async insertProducts({ commit, dispatch }, { file, products, addToState }) {
            return new Promise((resolve, reject) => {
                if (addToState) {
                    commit('insertProducts', { products, method: 'add' })
                    commit('PROCESS_PRODUCTS', products)
                    commit('SORT_PRODUCTS')
                }
                const apiUrl = `/files/${file.id}/products`
                axios
                    .post(apiUrl, {
                        method: 'Add',
                        products: products,
                    })
                    .then(response => {
                        // Alert the user
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${products.length > 1 ? products.length + ' ' : ''}Product${
                                    products.length > 1 ? 's' : ''
                                } created`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )

                        // Add the created ID to the product, if we only have 1 product
                        if (products.length <= 1) {
                            const product = products[0]
                            product.id = response.data.added_product_id_map[product.datasource_id]
                        }
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Something went wrong when creating the product. Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('insertProducts', { file, products, addToState }),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })
            }).catch(err => {
                console.log(err)
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
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Product updated',
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )

                        commit('updateProduct', product)
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Something went wrong when updating the product. Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('updateProduct', product),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })
            })
        },
        async updateManyProducts({ commit, dispatch }, { file, products }) {
            return new Promise((resolve, reject) => {
                const apiUrl = `/products?file_id=${file.id}`
                axios
                    .post(apiUrl, {
                        method: 'Add',
                        products,
                    })
                    .then(response => {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${products.length} products updated`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )

                        products.map(product => {
                            commit('updateProduct', product)
                        })
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Something went wrong when updating products. Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('updateManyProducts', { file, products }),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
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

                // PRE-COMPRESS THE IMAGE
                let compressedImage = image
                await new Promise((resolve, reject) => {
                    new Compressor(image, {
                        quality: 0.8,
                        checkOrientation: true,
                        maxHeight: 2016,
                        success(result) {
                            compressedImage = result
                            resolve()
                        },
                        error(err) {
                            console.log(err.message)
                            reject()
                        },
                    })
                })

                // Next configure a request to the presigned URL
                const uploadUrl = presignedUrl.presigned_url

                let blob = new Blob([compressedImage], { type: compressedImage.type })
                let xhr = new XMLHttpRequest()
                await new Promise((resolve, reject) => {
                    xhr.open('PUT', uploadUrl)
                    xhr.setRequestHeader('x-amz-acl', 'public-read')
                    xhr.setRequestHeader('Content-Type', 'image/jpeg')
                    xhr.upload.onprogress = event => {
                        if (callback) {
                            return callback(parseInt(Math.round((event.loaded / event.total) * 100)))
                        }
                    }
                    xhr.onload = () => resolve(xhr)
                    xhr.onerror = () => reject(xhr)
                    xhr.send(blob)
                })
                    .then(response => {
                        // On success, set the image on the variant
                        let newUrl = presignedUrl.url
                        // Change the URL from https to https
                        if (newUrl.indexOf('https') < 0) {
                            newUrl = newUrl.slice(0, 4) + 's' + newUrl.slice(4)
                        }
                        variant.image = newUrl
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
                .catch(err => {})
        },
        async deleteProducts({ state, getters, commit, dispatch }, { file, products }) {
            return new Promise((resolve, reject) => {
                const apiUrl = `/files/${file.id}/products`
                axios
                    .post(apiUrl, {
                        method: 'Remove',
                        products: products,
                    })
                    .then(response => {
                        commit('DELETE_PRODUCTS', products)
                        resolve(response)
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${products.length} product${products.length > 1 ? 's' : ''} deleted`,
                                callback: () => restoreProducts(),
                                callbackLabel: 'Restore products',
                                iconClass: 'fa-trash',
                                type: 'danger',
                            },
                            { root: true }
                        )
                    })
                    .catch(err => {
                        reject(err)
                        // Re-add the products
                        commit('insertProducts', { products, method: 'add' })
                        // Show error message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Something went wrong when deleting the product(s). Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('deleteProducts', { file, products }),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })

                const restoreProducts = async () => {
                    await dispatch('insertProducts', { file, products, addToState: true })
                    commit('SORT_PRODUCTS')
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${products.length} product${products.length > 1 ? 's' : ''} re-added`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                }
            })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        SORT_PRODUCTS(state) {
            if (state.lastSort) {
                sortArray.methods.sortArray(state.products, state.lastSort.method, state.lastSort.key)
            }
        },
        SET_PRODUCTS_STATUS(state, status) {
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
            for (let i = products.length; i--; ) {
                const index = state.products.findIndex(x => x.id == products[i].id)
                state.products.splice(index, 1)
            }
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
        PROCESS_PRODUCTS(state, products) {
            products.map(product => {
                // Name
                product.title = product.title ? product.title : 'Unnamed'
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
                            else return product.prices[0]
                        } else {
                            return product.prices[0]
                        }
                    },
                    configurable: true,
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
        PROCESS_SELECTION_PRODUCTS(state, { products, selection, authUser }) {
            products.map(product => {
                // Name
                product.title = product.title ? product.title : 'Unnamed'
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
                // Remove deleted comments
                Vue.set(product, 'comments', product.comments.filter(x => !x.is_deleted))

                // PROCESS VARIANTS
                product.variants.forEach(variant => {
                    Object.defineProperty(variant, 'feedbacks', {
                        get: function() {
                            const feedbacks = []
                            product.feedbacks.map(feedback => {
                                const variantFeedbacks = feedback.variants.filter(x => x.id == variant.id)
                                variantFeedbacks.map(variantFeedback => {
                                    feedbacks.push({
                                        id: variantFeedback.id,
                                        action: variantFeedback.feedback,
                                        user_id: feedback.user_id,
                                        user: feedback.user,
                                        selection_id: feedback.selection_id,
                                        selection: feedback.selection,
                                    })
                                })
                            })
                            return feedbacks
                        },
                    })
                    // Get the user's feedback
                    Object.defineProperty(variant, 'your_feedback', {
                        get: function() {
                            const userFeedback = variant.feedbacks.find(x => x.user_id == authUser.id)
                            return userFeedback ? userFeedback.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the user feedback for the variant input for this feedback action
                            const userFeedback = product.feedbacks.find(
                                // feedback => feedback.user_id == authUser.id && feedback.selection_id == selection.id
                                feedback => feedback.user_id == authUser.id
                            )
                            // If the user has already made variant input, update the action
                            const userVariantFeedbackIndex = userFeedback.variants.findIndex(x => x.id == variant.id)
                            if (userVariantFeedbackIndex >= 0) {
                                userFeedback.variants.splice(userVariantFeedbackIndex, 1, {
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            } else {
                                userFeedback.variants.push({
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            }
                        },
                    })

                    Object.defineProperty(variant, 'actions', {
                        get: function() {
                            const actions = []
                            product.actions.map(action => {
                                const variantActions = action.variants.filter(x => x.id == variant.id)
                                variantActions.map(variantAction => {
                                    actions.push({
                                        id: variantAction.id,
                                        action: variantAction.feedback,
                                        user_id: action.user_id,
                                        user: action.user,
                                        selection_id: action.selection_id,
                                        selection: action.selection,
                                    })
                                })
                            })
                            return actions
                        },
                    })
                    // Get the selection's action
                    Object.defineProperty(variant, 'action', {
                        get: function() {
                            const selectionAction = variant.actions.find(x => x.selection_id == selection.id)
                            return selectionAction ? selectionAction.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the current action for the variant input for this action action
                            const currentAction = product.actions.find(action => action.selection_id == selection.id)
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants.splice(currentVariantActionIndex, 1, {
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            } else {
                                currentAction.variants.push({
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            }
                        },
                    })

                    // Feedback Actions
                    Object.defineProperty(variant, 'ins', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'In')
                        },
                        configurable: true,
                    })
                    Object.defineProperty(variant, 'outs', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(variant, 'focus', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(variant, 'nds', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'None')
                        },
                    })

                    // Alignment Actions
                    Object.defineProperty(variant, 'alignmentIns', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'In')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentOuts', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentFocus', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentNds', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'None')
                        },
                    })
                    // All Actions
                    Object.defineProperty(variant, 'allIns', {
                        get: function() {
                            return variant.ins.length + variant.alignmentIns.length
                        },
                    })
                    Object.defineProperty(variant, 'allOuts', {
                        get: function() {
                            return variant.outs.length + variant.alignmentOuts.length
                        },
                    })
                    Object.defineProperty(variant, 'allFocus', {
                        get: function() {
                            return variant.focus.length + variant.alignmentFocus.length
                        },
                    })
                    Object.defineProperty(variant, 'allNds', {
                        get: function() {
                            return variant.nds.length + variant.alignmentNds.length
                        },
                    })
                })
                // END PROCESS VARIANTS
            })
        },
        PROCESS_PRODUCTS_FOR_MULTIPLE_SELECTIONS(state, { products, selectionProductArrayPairs, authUser }) {
            // Use the first product of the
            products.map((product, productIndex) => {
                // Name
                product.title = product.title ? product.title : 'Unnamed'
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
                            const preferredPrice = product.prices.find(x => x.currency == preferred_currency)
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                    configurable: true,
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
                        return product.selectionInputArray[0].product.your_feedback
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

                // PROCESS VARIANTS
                product.variants.forEach(variant => {
                    Object.defineProperty(variant, 'feedbacks', {
                        get: function() {
                            const feedbacks = []
                            product.feedbacks.map(feedback => {
                                const variantFeedbacks = feedback.variants.filter(x => x.id == variant.id)
                                variantFeedbacks.map(variantFeedback => {
                                    feedbacks.push({
                                        id: variantFeedback.id,
                                        action: variantFeedback.feedback,
                                        user_id: feedback.user_id,
                                        user: feedback.user,
                                        selection_id: feedback.selection_id,
                                        selection: feedback.selection,
                                    })
                                })
                            })
                            return feedbacks
                        },
                    })
                    // Get the user's feedback
                    Object.defineProperty(variant, 'your_feedback', {
                        get: function() {
                            const userFeedback = variant.feedbacks.find(x => x.user_id == authUser.id)
                            return userFeedback ? userFeedback.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the user feedback for the variant input for this feedback action
                            const userFeedback = product.feedbacks.find(
                                feedback =>
                                    feedback.user_id == authUser.id &&
                                    feedback.selection_id == product.selectionInputArray[0].selection.id
                            )
                            // If the user has already made variant input, update the action
                            const userVariantFeedbackIndex = userFeedback.variants.findIndex(x => x.id == variant.id)
                            if (userVariantFeedbackIndex >= 0) {
                                userFeedback.variants.splice(userVariantFeedbackIndex, 1, {
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            } else {
                                userFeedback.variants.push({
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            }
                        },
                    })

                    Object.defineProperty(variant, 'actions', {
                        get: function() {
                            const actions = []
                            product.actions.map(action => {
                                const variantActions = action.variants.filter(x => x.id == variant.id)
                                variantActions.map(variantAction => {
                                    actions.push({
                                        id: variantAction.id,
                                        action: variantAction.feedback,
                                        user_id: action.user_id,
                                        user: action.user,
                                        selection_id: action.selection_id,
                                        selection: action.selection,
                                    })
                                })
                            })
                            return actions
                        },
                    })
                    // Get the selection's action
                    Object.defineProperty(variant, 'action', {
                        get: function() {
                            const selectionAction = variant.actions.find(
                                x => x.selection_id == product.selectionInputArray[0].selection.id
                            )
                            return selectionAction ? selectionAction.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the current action for the variant input for this action action
                            const currentAction = product.actions.find(
                                action => action.selection_id == product.selectionInputArray[0].selection.id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants.splice(currentVariantActionIndex, 1, {
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            } else {
                                currentAction.variants.push({
                                    feedback: newAction,
                                    id: variant.id,
                                })
                            }
                        },
                    })

                    // Feedback Actions
                    Object.defineProperty(variant, 'ins', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'In')
                        },
                        configurable: true,
                    })
                    Object.defineProperty(variant, 'outs', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(variant, 'focus', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(variant, 'nds', {
                        get: function() {
                            return variant.feedbacks.filter(x => x.action == 'None')
                        },
                    })

                    // Alignment Actions
                    Object.defineProperty(variant, 'alignmentIns', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'In')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentOuts', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentFocus', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(variant, 'alignmentNds', {
                        get: function() {
                            return variant.actions.filter(x => x.action == 'None')
                        },
                    })
                    // All Actions
                    Object.defineProperty(variant, 'allIns', {
                        get: function() {
                            return variant.ins.length + variant.alignmentIns.length
                        },
                    })
                    Object.defineProperty(variant, 'allOuts', {
                        get: function() {
                            return variant.outs.length + variant.alignmentOuts.length
                        },
                    })
                    Object.defineProperty(variant, 'allFocus', {
                        get: function() {
                            return variant.focus.length + variant.alignmentFocus.length
                        },
                    })
                    Object.defineProperty(variant, 'allNds', {
                        get: function() {
                            return variant.nds.length + variant.alignmentNds.length
                        },
                    })
                })
                // END PROCESS VARIANTS
            })
        },
        SET_LAST_SORT(state, { method, key }) {
            state.lastSort = { method, key }
        },
    },
}
