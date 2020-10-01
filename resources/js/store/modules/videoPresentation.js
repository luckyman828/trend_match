import axios from 'axios'

export default {
    namespaced: true,

    state: {
        videoId: null,
        provider: null,
        searchItemDragActive: false,
        videoTimings: [],
        timingClone: null,
    },

    getters: {
        getSearchItemDragActive: state => state.searchItemDragActive,
        getVideoId: state => state.getVideoId,
        getProvider: state => state.provider,
        getVideoTimings: state => state.videoTimings,
        getTimingClone: state => state.timingClone,
    },

    actions: {
        addTiming({ getters, commit }, { newTiming, index }) {
            // Set the start time of the new timing by the timing just before it
            const newIndex = index != null ? index : getters.getVideoTimings.length
            if (newIndex > 0) {
                const timingBefore = getters.getVideoTimings[newIndex - 1]
                newTiming.start = timingBefore.end
            }

            commit('ADD_TIMING', { timing: newTiming, index })
            // Shuffle timings around
            if (index) {
                const timingsToUpdate = getters.getVideoTimings.slice(index + 1)
                timingsToUpdate.map(timing => {
                    timing.start += newTiming.duration
                })
            }
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
            Object.defineProperty(timing, 'end', {
                get() {
                    return timing.start + timing.duration
                },
            })
            if (index != null) {
                state.videoTimings.splice(index, 0, timing)
            } else {
                state.videoTimings.push(timing)
            }
        },
        SET_TIMING_CLONE(state, clone) {
            state.timingClone = clone
        },
    },
}
