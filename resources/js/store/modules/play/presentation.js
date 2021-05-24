import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        presentation: null,
        video: null,
        timings: [],
        sidebarProduct: null,
        timingsReady: false,

        // OLD
        status: 'success',
        timingStatus: 'success',
        searchItemDragActive: false,
        timingId: 0,
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
        getIsLive: state => false,
        getTimingsReady: state => state.timingsReady,

        // TIMING SPECIFIC
        getCurrentTimingIndex: (state, getters, rootState, rootGetters) => {
            const timings = getters.getTimings
            const timestamp = rootGetters['player/getTimestamp']

            // Loop backwards through our timings to find the last match that is before our timestamp
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
            console.log('presentation', JSON.parse(JSON.stringify(presentation)))
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
                    video = response.data.video
                    commit('SET_VIDEO', video)
                    const timings = response.data.timings
                    // Sort the timings
                    timings.sort((a, b) => (a.start_at_ms > b.start_at_ms ? 1 : -1))
                    // Init the videos timings
                    await dispatch('initTimings', timings)
                    commit('SET_TIMINGS', timings)
                    commit('SET_TIMINGS_READY', true)
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


            await axios
                .post(apiUrl, {
                    video,
                    timings: timings,
                })
                .then(response => {
                    commit('SET_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_STATUS', 'error')
                })
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
            await dispatch('initTimings', [newTiming])
            const allTimings = getters.getTimings
            // First find out what index to give the new timing, so we insert it at it's correct spot
            // We will insert the new timing at the current timestamp
            let index = 0
            const timestamp = rootGetters['videoPlayer/getTimestamp']
            // Set the desired `start` time equal to the timestamp
            const desiredDuration = Math.ceil((newTiming.end - newTiming.start) * (1 / getters.getTimelineZoom))
            console.log('desired duration', desiredDuration, newTiming.end, newTiming.start, getters.getTimelineZoom)
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

            const conflictingTiming = allTimings.find(
                x =>
                    (newTiming.start >= x.start && newTiming.start < x.end) ||
                    (newTiming.end < x.end && newTiming.end > x.start)
            )
            const minDuration = 1
            if (conflictingTiming) {
                // Place befoe
                const placeBefore = newTiming.start < conflictingTiming.start
                if (placeBefore) {
                    const nextTiming = allTimings[newTiming.index + 1]
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
        initTimings({ state, getters, rootGetters }, timings) {
            timings.map(timing => {
                // Give the timing an ID
                Vue.set(timing, 'id', state.timingId)
                state.timingId++
                if (!timing.product_ids) Vue.set(timing, 'product_ids', [])

                Object.defineProperty(timing, 'products', {
                    get() {
                        const products = rootGetters['products/products']
                        return products.filter(product => timing.product_ids.includes(product.id))
                    },
                })
                Object.defineProperty(timing, 'product', {
                    get() {
                        return timing.products[0]
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
                        const currentTiming = rootGetters['videoPlayer/getCurrentTiming']
                        if (!currentTiming) return false
                        return currentTiming.id == timing.id
                    },
                })
                timing.initDone = true
            })
        },
        getTimestampFromMouseEvent({ getters, rootGetters }, mouseEvent) {
            const mouseX = mouseEvent.clientX
            const rail = getters.getTimelineRail
            const railRect = rail.getBoundingClientRect()
            const adjustedX = mouseX - railRect.left + rail.scrollLeft
            const durationPerc = adjustedX / railRect.width
            const timestamp = rootGetters['videoPlayer/getDuration'] * durationPerc
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
        SET_SIDEBAR_PRODUCT(state, product) {
            state.sidebarProduct = product
        },
        SET_TIMINGS_READY(state, payload) {
            state.timingsReady = payload
        },

        // OLD

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
