<template>
    <div class="player-controls">
        <div class="main">
            <div class="left">
                <div class="button-list flex-list">
                    <!-- PLAY / PAUSE -->
                    <button class="invisible white circle ghost-hover" @click="togglePlaying">
                        <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
                    </button>

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

                    <button class="white circle invisible ghost-hover"></button>
                </div>

                <div class="time" style="margin-left: 40px;">
                    <span>{{ timestamp | timestampify }} / {{ duration | timestampify }}</span>
                </div>

                <div class="product-totals" style="margin-left: 52px;">
                    <div class="pill white xs">
                        <span> {{ currentTimingIndex + 1 }} / {{ timings.length }} styles </span>
                    </div>
                </div>
            </div>

            <div class="middle">
                <div class="button-list" v-if="product">
                    <BaseButton
                        :buttonClass="selectionInput[currentAction] != 'Focus' ? 'white' : 'primary'"
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
                <div class="price-list">
                    <template v-if="product">
                        <div class="price-list-item" :class="{ hidden: !product.delivery_dates[0] }">
                            <label>Delivery</label>
                            <div class="pill white xs">
                                <span>{{ getPrettyDate(product.delivery_dates[0]) }}</span>
                            </div>
                        </div>
                        <div class="price-list-item">
                            <label>WHS</label>
                            <div class="pill white xs">
                                <span>{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
                            </div>
                        </div>
                        <div class="price-list-item">
                            <label>RRP</label>
                            <div class="pill white xs">
                                <span
                                    >{{ product.yourPrice.recommended_retail_price }}
                                    {{ product.yourPrice.currency }}</span
                                >
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VolumeControl from './VolumeControl'

export default {
    name: 'playerControls',
    data: function() {
        return {
            fullscreenModeActive: false,
        }
    },
    components: {
        VolumeControl,
    },
    computed: {
        ...mapGetters('videoPlayer', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            currentTimingIndex: 'getCurrentTimingIndex',
            product: 'getCurrentProduct',
            desiredStatus: 'getDesiredStatus',
        }),
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
        ...mapGetters('products', ['getActiveSelectionInput']),
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
        ...mapActions('products', ['setProductAction']),
        ...mapActions('actions', ['updateFeedbacks', 'updateActions']),
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
    },
    destroyed() {
        this.removeFullscreenListeners()
        if (this.fullscreenModeActive) this.onExitFullscreen()
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
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
}
.pill span {
    font-weight: 700;
}
.price-list {
    display: flex;
    justify-content: flex-end;
    margin-top: -12px;
    width: 100%;
    .price-list-item {
        &:not(:first-child) {
            margin-left: 40px;
        }
        &.hidden {
            visibility: hidden;
        }
    }
    label {
        font-size: 12px;
        font-weight: 500;
        display: block;
        margin-bottom: 4px;
        margin-left: 7px;
        color: $grey500;
    }
    .pill {
        width: 112px;
        text-align: left;
        justify-content: flex-start;
    }
}
</style>
