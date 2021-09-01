import axios from 'axios'
import sortArray from '../../mixins/sortArray'
import Compressor from 'compressorjs'
import { instantiateProductsFromMappedFields, parseCSVStringToRowsAndCells } from '../../helpers/workbookUtils'
import chunkArray from '../../helpers/chunkArray'
import getUniqueObjectValuesByKey from '../../helpers/getUniqueObjectValuesByKey'
import { v4 as uuidv4 } from 'uuid'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentProduct: null,
        availableProducts: [],
        selectedProducts: [],
        unreadOnly: false,
        hideCompleted: false,
        noImagesOnly: false,
        singleVisible: false,
        products: [],
        productsFilteredBySearch: [],
        status: null,
        currentFocusRowIndex: null,
        lastSort: null,
        showPDFModal: false,
        showCSVModal: false,
        openTicketsOnly: false,
        pdpVariantIndex: 0,
    },

    getters: {
        loadingProducts: state => state.loading,
        getPdpVariantIndex: state => state.pdpVariantIndex,
        productsStatus: state => state.status,
        getStatus: state => state.status,
        currentProduct: state => state.currentProduct,
        currentFocusRowIndex: state => state.currentFocusRowIndex,
        getPDFModalVisible: state => state.showPDFModal,
        getCSVModalVisisble: state => state.showCSVModal,
        getProductsFilteredBySearch: state => state.productsFilteredBySearch,
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
        unreadOnly: state => state.unreadOnly,
        openTicketsOnly: state => state.openTicketsOnly,
        hideCompleted: state => state.hideCompleted,
        noImagesOnly: state => state.noImagesOnly,
        singleVisible: state => state.singleVisible,
        products: state => state.products,
        getProducts: state => state.products,
        getAllProducts: (state, getters) => state.products,
        getFilteredProducts: (state, getters, rootState, rootGetters) => products => {
            const invertMatch = rootGetters['productFilters/getIsInverseMatch']
            const exactMatch = rootGetters['productFilters/getIsExactMatch']
            const filters = rootGetters['productFilters/getProductFilters']

            // YE OLDE STUFF
            const unreadOnly = rootGetters['productFilters/unreadOnly']
            const openTicketsOnly = rootGetters['productFilters/openTicketsOnly']
            const hideCompleted = rootGetters['productFilters/hideCompleted']
            const noImagesOnly = rootGetters['productFilters/noImagesOnly']
            const styleOptionOnly = rootGetters['productFilters/styleOptionOnly']
            const actionFilter = rootGetters['productFilters/getProductActionFilter']
            const hasAdvancedFilter = rootGetters['productFilters/getHasAdvancedFilter']
            const advancedFilters = rootGetters['productFilters/getAdvancedFilter']
            // Selection Specific
            const getSelectionInput = rootGetters['selectionProducts/getActiveSelectionInput']
            const distributionScope = rootGetters['selectionProducts/getDistributionScope']
            const currentAction = rootGetters['selections/currentSelectionModeAction']
            const selectionMode = rootGetters['selections/currentSelectionMode']
            const ticketLabels = rootGetters['productFilters/getFilterTicketLabels']
            const selection = rootGetters['selections/getCurrentSelection']
            // END YE OLDE STUFF

            const filtersActive = rootGetters['productFilters/getFiltersAreActive']
            let productsToReturn = [...products]

            // Summed selections
            if (selection && selection.type == 'Summed') {
                // Filter out variats with no QTY
                productsToReturn = productsToReturn.filter(product => product.quantity > 0)
            }

            // Filter by regular filters
            filters.map(filter => {
                // if (filter.selected.length <= 0 || filter.scope != 'product') return true
                if (filter.selected.length <= 0) return true
                productsToReturn = productsToReturn.filter(product => {
                    const productOptions = getUniqueObjectValuesByKey(product, filter.key)
                    const optionsToMatch = productOptions.map(option => option.toString().toLowerCase())

                    const includesMatch = !!filter.selected.find(selectedOption => {
                        // If we are looking for objects with no values
                        if (selectedOption == 'N/A - Not set') return optionsToMatch.length <= 0

                        // Else
                        const toMatch = selectedOption.toString().toLowerCase()

                        return optionsToMatch.includes(toMatch)
                    })

                    // Exact match
                    if (exactMatch && includesMatch) {
                        return (
                            optionsToMatch.length == filter.selected.length &&
                            !filter.selected.find(selectedOption => {
                                const toMatch = selectedOption.toString().toLowerCase()
                                return !optionsToMatch.includes(toMatch)
                            })
                        )
                    }

                    return includesMatch
                })
            })

            // End filter by regular filters

            // YE OLDE FILTERS
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
            // Filter by ticket labels
            if (ticketLabels.length > 0) {
                const filteredByTicketLabels = productsToReturn.filter(product => {
                    return ticketLabels.find(label => {
                        if (label == 'no label') {
                            return (
                                product.requests.length <= 0 ||
                                !!product.requests.find(request => request.labels.length <= 0)
                            )
                        } else {
                            return product.requests.find(request => request.labels.includes(label))
                        }
                    })
                })
                productsToReturn = filteredByTicketLabels
            }

            // Filter by advanced filters
            if (hasAdvancedFilter) {
                productsToReturn = productsToReturn.filter(product => {
                    let include = true
                    advancedFilters.forEach((filter, index) => {
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
                                    const actionArray = distributionScope == 'Alignment' ? 'actions' : 'feedbacks'
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
                            if (distributionScope == 'Alignment' && filterKey == 'ins') filterKey = 'alignmentIns'
                            if (distributionScope == 'Alignment' && filterKey == 'outs') filterKey = 'alignmentOuts'
                            if (distributionScope == 'Alignment' && filterKey == 'focus') filterKey = 'alignmentFocus'
                            if (distributionScope == 'Alignment' && filterKey == 'nds') filterKey = 'alignmentNds'
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
            // Filter by style option
            if (styleOptionOnly) {
                const filteredByStyleOption = productsToReturn.filter(
                    product => !product.variants.find(variant => variant.style_option_id)
                )
                productsToReturn = filteredByStyleOption
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
            // END YE OLDE FILTERS

            if (invertMatch && filtersActive) {
                // Invert the match
                return products.filter(product => !productsToReturn.find(x => x.id == product.id))
            }

            return productsToReturn
        },
        productsFiltered(state, getters, rootState, rootGetters) {
            const products = getters.products
            return getters.getFilteredProducts(products)
        },
        getProductsFiltered: (state, getters) => getters.productsFiltered,
        getCurrentViewProducts: (state, getters, rootState, rootGetters) => {
            const products = getters.products
            const buyView = rootGetters['productFilters/getBuyView']
            const selection = rootGetters['selections/getCurrentSelection']
            const currentApp = rootGetters['kollektApps/getCurrentApp']

            if (!selection) return products

            let productsToReturn = [...products]
            if (currentApp.name == 'select') {
                const selectProducts = rootGetters['selectionProducts/getProducts']
                productsToReturn = [...selectProducts]
            }

            if (selection.type == 'Summed') {
                // Filter out variats with no QTY
                productsToReturn = productsToReturn.filter(product => product.quantity > 0)
            }

            if (buyView == 'tbd') {
                productsToReturn = productsToReturn.filter(
                    product => product.quantity <= 0 && ['Focus', 'In'].includes(product.selectionAlignment.action)
                )
            }
            if (buyView == 'purchase') {
                productsToReturn = productsToReturn.filter(product => product.quantity > 0)
            }
            return productsToReturn
        },
        getCurrentViewProductsFiltered: (state, getters) => {
            const products = getters.getCurrentViewProducts
            return getters.getFilteredProducts(products)
        },
        getFilteredVariants: (state, getters, rootState, rootGetters) => variants => {
            const selection = rootGetters['selections/getCurrentSelection']
            const filters = rootGetters['productFilters/getProductFilters']
            const filterVariants = rootGetters['productFilters/getFilterVariants']

            let variantsFiltered = [...variants]

            if (filterVariants) {
                filters.map(filter => {
                    if (filter.selected.length <= 0 || filter.scope != 'variant') return true
                    variantsFiltered = variantsFiltered.filter(variant => {
                        // remove `variants` from the key
                        const key = filter.key.slice(9)
                        const variantOptions = getUniqueObjectValuesByKey(variant, key)
                        const optionsToMatch = variantOptions.map(option => option.toString().toLowerCase())

                        const includesMatch = !!filter.selected.find(selectedOption => {
                            // If we are looking for objects with no values
                            if (selectedOption == 'N/A - Not set') return optionsToMatch.length <= 0

                            // Else
                            const toMatch = selectedOption.toString().toLowerCase()

                            return optionsToMatch.includes(toMatch)
                        })

                        // Exact match
                        if (exactMatch && includesMatch) {
                            return (
                                optionsToMatch.length == filter.selected.length &&
                                !filter.selected.find(selectedOption => {
                                    const toMatch = selectedOption.toString().toLowerCase()
                                    return !optionsToMatch.includes(toMatch)
                                })
                            )
                        }

                        return includesMatch
                    })
                })
            }

            if (selection.type == 'Summed') {
                // Filter out variats with no QTY
                variantsFiltered = variantsFiltered.filter(variant => variant.quantity > 0)
            }
            return variantsFiltered
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
        async fetchProduct({ commit, dispatch }, productId) {
            const apiUrl = `products/${productId}`

            let product
            await axios.get(apiUrl).then(async response => {
                product = response.data
            })
            return product
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
        async insertProducts({ commit, dispatch, getters }, { file, products, addToState }) {
            // Chunk products to avoid too big requests
            const productChunks = chunkArray(products, 50)

            await Promise.all(
                productChunks.map(async productChunk => {
                    const apiUrl = `/files/${file.id}/products`
                    await axios
                        .post(apiUrl, {
                            method: 'Add',
                            products: productChunk,
                        })
                        .then(response => {
                            // Add the created ID to the products
                            productChunk.map(product => {
                                Vue.set(product, 'id', response.data.added_product_id_map[product.datasource_id])
                            })
                            // Start image sync job
                            const syncJobId = response.data.download_image_progress_id
                            if (syncJobId != 0) {
                                dispatch('backgroundJobs/startImageSyncJob', { jobId: syncJobId, file }, { root: true })
                            }
                        })
                })
            )
                .then(async () => {
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

                    if (addToState) {
                        let sequenceIndex = getters.products
                            ? getters.products.reduce(
                                  (highestSequence, product) =>
                                      product.sequence > highestSequence ? product.sequence : highestSequence,
                                  0
                              )
                            : 0
                        products.map(product => {
                            product.sequence = sequenceIndex + 1
                            sequenceIndex++
                        })
                        commit('insertProducts', { products, method: 'add' })
                        await dispatch('initProducts', products)
                        commit('SORT_PRODUCTS')
                    }

                    // SYNC IMAGES
                    dispatch('files/syncExternalImages', { file, products }, { root: true })
                })
                .catch(err => {
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
            return products
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
        instantiateNewProduct({ commit }, productData = {}) {
            return {
                title: productData.title || 'Untitled product',
                datasource_id: productData.datasource_id || null,
                short_description: productData.short_description || null,
                sale_description: productData.sale_description || null,
                min_order: productData.min_order || null,
                min_variant_order: productData.min_variant_order || null,
                brand: productData.brand || null,
                category: productData.category || null,
                delivery_date: productData.delivery_date || null,
                delivery_dates: productData.delivery_dates || [],
                buying_group: productData.buying_group || null,
                is_editor_choice: productData.is_editor_choice || null,
                composition: productData.composition || null,
                labels: productData.labels || [],
                prices: productData.prices || [],
                variants: productData.variants || [],
                assortments: productData.assortments || [],
                eans: productData.eans || [],
                assortment_sizes: productData.assortment_sizes || [],
                extra_data: productData.extra_data || {},
            }
        },
        instantiateNewProductVariant({ commit }, variantData = {}) {
            return {
                id: variantData.id || uuidv4(),
                color: variantData.color || null,
                variant: variantData.variant || null,
                name: variantData.name || null,
                delivery_dates: variantData.delivery_dates || [],
                ean_sizes: variantData.ean_sizes || [], // {ean, quantity, ref_id, size}
                extra_data: variantData.extra_data || {},
                min_order: variantData.min_order || null,
                labels: variantData.labels || [],
                pictures: variantData.pictures || [],
                style_option_id: variantData.style_option_id || null,
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
                        // commit(
                        //     'alerts/SHOW_SNACKBAR',
                        //     {
                        //         msg: 'Product updated',
                        //         iconClass: 'fa-check',
                        //         type: 'success',
                        //     },
                        //     { root: true }
                        // )

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

                        // Start image sync job
                        const syncJobId = response.data.download_image_progress_id
                        if (syncJobId != 0) {
                            dispatch('backgroundJobs/startImageSyncJob', { jobId: syncJobId, file }, { root: true })
                        }

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
                if (product.isInit) return
                Vue.set(product, 'isInit', true)
                // Cast datasource_id to a number
                product.datasource_id = parseInt(product.datasource_id)

                // Find all EANs
                Object.defineProperty(product, 'getAllEAN', {
                    get: function() {
                        const eanList = [...product.eans]
                        product.variants.map(variant => {
                            const exists = eanList.includes(variant.ean)
                            if (!exists) eanList.push(variant.ean)
                            variant.ean_sizes.map(x => {
                                const exists = eanList.includes(x.ean)
                                if (!exists) eanList.push(x.ean)
                            })
                        })
                        return eanList.filter(x => !!x) // fitler out empty values
                    },
                })

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
                        // console.log('get active selection input', product, rootGetters['selections/currentSelection'])
                        if (product.selectionInputList.length <= 0) return
                        if (product.selectionInputList.length == 1) return product.selectionInputList[0]
                        const currentSelection = rootGetters['selections/currentSelection']
                        return product.selectionInputList.find(x => x.selection_id == currentSelection.id)
                    },
                })

                Object.defineProperty(product, 'feedbacks', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return
                        return product.getActiveSelectionInput.feedbacks
                    },
                })

                Object.defineProperty(product, 'alignments', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return
                        return product.getActiveSelectionInput.actions
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

                Object.defineProperty(product, 'yourLabels', {
                    get: function() {
                        if (!product.getActiveSelectionInput || !product.yourActionObject) return
                        return product.yourActionObject.labels
                    },
                    set: function(value) {
                        if (!product.getActiveSelectionInput || !product.yourActionObject) return
                        product.yourActionObject.labels = value
                    },
                })

                Object.defineProperty(product, 'labelInput', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        const distributionScope = rootGetters['selectionProducts/getDistributionScope']
                        const arrayKey = distributionScope == 'Feedback' ? 'feedbacks' : 'alignments'
                        const labels = []
                        product[arrayKey].map(action => {
                            action.labels.map(label => {
                                const newLabelInput = { label }
                                const labelInArray = labels.find(x => x.label == label)
                                if (!labelInArray) {
                                    labels.push(newLabelInput)
                                }
                            })
                        })
                        labels.map(labelInput => {
                            Object.defineProperty(labelInput, 'votes', {
                                get: function() {
                                    const votes = []
                                    product[arrayKey].map(action => {
                                        if (action.labels.includes(labelInput.label)) {
                                            votes.push(action)
                                        }
                                    })
                                    return votes
                                },
                            })
                        })
                        // Always sort labels by available labels
                        const sortingArr = rootGetters['workspaces/getAvailableProductLabels']
                        // Sort by available labels
                        const sortedLabelInput = labels.slice().sort((a, b) => {
                            return sortingArr.indexOf(a.label) - sortingArr.indexOf(b.label)
                        })
                        return sortedLabelInput
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
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).ins
                    },
                })
                Object.defineProperty(product, 'outs', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).outs
                    },
                })
                Object.defineProperty(product, 'focus', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).focus
                    },
                })
                Object.defineProperty(product, 'nds', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).nds
                    },
                })
                Object.defineProperty(product, 'alignmentIns', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentIns
                    },
                })
                Object.defineProperty(product, 'alignmentOuts', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentOuts
                    },
                })
                Object.defineProperty(product, 'alignmentFocus', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentFocus
                    },
                })
                Object.defineProperty(product, 'alignmentNds', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).alignmentNds
                    },
                })
                Object.defineProperty(product, 'comments', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
                        return product.selectionInputList.find(
                            x => x.selection_id == rootGetters['selections/currentSelection'].id
                        ).comments
                    },
                })
                Object.defineProperty(product, 'requests', {
                    get: function() {
                        if (!product.getActiveSelectionInput) return []
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

                Object.defineProperty(product, 'inStock', {
                    get: function() {
                        return !!product.variants.find(variant => variant.inStock)
                    },
                })

                // VARIANTS
                Vue.set(product, 'variantsRaw', [...product.variants])
                Object.defineProperty(product, 'variants', {
                    get: function() {
                        // Filter out variants that are not in chapters
                        if (!product.getActiveSelectionInput) return product.variantsRaw
                        return product.variantsRaw.filter(
                            variant => !!product.getActiveSelectionInput.variants.find(x => x.id == variant.id)
                        )
                    },
                })
                // Object.defineProperty(product, 'variantsFiltered', {
                //     get: function() {
                //         return getters.getFilteredVariants(product.variants)
                //     },
                // })

                product.variants.forEach((variant, variantIndex) => {
                    Vue.set(variant, 'isInit', true)
                    if (variant.imageIndex == null) {
                        Vue.set(variant, 'imageIndex', 0)
                    }
                    Vue.set(variant, 'index', variantIndex)
                    if (!variant.pictures) Vue.set(variant, 'pictures', [])
                    if (!variant.labels) Vue.set(variant, 'labels', [])
                    if (!variant.ean_sizes) Vue.set(variant, 'ean_sizes', [])
                    if (!variant.delivery_dates) Vue.set(variant, 'delivery_dates', [])
                    // Custom Props
                    if (!variant.extra_data) Vue.set(variant, 'extra_data', {})

                    Object.defineProperty(variant, 'currentImg', {
                        get: function() {
                            return variant.pictures[variant.imageIndex]
                        },
                    })
                    Object.defineProperty(variant, 'product', {
                        get: function() {
                            return product
                        },
                    })
                    Object.defineProperty(variant, 'product_id', {
                        get: function() {
                            return product.id
                        },
                    })

                    Object.defineProperty(variant, 'yourPrice', {
                        get: function() {
                            return product.yourPrice
                        },
                    })
                    Object.defineProperty(variant, 'getActiveSelectionInput', {
                        get: function() {
                            return product.getActiveSelectionInput.variants.find(x => x.id == variant.id)
                        },
                    })
                    Object.defineProperty(variant, 'action', {
                        get: function() {
                            return variant.getActiveSelectionInput.action
                        },
                    })
                    Object.defineProperty(variant, 'selectionAction', {
                        get: function() {
                            return variant.getActiveSelectionInput.selectionAction
                        },
                    })
                    Object.defineProperty(variant, 'deliveries', {
                        get: function() {
                            return variant.getActiveSelectionInput.deliveries
                        },
                    })

                    Object.defineProperty(variant, 'yourAction', {
                        get: function() {
                            if (!variant.getActiveSelectionInput) return
                            const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                            const selectionInput = variant.getActiveSelectionInput
                            return selectionInput[actionKey]
                        },
                        set: function(value) {
                            const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                            const selectionInput = variant.getActiveSelectionInput
                            return (selectionInput[actionKey] = value)
                        },
                    })

                    Object.defineProperty(variant, 'yourActionObject', {
                        get: function() {
                            if (!variant.getActiveSelectionInput) return
                            const selectionMode = rootGetters['selections/getCurrentSelectionMode']
                            const acitonObjectKey =
                                selectionMode == 'Feedback' ? 'yourSelectionFeedback' : 'selectionAction'
                            const selectionInput = variant.getActiveSelectionInput
                            return selectionInput[acitonObjectKey]
                        },
                        set: function(value) {
                            const actionKey = rootGetters['selections/getCurrentSelectionModeAction']
                            const selectionInput = variant.getActiveSelectionInput
                            return (selectionInput[actionKey] = value)
                        },
                    })

                    Object.defineProperty(variant, 'inStock', {
                        get: function() {
                            return !!variant.ean_sizes.find(sizeObj => sizeObj.inStock)
                        },
                    })

                    // EAN SIZES
                    variant.ean_sizes.map(x => {
                        Vue.set(x, 'quantity', 0)
                        Object.defineProperty(x, 'inStock', {
                            get() {
                                return x.quantity > 0
                            },
                        })
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
        SET_ALIGNMENTS(state, alignments) {
            alignments.map(alignment => {
                // Find the alignment object on the product
                const product = state.products.find(product => product.id == alignment.product_id)
                if (!product || !product.alignments) return
                const productAlignment = product.alignments.find(
                    productAlignment => productAlignment.selection_id == alignment.selection_id
                )
                delete alignment.user
                delete alignment.selection
                Object.assign(productAlignment, alignment)
            })
        },
        UPDATE_ACTIONS(state, { actions, newAction, user }) {
            // DESC: Sets all actions to the value of new action
            actions.forEach(action => {
                // Find the actions product
                const product = state.products.find(product => product.id == action.product_id)
                // If we didn't find the product, simply update the actions action
                if (!product) {
                    action.action = newAction
                    action.user_id = user.id
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.actionsRaw.find(x => x.selection_id == action.selection_id)
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user_id = user.id

                        // If the newaction is None or Out, remove any labels
                        if (['None', 'Out'].includes(newAction)) {
                            selectionAction.labels = []
                        }

                        const allVariantsOut = !selectionInput.variants.find(variant =>
                            ['In', 'Focus'].includes(variant.action)
                        )
                        const allVariantsND = !selectionInput.variants.find(variant => variant.action != 'None')

                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            // Check if an action for the variant already exists
                            if (allVariantsOut || allVariantsND) {
                                variant.action = newAction //OUT
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
                        // Delete user and selection from the action since we have it already as a calculated prop
                        delete action.user
                        delete action.selection
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
                    action.user_id = user.id
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.feedbacksRaw.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (selectionAction) {
                        selectionAction.action = newAction
                        selectionAction.user_id = user.id

                        // If the newaction is None or Out, remove any labels
                        if (['None', 'Out'].includes(newAction)) {
                            selectionAction.labels = []
                        }

                        const allVariantsOut = !selectionInput.variants.find(variant =>
                            ['In', 'Focus'].includes(variant.your_feedback)
                        )
                        const allVariantsND = !selectionInput.variants.find(variant => variant.your_feedback != 'None')
                        // Update variant actions - if the product is OUT no variant can be IN
                        selectionInput.variants.map(variant => {
                            if (allVariantsOut || allVariantsND) {
                                variant.your_feedback = newAction //OUT
                            }
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
                        // Delete user and selection from the action since we have it already as a calculated prop
                        delete action.user
                        delete action.selection
                        Object.assign(selectionAction, action)
                    }
                })
            })
        },

        SET_SELECTED_PRODUCTS(state, products) {
            state.selectedProducts = products
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
        SET_CURRENT_PDP_VARIANT_INDEX(state, index) {
            state.pdpVariantIndex = index
        },
        SET_QUANTITY(state, { alignment, variantId, deliveryDate, size, assortment, quantity }) {
            if (!alignment) return
            const existingQuantityDetail = alignment.quantity_details.find(detail => {
                if (variantId && detail.variant_id != variantId) return false
                if (deliveryDate && detail.delivery_date != deliveryDate) return false
                if (size && detail.variant_size != size) return false
                if (assortment && detail.assortment != assortment) return false
                return true
            })
            if (existingQuantityDetail) {
                existingQuantityDetail.quantity = quantity
            } else {
                alignment.quantity_details.push({
                    variant_id: variantId,
                    delivery_date: deliveryDate,
                    variant_size: size,
                    assortment,
                    quantity,
                })
            }
        },
    },
}
