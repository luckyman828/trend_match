import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSingleProductId: null,
        currentProductId: null,
        availableProductIds: [],
        selectedCategories: [],
        selectedDeliveryDates: [],
        selectedBuyerGroups: [],
        unreadOnly: false,
        currentProductFilter: 'overview',
        singleVisible: false,
        products: [],
        productsFiltered: [],
    },

    getters: {
        loadingProducts: state => {
            return state.loading
        },
        currentSingleProductId: state => {
            return state.currentSingleProductId
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
        availableProductIds: state => {
            return state.availableProductIds
        },
        currentProduct: (state, getters, rootState, rootGetters) => {
            return state.currentProductId != null && getters.products != null
                ? getters.products.find(x => x.id == state.currentProductId)
                : null
        },
        nextProductId: (state, getters, rootState, rootGetters) => {
            if (state.currentProductId != null && getters.availableProductIds.length > 0) {
                const productIds = getters.availableProductIds
                const currentProductIndex = productIds.findIndex(x => x == state.currentProductId)
                if (currentProductIndex < productIds.length - 1) {
                    return productIds[currentProductIndex + 1]
                }
            }
        },
        prevProductId: (state, getters, rootState, rootGetters) => {
            if (state.currentProductId != null && getters.availableProductIds.length > 0) {
                const productIds = getters.availableProductIds
                const currentProductIndex = productIds.findIndex(x => x == state.currentProductId)
                if (currentProductIndex != 0) {
                    return productIds[currentProductIndex - 1]
                }
            }
        },
    },

    actions: {
        async fetchProducts({ commit, dispatch }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/products`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Product.create({ data: response.data })
                    commit('setLoading', false)
                    dispatch('instantiateProducts')
                    succes = true
                } catch (err) {
                    console.log('API error in products.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        setCurrentProductId({ commit }, id) {
            commit('setCurrentProductId', id)
        },
        setAvailableProductIds({ commit }, products) {
            commit('setAvailableProductIds', products)
        },
        showNextProduct({ commit, getters }) {
            commit('setCurrentProductId', getters.nextProductId)
        },
        showPrevProduct({ commit, getters }) {
            commit('setCurrentProductId', getters.prevProductId)
        },
        showSingle({ commit }, id) {
            commit('setCurrentProductId', id)
            commit('setSingleVisisble', true)
        },
        async instantiateNewProduct({ commit, state, rootGetters }, { id, fileId }) {
            const authUser = rootGetters['persist/authUser']
            const currentSelection = rootGetters['entities/selections/currentSelection']
            const workspace = rootGetters['persist/currentWorkspace']

            // Get the product
            const product = await Product.new()

            // Instantiate initial data
            product.id = id
            product.file_id = fileId
            product.collection_id = fileId

            // START Parse the json objects to javascript objects
            // Test that each json object is actually valid json before trying to parse it
            if (typeof product.color_variants == 'string' && isJSON(product.color_variants))
                product.color_variants = JSON.parse(product.color_variants)
            if (typeof product.assortments == 'string' && isJSON(product.assortments))
                product.assortments = JSON.parse(product.assortments)
            if (typeof product.prices == 'string' && isJSON(product.prices)) product.prices = JSON.parse(product.prices)

            function isJSON(str) {
                try {
                    return JSON.parse(str) && !!str
                } catch (e) {
                    return false
                }
            }
            // END Parse the json objects to javascript objects

            // START Format the Delivery Date
            let date = product.delivery_date
            if (date) {
                let newDate = new Date(date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                product.delivery_date = newDate
            }
            // END Format the Delivery Date

            // START Find the correct price
            // Check if the chosen currency exists on the product
            if (product.prices.length > 0) {
                // First check if the user currency is available
                if (authUser.currency && product.prices.find(x => x.currency == authUser.currency)) {
                    const userPrices = product.prices.find(x => x.currency == authUser.currency)
                    product.userPrices = userPrices
                }
                // Then check if the team currency is available
                else if (
                    currentSelection &&
                    currentSelection.currency &&
                    product.prices.find(x => x.currency == currentSelection.currency)
                ) {
                    const selectionPrices = product.prices.find(x => x.currency == currentSelection.currency)
                    product.userPrices = selectionPrices
                }
                // Then check if the workspace currency is available
                else if (workspace.currency && product.prices.find(x => x.currency == workspace.currency)) {
                    const workspacePrices = product.prices.find(x => x.currency == workspace.currency)
                    product.userPrices = workspacePrices
                }
                // Else use the first available currency
                else {
                    product.userPrices = product.prices[0]
                }
            }
            // If there are no prices
            else {
                product.userPrices = {
                    currency: 'unset',
                    markup: null,
                    recommended_retail_price: null,
                    wholesale_price: null,
                }
            }
            // END Find the correct price

            // Save the product to our state
            state.products.push(product)
        },
        async updateProduct({ commit }, product) {
            commit('updateProduct', product)
            product.prices = product.prices && product.prices.length > 0 ? JSON.stringify(product.prices) : []
            product.color_variants =
                product.color_variants && product.color_variants.length > 0
                    ? JSON.stringify(product.color_variants)
                    : []
            product.assortments =
                product.assortments && product.assortments.length > 0 ? JSON.stringify(product.assortments) : []
            product.eans = product.eans && product.eans.length > 0 ? JSON.stringify(product.eans) : []

            // Change the delivery_date format back to MySQL Date format (yyyy-mm-dd)
            // Long code to account for timezone differences.
            const theDate = new Date(product.delivery_date)
            ;(product.delivery_date = theDate.toJSON()),
                new Date(theDate.getTime() - theDate.getTimezoneOffset() * 60000).toJSON().slice(0, 10)
            return true
        },
        async rotateImage({ commit }, file) {
            // Upload images to Blob storage
            let imageToReturn

            const uploadApiUrl = `/api/product/rotate-img`
            const axiosConfig = {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            }

            // Append the file
            let data = new FormData()
            data.append('file', file)
            console.log('Send rotate image request from store')

            await axios
                .post(uploadApiUrl, data, axiosConfig)
                .then(response => {
                    console.log('returning image')
                    imageToReturn = response.data
                })
                .catch(err => {
                    imageToReturn = false
                    console.log('error')
                    console.log(err.response)
                })
            return imageToReturn
        },
        async uploadImages({ commit, dispatch }, { files, callback }) {
            // Upload images to Blob storage
            let uploadSucces = false
            let uploadPercentage = 0

            const uploadApiUrl = `/api/product/images`
            const axiosConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: progressEvent => {
                    uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                    return callback(uploadPercentage)
                },
            }

            // Append the files
            let data = new FormData()
            let count = 0
            files.forEach(file => {
                count++
                data.append('files[' + count + ']', file.file, file.id)
            })
            console.log(count + ' images sent to API from store')

            await axios
                .post(uploadApiUrl, data, axiosConfig)
                .then(response => {
                    console.log(response.data)
                    uploadSucces = true
                })
                .catch(err => {
                    console.log('error')
                    console.log(err.response)
                    uploadSucces = false
                })
            return uploadSuccesupdateProduct
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
        instantiateProducts({ state, rootGetters }) {
            const authUser = rootGetters['persist/authUser']
            const currentSelection = rootGetters['entities/selections/currentSelection']
            const workspace = rootGetters['persist/currentWorkspace']

            // Get the products
            const products = Product.all()

            // START Loop through each product and instantiate their initial data
            products.forEach(product => {
                // START Parse the json objects to javascript objects
                // Test that each json object is actually valid json before trying to parse it
                if (typeof product.color_variants == 'string' && isJSON(product.color_variants))
                    product.color_variants = JSON.parse(product.color_variants)
                if (typeof product.assortments == 'string' && isJSON(product.assortments))
                    product.assortments = JSON.parse(product.assortments)
                if (typeof product.prices == 'string' && isJSON(product.prices))
                    product.prices = JSON.parse(product.prices)

                function isJSON(str) {
                    try {
                        return JSON.parse(str) && !!str
                    } catch (e) {
                        return false
                    }
                }
                // END Parse the json objects to javascript objects

                // START Format the Delivery Date
                let date = product.delivery_date
                if (date) {
                    let newDate = new Date(date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                    product.delivery_date = newDate
                }
                // END Format the Delivery Date

                // START Find the correct price
                // Check if the chosen currency exists on the product
                if (product.prices != null) {
                    // First check if the user currency is available
                    if (authUser.currency && product.prices.find(x => x.currency == authUser.currency)) {
                        const userPrices = product.prices.find(x => x.currency == authUser.currency)
                        product.userPrices = userPrices
                    }
                    // Then check if the team currency is available
                    else if (
                        currentSelection &&
                        currentSelection.currency &&
                        product.prices.find(x => x.currency == currentSelection.currency)
                    ) {
                        const selectionPrices = product.prices.find(x => x.currency == currentSelection.currency)
                        product.userPrices = selectionPrices
                    }
                    // Then check if the workspace currency is available
                    else if (workspace.currency && product.prices.find(x => x.currency == workspace.currency)) {
                        const workspacePrices = product.prices.find(x => x.currency == workspace.currency)
                        product.userPrices = workspacePrices
                    }
                    // Else use the first available currency
                    else {
                        product.userPrices = product.prices[0]
                    }
                }
                // If there are no prices
                else {
                    product.userPrices = {
                        currency: 'unset',
                        markup: null,
                        recommended_retail_price: null,
                        wholesale_price: null,
                    }
                }
                // END Find the correct price
            })
            // END Loop

            // Save the products to our state
            state.products = products
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentProductId(state, id) {
            state.currentProductId = id
        },
        setAvailableProductIds(state, ids) {
            state.availableProductIds = ids
        },
        setCurrentProductId(state, id) {
            state.currentProductId = id
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
        setSingleVisisble(state, payload) {
            state.singleVisible = payload
        },
        updateProduct(state, product) {
            // Replace the product with the new
            let stateProduct = state.products.find(x => x.id == product.id)
            Object.assign(stateProduct, product)
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
