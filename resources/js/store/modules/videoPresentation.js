import axios from 'axios'

export default {
    namespaced: true,

    state: {
        currentVideo: null,
        status: 'success',
        timingStatus: 'success',
        // currentVideo: {
        //     name: 'Test Video',
        //     id: 1,
        //     providerVideoId: 'SoonHVLkz2Q',
        //     provider: 'Youtube',
        // },
        // currentVideo: {
        //     name: 'Test Livestream',
        //     id: 1,
        //     // Youtube live
        //     // providerVideoId: 'Hp0wvlk7shg',
        //     // provider: 'Youtube',
        //     // Vimeo live
        //     providerVideoId: '468992739',
        //     provider: 'Vimeo',
        // },
        searchItemDragActive: false,
        videoTimings: [],
        // videoTimings: [
        //     {
        //         id: 1,
        //         start: 3,
        //         end: 24,
        //         product_id: '750475784351613090',
        //     },
        //     {
        //         id: 2,
        //         start: 24,
        //         end: 46,
        //         product_id: '748096819460718599',
        //     },
        // ],
        timingId: 0,
        timelineZoom: 1,
        timelineRail: null,
        timelineEl: null,
        snapThreshold: 12, // In seconds
        zoomLevels: [1, 2, 4, 8, 16, 32, 64],
        sidebarProduct: null,
    },

    getters: {
        getCurrentVideoRootobject: state => state.currentVideo,
        getCurrentVideo: state => state.currentVideo && state.currentVideo.video,
        getStatus: state => state.status,
        getTimingStatus: state => state.timingStatus,
        getSearchItemDragActive: state => state.searchItemDragActive,
        getVideoTimings: state => state.currentVideo && state.currentVideo.timings,
        getTimelineZoom: state => state.timelineZoom,
        getTimelineRail: state => state.timelineRail,
        getTimelineEl: state => state.timelineEl,
        // getSnapThreshold: (state, getters) => state.snapThreshold / getters.getTimelineZoom, // Manually set snap threshold
        getSnapThreshold: (state, getters, rootState, rootGetters) =>
            rootGetters['videoPlayer/getDuration'] / 32 / getters.getTimelineZoom, // Threshold relative to video length
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
        getSidebarProduct: state => state.sidebarProduct,
    },

    actions: {
        async fetchFileVideo({ dispatch }, fileId) {
            const apiUrl = `/files/${fileId}/video`
            let video
            await axios.get(apiUrl).then(response => {
                video = response.data
                // Sort the timings
                video.timings.sort((a, b) => (a.start_at_ms > b.start_at_ms ? 1 : -1))
                // Init the videos timings
                dispatch('initTimings', video.timings)
            })
            return video
        },
        async setVideoByURL({ getters, commit }, { file, url }) {
            // Set the curent video status
            commit('SET_STATUS', 'saving')

            const domainRegex = new RegExp(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^.\/\n?]+)/)
            const providerMatches = url.match(domainRegex)
            if (providerMatches.length < 2) return false
            let provider = providerMatches[1]

            console.log('get video from URL', url, provider)

            let videoIdRegex
            if (provider == 'vimeo') {
                // Check if it is a private link.
                // To test if the link is a private link we can count the number of / (forward slashes) in the URL.
                const slashCount = (url.match(/\//g) || []).length
                const isPrivateLink = slashCount >= 4
                if (isPrivateLink) videoIdRegex = new RegExp(/^(.*)$/)
                else videoIdRegex = new RegExp(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?(?:[^:\/\n?]+)\/([0-9]*)/)
            }
            if (provider == 'youtube') {
                videoIdRegex = new RegExp(
                    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?(?:[^:\/\n?]+)\/watch\?v=(([A-z]|[0-9]|\-)*)/
                )
                console.log('provider is youtube', url, provider)
            }
            if (provider == 'youtu') {
                provider = 'youtube'
                videoIdRegex = new RegExp(/(?:\.be\/)(.*)/)
                console.log('provider is youtu', url, provider)
            }

            const videoIdMatches = url.match(videoIdRegex)
            if (videoIdMatches.length < 2) return false
            const videoId = videoIdMatches[1]

            let newVideo = {
                video: {
                    provider,
                    identifier: videoId,
                },
                timings: [],
                published: false,
            }

            // Save to the API
            const apiUrl = `/files/${file.id}/video`
            await axios
                .post(apiUrl, newVideo)
                .then(response => {
                    Object.assign(newVideo, response.data)
                    commit('SET_CURRENT_VIDEO', newVideo)
                })
                .catch(err => {
                    commit('SET_STATUS', 'error')
                })
        },
        async updateCurrentVideo({ getters, rootGetters, commit }) {
            const file = rootGetters['files/currentFile']
            const video = getters.getCurrentVideoRootobject
            const apiUrl = `/files/${file.id}/video`

            // Set the curent video status
            commit('SET_STATUS', 'saving')

            // Clean the timings end and start by flooring to whole Integers
            video.timings.map(timing => {
                timing.start = Math.round(timing.start)
                timing.end = Math.round(timing.end)
            })

            // Sort the timings by start
            video.timings.sort((a, b) => {
                return a.start > b.start ? 1 : -1
            })

            await axios
                .post(apiUrl, video)
                .then(response => {
                    commit('SET_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_STATUS', 'error')
                })
        },
        async updateVideoThumbnail({}, video) {
            const apiUrl = `/videos/${video.id}`
            await axios.put(apiUrl, {
                thumbnail: video.thumbnail,
            })
        },
        async addTiming({ getters, commit, dispatch, rootGetters }, { newTiming }) {
            commit('SET_TIMING_STATUS', 'adding')
            await dispatch('initTimings', [newTiming])
            const allTimings = getters.getVideoTimings
            // First find out what index to give the new timing, so we insert it at it's correct spot
            // We will insert the new timing at the current timestamp
            let index = 0
            const timestamp = rootGetters['videoPlayer/getTimestamp']
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
            const conflictingTiming = allTimings.find(x => x.start < timestamp && x.end > timestamp)
            if (conflictingTiming) {
                index = conflictingTiming.index + 1
                newTiming.start = conflictingTiming.end
                newTiming.end = newTiming.start + desiredDuration
            }
            commit('ADD_TIMING', { timing: newTiming, index })
            await dispatch('bumpConflictingTimings', newTiming)
            // Done bumping
            await dispatch('updateCurrentVideo')
            commit('SET_TIMING_STATUS', 'success')
        },
        bumpConflictingTimings({ getters, dispatch }, newTiming) {
            // This function recursively bumps timings until there is space for all of them
            // It does nothing if my conflictin timings are found
            const conflictingTimings = getters.getVideoTimings.filter(
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
            dispatch('updateCurrentVideo')
        },
        initTimings({ state, getters, rootGetters }, timings) {
            timings.map(timing => {
                // Give the timing an ID
                Vue.set(timing, 'id', state.timingId)
                state.timingId++

                Object.defineProperty(timing, 'product', {
                    get() {
                        const products = rootGetters['products/products']
                        return products.find(x => x.id == timing.product_id)
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
                        const allTimings = getters.getVideoTimings
                        return allTimings.findIndex(x => x.id == timing.id)
                    },
                })
                Object.defineProperty(timing, 'nextTiming', {
                    get() {
                        const allTimings = getters.getVideoTimings
                        return allTimings[timing.index + 1]
                    },
                })
                Object.defineProperty(timing, 'prevTiming', {
                    get() {
                        const allTimings = getters.getVideoTimings
                        return allTimings[timing.index - 1]
                    },
                })
                Object.defineProperty(timing, 'timeToPrev', {
                    get() {
                        if (!timing.prevTiming) return 0
                        const allTimings = getters.getVideoTimings
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
        SET_SEARCH_ITEM_DRAG_ACTIVE(state, bool) {
            state.searchItemDragActive = bool
        },
        SET_CURRENT_VIDEO(state, video) {
            state.currentVideo = video
        },
        SET_VIDEO_TIMINGS(state, timings) {
            if (!state.currentVideo) return
            state.currentVideo.timings = timings
        },
        ADD_TIMING(state, { timing, index }) {
            if (index != null) {
                state.currentVideo.timings.splice(index, 0, timing)
            } else {
                console.log('push timing', timing)
                state.currentVideo.timings.push(timing)
            }
        },
        REMOVE_TIMING(state, index) {
            state.currentVideo.timings.splice(index, 1)
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
        SET_SIDEBAR_PRODUCT(state, product) {
            state.sidebarProduct = product
        },
    },
}
