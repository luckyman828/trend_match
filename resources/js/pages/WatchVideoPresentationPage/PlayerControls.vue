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
                </div>

                <div class="middle">
                    <div class="button-list" v-if="product">
                        <BaseButton
                            :buttonClass="[
                                'true-square',
                                selectionInput[currentAction] != 'Focus' ? 'white' : 'primary',
                            ]"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('Focus')"
                        >
                            <i class="far fa-star"></i>
                        </BaseButton>
                        <BaseButton
                            :buttonClass="selectionInput[currentAction] != 'In' ? 'white' : 'green'"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('In')"
                        >
                            <i class="far fa-heart"></i>
                            <span>In</span>
                        </BaseButton>
                        <BaseButton
                            :buttonClass="selectionInput[currentAction] != 'Out' ? 'white' : 'red'"
                            :disabled="!userWriteAccess.actions.hasAccess"
                            v-tooltip="userWriteAccess.actions.msg"
                            @click="onUpdateAction('Out')"
                        >
                            <i class="far fa-times-circle"></i>
                            <span>out</span>
                        </BaseButton>
                    </div>
                </div>

                <div class="right">
                    <template v-if="product">
                        <div class="price-list">
                            <div class="list-item">
                                <label>WHS</label>
                                <span class="value"
                                    >{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span
                                >
                            </div>
                            <div class="list-item">
                                <label>RRP</label>
                                <span class="value"
                                    >{{ product.yourPrice.recommended_retail_price }}
                                    {{ product.yourPrice.currency }}</span
                                >
                            </div>
                            <div class="list-item">
                                <label>Mark up</label>
                                <span class="value">{{ product.yourPrice.mark_up }}</span>
                            </div>
                        </div>

                        <div class="delivery-list" v-if="product && product.delivery_dates.length > 0">
                            <div class="list-item" v-for="(delivery, index) in product.delivery_dates" :key="index">
                                <label>Delivery {{ index + 1 }}</label>
                                <span class="value">{{ getPrettyDate(delivery, 'medium') }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoTimeline from '../../components/common/VideoPlayer/VideoTimeline.vue'
import VolumeControl from '../../components/common/VideoPlayer/VolumeControl'

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
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            currentSelectionMode: 'currentSelectionMode',
            getAuthUserSelectionWriteAccess: 'getAuthUserSelectionWriteAccess',
            getSelectionModeAction: 'getSelectionModeAction',
        }),
        currentSelectionModeAction() {
            return this.getSelectionModeAction(this.currentSelectionMode)
        },
        currentAction() {
            return this.currentSelectionModeAction
        },
        selectionInput() {
            return this.getActiveSelectionInput(this.product)
        },
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.selection, this.product)
        },
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'togglePlaying']),
        ...mapActions('actions', ['updateFeedbacks', 'updateActions']),
        ...mapMutations('videoPlayer', ['SET_CONTROLS_HIDDEN']),
        onUpdateAction(action) {
            const selectionInput = this.selectionInput
            if (this.currentSelectionMode == 'Feedback') {
                const selectionFeedback = selectionInput.yourSelectionFeedback
                const newAction = selectionFeedback.action == action ? 'None' : action
                this.updateFeedbacks({ actions: [selectionFeedback], newAction })
            }
            if (this.currentSelectionMode == 'Alignment') {
                const selectionAction = selectionInput.selectionAction
                const newAction = selectionAction.action == action ? 'None' : action
                this.updateActions({ actions: [selectionAction], newAction })
            }
        },
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
        mouseMoveHandler(e) {
            // // If the player controls are hidden, show them
            // if (this.hideControls) this.SET_CONTROLS_HIDDEN(false)
            // // Start a timeout to check if we should hide the controls
            // if (this.mouseMoveTimeout) clearTimeout(this.mouseMoveTimeout)
            // const delay = 1000
            // this.mouseMoveTimeout = setTimeout(() => {
            //     // Check if the target of the mouse is not the player controls.
            //     // If not, hide the player controls
            //     if (e.target != this.$el && !this.$el.contains(e.target)) {
            //         this.SET_CONTROLS_HIDDEN(true)
            //     }
            // }, delay)
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
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT') return

            // IN/OUT/FOCUS/NONE
            if (this.userWriteAccess.actions.hasAccess) {
                if (key == 'KeyF' || key == 'KeyU') {
                    this.onUpdateAction('Focus')
                }
                if (key == 'KeyI') {
                    this.onUpdateAction('In')
                }
                if (key == 'KeyO') {
                    this.onUpdateAction('Out')
                }
            }
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
            &:not(.middle) {
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
.price-list {
    display: flex;
    justify-content: flex-end;
}
.delivery-list {
    display: flex;
    margin-left: 32px;
}
.list-item {
    background: $dark;
    padding: 8px;
    border-radius: $borderRadiusEl;
    &:not(:first-child) {
        margin-left: 12px;
    }
    > * {
        display: block;
        line-height: 1;
    }

    label {
        font-size: 10px;
        font-weight: 500;
        display: block;
        margin-bottom: 4px;
        color: $bluegrey500;
    }
    .value {
        font-size: 12px;
        font-weight: 700;
        color: white;
    }
}
</style>
