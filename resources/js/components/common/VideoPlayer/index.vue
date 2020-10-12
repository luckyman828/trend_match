<template>
    <div class="player-wrapper" :class="{ 'drag-active': isDragging }">
        <vimeo-player
            v-if="provider == 'Vimeo'"
            ref="player"
            class="player"
            :videoId="providerVideoId"
            :controls="false"
            :autoplay="true"
            @ready="onPlayerReady"
            @play="onPlayingStatus"
            @pause="SET_PLAYER_STATUS('paused')"
            @ended="onEndedStatus"
            @timeupdate="$event => onTimeupdate($event.seconds)"
        />

        <youtube
            v-if="provider == 'Youtube'"
            ref="player"
            class="player"
            tabindex="-1"
            :videoId="providerVideoId"
            :playerVars="{
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                disablekb: 0,
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

        <PlayerOverlay v-if="playerReady">
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
    props: ['providerVideoId', 'provider'],
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
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'getCurrentTimestamp']),
        ...mapActions('products', ['initTimings']),
        ...mapMutations('videoPlayer', [
            'SET_PLAYER_REFERENCE',
            'SET_CURRENT_PLAYER_TIMESTAMP',
            'SET_PLAYER_DURATION',
            'SET_PLAYER_STATUS',
            'SET_IFRAME_REFERENCE',
            'SET_DESIRED_STATUS',
        ]),
        onPlayerReady(e, a) {
            this.playerReady = true
            this.SET_PLAYER_REFERENCE(this.$refs.player.player)
            this.SET_IFRAME_REFERENCE(this.$el.getElementsByTagName('iframe')[0])
            // Pre-mute the player
            this.togglePlayerMuted(true)
            this.startTimerListener()

            // Save a timestamp
            this.lastTimestamp = Date.now()
            this.getVideoDuration()
        },
        onPlayingStatus(e) {
            if (this.provider == 'Vimeo') {
                this.SET_PLAYER_DURATION(e.duration)
            }
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
            if (!this.isSeeking && this.isPlaying && !this.isDragging) {
                // Get the duration since last we read a timestamp
                const newTime = Date.now()
                const diff = newTime - this.lastTimestamp
                const timestamp = this.currentTimestamp + diff / 1000

                // const timestamp = await this.player.getCurrentTime()
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
            }
        },
        async getVideoDuration() {
            const duration = await this.player.getDuration()
            this.SET_PLAYER_DURATION(duration)
        },
    },
    destroyed() {
        this.clearTimerListener()
        this.SET_CURRENT_PLAYER_TIMESTAMP(0)
        this.SET_PLAYER_STATUS(null)
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
