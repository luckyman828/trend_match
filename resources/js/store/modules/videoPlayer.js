export default {
    namespaced: true,

    state: {
        playerProvider: null,
        player: null,
        videoType: 'static',
        timestamp: 0,
        duration: 0,
        status: null,
        iframe: null,
        isMuted: false,
        volume: 1,
        isPlaying: false,
        desiredStatus: 'paused',
        isSeeking: false,
        timelineKnobIsBeingDragged: false,
        providerMap: {
            vimeo: {
                play: 'play',
                pause: 'pause',
                mute: 'setVolume',
                unMute: 'setVolume',
                seekTo: 'setCurrentTime',
                getTimestamp: 'getCurrentTime',
                setVolume: 'setVolume',
                volumeMultiplier: 1,
            },
            youtube: {
                play: 'playVideo',
                pause: 'pauseVideo',
                mute: 'mute',
                unMute: 'unMute',
                seekTo: 'seekTo',
                getTimestamp: 'getCurrentTime',
                setVolume: 'setVolume',
                volumeMultiplier: 100,
            },
        },
        controlsHidden: false,
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
            return currentVideo.identifier
        },
        getVideoType: state => state.videoType,
        getIsLive: state => state.videoType == 'live',
        getProviderMap: (state, getters) => state.providerMap[getters.getProvider],
        getPlayer: state => state.player,
        getIsPlaying: state => state.status == 'playing',
        getDesiredStatus: state => state.desiredStatus,
        getTimestamp: state => state.timestamp,
        getDuration: state => state.duration,
        getStatus: state => state.status,
        getIframe: state => state.iframe,
        getIsMuted: state => state.isMuted,
        getVolume: state => state.volume,
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
            if (!timings || timings.length <= 0) return
            const isLive = getters.getIsLive
            const timestamp = getters.getTimestamp
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
        getControlsHidden: (state, getters) => state.controlsHidden && !!getters.getIsPlaying,
    },

    actions: {
        async togglePlayerMuted({ commit, getters }, muteOverride) {
            console.log('set player muted', muteOverride)
            const player = getters.getPlayer
            if (!player) return
            const providerMap = getters.getProviderMap
            const shouldBeMuted = !getters.getIsMuted || muteOverride
            commit('SET_PLAYER_MUTED', shouldBeMuted)
            if (shouldBeMuted) {
                await player[providerMap.mute](0)
            } else {
                await player[providerMap.unMute](1)
            }
        },
        async setVolume({ commit, getters }, newVolume) {
            console.log('set player volume')
            const player = getters.getPlayer
            if (!player) return
            const providerMap = getters.getProviderMap
            const volumeMultiplier = providerMap.volumeMultiplier
            commit('SET_PLAYER_VOLUME', newVolume)
            await player[providerMap.setVolume](newVolume * volumeMultiplier)
        },
        async togglePlaying({ commit, getters, dispatch }) {
            if (getters.getIsLive && (getters.desiredStatus == 'playing' || getters.getStatus == 'playing')) return
            const player = getters.getPlayer
            if (!player) return
            const providerMap = getters.getProviderMap
            if (getters.getStatus == 'playing') {
                commit('SET_DESIRED_STATUS', 'paused')
                player[providerMap.pause]()
            } else {
                if (getters.getTimestamp == getters.getDuration) commit('SET_CURRENT_PLAYER_TIMESTAMP', 0)
                commit('SET_DESIRED_STATUS', 'playing')
                player[providerMap.play]()

                // If we are watching a livestream, seek to the end
                if (getters.getVideoType == 'live') {
                    dispatch('seekTo', getters.getDuration)
                }
            }
        },
        async seekTo({ commit, getters }, timestamp) {
            const player = getters.getPlayer
            if (!player) return
            const duration = getters.getDuration
            timestamp = Math.min(timestamp, duration)
            const providerMap = getters.getProviderMap
            commit('SET_IS_SEEKING', true)
            commit('SET_CURRENT_PLAYER_TIMESTAMP', timestamp)
            await player[providerMap.seekTo](timestamp)
            commit('SET_IS_SEEKING', false)
        },
        async getCurrentTimestamp({ commit, getters }) {
            const player = getters.getPlayer
            if (!player) return
            const providerMap = getters.getProviderMap
            const timestamp = await player[providerMap.getTimestamp]()
            return timestamp
        },
        makeLastTimingCurrent({ getters, rootGetters }) {
            const timings = rootGetters['videoPresentation/getVideoTimings']
            if (timings.length <= 0) return
            const lastTiming = timings[timings.length - 1]

            const presentedProductId = rootGetters['presentation/getCurrentProductId']
            if (lastTiming.product_id == presentedProductId) {
                const videoDuration = getters.getDuration
                lastTiming.end_at_ms = Math.ceil(videoDuration + 5000)
                // Make sure the last timing is the current timing
                if (lastTiming.start_at_ms > videoDuration) {
                    lastTiming.start_at_ms = Math.floor(videoDuration - 5000)
                }
            }
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
        SET_PLAYER_VOLUME(state, volume) {
            state.volume = volume
        },
        SET_VIDEO_TYPE(state, type) {
            state.videoType = type
        },
        SET_CONTROLS_HIDDEN(state, isHidden) {
            state.controlsHidden = isHidden
        },
    },
}
