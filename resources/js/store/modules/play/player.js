export default {
    namespaced: true,

    state: {
        player: null,
        videoType: 'static',
        timestamp: 0,
        duration: 0,
        status: null,
        isMuted: false,
        isStarted: false,
        volume: 1,
        desiredStatus: 'paused',
        isSeeking: false,
        timelineKnobIsBeingDragged: false,
        controlsHidden: false,
        recentlyStarted: false,
    },

    getters: {
        getVideoType: state => state.videoType,
        getIsLive: state => state.videoType == 'live',
        getPlayer: state => state.player,
        getIsPlaying: state => state.status == 'playing',
        getDesiredStatus: state => state.desiredStatus,
        getTimestamp: state => state.timestamp,
        getDuration: state => state.duration,
        getStatus: state => state.status,
        getIsMuted: state => state.isMuted,
        getVolume: state => state.volume,
        getIsSeeking: state => state.isSeeking,
        getTimelineKnobIsBeingDragged: state => state.timelineKnobIsBeingDragged,
        getControlsHidden: (state, getters) => state.controlsHidden && !!getters.getIsPlaying,
        getPlayerStarted: state => state.isStarted,
        getPlayerRecentlyStarted: state => state.recentlyStarted,
    },

    actions: {
        async togglePlayerMuted({ commit, getters }, muteOverride) {
            const player = getters.getPlayer
            if (!player) return
            if (!getters.getIsMuted) {
                commit('SET_PLAYER_MUTED', true)
                player.volume = 0
            } else {
                commit('SET_PLAYER_MUTED', false)
                player.volume = getters.getVolume
            }
        },
        async setVolume({ commit, getters }, newVolume) {
            const player = getters.getPlayer
            if (!player) return
            commit('SET_PLAYER_VOLUME', newVolume)
            player.volume = newVolume
        },
        async togglePlaying({ commit, getters, dispatch }) {
            if (getters.getIsLive && (getters.desiredStatus == 'playing' || getters.getStatus == 'playing')) return
            const player = getters.getPlayer
            if (!player) return
            if (getters.getDesiredStatus != 'playing') {
                commit('SET_DESIRED_STATUS', 'playing')
                if (getters.getStatus == 'ended') {
                    commit('SET_CURRENT_PLAYER_TIMESTAMP', 0)
                    player.currentTime = 0
                }
                player.play()
                // Restart the video if it has ended
            } else {
                commit('SET_DESIRED_STATUS', 'paused')
                player.pause()
            }
        },
        async play({ commit, getters, dispatch }) {
            const player = getters.getPlayer
            if (!player) return
            commit('SET_DESIRED_STATUS', 'playing')

            // Restart the video if it has ended
            if (getters.getStatus == 'ended') {
                commit('SET_CURRENT_PLAYER_TIMESTAMP', 0)
                player.currentTime = 0
            }

            player.play()

            // If we are watching a livestream, seek to the end
            if (getters.getVideoType == 'live') {
                player.currentTime = player.duration
            }
        },
        async seekTo({ commit, getters }, timestamp) {
            const player = getters.getPlayer
            if (!player) return
            const duration = getters.getDuration
            timestamp = Math.min(timestamp, duration)
            commit('SET_IS_SEEKING', true)
            commit('SET_CURRENT_PLAYER_TIMESTAMP', timestamp)
            player.currentTime = timestamp
            commit('SET_IS_SEEKING', false)
        },
    },

    mutations: {
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
        SET_PLAYER_STARTED(state, payload) {
            state.isStarted = payload
        },
        SET_RECENTLY_STARTED(state, delay) {
            state.recentlyStarted = true
            setTimeout(() => {
                state.recentlyStarted = false
            }, delay)
        },
        RESET_PLAYER(state) {
            state.controlsHidden = false
            state.player = null
            state.videoType = 'static'
            state.timestamp = 0
            state.duration = 0
            state.status = null
            state.isMuted = false
            state.volume = 1
            state.isPlaying = false
            state.desiredStatus = 'paused'
            state.isSeeking = false
            state.timelineKnobIsBeingDragged = false
            state.isStarted = false
        },
    },
}
