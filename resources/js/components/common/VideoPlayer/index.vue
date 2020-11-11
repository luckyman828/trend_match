<template>
    <div class="player-wrapper" :class="{ 'drag-active': isDragging }">
        <vimeo-player
            v-if="provider == 'vimeo'"
            ref="player"
            class="player"
            :videoId="providerVideoId"
            :controls="false"
            :autoplay="autoplay"
            @ready="onPlayerReady"
            @play="onPlayingStatus"
            @pause="SET_PLAYER_STATUS('paused')"
            @ended="onEndedStatus"
            @timeupdate="$event => onTimeupdate($event.seconds)"
        />

        <youtube
            v-if="provider == 'youtube'"
            ref="player"
            class="player"
            tabindex="-1"
            :videoId="providerVideoId"
            :playerVars="{
                autoplay: autoplay ? 1 : 0,
                controls: 0,
                modestbranding: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                disablekb: 0,
                playsinline: 1,
            }"
            :resize="true"
            :fitParent="true"
            @ready="onPlayerReady"
            @playing="onPlayingStatus"
            @paused="SET_PLAYER_STATUS('paused')"
            @buffering="SET_PLAYER_STATUS('buffering')"
            @ended="onEndedStatus"
            @error="SET_PLAYER_STATUS('error')"
        />
        <!-- </div> -->

        <PlayerOverlay :playerReady="playerReady">
            <slot />
        </PlayerOverlay>
    </div>
</template>

<script>
import PlayerOverlay from './PlayerOverlay'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'videoPlayer',
    components: {
        PlayerOverlay,
    },
    props: ['providerVideoId', 'provider', 'autoplay'],
    data: function() {
        return {
            playerReady: false,
            intervalTimer: null,
            lastTimestamp: 0,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            player: 'getPlayer',
            playerStatus: 'getStatus',
            currentTimestamp: 'getTimestamp',
            isSeeking: 'getIsSeeking',
            isPlaying: 'getIsPlaying',
            duration: 'getDuration',
            isDragging: 'getTimelineKnobIsBeingDragged',
            isLive: 'getIsLive',
            currentTiming: 'getCurrentTiming',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'getCurrentTimestamp', 'togglePlaying']),
        ...mapMutations('videoPlayer', [
            'SET_PLAYER_REFERENCE',
            'SET_CURRENT_PLAYER_TIMESTAMP',
            'SET_PLAYER_DURATION',
            'SET_PLAYER_STATUS',
            'SET_IFRAME_REFERENCE',
            'SET_DESIRED_STATUS',
        ]),
        ...mapMutations('videoPresentation', ['SET_TIMELINE_ZOOM']),
        onPlayerReady(e, a) {
            this.playerReady = true
            const player = this.$refs.player.player
            // Set player reference. Using VUEX causes trouble with the iframe
            this.$store.state.videoPlayer.player = player
            // this.SET_PLAYER_REFERENCE(player)

            this.SET_IFRAME_REFERENCE(this.$el.getElementsByTagName('iframe')[0])
            // Pre-mute the player
            if (this.$route.name != 'watchVideoPresentation') {
                this.togglePlayerMuted(true)
            }
            this.startTimerListener()

            // Save a timestamp
            this.lastTimestamp = Date.now()
            this.getVideoDuration()

            this.addEventListeners()
        },
        onPlayingStatus(e) {
            if (this.provider == 'vimeo') {
                this.SET_PLAYER_DURATION(e.duration)
            }
            this.SET_DESIRED_STATUS('playing')
            this.SET_PLAYER_STATUS('playing')
            this.getVideoTimeStampFromProvider()
        },
        onEndedStatus() {
            this.SET_PLAYER_STATUS('ended')
            this.SET_DESIRED_STATUS('paused')
            this.SET_CURRENT_PLAYER_TIMESTAMP(this.duration)
        },
        onTimeupdate(timestamp) {
            this.onSetTimestamp(timestamp)
        },
        startTimerListener() {
            // Clear the current one if any
            this.clearTimerListener()

            // if (!this.provider == 'Vimeo') {
            this.intervalTimer = setInterval(this.getVideoTimeStamp, 50)
            // }
        },
        clearTimerListener() {
            if (this.intervalTimer) {
                clearInterval(this.intervalTimer)
            }
        },
        async getVideoTimeStamp() {
            const newTime = Date.now()
            const diff = newTime - this.lastTimestamp
            const timestamp = this.currentTimestamp + diff / 1000
            // Update duration if we are live
            if (this.isLive) {
                const newDuration = this.duration + diff / 1000
                this.SET_PLAYER_DURATION(newDuration)
                this.extendCurrentTiming()
            }
            if (!this.isSeeking && this.isPlaying && !this.isDragging) {
                // Get the duration since last we read a timestamp

                this.SET_CURRENT_PLAYER_TIMESTAMP(timestamp)
            }
            this.lastTimestamp = Date.now()
        },
        async getVideoTimeStampFromProvider() {
            const timestamp = await this.getCurrentTimestamp()
            this.onSetTimestamp(timestamp)
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
            if (currentTiming) {
                currentTiming.end_at_ms = Math.ceil(this.duration + 5000)
            }
        },
        async getVideoDuration() {
            const duration = await this.player.getDuration()
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
        this.clearTimerListener()
        this.SET_CURRENT_PLAYER_TIMESTAMP(0)
        this.SET_PLAYER_STATUS(null)
        this.removeEventListeners()
        this.SET_TIMELINE_ZOOM(1)
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
    ::v-deep {
        iframe {
            height: 100%;
            width: 100%;
        }
    }
    .player {
        pointer-events: none;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        ::v-deep {
            iframe {
                height: 100%;
                width: 100%;
            }
        }
    }
    &.drag-active {
        cursor: grabbing;
    }
}
</style>
