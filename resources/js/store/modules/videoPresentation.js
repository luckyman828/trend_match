import axios from 'axios'

export default {
    namespaced: true,

    state: {
        currentVideo: {
            name: 'Test Video',
            id: 1,
            providerVideoId: '458294507',
            provider: 'Vimeo',
        },
        searchItemDragActive: false,
        videoTimings: [],
        timingClone: null,
        timingId: 0,
        timelineZoom: 3,
    },

    getters: {
        getCurrentVideo: state => state.currentVideo,
        getSearchItemDragActive: state => state.searchItemDragActive,
        getVideoTimings: state => state.videoTimings,
        getTimingClone: state => state.timingClone,
        getTimelineZoom: state => state.timelineZoom,
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
        addTiming({ getters, commit, dispatch }, { newTiming, index }) {
            // Set the start time of the new timing by the timing just before it
            const newIndex = index != null ? index : getters.getVideoTimings.length
            if (newIndex > 0) {
                const timingBefore = getters.getVideoTimings[newIndex - 1]
                newTiming.start = timingBefore.end
            }

            commit('ADD_TIMING', { timing: newTiming, index })
            dispatch('initTimings', [newTiming])
            // Shuffle timings around
            if (index) {
                const timingsToUpdate = getters.getVideoTimings.slice(index + 1)
                timingsToUpdate.map(timing => {
                    timing.start += newTiming.duration
                })
            }
        },
        removeTiming({ getters, commit }, index) {
            const allTimings = getters.getVideoTimings
            const timingToRemove = allTimings[index]
            const timingsAfter = allTimings.slice(index + 1)
            // Shuffle timings around
            timingsAfter.map(timing => {
                timing.start -= timingToRemove.duration
            })
            commit('REMOVE_TIMING', index)
        },
        initTimings({ state, getters }, timings) {
            timings.map(timing => {
                // Give the timing an ID
                Vue.set(timing, 'id', state.timingId)
                state.timingId++

                Object.defineProperty(timing, 'end', {
                    get() {
                        return timing.start + timing.duration
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
                Object.defineProperty(timing, 'timeToPrev', {
                    get() {
                        if (timing.index <= 0) return 0
                        const allTimings = getters.getVideoTimings
                        return timing.start - allTimings[timing.index - 1].end
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
    },
}
