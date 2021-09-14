import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        presentation: null,
        video: null,
        timings: [],
        timingsReady: false,
        pdpItem: null,

        // OLD
        sidebarProduct: null,
        status: 'success',
        timingStatus: 'success',
        searchItemDragActive: false,
        timelineZoom: 1,
        timelineRail: null,
        timelineEl: null,
        snapThreshold: 12, // In seconds
        zoomLevels: [1, 2, 4, 8, 16, 32, 64],
    },

    getters: {
        getPresentation: state => state.presentation,
        getVideo: state => state.video,
        getTimings: state => state.timings,
        getSidebarProduct: state => state.sidebarProduct,
        getPdpItem: state => state.pdpItem,
        getIsLive: state => false,
        getTimingsReady: state => state.timingsReady,

        // TIMING SPECIFIC
        getCurrentTimingIndex: (state, getters, rootState, rootGetters) => {
            const timings = getters.getTimings
            const timestamp = rootGetters['player/getTimestamp']

            // // Find the first timing that intersects our current timestamp
            // const timingIndex = timings.findIndex(timing => timing.start < timestamp && timing.end > timestamp)

            // // Loop backwards through our timings to find the last match that is before our timestamp
            let timingIndex = -1
            for (let i = timings.length - 1; i >= 0; i--) {
                const timing = timings[i]
                if (timing.start <= timestamp) {
                    timingIndex = i
                    break
                }
            }
            return timingIndex
        },
        getCurrentTiming: (state, getters, rootState, rootGetters) => {
            const timings = getters.getTimings
            const timestamp = rootGetters['player/getTimestamp']
            if (!timings || timings.length <= 0) return
            const isLive = getters.getIsLive

            // If LIVE, return the last timing, if that timing
            if (isLive) {
                const lastTiming = timings[timings.length - 1]
                const lastIsCurrent = lastTiming.start <= timestamp && lastTiming.end >= timestamp
                if (lastIsCurrent) return lastTiming
            }
            return timings
                .slice()
                .reverse()
                .find(x => x.start <= timestamp && x.end > timestamp)
        },
        getCurrentProduct: (state, getters) => {
            const currentTiming = getters.getCurrentTiming
            if (!currentTiming) return
            return currentTiming.product
        },
        getCurrentVariant: (state, getters) => getters.getCurrentProduct && getters.getCurrentProduct.variants[0],

        // OLD
        getCurrentVideoRootobject: state => state.currentVideo,
        getCurrentVideo: state => state.currentVideo,
        getStatus: state => state.status,
        getTimingStatus: state => state.timingStatus,
        getSearchItemDragActive: state => state.searchItemDragActive,
        getTimelineZoom: state => state.timelineZoom,
        getTimelineRail: state => state.timelineRail,
        getTimelineEl: state => state.timelineEl,
        // getSnapThreshold: (state, getters) => state.snapThreshold / getters.getTimelineZoom, // Manually set snap threshold
        getSnapThreshold: (state, getters, rootState, rootGetters) =>
            rootGetters['player/getDuration'] / 32 / getters.getTimelineZoom, // Threshold relative to video length
        getZoomLevels: (state, getters, rootState, rootGetters) => {
            // const arr = [1]
            // const duration = rootGetters['videoPlayer/getDuration']
            // if (!duration) return arr
            // const levelCount = Math.ceil(Math.pow(duration, 1 / 4))
            // for (let i = 1; i < levelCount; i++) {
            //     arr.push(Math.pow(2, i))
            // }
            // return arr
            return state.zoomLevels
        },
    },

    actions: {
        async fetchPresentation({ dispatch, commit }, presentationId) {
            const presentation = await dispatch('files/fetchFile', presentationId, { root: true })
            await dispatch('playPresentations/initPresentations', [presentation], { root: true })
            commit('SET_PRESENTATION', presentation)

            if (presentation.video_count > 0) {
                await dispatch('fetchPresentationVideo', presentationId)
            }

            return presentation
        },

        async fetchPresentationVideo({ dispatch, commit }, presentationId) {
            commit('SET_TIMINGS_READY', false)
            // Fetch presentation video
            const apiUrl = `/files/${presentationId}/video`
            let video
            await axios
                .get(apiUrl)
                .then(async response => {
                    const presentation = response.data.file
                    Vue.set(presentation, 'id', presentationId)
                    commit('SET_PRESENTATION', presentation)

                    commit('workspaces/SET_PLAY_SHOP', response.data.workspace.play_shop, { root: true })

                    video = response.data.video
                    commit('SET_VIDEO', video)

                    const timings = response.data.timings

                    // Extract looks
                    const looks = []
                    for (const timing of timings) {
                        if (!timing.product_group_id) continue
                        const existsInArray = looks.find(group => group.id == timing.product_group_id)
                        if (existsInArray) continue
                        const productGroup = {
                            id: timing.product_group_id,
                            name: `timing: ${timing.id}`,
                            variants: [...timing.variants],
                        }
                        looks.push(productGroup)
                    }
                    await dispatch('productGroups/initProductGroups', looks, { root: true })
                    commit('productGroups/SET_PRODUCT_GROUPS', looks, { root: true })

                    // Sort the timings
                    timings.sort((a, b) => (a.start_at_ms > b.start_at_ms ? 1 : -1))
                    // Init the videos timings
                    await dispatch('initTimings', timings)
                    commit('SET_TIMINGS', timings)
                    commit('SET_TIMINGS_READY', true)

                    const products = response.data.products
                    await dispatch('products/initProducts', products, { root: true })
                    commit('products/SET_PRODUCTS', products, { root: true })

                    const workspace = response.data.workspace
                    Vue.set(presentation, 'workspace', workspace)
                })
                .catch(err => {
                    commit('SET_STATUS', err.status)
                })
            return video
        },
        async updatePresentation({ getters, rootGetters, commit }) {
            const file = rootGetters['files/currentFile']
            const video = getters.getVideo
            const timings = getters.getTimings
            const apiUrl = `/files/${file.id}/video`

            // Set the curent video status
            commit('SET_STATUS', 'saving')

            // Clean the timings end and start by flooring to whole Integers
            timings.map(timing => {
                timing.start = Math.round(timing.start)
                timing.end = Math.round(timing.end)
            })

            // Sort the timings by start
            timings.sort((a, b) => {
                return a.start > b.start ? 1 : -1
            })

            // const timingsToPost = timings.map(timing => {
            //     const cleanTiming = Object.assign({}, timing)
            //     delete cleanTiming.id
            //     delete cleanTiming.initDone
            //     return cleanTiming
            // })

            // const videoToPost = Object.assign({}, video)
            // delete videoToPost.urls
            // delete videoToPost.status

            await axios
                .post(apiUrl, {
                    video,
                    timings,
                    published: true,
                })
                .then(response => {
                    // Make sure the timings have an ID
                    if (response.data.timings) {
                        response.data.timings.map((responseTiming, index) => {
                            Vue.set(timings[index], 'id', responseTiming.id)
                        })
                    }
                    commit('SET_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_STATUS', 'error')
                })
        },
        async syncExternalProducts({ dispatch, getters }) {
            const products = await dispatch('bonaparte/fetchWebshopProductsFromFeed', null, { root: true })
            await dispatch(
                'products/insertProducts',
                { file: getters.getPresentation, products, addToState: true },
                { root: true }
            )
        },

        // OLD

        async updateVideoThumbnail({}, video) {
            const apiUrl = `/videos/${video.id}`
            await axios.put(apiUrl, {
                thumbnail: video.thumbnail,
            })
        },
        async addTiming({ getters, commit, dispatch, rootGetters }, { newTiming }) {
            commit('SET_TIMING_STATUS', 'adding')
            if (!newTiming.start_at_ms) newTiming.start_at_ms = 0
            if (!newTiming.end_at_ms) newTiming.end_at_ms = 5

            await dispatch('initTimings', [newTiming])

            console.log('new timing after init', newTiming)
            const allTimings = getters.getTimings
            // First find out what index to give the new timing, so we insert it at it's correct spot
            // We will insert the new timing at the current timestamp
            let index = 0
            const timestamp = rootGetters['player/getTimestamp']
            // Set the desired `start` time equal to the timestamp

            const desiredDuration = Math.ceil((newTiming.end - newTiming.start) * (1 / getters.getTimelineZoom))
            newTiming.start = timestamp
            newTiming.end = newTiming.start + desiredDuration

            // Find the last timing that ends before this timestamp
            const prevTiming = allTimings
                .slice()
                .reverse()
                .find(x => x.end < timestamp)

            if (prevTiming) {
                index = prevTiming.index + 1
            }

            const conflictingTimings = allTimings.filter(
                x =>
                    (newTiming.start >= x.start && newTiming.start < x.end) || // New timing start is inside another timing
                    (newTiming.end < x.end && newTiming.end > x.start) || // New timing end is inside another timing
                    (x.start > newTiming.start && x.end < newTiming.end) || // Another timing is entirely inside new timing
                    (newTiming.start > x.start && newTiming.end < x.end) // New timing is entirely inside another timing
            )
            const conflictingTiming = conflictingTimings.reduce((first, current) => {
                return current.start < first.start ? current : first
            }, conflictingTimings[0])
            const minDuration = 1
            if (conflictingTiming) {
                // Place befoe
                const placeBefore = newTiming.start < conflictingTiming.start
                if (placeBefore) {
                    // const nextTiming = allTimings[newTiming.index + 1]
                    const nextTiming = conflictingTiming
                    newTiming.end = nextTiming.start
                }

                // Place after
                else {
                    index = conflictingTiming.index + 1
                    newTiming.start = conflictingTiming.end
                    newTiming.end = newTiming.start + desiredDuration
                    // Check if there is a new conflict with the next timing
                    const nextTiming = allTimings[conflictingTiming.index + 1]
                    if (nextTiming && nextTiming.start < newTiming.end) {
                        newTiming.end = nextTiming.start
                    }
                }
            }
            if (newTiming.duration < minDuration) {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Duration too short',
                        iconClass: 'far fa-info-circle',
                        type: 'info',
                    },
                    { root: true }
                )
                return
            }
            commit('ADD_TIMING', { timing: newTiming, index })
            await dispatch('bumpConflictingTimings', newTiming)
            // Done bumping
            await dispatch('updatePresentation')
            commit('SET_TIMING_STATUS', 'success')
        },
        async updateTiming({ dispatch }, timing) {
            const newVariantMaps = []
            for (const variantMap of timing.productGroup.variantMaps) {
                const newVariantMap = {
                    product_id: variantMap.product_id,
                    variant_id: variantMap.variant_id,
                }
                await dispatch('initVariantMaps', [newVariantMap])
                newVariantMaps.push(newVariantMap)
            }
            timing.variants = newVariantMaps
        },
        bumpConflictingTimings({ getters, dispatch }, newTiming) {
            // This function recursively bumps timings until there is space for all of them
            // It does nothing if my conflictin timings are found
            const conflictingTimings = getters.getTimings.filter(
                x => x.id != newTiming.id && x.end > newTiming.start && x.start < newTiming.end
            )
            conflictingTimings.map(timing => {
                const delta = newTiming.end - timing.start
                timing.start += delta
                timing.end += delta
                // Call the function recursively until there are no more conflicts
                dispatch('bumpConflictingTimings', timing)
            })
        },
        removeTiming({ getters, commit, dispatch }, index) {
            commit('REMOVE_TIMING', index)
            dispatch('updatePresentation')
        },
        removeTimings({ getters, commit, dispatch }, timings) {
            for (const timing of timings) {
                const index = getters.getTimings.findIndex(stateTiming => stateTiming.id == timing.id)
                commit('REMOVE_TIMING', index)
            }
            dispatch('updatePresentation')
        },
        initVariantMaps({ rootGetters }, variantMaps) {
            variantMaps.map(variantMap => {
                Object.defineProperty(variantMap, 'product', {
                    get() {
                        const products = rootGetters['products/products']
                        return products.find(product => product.id == variantMap.product_id)
                    },
                })
                Object.defineProperty(variantMap, 'variant', {
                    get() {
                        return variantMap.product.variants.find(variant => variant.id == variantMap.variant_id)
                    },
                })
            })
        },
        async initTimings({ state, getters, rootGetters, dispatch }, timings) {
            for (const timing of timings) {
                if (!timing.variants) Vue.set(timing, 'variants', [])

                Object.defineProperty(timing, 'type', {
                    get() {
                        return !!parseInt(timing.product_group_id) ? 'Look' : 'Single'
                    },
                })

                Object.defineProperty(timing, 'productGroup', {
                    get() {
                        if (!timing.product_group_id) return
                        return rootGetters['productGroups/getProductGroups'].find(
                            group => group.id == timing.product_group_id
                        )
                    },
                })

                Object.defineProperty(timing, 'product', {
                    get() {
                        if (timing.type == 'Single') {
                            if (timing.variants.length <= 0) return
                            const products = rootGetters['products/products']
                            return products.find(product => product.id == timing.variants[0].product_id)
                        }
                        if (timing.type == 'Look') {
                            if (
                                !timing.productGroup ||
                                (timing.productGroup &&
                                    (timing.productGroup.variantMaps.length <= 0 || !timing.productGroup.variantMaps))
                            )
                                return
                            return timing.productGroup.variantMaps[0].product
                        }
                    },
                })
                Object.defineProperty(timing, 'variant', {
                    get() {
                        if (timing.type == 'Single') {
                            if (!timing.product) return
                            return timing.product.variants.find(variant => variant.id == timing.variants[0].variant_id)
                        }
                        if (timing.type == 'Look') {
                            if (timing.productGroup && timing.productGroup.variantMaps.length <= 0) return
                            return timing.productGroup.variantMaps[0].variant
                        }
                    },
                })
                Object.defineProperty(timing, 'variantList', {
                    get() {
                        if (timing.type == 'Single') {
                            return [timing.variant]
                        }
                        if (timing.type == 'Look') {
                            return timing.productGroup.variantMaps.map(variantMap => variantMap.variant)
                        }
                    },
                })

                Object.defineProperty(timing, 'start', {
                    get() {
                        return timing.start_at_ms
                    },
                    set(value) {
                        timing.start_at_ms = value
                    },
                })
                Object.defineProperty(timing, 'end', {
                    get() {
                        return timing.end_at_ms
                    },
                    set(value) {
                        timing.end_at_ms = value
                    },
                })
                Object.defineProperty(timing, 'duration', {
                    get() {
                        return timing.end - timing.start
                    },
                })
                Object.defineProperty(timing, 'startObj', {
                    get() {
                        return Duration.fromMillis(timing.start * 1000)
                            .shiftTo('hours', 'minutes', 'seconds')
                            .toObject()
                    },
                })
                Object.defineProperty(timing, 'endObj', {
                    get() {
                        return Duration.fromMillis(timing.end * 1000)
                            .shiftTo('hours', 'minutes', 'seconds')
                            .toObject()
                    },
                })
                Object.defineProperty(timing, 'index', {
                    get() {
                        const allTimings = getters.getTimings
                        return allTimings.findIndex(x => x.id == timing.id)
                    },
                })
                Object.defineProperty(timing, 'nextTiming', {
                    get() {
                        const allTimings = getters.getTimings
                        return allTimings[timing.index + 1]
                    },
                })
                Object.defineProperty(timing, 'prevTiming', {
                    get() {
                        const allTimings = getters.getTimings
                        return allTimings[timing.index - 1]
                    },
                })
                Object.defineProperty(timing, 'timeToPrev', {
                    get() {
                        if (!timing.prevTiming) return 0
                        const allTimings = getters.getTimings
                        return timing.start - timing.prevTiming.end
                    },
                })
                Object.defineProperty(timing, 'isCurrent', {
                    get() {
                        const currentTiming = getters.getCurrentTiming
                        if (!currentTiming) return false
                        return currentTiming.id == timing.id
                    },
                })
                timing.initDone = true
            }
        },
        getTimestampFromMouseEvent({ getters, rootGetters }, mouseEvent) {
            const mouseX = mouseEvent.clientX
            const rail = getters.getTimelineRail
            const railRect = rail.getBoundingClientRect()
            const adjustedX = mouseX - railRect.left + rail.scrollLeft
            const durationPerc = adjustedX / railRect.width
            const timestamp = rootGetters['player/getDuration'] * durationPerc
            return timestamp
        },
    },

    mutations: {
        SET_PRESENTATION(state, presentation) {
            state.presentation = presentation
        },
        SET_VIDEO(state, video) {
            state.video = video
        },
        SET_TIMINGS(state, timings) {
            state.timings = timings ? timings : []
        },
        ADD_TIMING(state, { timing, index }) {
            if (index != null) {
                state.timings.splice(index, 0, timing)
            } else {
                state.timings.push(timing)
            }
        },
        REMOVE_TIMING(state, index) {
            state.timings.splice(index, 1)
        },
        SET_PDP_ITEM(state, item) {
            state.pdpItem = item
        },
        SET_TIMINGS_READY(state, payload) {
            state.timingsReady = payload
        },

        // OLD
        SET_SIDEBAR_PRODUCT(state, product) {
            state.sidebarProduct = product
        },

        SET_SEARCH_ITEM_DRAG_ACTIVE(state, bool) {
            state.searchItemDragActive = bool
        },
        SET_TIMELINE_ZOOM(state, zoom) {
            state.timelineZoom = zoom
        },
        SET_TIMELINE_RAIL(state, rail) {
            state.timelineRail = rail
        },
        SET_TIMELINE_EL(state, el) {
            state.timelineEl = el
        },
        SET_STATUS(state, newStatus) {
            state.status = newStatus
        },
        SET_TIMING_STATUS(state, status) {
            state.timingStatus = status
        },
    },
}
