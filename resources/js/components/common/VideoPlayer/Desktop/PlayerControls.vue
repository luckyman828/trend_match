<template>
    <div class="player-controls-wrapper">
        <VideoTimeline v-if="playerReady && !isLive" />
        <div class="player-controls" :class="{ hide: hideControls }">
            <div class="main">
                <div class="left">
                    <div class="button-list flex-list">
                        <!-- PLAY / PAUSE -->
                        <button v-if="!isLive" class="invisible white circle ghost-hover" @click="togglePlaying">
                            <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
                        </button>
                        <span
                            v-else
                            class="circle invisible ghost-hover"
                            v-tooltip="'Video is LIVE. Pause/Play controls have been disabled.'"
                        >
                            <i class="fas fa-circle red"></i>
                        </span>

                        <!-- MUTE / UNMUTE -->
                        <VolumeControl />

                        <!-- FULLSCREEN MODE -->
                        <button
                            class="invisible white circle ghost-hover"
                            v-tooltip="{
                                content: `${fullscreenModeActive ? 'Exit' : 'Enter'} full-screen mode`,
                                delay: { show: 500 },
                            }"
                            ref="buttonToClick"
                            @click="toggleFullscreenMode"
                        >
                            <i class="far" :class="fullscreenModeActive ? 'fa-compress' : 'fa-expand'"></i>
                        </button>
                    </div>

                    <div class="time" style="margin-left: 40px;">
                        <span>{{ timestamp | timestampify }} / {{ duration | timestampify }}</span>
                    </div>

                    <div class="product-totals" style="margin-left: 52px;">
                        <div class="pill dark sm">
                            <span> {{ currentTimingIndex + 1 }} / {{ timings.length }} styles </span>
                        </div>
                    </div>

                    <slot name="left" />
                </div>

                <div class="center">
                    <slot name="center" />
                </div>

                <div class="right">
                    <slot name="right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoTimeline from '../VideoTimeline.vue'
import VolumeControl from '../VolumeControl'

export default {
    name: 'playerControls',
    data: function() {
        return {
            fullscreenModeActive: false,
            mouseMoveTimeout: null,
        }
    },
    components: {
        VolumeControl,
        VideoTimeline,
    },
    computed: {
        ...mapGetters('videoPlayer', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            currentTimingIndex: 'getCurrentTimingIndex',
            product: 'getCurrentProduct',
            desiredStatus: 'getDesiredStatus',
            isLive: 'getIsLive',
            isPlaying: 'getIsPlaying',
            hideControls: 'getControlsHidden',
            playerReady: 'getPlayer',
        }),
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'togglePlaying']),
        ...mapMutations('videoPlayer', ['SET_CONTROLS_HIDDEN']),
        toggleFullscreenMode() {
            if (this.fullscreenModeActive) {
                this.onExitFullscreen()
            } else {
                this.onEnterFullscreen()
            }
        },
        onEnterFullscreen() {
            const elem = document.documentElement
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
            } else if (elem.mozRequestFullScreen) {
                /* Firefox */
                elem.mozRequestFullScreen()
            } else if (elem.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen()
            } else if (elem.msRequestFullscreen) {
                /* IE/Edge */
                elem.msRequestFullscreen()
            }
        },
        onExitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                /* Firefox */
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                /* Chrome, Safari and Opera */
                document.webkitExitFullscreen()
            } else if (document.msExitFullscreen) {
                /* IE/Edge */
                document.msExitFullscreen()
            }
        },
        fullscreenChangeHandler(e) {
            if (this.fullscreenModeActive) {
                this.fullscreenModeActive = false
            } else {
                this.fullscreenModeActive = true
            }
        },
        addFullscreenListeners() {
            document.addEventListener('fullscreenchange', this.fullscreenChangeHandler, false)
            document.addEventListener('mozfullscreenchange', this.fullscreenChangeHandler, false)
            document.addEventListener('MSFullscreenChange', this.fullscreenChangeHandler, false)
            document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler, false)
        },
        removeFullscreenListeners() {
            document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler, false)
            document.removeEventListener('mozfullscreenchange', this.fullscreenChangeHandler, false)
            document.removeEventListener('MSFullscreenChange', this.fullscreenChangeHandler, false)
            document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler, false)
        },
    },
    created() {
        this.addFullscreenListeners()
        document.addEventListener('keydown', this.hotkeyHandler)
        document.addEventListener('mousemove', this.mouseMoveHandler)
    },
    destroyed() {
        this.removeFullscreenListeners()
        if (this.fullscreenModeActive) this.onExitFullscreen()
        document.removeEventListener('keydown', this.hotkeyHandler)
        document.removeEventListener('mousemove', this.mouseMoveHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.player-controls-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    pointer-events: all;
}
.player-controls {
    pointer-events: all;
    background: $dark100;
    height: $heightPlayerControls;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    color: white;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: none;
    transition: transform 0.1s ease-out;
    .main {
        display: flex;
        align-items: center;
        padding: 8px 60px 8px 20px;
        flex: 1;
        > * {
            display: flex;
            align-items: center;
            &:not(.center) {
                flex: 1;
            }
        }
        .right {
            justify-content: flex-end;
        }
    }
    &.hide {
        transform: translateY(100%);
    }
}
</style>
