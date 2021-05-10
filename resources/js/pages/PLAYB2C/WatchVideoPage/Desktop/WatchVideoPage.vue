<template>
    <div class="watch-video-page" :class="[`desired-${desiredStatus}`, { 'recently-started': recentlyStarted }]">
        <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false" :hideTimeline="true">
            <template v-slot:beforeStart>
                <BeforeStartOverlay :video="video" />
            </template>

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
import PlayerControls from '../../../../components/common/VideoPlayer/Desktop/PlayerControls'

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
        PlayerControls,
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
            showControls: true,
            showCart: false,
            showChatInput: false,
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
            recentlyStarted: 'getPlayerRecentlyStarted',
            playerStarted: 'getPlayerStarted',
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
        ...mapMutations('videoPlayer', ['SET_DESIRED_STATUS']),
        ...mapMutations('videoPresentation', ['ADD_TIMING', 'SET_SIDEBAR_PRODUCT']),
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
</style>
