import axios from 'axios'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSingleProductId: -1,
        currentProductId: null,
        availableProductIds: [],
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
        loadingProducts: (state) => state.loading,
        productsStatus: (state) => state.status,
        currentProduct: (state) => state.currentProduct,
        currentFocusIndex: (state) => state.currentFocusIndex,
        availableProducts: (state) => {
            return state.availableProducts
        },
        nextProduct: (state) => {
            // Find the index of the current product
            const index = state.availableProducts.findIndex((x) => x.id == state.currentProduct.id)
            // Check that the current is not the last in the array
            if (index + 1 < state.availableProducts.length) {
                return state.availableProducts[index + 1]
            }
        },
        prevProduct: (state) => {
            // Find the index of the current product
            const index = state.availableProducts.findIndex((x) => x.id == state.currentProduct.id)
            // Check that the current is not the first in the array
            if (index > 0) {
                return state.availableProducts[index - 1]
            }
        },
        selectedCategories: (state) => {
            return state.selectedCategories
        },
        selectedDeliveryDates: (state) => {
            return state.selectedDeliveryDates
        },
        selectedBuyerGroups: (state) => {
            return state.selectedBuyerGroups
        },
        unreadOnly: (state) => {
            return state.unreadOnly
        },
        currentProductFilter: (state) => {
            return state.currentProductFilter
        },
        singleVisible: (state) => {
            return state.singleVisible
        },
        actionsUpdated: (state) => {
            return state.actionsUpdated
        },
        commentsUpdated: (state) => {
            return state.commentsUpdated
        },
        commentsCreated: (state) => {
            return state.commentsCreated
        },
        productsStatic: state => {
            return state.productsStatic
        },
        availableCategories(state, getters) {
            const products = getters.products
            let uniqueCategories = []
            products.forEach((product) => {
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
            products.forEach((product) => {
                if (product.delivery_date) {
                    // const found = uniqueDeliveryDates.find(x => x.value == product.delivery_date)
                    const found = uniqueDeliveryDates.find((x) => x == product.delivery_date)
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
        productsScoped: (state, getters, rootState, rootGetters) => {
            const products = getters.products
            let unique = []
            products.forEach((product) => {
                if (product.buying_group) {
                    const theBuyingGroup = product.buying_group.toLowerCase()
                    const found = unique.includes(theBuyingGroup)
                    if (!found) unique.push(theBuyingGroup)
                }
            } else {
                return []
            }
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
                products.forEach((product) => {
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
            let productsToReturn = []

            // First filter by category
            if (categories.length > 0) {
                const filteredByCategory = productsToReturn.filter((product) => {
                    return product.category && Array.from(categories).includes(product.category.toLowerCase())
                })
                productsToReturn = filteredByCategory
            }
            // Filter by delivery date
            if (deliveryDates.length > 0) {
                const filteredByDeliveryDate = productsToReturn.filter((product) => {
                    return Array.from(deliveryDates).includes(product.delivery_date)
                })
                productsToReturn = filteredByDeliveryDate
            }
            // Filter by buyer group
            if (buyerGroups.length > 0) {
                const filteredByBuyerGroups = productsToReturn.filter((product) => {
                    return product.buying_group && Array.from(buyerGroups).includes(product.buying_group.toLowerCase())
                })
                productsToReturn = filteredByAction
            }

            // Filer by unread
            if (unreadOnly) {
                const filteredByUnread = productsToReturn.filter((product) => product.newComment)
                productsToReturn = filteredByUnread
            }

            // Filter by actions
            if (['ins', 'outs', 'nds'].includes(actionFilter)) {
                const filteredByAction = productsToReturn.filter((product) => {
                    if (actionFilter == 'nds') return !product[currentAction] || product[currentAction] == 'None'
                    if (actionFilter == 'outs') return product[currentAction] == 'Out'
                    if (actionFilter == 'ins')
                        return product[currentAction] == 'In' || product[currentAction] == 'Focus'
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
        availableProductIds: state => {
            return state.availableProductIds
        },
        currentProduct: (state, getters, rootState, rootGetters) => {
            return state.currentProductId != null && state.productsStatic != null
                ? state.productsStatic.find(x => x.id == state.currentProductId)
                : null
        },
        currentProductv1: (state, getters, rootState, rootGetters) => {
            const products = getters[getters.productScope]
            return state.currentProductId != null && products != null
                ? products.find(x => x.id == state.currentProductId)
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

    actions: {
        async fetchProducts({ commit, dispatch }, fileId) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/files/${fileId}/products`

            await axios
                .get(apiUrl)
                .then((response) => {
                    commit('insertProducts', { products: response.data, method: 'set' })
                    commit('procesProducts')
                    commit('setProductStatus', 'success')
                })
                .catch((err) => {
                    commit('setProductStatus', 'error')
                })
        },
        async fetchSelectionProducts({ commit, dispatch }, selectionId) {
            commit('setProductStatus', 'loading')

            const apiUrl = `/selections/${selectionId}/products`

            await axios
                .get(apiUrl)
                .then((response) => {
                    commit('insertProducts', { products: response.data, method: 'set' })
                    dispatch('procesSelectionProducts')
                    commit('setProductStatus', 'success')
                })
                .catch((err) => {
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
                    .then((response) => {
                        // Add the created ID to the product, if we only have 1 product
                        if (products.length <= 1) {
                            const product = products[0]
                            product.id = response.data.added_product_id_map[product.datasource_id]
                        }
                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)
                        dispatch(
                            'alerts/showAlert',
                            'Something went wrong when creating the product. Please try again.',
                            { root: true }
                        )
                    })
            })
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
        async updateProduct({ commit, dispatch }, product) {
            return new Promise((resolve, reject) => {
                const apiUrl = `/products/${product.id}`
                axios
                    .put(apiUrl, product)
                    .then((response) => {
                        commit('updateProduct', product)
                        resolve(response)
                    })
                    .catch((err) => {
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
                    .then((response) => {
                        presignedUrl = response.data
                    })
                    .catch((err) => {
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
                    xhr.upload.onprogress = (event) => {
                        return callback(parseInt(Math.round((event.loaded / event.total) * 100)))
                    }
                    xhr.onload = () => resolve(xhr)
                    xhr.onerror = () => reject(xhr)
                    xhr.send(blob)
                })
                    .then((response) => {
                        // On success, set the image on the variant
                        variant.image = presignedUrl.url
                        resolve(response)
                    })
                    .catch((err) => {
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
                .then((response) => {
                    console.log(response.data)
                })
                .catch((err) => {
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
                    .then((response) => {
                        // Add the created ID to the product, if we only have 1 product
                        resolve(response)
                    })
                    .catch((err) => {
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
        procesSelectionProducts({ commit, state, rootGetters }) {
            const authUser = rootGetters['auth/authUser']
            const products = state.products
            products.map((product) => {
                // Currency
                Object.defineProperty(product, 'yourPrice', {
                    get: function () {
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
                            const preferredPrice = product.prices.find((x) => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                })

                // Dynamically Calculated Actions
                // Feedback Actions
                Object.defineProperty(product, 'ins', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'None')
                    },
                })
                // All Actions
                Object.defineProperty(product, 'allIns', {
                    get: function () {
                        return product.ins.length + product.alignmentIns.length
                    },
                })
                Object.defineProperty(product, 'allOuts', {
                    get: function () {
                        return product.outs.length + product.alignmentOuts.length
                    },
                })
                Object.defineProperty(product, 'allFocus', {
                    get: function () {
                        return product.focus.length + product.alignmentFocus.length
                    },
                })
                Object.defineProperty(product, 'allNds', {
                    get: function () {
                        return product.nds.length + product.alignmentNds.length
                    },
                })

                // Hard Set Actions
                // Feedback Actions
                // Vue.set(
                //     product,
                //     'ins',
                //     product.feedbacks.filter(x => x.action == 'In')
                // )
                // Vue.set(
                //     product,
                //     'outs',
                //     product.feedbacks.filter(x => x.action == 'Outs')
                // )
                // Vue.set(
                //     product,
                //     'focus',
                //     product.feedbacks.filter(x => x.action == 'Focus')
                // )
                // Vue.set(
                //     product,
                //     'nds',
                //     product.feedbacks.filter(x => x.action == 'None')
                // )
                // // Alignment Actions
                // Vue.set(
                //     product,
                //     'alignmentIns',
                //     product.actions.filter(x => x.action == 'In')
                // )
                // Vue.set(
                //     product,
                //     'alignmentOuts',
                //     product.actions.filter(x => x.action == 'Outs')
                // )
                // Vue.set(
                //     product,
                //     'alignmentFocus',
                //     product.actions.filter(x => x.action == 'Focus')
                // )
                // Vue.set(
                //     product,
                //     'alignmentNds',
                //     product.actions.filter(x => x.action == 'None')
                // )
                // // All Actions
                // Vue.set(product, 'allIns', product.ins.length + product.alignmentIns.length)
                // Vue.set(product, 'allOuts', product.outs.length + product.alignmentOuts.length)
                // Vue.set(product, 'allFocus', product.focus.length + product.alignmentFocus.length)
                // Vue.set(product, 'allNds', product.nds.length + product.alignmentNds.length)

                // Comments / Requests
                Object.defineProperty(product, 'hasAuthUserRequest', {
                    get: function () {
                        return !!product.requests.find((x) => x.author_id == authUser.id)
                    },
                })
                // Remove deleted comments
                Vue.set(
                    product,
                    'comments',
                    product.comments.filter((x) => !x.is_deleted)
                )
            })
        },
        instantiateProducts({ state, rootGetters }) {
            const authUser = rootGetters['persist/authUser']
            const currentTeam = rootGetters['persist/currentTeam']
            const workspace = rootGetters['persist/currentWorkspace']

            // Get the products
            const products = Product.all()

            // START Loop through each product and instantiate their initial data
            products.forEach(product => {
                // Instantiate properties
                product.ins = []
                product.outs = []
                product.focus = []
                product.nds = []
                product.ndsTotal
                product.commentsScoped = []
                product.commentsInherited = []
                product.requests = []
                product.outInFilter = false
                product.currentAction = null
                product.inheritedAction = null

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
                        currentTeam &&
                        currentTeam.currency &&
                        product.prices.find(x => x.currency == currentTeam.currency)
                    ) {
                        const teamPrices = product.prices.find(x => x.currency == currentTeam.currency)
                        product.userPrices = teamPrices
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
            state.productsStatic = products
        },
        insertProducts(state, { products, method }) {
            // Loop through the products and format their data as necessary
            products.forEach((product) => {
                // Cast datasource_if to a number
                product.datasource_id = parseInt(product.datasource_id)
                // Format delivery_date
                if (product.delivery_date) {
                    product.delivery_date = new Date(product.delivery_date).toLocaleDateString('en-GB', {
                        month: 'long',
                        year: 'numeric',
                    })
                }
                product.ndsTotal = product.nds.length
                // END find Not decideds
            })
        },
        markNewComments({ state, rootGetters }, { product, productToUpdate }) {
            const currentTask = rootGetters['persist/currentTask']
            const userPermissionLevel = rootGetters['persist/userPermissionLevel']

            const allComments = productToUpdate.commentsScoped
                .concat(productToUpdate.requests)
                .concat(productToUpdate.commentsInherited)

            // START NEW Comment (Find products with unread / new comments)
            if (allComments.length > 0) {
                if (
                    currentTask.type == 'approval' &&
                    productToUpdate.currentAction == null &&
                    productToUpdate.requests.length > 0
                ) {
                    // Sort array
                    allComments.sort((a, b) => {
                        // console.log('The dates:')
                        // console.log(new Date(b.created_at))
                        // console.log(new Date(a.created_at))
                        // console.log(new Date(b.created_at) < new Date(a.created_at))
                        return new Date(b.created_at) < new Date(a.created_at) ? 1 : -1
                    })
                    if (userPermissionLevel == 3) {
                        productToUpdate.newComment =
                            allComments[allComments.length - 1].user.role_id != 3 || allComments.length < 1
                    } else {
                        productToUpdate.newComment = allComments[allComments.length - 1].user.role_id == 3
                    }
                }
            }
            // END NEW Comment
        },
        markCommentsAsFocus({ state, rootGetters }, { productId, productToUpdate }) {
            const currentTask = rootGetters['persist/currentTask']
            const allComments = productToUpdate.commentsScoped
                .concat(productToUpdate.requests)
                .concat(productToUpdate.commentsInherited)
            const product = Product.query()
                .with(['actions.task'])
                .find(productId)
            // START Mark comments as FOCUS if the users action was IN for the product
            if (allComments.length > 0) {
                allComments.forEach(comment => {
                    if (currentTask.type == 'feedback') {
                        comment.focus = product.actions.find(
                            x => x.task_id == comment.task_id && x.user_id == comment.user_id && x.action == 2
                        )
                    } else {
                        comment.focus = product.actions.find(x =>
                            x.task.type == 'feedback'
                                ? x.task_id == comment.task_id && x.action == 2 && x.user_id == comment.user_id
                                : x.task_id == comment.task_id && x.action == 2
                        )
                    }
                })
            }
            // END Mark comments as FOCUS if the users action was IN for the product
        },
        updateComments({ commit, state, rootGetters, dispatch }, productId, staticProduct) {
            const product = Product.query()
                .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team|task'])
                .find(productId)
            const productToUpdate = staticProduct ? staticProduct : state.productsStatic.find(x => x.id == productId)

            const currentTask = rootGetters['persist/currentTask']
            const inheritFromTask = currentTask.inheritFromTask

            // Reset product comment related properties
            productToUpdate.commentsScoped = []
            productToUpdate.commentsInherited = []
            productToUpdate.requests = []

            //START COMMENTS

            // START scope comments to task
            product.comments.forEach(comment => {
                if (
                    comment.task_id == currentTask.inherit_from_id ||
                    comment.task_id == currentTask.id ||
                    currentTask.filter_products_by_ids.includes(comment.task_id)
                ) {
                    comment.is_request
                        ? productToUpdate.requests.push(comment)
                        : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'feedback') {
                    if (comment.task_id == currentTask.id)
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'approval') {
                    if (
                        currentTask.children.length > 0 // children are actually parents
                            ? currentTask.children.find(x => x.task_id == comment.task_id)
                            : false || comment.task_id == currentTask.id
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'decision') {
                    // CSM DECISION
                    if (
                        comment.task_id == currentTask.approvalParent.id ||
                        currentTask.parentTasks.find(x => x.id == comment.task_id) ||
                        currentTask.approvalParent.parentTasks.find(x => x.id == comment.task_id)
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else {
                    // If current task type is alignment
                    if (
                        comment.task_id == currentTask.id ||
                        currentTask.siblings.find(x => x.parent_id == comment.task_id) ||
                        currentTask.parentTasks.find(x => x.id == comment.task_id)
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                }

                // START Find inherited comments

                if (currentTask.type == 'decision' && inheritFromTask.type == 'alignment') {
                    if (
                        (inheritFromTask.parentTasks.find(x => x.id == comment.task_id) ||
                            comment.task_id == inheritFromTask.id) &&
                        !comment.is_request
                    ) {
                        productToUpdate.commentsInherited.push(comment)
                    }
                }

                // END Find inherited comments
            })

            // END scope comments to task

            // START Comment votes
            // Handle comment votes - group them by team
            productToUpdate.commentsScoped.forEach(comment => {
                comment.teamVotes = []
                let noTeamExists = false
                comment.votes.forEach(vote => {
                    if (vote.user != null) {
                        if (vote.user.teams.length > 0) {
                            const found = comment.teamVotes.find(x => x.title == vote.user.teams[0].title)
                            if (!found) {
                                let voteTeam = vote.user.teams[0]
                                let teamToPush = {
                                    id: voteTeam.id,
                                    title: voteTeam.title,
                                    votes: 1,
                                }
                                comment.teamVotes.push(teamToPush)
                            } else {
                                found.votes++
                            }
                        } else {
                            if (!noTeamExists) {
                                comment.teamVotes.unshift({ id: 0, title: 'No team', votes: 0 })
                                noTeamExists = true
                            }
                            comment.teamVotes[0].votes++
                        }
                    }
                })
            })
            // END Comment votes

            // END COMMENTS

            // Mark new comments
            dispatch('markNewComments', { product: product, productToUpdate: productToUpdate })

            // Marks comments as focus
            dispatch('markCommentsAsFocus', { productId: product.id, productToUpdate: productToUpdate })
        },
        DELETE_PRODUCTS(state, products) {
            products.forEach((product) => {
                const index = state.products.findIndex((x) => x.id == product.id)
                state.products.splice(index, 1)
            })
        },
        setCurrentProduct(state, product) {
            state.currentProduct = product
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
        setSingleVisisble(state, payload) {
            state.singleVisible = payload
        },
        setProductScope(state, productScope) {
            state.productScope = productScope
        },
        updateProduct(state, product) {
            // Replace the product with the new
            let stateProduct = state.products.find((x) => x.id == product.id)
            Object.assign(stateProduct, product)
            // Check if we also need to update the current product
            if (state.currentProduct && state.currentProduct.id == product.id) {
                Object.assign(state.currentProduct, product)
            }
        },
        alertError: (state) => {
            window.alert('Network error. Please check your connection')
        },
        procesProducts: (state) => {
            const products = state.products
            products.map((product) => {
                // Currency
                Object.defineProperty(product, 'yourPrice', {
                    get: function () {
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
                            const preferredPrice = product.prices.find((x) => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                            else return product.prices[0]
                        } else {
                            return product.prices[0]
                        }
                    },
                })
            })
        },
        procesSelectionProducts: (state) => {
            const products = state.products
            products.map((product) => {
                // Currency
                Object.defineProperty(product, 'yourPrice', {
                    get: function () {
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
                            const preferredPrice = product.prices.find((x) => (x.currency = product.preferred_currency))
                            if (preferredPrice) return preferredPrice
                        }
                        // If nothing else worked, return the first available price
                        return product.prices[0]
                    },
                })

                // Actions
                // Feedback Actions
                Object.defineProperty(product, 'ins', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function () {
                        return product.feedbacks.filter((x) => x.action == 'None')
                    },
                })
                // Alignment Actions
                Object.defineProperty(product, 'alignmentIns', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'In')
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'Out')
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'Focus')
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function () {
                        return product.actions.filter((x) => x.action == 'None')
                    },
                })

                // Comments / Requests
                Object.defineProperty(product, 'hasAuthUserRequest', {
                    get: function () {
                        return !!product.requests.find((x) => x.author_id == 'None')
                    },
                })
                // Remove deleted comments
                Vue.set(
                    product,
                    'comments',
                    product.comments.filter((x) => !x.is_deleted)
                )
            })
        },
    },
}
