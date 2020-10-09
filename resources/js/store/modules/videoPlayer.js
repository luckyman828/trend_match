export default {
    namespaced: true,

    state: {
        playerProvider: null,
        player: null,
        timestamp: 0,
        duration: 0,
        status: null,
        iframe: null,
        isMuted: false,
        isPlaying: false,
        desiredStatus: 'playing',
        isSeeking: false,
        timelineKnobIsBeingDragged: false,
        providerMap: {
            Vimeo: {
                play: 'play',
                pause: 'pause',
                mute: 'setVolume',
                unMute: 'setVolume',
                seekTo: 'setCurrentTime',
                getTimestamp: 'getCurrentTime',
            },
            Youtube: {
                play: 'playVideo',
                pause: 'pauseVideo',
                mute: 'mute',
                unMute: 'unMute',
                seekTo: 'seekTo',
                getTimestamp: 'getCurrentTime',
            },
        },
    },

    getters: {
        getProvider: (state, getters, rootState, rootGetters) => {
            const currentVideo = rootGetters['videoPresentation/getCurrentVideo']
            if (!currentVideo) return
            return currentVideo.provider
        },
        getProviderVideoId: (state, getters, rootState, rootGetters) => {
            const currentVideo = rootGetters['videoPresentation/getCurrentVideo']
            if (!currentVideo) return
            return currentVideo.providerVideoId
        },
        getProviderMap: (state, getters) => state.providerMap[getters.getProvider],
        getPlayer: state => state.player,
        getIsPlaying: state => state.status == 'playing',
        getDesiredStatus: state => state.desiredStatus,
        getTimestamp: state => state.timestamp,
        getDuration: state => state.duration,
        getStatus: state => state.status,
        getIframe: state => state.iframe,
        getIsMuted: state => state.isMuted,
        getIsSeeking: state => state.isSeeking,
        getTimelineKnobIsBeingDragged: state => state.timelineKnobIsBeingDragged,
        getCurrentTimingIndex: (state, getters, rootState, rootGetters) => {
            const timings = rootGetters['videoPresentation/getVideoTimings']
            if (!timings) return
            const timestamp = getters.getTimestamp

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
            const timings = rootGetters['videoPresentation/getVideoTimings']
            const timestamp = getters.getTimestamp
            return timings.find(x => x.start < timestamp && x.end > timestamp)
        },
    },

    actions: {
        async togglePlayerMuted({ commit, getters }, muteOverride) {
            const player = getters.getPlayer
            const providerMap = getters.getProviderMap
            const shouldBeMuted = !getters.getIsMuted || muteOverride
            commit('SET_PLAYER_MUTED', shouldBeMuted)
            if (shouldBeMuted) {
                await player[providerMap.mute](0)
            } else {
                await player[providerMap.mute](1)
            }
        },
        async togglePlaying({ commit, getters }) {
            const player = getters.getPlayer
            const providerMap = getters.getProviderMap
            if (getters.getStatus == 'playing') {
                commit('SET_DESIRED_STATUS', 'paused')
                player[providerMap.pause]()
            } else {
                if (getters.getTimestamp == getters.getDuration) commit('SET_CURRENT_PLAYER_TIMESTAMP', 0)
                commit('SET_DESIRED_STATUS', 'playing')
                player[providerMap.play]()
            }
        },
        async seekTo({ commit, getters }, timestamp) {
            const duration = getters.getDuration
            timestamp = Math.min(timestamp, duration)
            const player = getters.getPlayer
            const providerMap = getters.getProviderMap
            commit('SET_IS_SEEKING', true)
            commit('SET_CURRENT_PLAYER_TIMESTAMP', timestamp)
            await player[providerMap.seekTo](timestamp)
            commit('SET_IS_SEEKING', false)
        },
        async getCurrentTimestamp({ commit, getters }) {
            const player = getters.getPlayer
            const providerMap = getters.getProviderMap
            const timestamp = await player[providerMap.getTimestamp]()
            return timestamp
        },
    },

    mutations: {
        SET_PLAYER_PROVIDER(state, provider) {
            state.playerProvider = provider
        },
        SET_PLAYER_REFERENCE(state, player) {
            state.player = player
        },
        SET_CURRENT_PLAYER_TIMESTAMP(state, timestamp) {
            state.timestamp = timestamp
        },
        SET_PLAYER_DURATION(state, duration) {
            state.duration = duration
        },
        SET_PLAYER_STATUS(state, status) {
            state.status = status
        },
        SET_IFRAME_REFERENCE(state, iframeEl) {
            state.iframe = iframeEl
        },
        SET_PLAYER_MUTED(state, isMuted) {
            state.isMuted = isMuted
        },
        SET_IS_SEEKING(state, isSeeking) {
            state.isSeeking = isSeeking
        },
        SET_DESIRED_STATUS(state, status) {
            state.desiredStatus = status
        },
        SET_IS_DRAGGING(state, isDragging) {
            state.timelineKnobIsBeingDragged = isDragging
        },
    },
}
