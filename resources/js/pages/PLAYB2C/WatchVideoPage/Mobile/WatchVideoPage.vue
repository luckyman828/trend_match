<template>
    <div class="watch-video-page" :class="`desired-${desiredStatus}`">
        <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false" :hideTimeline="true">
            <BeforeStartOverlay :video="video" v-if="!playerStarted" @start="onStartPlaying" />

            <VideoTitle :video="video" />

            <template v-if="playerStarted">
                <div class="bottom-aligned flex-list flex-v md">
                    <PreviewList v-if="currentTiming" />
                    <div class="top flex-list justify">
                        <button class="white lg circle"><i class="far fa-comment"></i></button>
                        <AddToWishlistButton v-if="currentTiming" />
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
                            <button class="wishlist-count pill white">
                                <i class="far fa-heart"></i>
                                <span>{{ wishlist.length }}</span>
                            </button>
                            <button class="basket-count pill white">
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
                <!-- <ProductActions @show-chat="showChatInput = true" />
                <ChatInput v-if="showChatInput" @close="showChatInput = false" />
                <ChatArea />
                <ProductPreview />
                <ProductDetailsDrawer
                    :show="!!sidebarProduct"
                    :product="sidebarProduct"
                    @close="SET_SIDEBAR_PRODUCT(null)"
                />
                <CartDrawer /> -->
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
import ProductDetailsDrawer from './ProductDetailsDrawer/'
import AddToWishlistButton from './AddToWishlistButton'

export default {
    name: 'watchVideoPage',
    components: {
        VideoPlayer,
        VideoTimeline,
        BeforeStartOverlay,
        VideoTitle,
        PreviewList,
        ProductDetailsDrawer,
        AddToWishlistButton,
    },
    data: function() {
        return {
            basket: [],
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
</style>
