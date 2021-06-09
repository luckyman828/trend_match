<template>
    <div class="player-wrapper" :class="[{ 'drag-active': isDragging }, playerStatus, `desired-${desiredStatus}`]">
        <video
            :src="video.urls[desiredQuality ? desiredQuality : 'SD360P']"
            ref="player"
            class="player"
            tabindex="-1"
            :autoplay="autoplay"
            :controls="false"
            playsinline
            @canplay="onPlayerReady"
            @loadedmetadata="onPlayerReady"
            @playing="onPlayingStatus"
            @pause="SET_PLAYER_STATUS('paused')"
            @waiting="SET_PLAYER_STATUS('buffering')"
            @ended="onEndedStatus"
            @timeupdate="onTimeupdate"
        />

        <div class="click-to-pause" @click="!isLive && togglePlaying()" />
        <div class="player-overlay">
            <slot name="beforeStart" v-if="!playerStarted" />

            <slot name="ended" v-if="playerStatus == 'ended'" />

            <slot name="paused" v-if="desiredStatus == 'paused'" />

            <slot />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'videoPlayer',
    props: ['video', 'autoplay'],
    data: function() {
        return {
            playerReady: false,
            liveDurationFetched: false,
            playerStartedTester: false,
            lastTimestamp: null,
            videoTimer: null,
            unhandledQualityChange: false,
        }
    },
    computed: {
        ...mapGetters('player', {
            player: 'getPlayer',
            playerStatus: 'getStatus',
            currentTimestamp: 'getTimestamp',
            isSeeking: 'getIsSeeking',
            isPlaying: 'getIsPlaying',
            duration: 'getDuration',
            isDragging: 'getTimelineKnobIsBeingDragged',
            isLive: 'getIsLive',
            currentTiming: 'getCurrentTiming',
            desiredStatus: 'getDesiredStatus',
            playerStarted: 'getPlayerStarted',
            desiredQuality: 'getDesiredQuality',
        }),
    },
    watch: {
        desiredStatus(newStatus) {
            if (newStatus == 'playing' && !this.playerStarted) {
                this.onStartPlaying()
            }
        },
        desiredQuality(newQuality) {
            this.player.pause()
            this.unhandledQualityChange = true
        },
    },
    methods: {
        ...mapActions('player', [
            'togglePlayerMuted',
            'getCurrentTimestamp',
            'togglePlaying',
            'play',
            'seekTo',
            'pause',
        ]),
        ...mapMutations('player', [
            'SET_PLAYER_REFERENCE',
            'SET_CURRENT_PLAYER_TIMESTAMP',
            'SET_PLAYER_DURATION',
            'SET_PLAYER_STATUS',
            'SET_DESIRED_STATUS',
            'SET_PLAYER_STARTED',
            'SET_RECENTLY_STARTED',
            'RESET_PLAYER',
        ]),
        onStartPlaying() {
            this.lastTimestamp = Date.now()
            this.play()
            this.SET_PLAYER_STARTED(true)
            this.startVideoTimer()

            // Add a class to the player to tell that it has recently been started
            this.SET_RECENTLY_STARTED(4000)
        },
        onPlayerReady(e, a) {
            // If we started the player the first time
            if (!this.playerReady) {
                this.playerReady = true
                const player = this.$refs.player
                this.SET_PLAYER_REFERENCE(player)
                // Pre-mute the player
                if (['editVideoPresentation'].includes(this.$route.name)) {
                    this.togglePlayerMuted(true)
                }

                // Save a timestamp
                this.getVideoDuration()

                this.addEventListeners()
            } else if (this.unhandledQualityChange) {
                this.seekTo(this.currentTimestamp)
                if (this.desiredStatus == 'playing') {
                    this.play()
                }
                this.unhandledQualityChange = false
            }
        },
        onPlayingStatus() {
            this.SET_DESIRED_STATUS('playing')
            this.SET_PLAYER_STATUS('playing')
        },
        onEndedStatus() {
            this.SET_PLAYER_STATUS('ended')
            this.SET_DESIRED_STATUS('paused')
            this.SET_CURRENT_PLAYER_TIMESTAMP(this.duration)
        },
        onTimeupdate(e) {
            // const timestamp = e.target.currentTime
            // this.onSetTimestamp(timestamp)
        },
        startVideoTimer() {
            // Clear the current one if any
            this.clearVideoTimer()

            this.videoTimer = setInterval(this.updateVideoTimestamp, 50)
        },
        clearVideoTimer() {
            if (this.videoTimer) {
                clearInterval(this.videoTimer)
            }
        },
        async updateVideoTimestamp() {
            const newTime = Date.now()
            const diff = newTime - this.lastTimestamp
            const timestamp = this.currentTimestamp + diff / 1000
            if (!this.isSeeking && this.isPlaying && !this.isDragging) {
                // Get the duration since last we read a timestamp
                this.SET_CURRENT_PLAYER_TIMESTAMP(timestamp)
            }
            this.lastTimestamp = Date.now()
        },
        onSetTimestamp(timestamp) {
            if (!this.isDragging) {
                this.SET_CURRENT_PLAYER_TIMESTAMP(timestamp)
                this.lastTimestamp = Date.now()

                // Update duration if we are live
                if (this.isLive) {
                    this.SET_PLAYER_DURATION(timestamp)
                    this.extendCurrentTiming()
                }
            }
        },
        extendCurrentTiming() {
            // Check if we have a current timing. If so extend its end time
            const currentTiming = this.currentTiming
            // console.log('here is current timing', this.currentTiming)
            if (currentTiming) {
                currentTiming.end_at_ms = Math.ceil(this.duration + 5000)
            }
        },
        async getVideoDuration() {
            const duration = await this.player.duration
            this.SET_PLAYER_DURATION(duration)
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT') return

            // PLAY/PAUSE
            if (key == 'Space' && !this.isLive) {
                e.preventDefault()
                this.togglePlaying()
            }
            // MUTE / UNMUTE
            if (key == 'KeyM') {
                this.togglePlayerMuted()
            }
        },
        addEventListeners() {
            document.addEventListener('keydown', this.hotkeyHandler)
        },
        removeEventListeners() {
            document.removeEventListener('keydown', this.hotkeyHandler)
        },
    },
    destroyed() {
        this.RESET_PLAYER()
        this.clearVideoTimer()
        this.removeEventListeners()
        if (this.playerStartedTester) clearInterval(this.playerStartedTester)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.player-wrapper {
    width: 100%;
    background: black;
    height: 100%;
    position: relative;
    .player {
        pointer-events: none;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        video {
            height: 100%;
            width: 100%;
        }
    }
    .click-to-pause {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
    &.desired-paused {
        .player-overlay {
            background: rgba(0, 0, 0, 0.5);
        }
    }
    &.drag-active {
        cursor: grabbing;
    }
}
.player-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    pointer-events: none;
    transition: background $videoPauseTransition;
    > *:not(.drawer-wrapper) {
        pointer-events: all;
    }
}
</style>
