import axios from 'axios'
import sortArray from '../../mixins/sortArray'
import Compressor from 'compressorjs'
import { instantiateProductsFromMappedFields, parseCSVStringToRowsAndCells } from '../../helpers/workbookUtils'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentProduct: null,
        availableProducts: [],
        selectedCategories: [],
        selectedDeliveryDates: [],
        selectedBrands: [],
        selectedBuyerGroups: [],
        selectedSelectionIds: [],
        selectedProducts: [],
        selectedTicketLabels: [],
        advancedFilter: null,
        unreadOnly: false,
        hideCompleted: false,
        noImagesOnly: false,
        currentProductFilter: 'overview',
        singleVisible: false,
        products: [],
        productsFilteredBySearch: [],
        status: null,
        currentFocusRowIndex: null,
        lastSort: null,
        distributionScope: 'Feedback',
        showPDFModal: false,
        showCSVModal: false,
        openTicketsOnly: false,
        pdpVariantIndex: 0,
        selectedCustomFieldValues: {},
    },

    getters: {
        loadingProducts: state => state.loading,
        getPdpVariantIndex: state => state.pdpVariantIndex,
        productsStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        currentFocusRowIndex: state => state.currentFocusRowIndex,
        getPDFModalVisible: state => state.showPDFModal,
        getCSVModalVisisble: state => state.showCSVModal,
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
        getSelectedProducts: state => state.selectedProducts,
        nextProduct: (state, getters, rootState, rootGetters) => {
            // If we have a nextProduct in our presentationQueue, then use that instead
            const nextPresentationQueueProduct = rootGetters['presentationQueue/getNextProduct']
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
            // If we have a prevProduct in our presentationQueue, then use that instead
            const prevPresentationQueueProduct = rootGetters['presentationQueue/getPrevProduct']
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
        selectedCategories: state => state.selectedCategories,
        selectedDeliveryDates: state => state.selectedDeliveryDates,
        selectedBuyerGroups: state => state.selectedBuyerGroups,
        selectedBrands: state => state.selectedBrands,
        getSelectedSelectionIds: state => state.selectedSelectionIds,
        getHasAdvancedFilter: state => !!state.advancedFilter && state.advancedFilter.length > 0,
        getSelectedTicketLabels: state => state.selectedTicketLabels,
        getAdvancedFilter: state => state.advancedFilter,
        unreadOnly: state => state.unreadOnly,
        openTicketsOnly: state => state.openTicketsOnly,
        hideCompleted: state => state.hideCompleted,
        noImagesOnly: state => state.noImagesOnly,
        currentProductFilter: state => state.currentProductFilter,
        singleVisible: state => state.singleVisible,
        actionsUpdated: state => state.actionsUpdated,
        commentsUpdated: state => state.commentsUpdated,
        commentsCreated: state => state.commentsCreated,
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
                product.delivery_dates.map(date => {
                    const found = uniqueDeliveryDates.find(x => x == date)
                    if (!found) {
                        uniqueDeliveryDates.push(date)
                    }
                })
            })
            return uniqueDeliveryDates.sort()
        },
        availableBrands(state, getters) {
            const products = getters.products
            let unique = []
            products.forEach(product => {
                if (product.brand) {
                    const theBrand = product.brand.toLowerCase()
                    const found = unique.includes(theBrand)
                    if (!found) unique.push(theBrand)
                }
            })
            return unique
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
            const brands = getters.selectedBrands
            const ticketLabels = getters.getSelectedTicketLabels
            const unreadOnly = getters.unreadOnly
            const openTicketsOnly = getters.openTicketsOnly
            const hideCompleted = getters.hideCompleted
            const noImagesOnly = getters.noImagesOnly
            const actionFilter = getters.currentProductFilter
            const getSelectionInput = getters.getActiveSelectionInput
            const customDataFilters = state.selectedCustomFieldValues
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
                    return Array.from(deliveryDates).find(date => product.delivery_dates.includes(date))
                })
                productsToReturn = filteredByDeliveryDate
            }
            // Filter by brand
            if (brands.length > 0) {
                const filteredByBrands = productsToReturn.filter(product => {
                    return product.brand && Array.from(brands).includes(product.brand.toLowerCase())
                })
                productsToReturn = filteredByBrands
            }
            // Filter by buyer group
            if (buyerGroups.length > 0) {
                const filteredByBuyerGroups = productsToReturn.filter(product => {
                    return product.buying_group && Array.from(buyerGroups).includes(product.buying_group.toLowerCase())
                })
                productsToReturn = filteredByBuyerGroups
            }
            // Filter by ticket labels
            if (ticketLabels.length > 0) {
                // const filteredByTicketLabels = productsToReturn.filter(product => {
                //     return product.requests.find(request => request.labels.find(label => ticketLabels.includes(label)))
                // })
                const filteredByTicketLabels = productsToReturn.filter(product => {
                    return ticketLabels.find(label => {
                        if (label == 'no label') {
                            return product.requests.find(
                                request => request.type == 'Ticket' && request.labels.length <= 0
                            )
                        } else {
                            return product.requests.find(
                                request => request.type == 'Ticket' && request.labels.includes(label)
                            )
                        }
                    })
                    // return product.requests.find(request => request.labels.find(label => ticketLabels.includes(label)))
                })
                productsToReturn = filteredByTicketLabels
            }

            // Filter by custom values
            Object.keys(customDataFilters).map(filterKey => {
                const filterValues = customDataFilters[filterKey]
                if (filterValues.length <= 0) return
                productsToReturn = productsToReturn.filter(product =>
                    filterValues.includes(product.extra_data[filterKey])
                )
            })

            // Filer by unread
            if (unreadOnly) {
                if (selectionMode == 'Approval') {
                    productsToReturn = productsToReturn.filter(
                        product => !product.is_completed && getSelectionInput(product).hasUnreadAlignerComment
                    )
                }
                if (selectionMode == 'Alignment') {
                    productsToReturn = productsToReturn.filter(
                        product => !product.is_completed && getSelectionInput(product).hasUnreadApproverComment
                    )
                }
            }
            if (hideCompleted) {
                productsToReturn = productsToReturn.filter(x => !x.is_completed)
            }

            if (openTicketsOnly) {
                productsToReturn = productsToReturn.filter(x =>
                    x.requests.find(request => request.type == 'Ticket' && request.status == 'Open')
                )
            }

            // Filter by advanced filters
            if (getters.getHasAdvancedFilter) {
                productsToReturn = productsToReturn.filter(product => {
                    let include = true
                    getters.getAdvancedFilter.forEach((filter, index) => {
                        // FILTER BY USER / SELECTION INPUT
                        if (filter.type == 'author') {
                            if (!filter.filter.filterType) return

                            const operator = filter.operator
                            const type = filter.filter.filterType
                            const selectionInput = getSelectionInput(product)

                            if (type == 'user') {
                                const userId = filter.filter.user_id

                                if (filter.key == 'Comment') {
                                    if (operator == '=' && !selectionInput.comments.find(x => x.user_id == userId))
                                        include = false
                                    if (operator == '!=' && !!selectionInput.comments.find(x => x.user_id == userId))
                                        include = false
                                } else if (filter.key == 'Request') {
                                    if (operator == '=' && !selectionInput.requests.find(x => x.author_id == userId))
                                        include = false
                                    if (operator == '!=' && !!selectionInput.requests.find(x => x.author_id == userId))
                                        include = false
                                } else {
                                    const actionArray =
                                        getters.getDistributionScope == 'Alignment' ? 'actions' : 'feedbacks'
                                    const userFeedback = selectionInput[actionArray].find(
                                        action => action.user_id == userId
                                    )
                                    if (operator == '=' && (!userFeedback || userFeedback.action != filter.key))
                                        include = false
                                    if (operator == '!=' && !!userFeedback && userFeedback.action == filter.key)
                                        include = false
                                }
                            }

                            if (type == 'selection') {
                                const selectionId = filter.filter.id

                                if (filter.key == 'Comment') {
                                    if (
                                        operator == '=' &&
                                        !selectionInput.comments.find(x => x.selection_id == selectionId)
                                    )
                                        include = false
                                    if (
                                        operator == '!=' &&
                                        !!selectionInput.comments.find(x => x.selection_id == selectionId)
                                    )
                                        include = false
                                } else if (filter.key == 'Request') {
                                    if (
                                        operator == '=' &&
                                        !selectionInput.requests.find(x => x.selection_id == selectionId)
                                    )
                                        include = false
                                    if (
                                        operator == '!=' &&
                                        !!selectionInput.requests.find(x => x.selection_id == selectionId)
                                    )
                                        include = false
                                } else {
                                    const selectionAction = selectionInput.actions.find(
                                        action => action.selection_id == selectionId
                                    )
                                    if (operator == '=' && (!selectionAction || selectionAction.action != filter.key))
                                        include = false
                                    if (operator == '!=' && !!selectionAction && selectionAction.action == filter.key)
                                        include = false
                                }
                            }
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
                    })
                    return include
                })
            }

            // Filter by no images
            if (noImagesOnly) {
                const filteredByNoImages = productsToReturn.filter(
                    product => !product.variants.find(variant => variant.pictures.find(picture => !!picture.url))
                )
                productsToReturn = filteredByNoImages
            }

            // Filter by actions
            if (['ins', 'outs', 'nds', 'focus', 'tickets'].includes(actionFilter)) {
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
                    if (actionFilter == 'tickets') return product.hasTicket
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
        getSelectedCustomFieldValues: state => key => {
            if (!state.selectedCustomFieldValues[key]) {
                Vue.set(state.selectedCustomFieldValues, key, [])
            }
            return state.selectedCustomFieldValues[key]
        },
        getAllCustomValueFilters: state => {
            return state.selectedCustomFieldValues
        },
    },

    actions: {
        async fetchProducts({ commit, dispatch }, { fileId, addToState = true }) {
            commit('SET_PRODUCTS_STATUS', 'loading')

            const apiUrl = `/files/${fileId}/products`

            let products
            await axios
                .get(apiUrl)
                .then(async response => {
                    products = response.data
                    if (addToState) {
                        commit('insertProducts', { products, method: 'set' })
                        await dispatch('initProducts', products)
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
            dispatch('mergeProductsWithSelectionInput', {
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
            // If we have many products. Bundle them
            const chunkSize = 500
            if (products.length > chunkSize) {
                const array = products
                const chunkedArr = []
                const size = chunkSize
                for (let i = 0; i < array.length; i++) {
                    const last = chunkedArr[chunkedArr.length - 1]
                    if (!last || last.length === size) {
                        chunkedArr.push([array[i]])
                    } else {
                        last.push(array[i])
                    }
                }
                chunkedArr.map(async productChunk => {
                    await dispatch('insertProducts', { file, products: productChunk, addToState })
                })
                return
            }

            return new Promise((resolve, reject) => {
                const apiUrl = `/files/${file.id}/products`
                axios
                    .post(apiUrl, {
                        method: 'Add',
                        products: products,
                    })
                    .then(async response => {
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

                        // Add the created ID to the products
                        products.map(product => {
                            product.id = response.data.added_product_id_map[product.datasource_id]
                        })

                        if (addToState) {
                            commit('insertProducts', { products, method: 'add' })
                            await dispatch('initProducts', products)
                            commit('SORT_PRODUCTS')
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
                delivery_dates: [],
                buying_group: null,
                is_editor_choice: null,
                compositions: null,
                prices: [],
                variants: [],
                assortments: [],
                eans: [],
                assortment_sizes: [],
                extra_data: {},
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
            // If we have many products. Bundle them
            const chunkSize = 500
            if (products.length > chunkSize) {
                const array = products
                const chunkedArr = []
                const size = chunkSize
                for (let i = 0; i < array.length; i++) {
                    const last = chunkedArr[chunkedArr.length - 1]
                    if (!last || last.length === size) {
                        chunkedArr.push([array[i]])
                    } else {
                        last.push(array[i])
                    }
                }
                chunkedArr.map(async productChunk => {
                    await dispatch('updateManyProducts', { file, products: productChunk })
                })
                return
            }

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
                        // maxHeight: 2016,
                        maxHeight: 1080,
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
                commit('DELETE_PRODUCTS', products)

                // Start timer for deletion
                let wasCancelled = false
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: `${products.length} Products will be deleted`,
                        iconClass: 'fa-trash',
                        type: 'danger',
                        callback: () => {
                            wasCancelled = true
                            restoreProducts()
                        },
                        callbackLabel: 'Undo',
                        timeoutCallback: () => {
                            if (!wasCancelled) {
                                sendRequest()
                            }
                        },
                    },
                    { root: true }
                )

                const sendRequest = async () => {
                    const apiUrl = `/files/${file.id}/products`
                    axios
                        .post(apiUrl, {
                            method: 'Remove',
                            products: products,
                        })
                        .then(response => {
                            resolve(response)
                            commit(
                                'alerts/SHOW_SNACKBAR',
                                {
                                    msg: `${products.length} product${products.length > 1 ? 's' : ''} deleted`,
                                    iconClass: 'fa-check',
                                    type: 'success',
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
                }

                const restoreProducts = async () => {
                    // await dispatch('insertProducts', { file, products, addToState: true })
                    commit('insertProducts', { products, method: 'add' })
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
        toggleProductCompleted({ commit }, { selectionId, product }) {
            // console.log('toggle product completd', selection, product)
            const apiUrl = `selections/${selectionId}/products/complete`
            const shouldBeCompleted = product.is_completed ? false : true

            commit('TOGGLE_PRODUCT_COMPLETED', { product, shouldBeCompleted })

            const apiMethod = shouldBeCompleted ? 'put' : 'delete'
            axios({
                method: apiMethod,
                url: apiUrl,
                data: {
                    product_ids: [product.id],
                },
            }).then(response => {
                // commit(
                //     'alerts/SHOW_SNACKBAR',
                //     {
                //         msg: `Product ${shouldBeCompleted ? 'completed' : 'un-completed'}`,
                //         iconClass: shouldBeCompleted ? 'fa-check' : 'fa-times',
                //         type: shouldBeCompleted ? 'success' : 'danger',
                //     },
                //     { root: true }
                // )
            })
        },
        setProductsCompleted({ commit }, { selectionId, products, shouldBeCompleted }) {
            const apiUrl = `selections/${selectionId}/products/complete`

            commit('SET_PRODUCTS_COMPLETED', { products, shouldBeCompleted })

            const apiMethod = shouldBeCompleted ? 'put' : 'delete'
            axios({
                method: apiMethod,
                url: apiUrl,
                data: {
                    product_ids: products.map(x => x.id),
                },
            }).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: `${products.length} Products ${shouldBeCompleted ? 'completed' : 'un-completed'}`,
                        iconClass: shouldBeCompleted ? 'fa-check' : 'fa-times',
                        type: shouldBeCompleted ? 'success' : 'danger',
                    },
                    { root: true }
                )
            })
        },
        async fetchProductsFromDatabase({ dispatch, commit }, { databaseId, columnNameList, queryValues }) {
            const apiUrl = `external-databases/${databaseId}/query-products`

            // Fetch the raw product data from database. Will be returned as CSV
            let csvString
            await axios
                .post(apiUrl, {
                    conditions: columnNameList.map(columnName => {
                        return {
                            column: columnName,
                            values: queryValues,
                            operator: 'InArray',
                        }
                    }),
                    relation: 'OR',
                })
                .then(response => {
                    csvString = response.data
                })

            // Read the CSV data and parse to object array
            const rows = parseCSVStringToRowsAndCells(csvString)

            if (rows.length <= 0) {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'No matches found',
                        iconClass: 'far fa-info-cirlce',
                        type: 'info',
                    },
                    { root: true }
                )
                return
            }

            // ------------------------------------------------------- //
            // START QUIRKY CODE HACKING THE UPLOAD FROM CSV FUNCTIONS //
            // ------------------------------------------------------- //

            const mappedKey = await dispatch('mapProductData/fetchProductFields', { scope: 'key' }, { root: true })

            const file = {
                mappedKey: mappedKey[0],
                headers: Object.keys(rows[0]),
                fileName: 'temp',
                rows,
            }

            mappedKey[0].fieldName = 'STYLE_NUMBER'
            mappedKey[0].file = file

            // Instantiate products from the row objects
            // Instantiate fields to map
            const fieldsToMap = await dispatch('mapProductData/getAllFields', null, { root: true })
            // Map the fields
            fieldsToMap.map(field => {
                field.file = file
                if (!field.scope) {
                    if (field.name == 'eans') {
                        field.fieldName = 'EAN_NO'
                    }
                    if (field.name == 'title') {
                        field.fieldName = 'STYLE_NAME'
                    }
                    if (field.name == 'category') {
                        field.fieldName = 'CATEGORYBI2'
                    }
                    if (field.name == 'brand') {
                        field.fieldName = 'COLLECTION_NAME'
                    }
                    if (field.name == 'buying_group') {
                        field.fieldName = 'PURCHASEDIVISION'
                    }
                    if (field.name == 'delivery_dates') {
                        field.fieldName = 'DELIVERY'
                    }
                    if (field.displayName == 'Country of Origin') {
                        field.fieldName = 'COO'
                    }
                    if (field.displayName == 'Sample Location Name') {
                        field.fieldName = 'PURCHASEDIVISION'
                    }
                }
                if (field.scope == 'variants') {
                    if (field.name == 'color') {
                        field.fieldName = 'COLOUR_NAME'
                    }
                    if (field.name == 'variant') {
                        field.fieldName = 'STYLE_VARIANT_NAME'
                    }
                    if (field.name == 'ean') {
                        field.fieldName = 'EAN_NO'
                    }
                    if (field.name == 'sizes') {
                        field.fieldName = 'SIZE_NAME'
                    }
                }
                if (field.scope == 'prices') {
                    if (field.name == 'currency') {
                        field.fieldName = 'CUR'
                    }
                    if (field.name == 'wholesale_price') {
                        field.fieldName = 'WHS_PRICE'
                    }
                    if (field.name == 'recommended_retail_price') {
                        field.fieldName = 'RRP'
                    }
                    if (field.name == 'mark_up') {
                        field.fieldName = 'RTL_MU'
                    }
                }
            })

            // ----------------------------------------------------- //
            // END QUIRKY CODE HACKING THE UPLOAD FROM CSV FUNCTIONS //
            // ----------------------------------------------------- //

            const products = instantiateProductsFromMappedFields(fieldsToMap, [file])
            return products
        },
        initProducts({ state, rootGetters }, products) {
            products.map(product => {
                // Cast datasource_id to a number
                product.datasource_id = parseInt(product.datasource_id)

                // Name
                product.title = product.title ? product.title : 'Unnamed'
                // Custom Props
                if (!product.extra_data) Vue.set(product, 'extra_data', {})

                Object.defineProperty(product, 'name', {
                    get: function() {
                        return product.title
                    },
                    set: function(value) {
                        product.title = value
                    },
                })

                // Instantiate the selectionInputList on the product
                Vue.set(product, 'selectionInputList', [])

                Object.defineProperty(product, 'getActiveSelectionInput', {
                    get: function() {
                        if (product.selectionInputList.length <= 0) return
                        if (product.selectionInputList.length == 1) return product.selectionInputList[0]
                        const currentSelection = rootGetters['selections/currentSelection']
                        return product.selectionInputList.find(x => x.selection_id == currentSelection.id)
                    },
                })

                Object.defineProperty(product, 'yourAction', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return
                        const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                        const selectionInput = product.getActiveSelectionInput
                        return selectionInput[actionKey]
                    },
                    set: function(value) {
                        const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                        const selectionInput = product.getActiveSelectionInput
                        return (selectionInput[actionKey] = value)
                    },
                })

                Object.defineProperty(product, 'yourActionObject', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return
                        const selectionMode = rootGetters['selections/getCurrentSelectionMode']
                        const acitonObjectKey =
                            selectionMode == 'Feedback' ? 'yourSelectionFeedback' : 'selectionAction'
                        const selectionInput = product.getActiveSelectionInput
                        return selectionInput[acitonObjectKey]
                    },
                    set: function(value) {
                        const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                        const selectionInput = product.getActiveSelectionInput
                        return (selectionInput[actionKey] = value)
                    },
                })

                Object.defineProperty(product, 'is_completed', {
                    get: function() {
                        return product.selectionInputList.length > 0 && product.selectionInputList[0].is_completed
                    },
                    set: function(value) {
                        product.selectionInputList[0].is_completed = value
                    },
                })

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
                        return !!product.requests.find(x => x.hasUnreadAlignerComment)
                    },
                })
                Object.defineProperty(product, 'hasUnreadApproverComment', {
                    get: function() {
                        return !!product.requests.find(x => x.hasUnreadApproverComment)
                    },
                })
                Object.defineProperty(product, 'hasNewComment', {
                    get: function() {
                        return (
                            !product.is_completed &&
                            ((rootGetters['selections/getCurrentSelectionMode'] == 'Alignment' &&
                                product.hasUnreadApproverComment) ||
                                (rootGetters['selections/getCurrentSelectionMode'] == 'Approval' &&
                                    product.hasUnreadAlignerComment))
                        )
                    },
                })
                Object.defineProperty(product, 'hasOpenTicket', {
                    get: function() {
                        return !!product.requests.find(request => request.status == 'Open' && request.type == 'Ticket')
                    },
                })
                Object.defineProperty(product, 'hasTicket', {
                    get: function() {
                        return !!product.requests.find(request => request.type == 'Ticket')
                    },
                })

                // VARIANTS
                product.variants.forEach(variant => {
                    if (variant.imageIndex == null) {
                        Vue.set(variant, 'imageIndex', 0)
                    }
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])
                    if (!variant.ean_sizes) Vue.set(variant, 'ean_sizes', [])
                    // Custom Props
                    if (!variant.extra_data) Vue.set(variant, 'extra_data', {})

                    Object.defineProperty(variant, 'currentImg', {
                        get: function() {
                            return variant.pictures[variant.imageIndex]
                        },
                    })
                })
            })
        },
        mergeProductsWithSelectionInput({ state, dispatch }, { selectionProductInput, authUser }) {
            // Filter out products not in our selection input
            state.products = state.products.filter(
                product => !!selectionProductInput.products.find(x => x.id == product.id)
            )

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

                Object.defineProperty(selectionInput, 'is_completed', {
                    get: function() {
                        return rawSelectionInput.is_completed
                    },
                    set: function(value) {
                        rawSelectionInput.is_completed = value
                    },
                })

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
                Object.defineProperty(selectionInput, 'feedbacksRaw', {
                    get: function() {
                        const allFeedback = rawSelectionInput.feedbacks
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
                Object.defineProperty(selectionInput, 'actionsRaw', {
                    get: function() {
                        const allActions = rawSelectionInput.actions
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

                Object.defineProperty(selectionInput, 'hasUnreadAlignerComment', {
                    get: function() {
                        return !!selectionInput.requests.find(x => x.hasUnreadAlignerComment)
                    },
                })
                Object.defineProperty(selectionInput, 'hasUnreadApproverComment', {
                    get: function() {
                        return !!selectionInput.requests.find(x => x.hasUnreadApproverComment)
                    },
                })
                Object.defineProperty(selectionInput, 'hasOpenTicket', {
                    get: function() {
                        return selectionInput.requests.find(
                            request => request.status == 'Open' && request.type == 'Ticket'
                        )
                    },
                })
                Object.defineProperty(selectionInput, 'hasTicket', {
                    get: function() {
                        return !!selectionInput.requests.find(request => request.type == 'Ticket')
                    },
                })

                // Set the current action for the user
                Object.defineProperty(selectionInput, 'your_feedback', {
                    get: function() {
                        const userFeedback = rawSelectionInput.feedbacks.find(
                            x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                        )
                        return userFeedback ? userFeedback.action : 'None'
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
                // Get the user's quantity
                Object.defineProperty(selectionInput, 'your_quantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            totalQty += variant.your_quantity
                        })
                        return totalQty
                    },
                })
                // Get total
                Object.defineProperty(selectionInput, 'totalQuantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            // Return the childrens quantity if no quantity has been set for this selection
                            const quantity =
                                variant.action == 'None'
                                    ? variant.totalChildrenQuantity + variant.totalSiblingQuantity
                                    : variant.totalSiblingQuantity
                            totalQty += quantity
                        })
                        return totalQty
                    },
                })
                // Get total from children
                Object.defineProperty(selectionInput, 'totalChildrenQuantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            variant.actions
                                .filter(action => action.selection.parent_id == selectionInput.selection_id)
                                .map(action => {
                                    totalQty += action.quantity
                                })
                        })
                        return totalQty
                    },
                })
                // Get total from ex children
                Object.defineProperty(selectionInput, 'totalSiblingQuantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            variant.actions
                                .filter(action => action.selection.parent_id == selectionInput.selection.parent_id)
                                .map(action => {
                                    totalQty += action.quantity
                                })
                        })
                        return totalQty
                    },
                })

                Object.defineProperty(selectionInput, 'totalFeedbackQuantity', {
                    get: function() {
                        let totalQty = 0
                        selectionInput.variants.map(variant => {
                            variant.feedbacks.map(action => {
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
                dispatch('requests/initRequests', selectionInput.requests, { root: 'true' })

                // PROCESS VARIANTS
                selectionInput.variants.forEach(variant => {
                    // VARIANTS
                    Vue.set(variant, 'imageIndex', 0)
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])
                    if (!variant.ean_sizes) Vue.set(variant, 'ean_sizes', [])

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
                                        quantity: variantFeedback.quantity,
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
                    Object.defineProperty(variant, 'feedbacksRaw', {
                        get: function() {
                            const feedbacks = []
                            selectionInput.feedbacksRaw.map(feedback => {
                                const variantFeedbacks = feedback.variants.filter(x => x.id == variant.id)
                                variantFeedbacks.map(variantFeedback => {
                                    feedbacks.push({
                                        id: variantFeedback.id,
                                        action: variantFeedback.feedback,
                                        quantity: variantFeedback.quantity,
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
                            const userFeedback = variant.feedbacksRaw.find(
                                x => x.user_id == authUser.id && x.selection_id == selectionInput.selection_id
                            )
                            return userFeedback ? userFeedback.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the user feedback for the variant input for this feedback action
                            const userFeedback = selectionInput.feedbacksRaw.find(
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
                                    quantity: variant.your_quantity,
                                })
                            } else {
                                userFeedback.variants.push({
                                    feedback: newAction,
                                    id: variant.id,
                                    quantity: variant.your_quantity,
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
                    Object.defineProperty(variant, 'actionsRaw', {
                        get: function() {
                            const actions = []
                            selectionInput.actionsRaw.map(action => {
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
                            const selectionAction = variant.actionsRaw.find(
                                x => x.selection_id == selectionInput.selection_id
                            )
                            return selectionAction ? selectionAction.action : 'None'
                        },
                        set: function(newAction) {
                            // Find the current action for the variant input for this action action
                            const currentAction = selectionInput.actionsRaw.find(
                                action => action.selection_id == selectionInput.selection_id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants.splice(currentVariantActionIndex, 1, {
                                    id: variant.id,
                                    feedback: newAction,
                                    quantity: currentAction.variants[currentVariantActionIndex].quantity,
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
                            const currentAction = selectionInput.actionsRaw.find(
                                action => action.selection_id == selectionInput.selection_id
                            )
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            return currentVariantActionIndex >= 0
                                ? currentAction.variants[currentVariantActionIndex].quantity
                                : 0
                        },
                        set: function(newQuantity) {
                            // Find the current action for the variant input for this action action
                            const currentAction = selectionInput.actionsRaw.find(
                                action => action.selection_id == selectionInput.selection_id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantActionIndex = currentAction.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantActionIndex >= 0) {
                                currentAction.variants[currentVariantActionIndex].quantity = newQuantity
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
                    // Get the user's feedback quantity
                    Object.defineProperty(variant, 'your_quantity', {
                        get: function() {
                            const userFeedback = variant.feedbacksRaw.find(
                                x => x.user_id == authUser.id && x.selection_id == selectionInput.selection_id
                            )
                            return userFeedback ? userFeedback.quantity : 0
                        },
                        set: function(newQuantity) {
                            // Find the current action for the variant input for this action action
                            const userFeedback = selectionInput.feedbacksRaw.find(
                                feedback =>
                                    feedback.user_id == authUser.id &&
                                    feedback.selection_id == selectionInput.selection_id
                            )
                            // If the user has already made variant input, update the action
                            const currentVariantFeedbackIndex = userFeedback.variants.findIndex(x => x.id == variant.id)
                            if (currentVariantFeedbackIndex >= 0) {
                                userFeedback.variants.splice(currentVariantFeedbackIndex, 1, {
                                    id: variant.id,
                                    feedback: variant.your_feedback,
                                    quantity: newQuantity,
                                })
                            } else {
                                userFeedback.variants.push({
                                    id: variant.id,
                                    feedback: variant.your_feedback,
                                    quantity: newQuantity,
                                })
                            }
                        },
                    })
                    // Get the selection's quantity
                    Object.defineProperty(variant, 'totalQuantity', {
                        get: function() {
                            // Return the childrens quantity if no quantity has been set for this selection
                            const actionsFiltered =
                                variant.action == 'None'
                                    ? variant.actions.filter(
                                          action => action.selection.parent_id == selectionInput.selection_id
                                      )
                                    : variant.actions.filter(
                                          action => action.selection.parent_id != selectionInput.selection_id
                                      )
                            return actionsFiltered.reduce((total, x) => (total += x.quantity), 0)
                        },
                    })
                    // Get total from children
                    Object.defineProperty(variant, 'totalChildrenQuantity', {
                        get: function() {
                            return variant.actions
                                .filter(action => action.selection.parent_id == selectionInput.selection_id)
                                .reduce((total, x) => (total += x.quantity), 0)
                        },
                    })
                    // Get total from ex children
                    Object.defineProperty(variant, 'totalSiblingQuantity', {
                        get: function() {
                            return variant.actions
                                .filter(action => action.selection.parent_id == selectionInput.selection.parent_id)
                                .reduce((total, x) => (total += x.quantity), 0)
                        },
                    })
                    // Get the selection's quantity
                    Object.defineProperty(variant, 'totalFeedbackQuantity', {
                        get: function() {
                            return variant.feedbacks.reduce((total, x) => (total += x.quantity), 0)
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
        SET_PRODUCTS(state, products) {
            state.products = products
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
        SET_HIDE_COMPLETED(state, payload) {
            state.hideCompleted = payload
        },
        SET_OPEN_TICKETS_ONLY(state, payload) {
            state.openTicketsOnly = payload
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
                    const selectionAction = selectionInput.actionsRaw.find(x => x.selection_id == action.selection_id)
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user = user

                        const allVariantsOut = !selectionInput.variants.find(variant =>
                            ['In', 'Focus'].includes(variant.action)
                        )

                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            // Check if an action for the variant already exists
                            if (allVariantsOut || variant.action == 'None') {
                                variant.action = newAction
                                variant.quantity = variant.totalChildrenQuantity
                            }
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
                    const selectionAction = selectionInput.actionsRaw.find(x => x.selection_id == action.selection_id)
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
                    const selectionAction = selectionInput.feedbacksRaw.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user = user

                        const allVariantsOut = !selectionInput.variants.find(variant =>
                            ['In', 'Focus'].includes(variant.your_feedback)
                        )
                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            // Check if an action for the variant already exists
                            if (variant.your_feedback == 'None' || allVariantsOut) {
                                variant.your_feedback = newAction
                            }
                            // variant.action = newAction
                            if (['Out', 'None'].includes(newAction)) {
                                variant.your_feedback = newAction
                                variant.your_quantity = 0
                            }
                        })
                    }
                })
            })
        },
        SET_FEEDBACKS(state, actions) {
            actions.forEach(action => {
                if (!action.variants) action.variants = []
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.feedbacksRaw.find(
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
        SET_SELECTED_PRODUCTS(state, products) {
            state.selectedProducts = products
        },
        SET_SELECTED_TICKET_LABELS(state, labels = []) {
            state.selectedTicketLabels = labels
        },
        SET_SHOW_CSV_MODAL(state, makeVisible) {
            state.showCSVModal = makeVisible
        },
        SET_SHOW_PDF_MODAL(state, makeVisible) {
            state.showPDFModal = makeVisible
        },
        TOGGLE_PRODUCT_COMPLETED(state, { product, shouldBeCompleted }) {
            product.is_completed = shouldBeCompleted
        },
        SET_PRODUCTS_COMPLETED(state, { products, shouldBeCompleted }) {
            products.map(product => {
                product.is_completed = shouldBeCompleted
            })
        },
        SET_NO_IMAGES_ONLY(state, boolean) {
            state.noImagesOnly = boolean
        },
        SET_SELECTED_BRANDS(state, brands) {
            state.selectedBrands = brands
        },
        SET_CURRENT_PDP_VARIANT_INDEX(state, index) {
            state.pdpVariantIndex = index
        },
        SET_SELECTED_CUSTOM_FIELD_VALUES(state, { field, value }) {
            Vue.set(state.selectedCustomFieldValues, field, value)
        },
        RESET_CUSTOM_FILTERS(state) {
            Object.keys(state.selectedCustomFieldValues).map(key => {
                state.selectedCustomFieldValues[key] = []
            })
        },
    },
}
