<template>
    <div class="watch-video-page" :class="[`desired-${desiredStatus}`, { 'recently-started': recentlyStarted }]">
        <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false" :hideTimeline="true">
            <BeforeStartOverlay :video="video" v-if="!playerStarted" @start="onStartPlaying" />

            <VideoTitle :video="video" />

            <template v-if="playerStarted">
                <div class="bottom-aligned flex-list flex-v md">
                    <PreviewList v-if="currentTiming" />
                    <div class="top flex-list justify">
                        <button class="white lg circle comment-button"><i class="far fa-comment"></i></button>
                        <AddToWishlistButton class="lg like-button" v-if="currentTiming" />
                    </div>
                    <div class="bottom flex-list equal-width justify center-v">
                        <div class="left">
                            <div class="video-timer pill grey sm">
                                <span>{{ timestamp | timestampify }} / {{ duration | timestampify }}</span>
                            </div>
                        </div>
                        <div class="center">
                            <div class="timing-count pill white sm">
                                <span>{{ currentTimingIndex + 1 }} of {{ videoTimings.length }}</span>
                            </div>
                        </div>
                        <div class="flex-list">
                            <button
                                class="wishlist-count pill white"
                                @click="
                                    showSavedProductsDrawer = true
                                    savedProductsView = 'wishlist'
                                "
                            >
                                <i class="far fa-heart"></i>
                                <span>{{ wishlist.length }}</span>
                            </button>
                            <button
                                class="basket-count pill white"
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
                <VideoTimeline />

                <ProductDetailsDrawer
                    :show="!!sidebarProduct"
                    :product="sidebarProduct"
                    @close="SET_SIDEBAR_PRODUCT(null)"
                />
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
import VideoPlayer from '../../../../components/common/VideoPlayer/'
import VideoTimeline from '../../../../components/common/VideoPlayer/VideoTimeline'

import BeforeStartOverlay from './BeforeStartOverlay'
import VideoTitle from './VideoTitle'
import PreviewList from './PreviewList'
import AddToWishlistButton from './AddToWishlistButton'

import ProductDetailsDrawer from './ProductDetailsDrawer/'
import SavedStylesDrawer from './SavedStylesDrawer/'

export default {
    name: 'watchVideoPage',
    components: {
        VideoPlayer,
        VideoTimeline,
        BeforeStartOverlay,
        VideoTitle,
        PreviewList,
        ProductDetailsDrawer,
        SavedStylesDrawer,
        AddToWishlistButton,
    },
    data: function() {
        return {
            showSavedProductsDrawer: false,
            savedProductsView: 'wishlist',
            playerStarted: false,
            showControls: true,
            showCart: false,
            showChatInput: false,
            playerStartedTester: null,
            recentlyStarted: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            videoTimings: 'getVideoTimings',
            video: 'getCurrentVideo',
            sidebarProduct: 'getSidebarProduct',
        }),
        ...mapGetters('videoPlayer', {
            isPlaying: 'getIsPlaying',
            videoId: 'getProviderVideoId',
            provider: 'getProvider',
            playerStatus: 'getStatus',
            desiredStatus: 'getDesiredStatus',
            videoType: 'getVideoType',
            duration: 'getDuration',
            timestamp: 'getTimestamp',
            currentTimingIndex: 'getCurrentTimingIndex',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
        }),
        ...mapGetters('basket', {
            basket: 'getBasket',
        }),
        currentTimingIsInWishlist() {
            return this.currentTiming && this.wishlist.find(product => product.id == this.currentTiming.product.id)
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['initTimings']),
        ...mapActions('videoPlayer', ['togglePlaying']),
        ...mapMutations('videoPlayer', ['SET_DESIRED_STATUS']),
        ...mapMutations('videoPresentation', ['ADD_TIMING', 'SET_SIDEBAR_PRODUCT']),
        onStartPlaying() {
            this.togglePlaying()
            this.playerStarted = true
            const interval = 1000
            this.SET_DESIRED_STATUS('playing')
            this.playerStartedTester = setInterval(() => {
                if (!this.isPlaying && this.desiredStatus == 'playing') {
                    this.togglePlaying()
                } else {
                    clearInterval(this.playerStartedTester)
                }
            }, interval)

            // Add a class to the player to tell that it has recently been started
            this.recentlyStarted = true
            setTimeout(() => {
                this.recentlyStarted = false
            }, 4000)
        },
        onAddToWishlist() {
            // Check if we should add or remove
            if (this.currentTimingIsInWishlist) {
                // Remove
                const index = this.wishlist.findIndex(product => product.id == this.currentTiming.product.id)
                this.wishlist.splice(index, 1)
            } else {
                // Add
                this.wishlist.push(this.currentTiming.product)
            }
        },
    },
    created() {},
    destroyed() {
        if (this.playerStartedTester) clearInterval(this.playerStartedTester)
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
        bottom: -8px;
        left: 16px;
        width: calc(100% - 2 * 16px);
        transition: $videoPauseTransition;
    }
    &.desired-paused {
        .bottom-aligned {
            transform: translateY(-32px);
        }
        .timeline {
            transform: translateY(-24px);
        }
    }

    .bottom-aligned {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 12px 8px;
        transition: $videoPauseTransition;
        pointer-events: none;
        > * {
            pointer-events: all;
        }
    }
    .wishlist-button {
        &.active {
            i {
                font-weight: 900;
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
<style lang="scss">
@import '~@/_variables.scss';
@include desktop {
    // ADD TO BASKET SELECTOR
    .add-to-basket-selector {
        border-radius: 32px !important;
        padding: 32px !important;
        height: auto !important;
        &:not(.show) {
            bottom: -160px !important;
        }
        .flex-list.equal-width {
            margin-left: 16px;
            .trigger {
                width: 100%;
                padding-right: 32px;
            }
        }
        button {
            height: 92px !important;
            min-width: 92px !important;
            font-size: 28px !important;
            i {
                font-size: 28px !important;
            }
        }
    }
}
</style>
