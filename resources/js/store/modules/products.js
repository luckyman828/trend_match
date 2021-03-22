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
            const getSelectionInput = rootGetters['selectionProducts/getActiveSelectionInput']
            // Filters
            const filtersAreActive = rootGetters['productFilters/getFiltersAreActive']
            const exactMatch = rootGetters['productFilters/getIsExactMatch']
            const invertMatch = rootGetters['productFilters/getIsInverseMatch']
            const categories = rootGetters['productFilters/getFilterCategories']
            const deliveryDates = rootGetters['productFilters/getFilterDeliveryDates']
            const buyerGroups = rootGetters['productFilters/getFilterBuyerGroups']
            const brands = rootGetters['productFilters/getFilterBrands']
            const productLabels = rootGetters['productFilters/getFilterProductLabels']
            const variantLabels = rootGetters['productFilters/getFilterVariantLabels']
            const ticketLabels = rootGetters['productFilters/getFilterTicketLabels']
            const unreadOnly = rootGetters['productFilters/unreadOnly']
            const openTicketsOnly = rootGetters['productFilters/openTicketsOnly']
            const hideCompleted = rootGetters['productFilters/hideCompleted']
            const noImagesOnly = rootGetters['productFilters/noImagesOnly']
            const actionFilter = rootGetters['productFilters/getProductActionFilter']
            const customDataFilters = rootGetters['productFilters/getAllCustomValueFilters']
            const customFields = rootGetters['workspaces/getCustomProductFields']
            const hasAdvancedFilter = rootGetters['productFilters/getHasAdvancedFilter']
            const advancedFilters = rootGetters['productFilters/getAdvancedFilter']
            // Selection Specific
            const distributionScope = rootGetters['selectionProducts/getDistributionScope']
            const currentAction = rootGetters['selections/currentSelectionModeAction']
            const selectionMode = rootGetters['selections/currentSelectionMode']
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
            // Filter by product labels
            if (productLabels.length > 0) {
                const filteredByProductLabels = productsToReturn.filter(product => {
                    let shouldBeIncluded = true
                    if (exactMatch) {
                        productLabels.map(label => {
                            if (!product.labels.includes(label)) shouldBeIncluded = false
                        })
                        product.labels.map(label => {
                            if (!productLabels.includes(label)) shouldBeIncluded = false
                        })
                    } else {
                        shouldBeIncluded = !!productLabels.find(label => {
                            if (label == 'no label') return product.labels.length <= 0
                            return product.labels.includes(label)
                        })
                    }
                    return shouldBeIncluded
                })
                productsToReturn = filteredByProductLabels
            }
            // Filter by product labels
            if (variantLabels.length > 0) {
                const filteredByVariantLabels = productsToReturn.filter(product => {
                    let shouldBeIncluded = false
                    product.variants.map(variant => {
                        if (exactMatch) {
                            let includeVariant = true
                            variantLabels.map(label => {
                                if (!variant.labels.includes(label)) includeVariant = false
                            })
                            variant.labels.map(label => {
                                if (!variantLabels.includes(label)) includeVariant = false
                            })
                            if (includeVariant) shouldBeIncluded = true
                        } else {
                            if (
                                !!variantLabels.find(label => {
                                    if (label == 'no label') return variant.labels.length <= 0
                                    return variant.labels.includes(label)
                                })
                            ) {
                                shouldBeIncluded = true
                            }
                        }
                    })
                    return shouldBeIncluded
                })
                productsToReturn = filteredByVariantLabels
            }
            // Filter by ticket labels
            if (ticketLabels.length > 0) {
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
                })
                productsToReturn = filteredByTicketLabels
            }

            // Filter by custom values

            Object.keys(customDataFilters).map(filterKey => {
                // Get details about the key
                const filterValues = customDataFilters[filterKey]
                if (filterValues.length <= 0) return

                const customField = customFields.find(field => field.name == filterKey)
                const checkIfObjectShouldBeIncluded = object => {
                    if (Array.isArray(object.extra_data[filterKey])) {
                        if (object.extra_data[filterKey].find(x => filterValues.includes(x))) {
                            return true
                        }
                    } else if (filterValues.includes(object.extra_data[filterKey])) {
                        return true
                    }
                    return false
                }

                productsToReturn = productsToReturn.filter(product => {
                    let include = false
                    if (customField.belong_to == 'Variant') {
                        product.variants.map(variant => {
                            if (checkIfObjectShouldBeIncluded(variant)) {
                                include = true
                            }
                        })
                    } else {
                        include = checkIfObjectShouldBeIncluded(product)
                    }
                    return include
                })
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

            if (invertMatch && filtersAreActive) {
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
            let productsToReturn = [...products]
            const buyView = rootGetters['productFilters/getBuyView']
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
                        console.log('products created', response.data)
                        products.map(product => {
                            product.id = response.data.added_product_id_map[product.datasource_id]
                        })

                        if (addToState) {
                            commit('insertProducts', { products, method: 'add' })
                            await dispatch('initProducts', products)
                            commit('SORT_PRODUCTS')
                        }

                        // SYNC IMAGES
                        dispatch('files/syncExternalImages', { file, products }, { root: true })

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
                labels: [],
            }
        },
        instantiateNewProductVariant({ commit }) {
            return {
                id: null,
                color: null,
                variant: null,
                delivery_dates: [],
                ean_sizes: [],
                extra_data: {},
                min_order: null,
                labels: [],
                pictures: [],
                style_option_id: null,
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
                product.variants.forEach((variant, variantIndex) => {
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
                    Object.defineProperty(variant, 'yourPrice', {
                        get: function() {
                            return product.yourPrice
                        },
                    })
                    Object.defineProperty(variant, 'getActiveSelectionInput', {
                        get: function() {
                            return product.getActiveSelectionInput.variants[variantIndex]
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

                    // EAN SIZES
                    variant.ean_sizes.map(x => {
                        Vue.set(x, 'quantity', 0)
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
