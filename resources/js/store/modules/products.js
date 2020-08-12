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
        selectedSelectionIds: [],
        advancedFilter: null,
        unreadOnly: false,
        currentProductFilter: 'overview',
        singleVisible: false,
        products: [],
        productsFilteredBySearch: [],
        status: null,
        currentFocusRowIndex: null,
        lastSort: null,
        distributionScope: 'Feedback',
    },

    getters: {
        loadingProducts: state => state.loading,
        productsStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        currentFocusRowIndex: state => state.currentFocusRowIndex,
        getProductsFilteredBySearch: state => state.productsFilteredBySearch,
        getDistributionScope: state => state.distributionScope,
        getActiveSelectionInput: (state, getters, rootState, rootGetters) => product => {
            const activeSelection = rootGetters['selections/getCurrentSelections'][0]
            return product.selectionInputList.find(selectionInput => selectionInput.selection_id == activeSelection.id)
        },
        availableProducts: state => {
            return state.availableProducts
        },
        getAvailableProducts: state => {
            return state.availableProducts
        },
        nextProduct: (state, getters, rootState, rootGetters) => {
            // If we have a nextProduct in our presenterQueue, then use that instead
            const nextPresentationQueueProduct = rootGetters['presenterQueue/getNextProduct']
            if (nextPresentationQueueProduct) {
                return nextPresentationQueueProduct
            }

            const availableProducts = getters.getAvailableProducts
            // Find the index of the current product
            const index = availableProducts.findIndex(x => x.id == state.currentProduct.id)
            // Check that the current is not the last in the array
            if (index + 1 < availableProducts.length) {
                return availableProducts[index + 1]
            }
        },
        prevProduct: (state, getters, rootState, rootGetters) => {
            // If we have a prevProduct in our presenterQueue, then use that instead
            const prevPresentationQueueProduct = rootGetters['presenterQueue/getPrevProduct']
            if (prevPresentationQueueProduct) {
                return prevPresentationQueueProduct
            }

            const availableProducts = getters.getAvailableProducts
            // Find the index of the current product
            const index = availableProducts.findIndex(x => x.id == state.currentProduct.id)
            // Check that the current is not the first in the array
            if (index > 0) {
                return availableProducts[index - 1]
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
        getSelectedSelectionIds: state => {
            return state.selectedSelectionIds
        },
        getHasAdvancedFilter: state => {
            return !!state.advancedFilter && state.advancedFilter.length > 0
        },
        getAdvancedFilter: state => {
            return state.advancedFilter
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
        products: state => state.products,
        getProducts: state => state.products,
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
            const selectionMode = rootGetters['selections/currentSelectionMode']
            const products = getters.products
            const categories = getters.selectedCategories
            const deliveryDates = getters.selectedDeliveryDates
            const buyerGroups = getters.selectedBuyerGroups
            const unreadOnly = getters.unreadOnly
            const actionFilter = getters.currentProductFilter
            const getSelectionInput = getters.getActiveSelectionInput
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
                if (selectionMode == 'Approval') {
                    productsToReturn = productsToReturn.filter(
                        product => getSelectionInput(product).hasUnreadAlignerComment
                    )
                }
                if (selectionMode == 'Alignment') {
                    productsToReturn = productsToReturn.filter(
                        product => getSelectionInput(product).hasUnreadApproverComment
                    )
                }
            }

            // Filter by advanced filters
            if (getters.getHasAdvancedFilter) {
                productsToReturn = productsToReturn.filter(product => {
                    let include = true
                    getters.getAdvancedFilter.forEach((filter, index) => {
                        // FILTER BY USER FEEDBACK
                        if (filter.type == 'user') {
                            if (!filter.user.user_id) return
                            const operator = filter.operator
                            const userId = filter.user.user_id
                            const selectionId = filter.user.selection_id
                            const selectionInput = getSelectionInput(product)
                            const userFeedback = selectionInput.feedbacks.find(
                                feedback => feedback.user_id == userId && feedback.selection_id == selectionId
                            )
                            if (operator == '=' && (!userFeedback || userFeedback.action != filter.actionType))
                                include = false
                            if (operator == '!=' && !!userFeedback && userFeedback.action == filter.actionType)
                                include = false
                        }

                        // FILTER BY KEY
                        else {
                            if (filter.key.value == null) return
                            let filterKey = filter.key.value
                            if (getters.getDistributionScope == 'Alignment' && filterKey == 'ins')
                                filterKey = 'alignmentIns'
                            if (getters.getDistributionScope == 'Alignment' && filterKey == 'outs')
                                filterKey = 'alignmentOuts'
                            if (getters.getDistributionScope == 'Alignment' && filterKey == 'focus')
                                filterKey = 'alignmentFocus'
                            if (getters.getDistributionScope == 'Alignment' && filterKey == 'nds')
                                filterKey = 'alignmentNds'
                            const keyValue = Array.isArray(product[filterKey])
                                ? product[filterKey].length
                                : product[filterKey]
                            const operator = filter.operator
                            const value = filter.value
                            if (operator == '>' && keyValue <= value) include = false
                            if (operator == '>=' && keyValue < value) include = false
                            if (operator == '=' && keyValue != value) include = false
                            if (operator == '!=' && keyValue == value) include = false
                            if (operator == '<=' && keyValue > value) include = false
                            if (operator == '<' && keyValue >= value) include = false
                        }

                        // let filterKey = filter.key.value
                        // if (getters.getDistributionScope == 'Alignment' && filterKey == 'ins')
                        //     filterKey = 'alignmentIns'
                        // if (getters.getDistributionScope == 'Alignment' && filterKey == 'outs')
                        //     filterKey = 'alignmentOuts'
                        // if (getters.getDistributionScope == 'Alignment' && filterKey == 'focus')
                        //     filterKey = 'alignmentFocus'
                        // if (getters.getDistributionScope == 'Alignment' && filterKey == 'nds')
                        //     filterKey = 'alignmentNds'
                        // const keyValue = Array.isArray(product[filterKey])
                        //     ? product[filterKey].length
                        //     : product[filterKey]
                        // const operator = filter.operator
                        // const value = filter.value
                        // if (index == 0) console.log('filter products', keyValue, operator, value)
                        // if (operator == '>' && keyValue <= value) include = false
                        // if (operator == '>=' && keyValue < value) include = false
                        // if (operator == '=' && keyValue != value) include = false
                        // if (operator == '!=' && keyValue == value) include = false
                        // if (operator == '<=' && keyValue > value) include = false
                        // if (operator == '<' && keyValue >= value) include = false
                    })
                    return include
                })
            }

            // Filter by actions
            if (['ins', 'outs', 'nds', 'focus'].includes(actionFilter)) {
                const filteredByAction = productsToReturn.filter(product => {
                    if (actionFilter == 'nds')
                        return (
                            !getSelectionInput(product)[currentAction] ||
                            getSelectionInput(product)[currentAction] == 'None'
                        )
                    if (actionFilter == 'outs') return getSelectionInput(product)[currentAction] == 'Out'
                    if (actionFilter == 'focus') return getSelectionInput(product)[currentAction] == 'Focus'
                    if (actionFilter == 'ins')
                        return (
                            getSelectionInput(product)[currentAction] == 'In' ||
                            getSelectionInput(product)[currentAction] == 'Focus'
                        )
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
    },

    actions: {
        async fetchProducts({ commit, dispatch }, { fileId, addToState = true }) {
            commit('SET_PRODUCTS_STATUS', 'loading')

            const apiUrl = `/files/${fileId}/products`

            let products
            await axios
                .get(apiUrl)
                .then(response => {
                    products = response.data
                    if (addToState) {
                        commit('insertProducts', { products, method: 'set' })
                        dispatch('initProducts', products)
                    }
                    commit('SET_PRODUCTS_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_PRODUCTS_STATUS', 'error')
                })
            return products
        },
        async fetchSelectionProductInput({ commit, dispatch, rootGetters }, selection) {
            // commit('SET_PRODUCTS_STATUS', 'loading')
            let selectionProductInput
            const apiUrl = `/selections/${selection.id}/products`
            await axios
                .get(apiUrl)
                .then(async response => {
                    const products = response.data
                    selectionProductInput = { selection, products }
                })
                .then(() => {
                    // commit('SET_PRODUCTS_STATUS', 'success')
                })
                .catch(err => {
                    console.log(err)
                    // commit('SET_PRODUCTS_STATUS', 'error')
                })
            return selectionProductInput
        },
        async fetchSelectionProducts({ commit, dispatch, rootGetters }, selection) {
            commit('SET_PRODUCTS_STATUS', 'loading')
            const authUser = rootGetters['auth/authUser']

            // Fetch the selection input for the products
            const selectionProductInput = await dispatch('fetchSelectionProductInput', selection)

            // Process the selection products
            commit('MERGE_PRODUCTS_WITH_SELECTION_INPUT', {
                selectionProductInput,
                authUser,
            })
            commit('SET_PRODUCTS_STATUS', 'success')
        },
        async showSelectionProductPDP({ getters, commit, dispatch }, { product, selection }) {
            // If the selection has no settings fetched, fetch the settings
            if (!selection.settings) await dispatch('selections/fetchSelectionSettings', selection, { root: true })

            commit('setCurrentProduct', product)

            // Set the current PDP selection
            commit('selections/SET_CURRENT_PDP_SELECTION', selection, { root: true })

            // Save the list of products that should be available in pdp navigation
            commit('SET_AVAILABLE_PRODUCTS', getters.getProductsFilteredBySearch)

            // Show the single PDP
            commit('setSingleVisisble', true)
        },
        async insertProducts({ commit, dispatch }, { file, products, addToState }) {
            return new Promise((resolve, reject) => {
                if (addToState) {
                    commit('insertProducts', { products, method: 'add' })
                    dispatch('initProducts', products)
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
        async updateFileProducts({ commit, dispatch }, { fileId, products }) {
            const apiUrl = `/files/${fileId}/products`
            axios
                .post(apiUrl, {
                    method: 'Set',
                    products,
                })
                .then(response => {
                    // Alert the user
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${products.length > 1 ? products.length + ' ' : ''}Product${
                                products.length > 1 ? 's' : ''
                            } updated`,
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
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong when updating the products. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateFileProducts', { fileId, products }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
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
        async uploadImage({ commit, dispatch }, { file, product, picture, image, callback }) {
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
                        // On success, set the image on the picture
                        let newUrl = presignedUrl.url
                        // Change the URL from https to https
                        if (newUrl.indexOf('https') < 0) {
                            newUrl = newUrl.slice(0, 4) + 's' + newUrl.slice(4)
                        }
                        picture.url = newUrl
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
                    // console.log(response.data)
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
        initProducts({ state, rootGetters }, products) {
            products.map(product => {
                // Cast datasource_id to a number
                product.datasource_id = parseInt(product.datasource_id)
                // Format delivery_date
                if (product.delivery_date) {
                    product.delivery_date = new Date(product.delivery_date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                    })
                }
                // Name
                product.title = product.title ? product.title : 'Unnamed'

                // Instantiate the selectionInputList on the product
                Vue.set(product, 'selectionInputList', [])

                // ---- START PRICES ----
                // Currency
                Object.defineProperty(product, 'preferred_currency', {
                    get: function() {
                        // Check if the product has any prices
                        const productHasSelectionInput =
                            product.selectionInputList && product.selectionInputList.length > 0
                        if (!productHasSelectionInput) return
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).preferred_currency
                    },
                })
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

                // SELECTION INPUT
                Object.defineProperty(product, 'ins', {
                    get: function() {
                        // console.log('get ins')
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).ins
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).outs
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).focus
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).nds
                    },
                })
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentIns
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentOuts
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentFocus
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentNds
                    },
                })
                Object.defineProperty(product, 'comments', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).comments
                    },
                })
                Object.defineProperty(product, 'requests', {
                    get: function() {
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).requests
                    },
                })
                Object.defineProperty(product, 'hasUnreadAlignerComment', {
                    get: function() {
                        return (
                            (product.requests.length > 0 && product.comments.length <= 0) ||
                            (product.comments.length > 0 &&
                                product.comments[product.comments.length - 1].role != 'Approver')
                        )
                    },
                })
                Object.defineProperty(product, 'hasUnreadApproverComment', {
                    get: function() {
                        return (
                            product.comments.length > 0 &&
                            product.comments[product.comments.length - 1].role == 'Approver'
                        )
                    },
                })

                // VARIANTS
                product.variants.forEach(variant => {
                    if (variant.imageIndex == null) {
                        Vue.set(variant, 'imageIndex', 0)
                    }
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])

                    Object.defineProperty(variant, 'currentImg', {
                        get: function() {
                            return variant.pictures[variant.imageIndex]
                        },
                    })
                })
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
        SET_AVAILABLE_PRODUCTS(state, products) {
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
        SET_SELECTED_SELECTION_IDS(state, payload) {
            state.selectedSelectionIds = payload
        },
        SET_ADVANCED_FILTER(state, payload) {
            state.advancedFilter = payload
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
            if (stateProduct) Object.assign(stateProduct, product)
            // Check if we also need to update the current product
            if (state.currentProduct && state.currentProduct.id == product.id) {
                Object.assign(state.currentProduct, product)
            }
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        MERGE_PRODUCTS_WITH_SELECTION_INPUT(state, { selectionProductInput, authUser }) {
            const products = state.products
            products.map(product => {
                const rawSelectionInput = selectionProductInput.products.find(x => x.id == product.id)
                const selectionInput = {}
                Vue.set(selectionInput, 'rawSelectionInput', rawSelectionInput)
                Vue.set(selectionInput, 'selection_id', selectionProductInput.selection.id)
                Vue.set(selectionInput, 'selection', selectionProductInput.selection)
                Vue.set(selectionInput, 'product_id', product.id)
                Vue.set(selectionInput, 'product', product)
                Vue.set(selectionInput, 'variants', rawSelectionInput.variants)

                Object.defineProperty(selectionInput, 'preferred_currency', {
                    get: function() {
                        return rawSelectionInput.preferred_currency
                    },
                })
                Object.defineProperty(selectionInput, 'variants', {
                    get: function() {
                        return rawSelectionInput.variants
                    },
                })
                Object.defineProperty(selectionInput, 'feedbacks', {
                    get: function() {
                        const allFeedback = rawSelectionInput.feedbacks
                        if (state.selectedSelectionIds.length > 0) {
                            return allFeedback.filter(x => state.selectedSelectionIds.includes(x.selection_id))
                        }
                        return allFeedback
                    },
                })
                Object.defineProperty(selectionInput, 'actions', {
                    get: function() {
                        const allActions = rawSelectionInput.actions
                        if (state.selectedSelectionIds.length > 0) {
                            return allActions.filter(x => state.selectedSelectionIds.includes(x.selection_id))
                        }
                        return allActions
                    },
                })
                Object.defineProperty(selectionInput, 'comments', {
                    get: function() {
                        const allComments = rawSelectionInput.comments.filter(comment => !comment.is_deleted)
                        if (state.selectedSelectionIds.length > 0) {
                            return allComments.filter(x => state.selectedSelectionIds.includes(x.selection_id))
                        }
                        return allComments
                    },
                })
                Object.defineProperty(selectionInput, 'requests', {
                    get: function() {
                        const allRequests = rawSelectionInput.requests
                        if (state.selectedSelectionIds.length > 0) {
                            return allRequests.filter(x => state.selectedSelectionIds.includes(x.selection_id))
                        }
                        return allRequests
                    },
                })
                Object.defineProperty(selectionInput, 'selectionRequest', {
                    get: function() {
                        return selectionInput.requests.find(x => x.selection_id == selectionInput.selection_id)
                    },
                })
                Object.defineProperty(selectionInput, 'hasAuthUserRequest', {
                    get: function() {
                        return !!selectionInput.requests.find(x => x.user_id == authUser.id)
                    },
                })

                Object.defineProperty(selectionInput, 'hasUnreadAlignerComment', {
                    get: function() {
                        return (
                            (selectionInput.requests.length > 0 && selectionInput.comments.length <= 0) ||
                            (selectionInput.comments.length > 0 &&
                                selectionInput.comments[selectionInput.comments.length - 1].role != 'Approver')
                        )
                    },
                })
                Object.defineProperty(selectionInput, 'hasUnreadApproverComment', {
                    get: function() {
                        return (
                            selectionInput.comments.length > 0 &&
                            selectionInput.comments[selectionInput.comments.length - 1].role == 'Approver'
                        )
                    },
                })

                // Set the current action for the user
                Object.defineProperty(selectionInput, 'your_feedback', {
                    get: function() {
                        return rawSelectionInput.feedbacks.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        ).action
                    },
                    set: function(value) {
                        rawSelectionInput.feedbacks.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        ).action = value
                    },
                })
                // Set the current action for the user
                Object.defineProperty(selectionInput, 'action', {
                    get: function() {
                        return rawSelectionInput.actions.find(x => x.selection_id == selectionInput.selection_id).action
                    },
                    set: function(value) {
                        rawSelectionInput.actions.find(
                            x => x.selection_id == selectionInput.selection_id
                        ).action = value
                    },
                })
                // Set the current action for the user
                Object.defineProperty(selectionInput, 'yourSelectionFeedback', {
                    get: function() {
                        return rawSelectionInput.feedbacks.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        )
                    },
                    set: function(value) {
                        const rawAction = rawSelectionInput.feedbacks.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        )
                        Object.assign(rawAction, value)
                    },
                })
                // Set the current action for the user
                Object.defineProperty(selectionInput, 'selectionAction', {
                    get: function() {
                        return rawSelectionInput.actions.find(x => x.selection_id == selectionInput.selection_id)
                    },
                    set: function(value) {
                        const rawAction = rawSelectionInput.actions.find(
                            x => x.selection_id == selectionInput.selection_id
                        )
                        Object.assign(rawAction, value)
                    },
                })
                // Set the current action for the user
                Object.defineProperty(selectionInput, 'action_author', {
                    get: function() {
                        return rawSelectionInput.actions.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        ).user
                    },
                    set: function(value) {
                        rawSelectionInput.action_author = value
                    },
                })

                // Get the selection's quantity
                Object.defineProperty(selectionInput, 'quantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            totalQty += variant.quantity
                        })
                        return totalQty
                    },
                })
                // Get total
                Object.defineProperty(selectionInput, 'totalQuantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            variant.actions.map(action => {
                                totalQty += action.quantity
                            })
                        })
                        return totalQty
                    },
                })

                // Dynamically Calculated Actions
                // Feedback Actions
                Object.defineProperty(selectionInput, 'ins', {
                    get: function() {
                        return selectionInput.feedbacks.filter(x => x.action == 'In')
                    },
                    configurable: true,
                })
                Object.defineProperty(selectionInput, 'outs', {
                    get: function() {
                        return selectionInput.feedbacks.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(selectionInput, 'focus', {
                    get: function() {
                        return selectionInput.feedbacks.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(selectionInput, 'nds', {
                    get: function() {
                        return selectionInput.feedbacks.filter(x => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(selectionInput, 'alignmentIns', {
                    get: function() {
                        return selectionInput.actions.filter(x => x.action == 'In')
                    },
                })
                Object.defineProperty(selectionInput, 'alignmentOuts', {
                    get: function() {
                        return selectionInput.actions.filter(x => x.action == 'Out')
                    },
                })
                Object.defineProperty(selectionInput, 'alignmentFocus', {
                    get: function() {
                        return selectionInput.actions.filter(x => x.action == 'Focus')
                    },
                })
                Object.defineProperty(selectionInput, 'alignmentNds', {
                    get: function() {
                        return selectionInput.actions.filter(x => x.action == 'None')
                    },
                })

                // PROCESS REQUESTS
                selectionInput.requests.forEach(request => {
                    Vue.set(request, 'comments', [])

                    Object.defineProperty(request, 'is_resolved', {
                        get: function() {
                            return !!request.completed_at
                        },
                    })
                })

                // PROCESS VARIANTS
                selectionInput.variants.forEach(variant => {
                    // VARIANTS
                    Vue.set(variant, 'imageIndex', 0)
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])

                    Object.defineProperty(variant, 'currentImg', {
                        get: function() {
                            return variant.pictures[variant.imageIndex]
                        },
                    })

                    Object.defineProperty(variant, 'feedbacks', {
                        get: function() {
                            const feedbacks = []
                            selectionInput.feedbacks.map(feedback => {
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
                            return feedbacks.filter(x => x.action != 'None')
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
                            const userFeedback = selectionInput.feedbacks.find(
                                feedback =>
                                    feedback.user_id == authUser.id &&
                                    feedback.selection_id == selectionInput.selection_id
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
                            selectionInput.actions.map(action => {
                                const variantActions = action.variants.filter(x => x.id == variant.id)
                                variantActions.map(variantAction => {
                                    actions.push({
                                        id: variantAction.id,
                                        action: variantAction.feedback,
                                        quantity: variantAction.quantity,
                                        user_id: action.user_id,
                                        user: action.user,
                                        selection_id: action.selection_id,
                                        selection: action.selection,
                                    })
                                })
                            })
                            return actions.filter(x => x.action != 'None')
                        },
                    })
                    // Get the selection's action
                    Object.defineProperty(variant, 'action', {
                        get: function() {
                            const selectionAction = variant.actions.find(
                                x => x.selection_id == selectionInput.selection_id
                            )
                            return selectionAction ? selectionAction.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the current action for the variant input for this action action
                            const currentAction = selectionInput.actions.find(
                                action => action.selection_id == selectionInput.selection_id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants.splice(currentVariantActionIndex, 1, {
                                    id: variant.id,
                                    feedback: newAction,
                                    quantity: variant.quantity,
                                })
                            } else {
                                currentAction.variants.push({
                                    id: variant.id,
                                    feedback: newAction,
                                    quantity: variant.quantity,
                                })
                            }
                        },
                    })
                    // Get the selection's quantity
                    Object.defineProperty(variant, 'quantity', {
                        get: function() {
                            const selectionAction = variant.actions.find(
                                x => x.selection_id == selectionInput.selection_id
                            )
                            return selectionAction ? selectionAction.quantity : 0
                        },
                        set: function(newQuantity) {
                            // Find the current action for the variant input for this action action
                            const currentAction = selectionInput.actions.find(
                                action => action.selection_id == selectionInput.selection_id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants.splice(currentVariantActionIndex, 1, {
                                    id: variant.id,
                                    feedback: variant.action,
                                    quantity: newQuantity,
                                })
                            } else {
                                currentAction.variants.push({
                                    id: variant.id,
                                    feedback: variant.action,
                                    quantity: newQuantity,
                                })
                            }
                        },
                    })
                    // Get the selection's quantity
                    Object.defineProperty(variant, 'totalQuantity', {
                        get: function() {
                            return variant.actions.reduce((total, x) => (total += x.quantity), 0)
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
                })

                product.selectionInputList.push(selectionInput)
            })
        },
        SET_LAST_SORT(state, { method, key }) {
            state.lastSort = { method, key }
        },
        UPDATE_ACTIONS(state, { actions, newAction, user }) {
            // DESC: Sets all actions to the value of new action
            actions.forEach(action => {
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // If we didn't find the product, simply update the actions action
                if (!product) {
                    action.action = newAction
                    action.user = user
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user = user
                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            // Check if an action for the variant already exists
                            if (variant.action == 'None') {
                                variant.action = newAction
                            }
                            // variant.action = newAction
                            if (['Out', 'None'].includes(newAction)) {
                                variant.action = newAction
                                variant.quantity = 0
                            }
                        })
                    }
                })
            })
        },
        SET_ACTIONS(state, actions) {
            // DESC: Sets all actions matching the provided actions equal to the actions provided
            actions.forEach(action => {
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
                    if (selectionAction) {
                        Object.assign(selectionAction, action)
                    }
                })
            })
        },
        UPDATE_FEEDBACKS(state, { actions, newAction, user }) {
            actions.forEach(action => {
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // If we didn't find the product, simply update the actions action
                if (!product) {
                    action.action = newAction
                    action.user = user
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.feedbacks.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user = user
                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            // Check if an action for the variant already exists
                            if (variant.your_feedback == 'None') {
                                variant.your_feedback = newAction
                            }
                            // variant.action = newAction
                            if (['Out', 'None'].includes(newAction)) {
                                variant.your_feedback = newAction
                            }
                        })
                    }
                })
            })
        },
        SET_FEEDBACKS(state, actions) {
            actions.forEach(action => {
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.feedbacks.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (selectionAction) {
                        Object.assign(selectionAction, action)
                    }
                })
            })
        },
        SET_DISTRIBUTION_SCOPE(state, newScope) {
            state.distributionScope = newScope
        },
    },
}
