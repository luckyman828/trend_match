import axios from 'axios'

export default {
    namespaced: true,

    state: {
        // currentVideo: {
        //     name: 'Test Video',
        //     id: 1,
        //     providerVideoId: 'SoonHVLkz2Q',
        //     provider: 'Youtube',
        // },
        currentVideo: {
            name: 'Test Livestream',
            id: 1,
            // Youtube live
            // providerVideoId: 'Hp0wvlk7shg',
            // provider: 'Youtube',
            // Vimeo live
            providerVideoId: '468992739',
            provider: 'Vimeo',
        },
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
        zoomLevels: [1, 2, 4, 8, 16, 32],
    },

    getters: {
        getCurrentVideo: state => state.currentVideo,
        getSearchItemDragActive: state => state.searchItemDragActive,
        getVideoTimings: state => state.videoTimings,
        getTimelineZoom: state => state.timelineZoom,
        getTimelineRail: state => state.timelineRail,
        getTimelineEl: state => state.timelineEl,
        // getSnapThreshold: (state, getters) => state.snapThreshold / getters.getTimelineZoom, // Manually set snap threshold
        getSnapThreshold: (state, getters, rootState, rootGetters) =>
            rootGetters['videoPlayer/getDuration'] / 32 / getters.getTimelineZoom, // Threshold relative to video length
        getZoomLevels: state => state.zoomLevels,
    },

    actions: {
        setVideoByURL({ getters, commit }, { video, url }) {
            const domainRegex = new RegExp(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^.\/\n?]+)/)
            const providerMatches = url.match(domainRegex)
            if (providerMatches.length < 2) return false
            const provider = providerMatches[1]
            const providerCapitalized = provider.charAt(0).toUpperCase() + provider.slice(1)

            let videoIdRegex
            if (provider == 'vimeo') {
                videoIdRegex = new RegExp(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?(?:[^:\/\n?]+)\/([0-9]*)/)
            }
            if (provider == 'youtube') {
                videoIdRegex = new RegExp(
                    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?(?:[^:\/\n?]+)\/watch\?v=(([A-z]|[0-9])*)/
                )
            }

            const videoIdMatches = url.match(videoIdRegex)
            if (videoIdMatches.length < 2) return false
            const videoId = videoIdMatches[1]

            video.provider = providerCapitalized
            video.providerVideoId = videoId
        },
        addTiming({ getters, commit, dispatch, rootGetters }, { newTiming }) {
            dispatch('initTimings', [newTiming])
            const allTimings = getters.getVideoTimings
            // First find out what index to give the new timing, so we insert it at it's correct spot
            // We will insert the new timing at the current timestamp
            let index = 0
            const timestamp = rootGetters['videoPlayer/getTimestamp']
            // Set the desired `start` time equal to the timestamp
            const desiredDuration = (newTiming.end - newTiming.start) * (1 / getters.getTimelineZoom)
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
            dispatch('bumpConflictingTimings', newTiming)
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
        removeTiming({ getters, commit }, index) {
            // const allTimings = getters.getVideoTimings
            // const timingToRemove = allTimings[index]
            // const timingsAfter = allTimings.slice(index + 1)
            // // Shuffle timings around
            // timingsAfter.map(timing => {
            //     timing.start -= timingToRemove.duration
            // })
            commit('REMOVE_TIMING', index)
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
        SET_VIDEO(state, { videoId, provider }) {
            state.videoId = videoId
            state.provider = provider
        },
        SET_VIDEO_TIMINGS(state, timings) {
            state.videoTimings = timings
        },
        ADD_TIMING(state, { timing, index }) {
            if (index != null) {
                state.videoTimings.splice(index, 0, timing)
            } else {
                state.videoTimings.push(timing)
            }
        },
        REMOVE_TIMING(state, index) {
            state.videoTimings.splice(index, 1)
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
    },
}
