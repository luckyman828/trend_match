import axios from 'axios'

export default {
    namespaced: true,

    state: {
        currentVideo: {
            name: 'Test Video',
            id: 1,
            providerVideoId: 'hGRii5f_uSc',
            provider: 'Youtube',
        },
        searchItemDragActive: false,
        videoTimings: [],
        timingClone: null,
        timingId: 0,
        timelineZoom: 1,
        timelineRail: null,
    },

    getters: {
        getCurrentVideo: state => state.currentVideo,
        getSearchItemDragActive: state => state.searchItemDragActive,
        getVideoTimings: state => state.videoTimings,
        getTimingClone: state => state.timingClone,
        getTimelineZoom: state => state.timelineZoom,
        getTimelineRail: state => state.timelineRail,
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

            console.log('set video by url', url, provider, providerCapitalized, videoId)

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
            const desiredDuration = newTiming.end - newTiming.start
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
            console.log('bump conflicting timings', newTiming.start, newTiming.end, conflictingTimings)
            conflictingTimings.map(timing => {
                console.log('i am conflicting', timing.start, timing.end)
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
        initTimings({ state, getters }, timings) {
            timings.map(timing => {
                // Give the timing an ID
                Vue.set(timing, 'id', state.timingId)
                state.timingId++

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
        SET_TIMING_CLONE(state, clone) {
            state.timingClone = clone
        },
        SET_TIMELINE_ZOOM(state, zoom) {
            state.timelineZoom = zoom
        },
        SET_TIMELINE_RAIL(state, rail) {
            state.timelineRail = rail
        },
    },
}
