<template>
    <div class="watch-video-page" :class="[`desired-${desiredStatus}`, { 'recently-started': recentlyStarted }]">
        <VideoPlayer :video="video" :autoplay="false">
            <template v-slot:beforeStart>
                <BeforeStartOverlay />
            </template>

            <PresentationTitle :presentation="presentation" />

            <template v-if="playerStarted">
                <div class="bottom-aligned flex-list flex-v md">
                    <div class="over-timeline flex-list flex-v md">
                        <PreviewList v-if="currentTiming" />
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
                            <button v-if="!isLive" class="invisible white circle ghost-hover" @click="togglePlaying">
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

                <ProductDetailsDrawer :show="!!pdpItem" @close="SET_PDP_ITEM(null)" />
                <SavedStylesDrawer
                    :show="!!showSavedProductsDrawer"
                    :view.sync="savedProductsView"
                    @close="showSavedProductsDrawer = false"
                />
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
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
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
</style>
