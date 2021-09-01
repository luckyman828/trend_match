<template>
    <div class="player-controls flex-list justify space-md">
        <div class="left flex-list">
            <!-- PLAY / PAUSE -->
            <button v-if="!isLive" class="no-bg white circle ghost-hover" @click="togglePlaying">
                <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
            </button>
            <span
                v-else
                class="circle no-bg ghost-hover"
                v-tooltip="'Video is LIVE. Pause/Play controls have been disabled.'"
            >
                <i class="fas fa-circle red"></i>
            </span>

            <!-- MUTE / UNMUTE -->
            <VolumeControl />

            <div class="product-totals" @click="$emit('show-timing-list')">
                <button class="pill no-bg white ghost-hover">
                    <i class="far fa-tshirt"></i>
                    <span> {{ currentTimingIndex + 1 }} of {{ timings.length }} </span>
                </button>
            </div>

            <slot name="left" />
        </div>

        <div class="timeline-wrapper fill flex-list flex-v auto-top">
            <div class="time ft-10">
                <span>{{ timestamp | timestampify }} / {{ duration | timestampify }}</span>
            </div>
            <VideoTimeline v-if="playerReady && !isLive" />
        </div>

        <div class="right flex-list">
            <v-popover trigger="click" ref="qualitySelector">
                <button class="no-bg white circle ghost-hover">
                    <i class="far fa-cog"></i>
                </button>
                <BaseSelectButtons
                    header="Quality"
                    slot="popover"
                    type="radio"
                    :submitOnChange="true"
                    :options="Object.keys(video.urls)"
                    :value="desiredQuality"
                    @change="onChangeQuality"
                />
            </v-popover>

            <!-- FULLSCREEN MODE -->
            <button
                class="no-bg white circle ghost-hover"
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
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoTimeline from '../VideoTimeline'
import VolumeControl from '../VolumeControl'

export default {
    name: 'playerControls',
    data: function() {
        return {
            mouseMoveTimeout: null,
        }
    },
    components: {
        VolumeControl,
        VideoTimeline,
    },
    computed: {
        ...mapGetters('player', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            desiredStatus: 'getDesiredStatus',
            isLive: 'getIsLive',
            isPlaying: 'getIsPlaying',
            hideControls: 'getControlsHidden',
            playerReady: 'getPlayer',
            desiredQuality: 'getDesiredQuality',
            fullscreenModeActive: 'getFullscreenModeActive',
        }),
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            timings: 'getTimings',
            currentTimingIndex: 'getCurrentTimingIndex',
            product: 'getCurrentProduct',
        }),
    },
    methods: {
        ...mapActions('player', ['togglePlayerMuted', 'togglePlaying']),
        ...mapMutations('player', ['SET_CONTROLS_HIDDEN', 'SET_DESIRED_QUALITY', 'SET_FULLSCREEN_MODE_ACTIVE']),
        onChangeQuality(newQuality) {
            this.SET_DESIRED_QUALITY(newQuality)
            this.$refs.qualitySelector.hide()
        },
        toggleFullscreenMode() {
            if (this.fullscreenModeActive) {
                this.onExitFullscreen()
            } else {
                this.onEnterFullscreen()
            }
        },
        onEnterFullscreen() {
            console.log('VUE, ENTER Fullscreen')
            // try {
            const elem = document.documentElement
            if (elem.requestFullscreen) {
                // try {
                elem.requestFullscreen()
                // } catch (e) {}
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
            // } catch (e) {
            //     console.log('error')
            // }
        },
        onExitFullscreen() {
            console.log('VUE, EXIT Fullscreen')

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
            const shouldBeActive = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            )

            if (this.fullscreenModeActive) {
                this.SET_FULLSCREEN_MODE_ACTIVE(shouldBeActive)
            } else {
                this.SET_FULLSCREEN_MODE_ACTIVE(shouldBeActive)
            }
        },
        addFullscreenListeners() {
            // window.addEventListener('resize', this.fullscreenChangeHandler, false)
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
.player-controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 16px;
    background: linear-gradient(180deg, transparent 0%, black 100%) 0% 0% no-repeat padding-box;
    color: white;
    width: 100%;
    overflow: hidden;

    // TIMELINE
    &::v-deep {
        .timeline {
            .target-area {
                transform: translateY(-50%);
                width: 100%;
            }
            .knob {
                display: none;
            }
            .timeline-wrapper {
                background: rgba(white, 16%);
                .rail {
                    height: 4px;
                    border-radius: 2px;
                    background: white;
                }
            }
        }
    }
}
</style>
