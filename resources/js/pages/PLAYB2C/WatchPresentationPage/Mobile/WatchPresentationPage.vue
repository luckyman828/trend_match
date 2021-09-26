<template>
    <div class="watch-video-page" :class="[`desired-${desiredStatus}`, { 'recently-started': recentlyStarted }]">
        <VideoPlayer :video="video" :autoplay="false">
            <template v-slot:beforeStart>
                <BeforeStartOverlay />
            </template>

            <PresentationTitle :presentation="presentation" />

            <template v-if="playerStarted">
                <div class="flip-screen-overlay" v-if="flipScreen">
                    <div class="flip-screen-container">
                        <div class="flip-screen-icon"><i class="fa fa-repeat"></i></div>
                        <p class="font-bold">Rotate your device.</p>
                        <p class="leading-snug">This presentation is best viewed in {{ flipOrientation }} mode.</p>
                    </div>
                </div>
                <div class="bottom-aligned flex-list flex-v md">
                    <div class="over-timeline flex-list flex-v md">
                        <PreviewList />
                        <div class="top flex-list justify flex-end-v">
                            <div class="left">
                                <!-- <button class="bg-blur sm pill comment-button">
                                    <i class="far fa-comment black"></i><span class="color-black">Show</span>
                                </button> -->
                            </div>
                            <div class="right flex-list">
                                <AddToWishlistButton
                                    class="lg circle"
                                    :disabled="!currentTiming"
                                    :variants="currentTiming && currentTiming.variantList"
                                />

                                <v-popover
                                    trigger="click"
                                    :autoHide="false"
                                    :disabled="!currentTiming && !addToBasketPopoverIsVisible"
                                    ref="addToBasketPopover"
                                    @show="onShowAddToBasketPopover"
                                    @hide="onHideBasketPopover"
                                >
                                    <BaseStateAlternatingButton
                                        buttonClass="circle lg"
                                        :disabled="!currentTiming"
                                        :active="
                                            addToBasketPopoverIsVisible
                                                ? addToBasketPopoverVariantIsInBasket
                                                : currentTimingIsInBasket
                                        "
                                        :baseState="{
                                            class: 'white',
                                            iconLeft: 'far fa-shopping-bag',
                                        }"
                                        :activeState="{
                                            class: 'primary',
                                            iconLeft: 'far fa-shopping-bag white',
                                            nestedIconLeft: 'fas fa-check pos-bottom pos-right white',
                                        }"
                                    >
                                    </BaseStateAlternatingButton>
                                    <AddToBasketPopover
                                        slot="popover"
                                        :variants="addToBasketPopoverVariantList"
                                        @hide="$refs.addToBasketPopover.hide()"
                                    />
                                </v-popover>
                                <!-- <AddToBasketButton
                                    buttonClass="lg circle"
                                    baseClass="white"
                                    :disabled="!currentTiming"
                                    :variant="currentTiming && currentTiming.variant"
                                    textStyle="none"
                                    :resetOnSubmit="true"
                                /> -->
                            </div>
                        </div>
                    </div>

                    <VideoTimeline />

                    <div class="bottom flex-list equal-width justify center-v">
                        <div class="left flex-list">
                            <button v-if="!isLive" class="no-bg white circle ghost-hover" @click="togglePlaying">
                                <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
                            </button>
                            <VolumeControl :disableSlider="true" />
                        </div>
                        <div class="center">
                            <div class="timing-count pill bg-blur" @click="showTimingList = !showTimingList">
                                <i class="fas fa-tshirt"></i>
                                <span>{{ currentTimingIndex + 1 }} of {{ videoTimings.length }}</span>
                            </div>
                        </div>
                        <div class="flex-list">
                            <button
                                class="wishlist-count pill bg-blur"
                                @click="
                                    showSavedProductsDrawer = true
                                    savedProductsView = 'wishlist'
                                "
                            >
                                <i class="far fa-heart"></i>
                                <span>{{ wishlist.length }}</span>
                            </button>
                            <button
                                class="basket-count pill bg-blur"
                                @click="
                                    showSavedProductsDrawer = true
                                    savedProductsView = 'basket'
                                "
                            >
                                <i class="far fa-shopping-bag"></i>
                                <span>{{ basket.length }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <TimingListDrawer :show="showTimingList" @close="showTimingList = false" />

                <SavedStylesDrawer
                    :show="!!showSavedProductsDrawer"
                    :view.sync="savedProductsView"
                    @close="showSavedProductsDrawer = false"
                />
                <ProductDetailsDrawer :show="!!pdpItem" @close="SET_PDP_ITEM(null)" />
            </template>

            <template v-slot:ended>
                <div
                    class="ended-wrapper flex-list flex-v center-h center-v space-md"
                    style="height: 100%; width: 100%"
                >
                    <button
                        class="primary pill lg w-lg"
                        @click="
                            showSavedProductsDrawer = true
                            savedProductsView = 'basket'
                        "
                    >
                        <span>Se kurv</span>
                    </button>
                    <button
                        class="white pill lg w-lg"
                        @click="$store.dispatch('playEmbed/postMessage', { action: 'closePresentation' })"
                    >
                        <span>Afslut og shop videre</span>
                    </button>
                </div>
            </template>
        </VideoPlayer>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../../../components/PLAY/VideoPlayer'
import VideoTimeline from '../../../../components/PLAY/PresentationPlayer/VideoTimeline'
import VolumeControl from '../../../../components/PLAY/PresentationPlayer/VolumeControl'

import BeforeStartOverlay from './BeforeStartOverlay'
import PresentationTitle from './PresentationTitle'
import PreviewList from './PreviewList'
import AddToWishlistButton from '../AddToWishlistButton'
import AddToBasketButton from '../AddToBasketButton'
import TimingListDrawer from './TimingListDrawer/'

import ProductDetailsDrawer from './ProductDetailsDrawer/'
import SavedStylesDrawer from './SavedStylesDrawer/'
import AddToBasketPopover from './AddToBasketPopover'

export default {
    name: 'watchVideoPage',
    components: {
        VideoPlayer,
        VideoTimeline,
        BeforeStartOverlay,
        PresentationTitle,
        PreviewList,
        ProductDetailsDrawer,
        SavedStylesDrawer,
        AddToWishlistButton,
        AddToBasketButton,
        VolumeControl,
        TimingListDrawer,
        AddToBasketPopover,
    },
    data: function() {
        return {
            flipScreen: false,
            flipOrientation: '',
            showSavedProductsDrawer: false,
            savedProductsView: 'wishlist',
            showControls: true,
            showCart: false,
            showChatInput: false,
            recentlyStarted: false,
            showTimingList: false,
            addToBasketPopoverVariantList: [],
            addToBasketPopoverIsVisible: false,
        }
    },
    mounted() {
        window.addEventListener(
            "resize",
            this.handleScreenOrientation
        );
    },
    watch: {
      playerStarted() {
          this.handleScreenOrientation()
      }  
    },
    computed: {
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
            videoTimings: 'getTimings',
            video: 'getVideo',
            pdpItem: 'getPdpItem',
            currentTimingIndex: 'getCurrentTimingIndex',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('player', {
            player: 'getPlayer',            
            isPlaying: 'getIsPlaying',
            videoId: 'getProviderVideoId',
            provider: 'getProvider',
            playerStatus: 'getStatus',
            desiredStatus: 'getDesiredStatus',
            videoType: 'getVideoType',
            duration: 'getDuration',
            timestamp: 'getTimestamp',
            isLive: 'getIsLive',
            playerStarted: 'getPlayerStarted',
        }),
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
        }),
        ...mapGetters('basket', {
            basket: 'getBasket',
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        addToBasketPopoverVariantIsInBasket() {
            return this.addToBasketPopoverVariantList.find(variant => this.getVariantIsInBasket(variant))
        },
        currentTimingIsInBasket() {
            return (
                this.currentTiming && this.currentTiming.variantList.find(variant => this.getVariantIsInBasket(variant))
            )
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
        ...mapActions('player', ['togglePlayerMuted', 'togglePlaying']),
        onShowAddToBasketPopover() {
            this.addToBasketPopoverIsVisible = true
            this.addToBasketPopoverVariantList = this.currentTiming ? this.currentTiming.variantList : []
        },
        onHideBasketPopover() {
            this.addToBasketPopoverIsVisible = false
        },
        handleScreenOrientation() {
            const orientationIsPortrait = window.matchMedia("(orientation: portrait)").matches
            const videoWidth = this.player.videoWidth
            const videoHeight = this.player.videoHeight
            if ((orientationIsPortrait  && videoWidth > videoHeight) 
                || (!orientationIsPortrait && videoWidth < videoHeight)) {
                this.flipOrientation = orientationIsPortrait ? 'landscape' : 'portrait'
                this.flipScreen = true
            } else {
                this.flipScreen = false
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.watch-video-page {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    z-index: 2147483646;
    .timeline {
        position: fixed;
        bottom: 48px;
        left: 8px;
        width: calc(100% - 2 * 8px);
        transition: $videoPauseTransition;
        &::v-deep {
            .knob {
                display: none;
            }
        }
    }

    &.desired-paused {
        .bottom-aligned {
            // transform: translateY(-32px);
        }
        .over-timeline {
            transform: translateY(-24px);
        }
        .timeline {
            transform: translateY(-12px);
        }
    }

    .bottom-aligned {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 8px;
        transition: $videoPauseTransition;
        pointer-events: none;
        > * {
            pointer-events: all;
        }
        .over-timeline {
            transition: $videoPauseTransition;
            pointer-events: none;
            padding-bottom: 6px;
            > * {
                pointer-events: all;
            }
        }
        .top {
            pointer-events: none;
            > * {
                pointer-events: all;
            }
        }
    }
    .wishlist-button {
        &.active {
            i {
                font-weight: 900;
            }
        }
    }
    @include iphone-x {
        .bottom-aligned {
            padding-bottom: env(safe-area-inset-bottom);
            padding-bottom: 20px;
            .timeline {
                bottom: calc(48px + env(safe-area-inset-bottom));
                bottom: 60px;
            }
        }
    }
}
@include desktop {
    .watch-video-page {
        &::v-deep {
            button.lg {
                min-width: 96px !important;
                height: 96px !important;
                i {
                    font-size: 32px !important;
                }
            }
            .bottom-aligned {
                padding: 8px 32px 32px;
            }
            &.desired-paused {
                .bottom-aligned {
                    transform: translateY(-52px);
                }
                .timeline {
                    transform: translateY(-32px);
                }
            }
            // HIDE STUFF
            .video-timing-list,
            .timing-count,
            .comment-button {
                display: none;
            }

            // TIMELINE
            .timeline {
                bottom: 12px;
                left: 32px;
                width: calc(100% - 2 * 32px);
            }
            .timeline-wrapper {
                background: rgba($dark100, 25%);
                .knob {
                    display: none;
                }
                .rail {
                    background: rgba(white, 25%);
                }
            }

            .before-start-overlay {
                button {
                    min-width: 128px !important;
                    height: 128px !important;
                    i {
                        font-size: 32px !important;
                    }
                }
            }

            // PREVIEW LIST
            .preview-list {
                position: absolute;
                right: 32px;
                bottom: 16vh;
                padding: 16px;
                border-radius: 16px;
                .product-preview {
                    width: 208px;
                    border-radius: 16px;
                    .price-wrapper {
                        padding: 0 16px;
                        .price {
                            font-size: 20px;
                            font-weight: 700;
                        }
                    }
                }
            }
            // VIDEO TIMER
            .video-timer {
                border: none !important;
                background: rgba(255, 255, 255, 0.25) !important;
                -webkit-backdrop-filter: blur(8px) brightness(80%) !important;
                backdrop-filter: blur(8px) brightness(80%) !important;
                height: 32px !important;
                padding: 0 16px !important;
                font-size: 14px !important;
            }
            // BUTTONS
            .wishlist-count,
            .basket-count {
                height: 64px !important;
                padding: 0 32px !important;
                font-size: 20px !important;
                i {
                    font-size: 20px !important;
                    margin-right: 8px !important;
                }
            }
            .bottom-aligned {
                .bottom {
                    align-items: flex-end !important;
                }
            }
            // PDP DRAWER
            .product-details-drawer {
                .image-rail {
                }
                .pagination {
                    display: none;
                }
                .body-rail {
                    padding-top: 0 !important;
                    transform: none !important;
                    padding-bottom: 232px !important;
                }
            }
        } // End v-deep
    }
}

/* Flip screen */
.flip-screen-overlay {
	display: block;
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
}

.flip-screen-container {
	width: 220px;
	height: 250px;
	position: absolute;
	padding: 8px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background: $almostBlack;
	border-radius: $borderRadiusLg;
	opacity: 0.8;
	& p {
		color: white;
		display: inline-block;
		width: 100%;
		text-align: center;
		margin: 0;
		font-size: 15px;
		opacity: 0;
	}
}

.flip-screen-icon {
	position: relative;
	left: 50%;
	margin: 10px -40px;
	width: 0;
	height: 0;
	border: 0 solid white;
	border-radius: 10px;
	box-sizing: border-box;
	& i {
		text-align: center;
		width: 100%;
		line-height: 100px;
		font-size: 30px;
		color: white;
		opacity: 0;
	}
}

/* Flip screen animations */
.flip-screen-overlay {
    animation: displayFlipScreenIcon 4s forwards ease;
}
.flip-screen-overlay .flip-screen-icon i {
	animation: fadeIn 0.5s 0.8s forwards ease;
}
.flip-screen-overlay .flip-screen-container p {
	animation: fadeIn 0.5s 1.3s forwards ease;
}

@media screen and (orientation:portrait) {
    .flip-screen-overlay .flip-screen-icon {
        margin-top: 5px;
        margin-bottom: 5px;
	    animation: sizeIncrease 0.5s forwards ease,
		    borderIncrease 0.5s 0.5s forwards ease, rotateRight 0.7s 1s forwards ease;
    }
}

@media screen and (orientation:landscape) { 
    .flip-screen-overlay .flip-screen-icon {
        animation: sizeIncrease 0.5s forwards ease,
		borderIncrease 0.5s 0.5s forwards ease,
        rotateRight 0s 0.2s forwards ease,
        rotateLeft 0.7s 1s forwards ease;
    }
}

/* Flip screen keyframes */
/* Display animation */
@keyframes displayFlipScreenIcon {
	100% { visibility: hidden; }
}
/* Animate width + height */
@keyframes sizeIncrease {
	0% { width: 0; height: 10px; }
	50% { width: 80px; height: 10px; }
	100% { width: 80px; height: 140px; }
}

/* Add borders */
@keyframes borderIncrease {
	100% { border-width: 17px 7px; }
}

/* fade-in  */
@keyframes fadeIn {
	100% { opacity: 1; }
}

/* Rotate device */
@keyframes rotateRight {
	100% { transform: rotate(90deg); }
}

/* Rotate device back */
@keyframes rotateLeft {
	100% { transform: rotate(0deg); }
}

</style>
