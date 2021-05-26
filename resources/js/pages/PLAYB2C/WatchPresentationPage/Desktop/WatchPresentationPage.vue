<template>
    <div class="watch-video-page" :class="[`desired-${desiredStatus}`, { 'recently-started': recentlyStarted }]">
        <VideoPlayer :video="video" :autoplay="false" :hideTimeline="true">
            <template v-slot:beforeStart>
                <BeforeStartOverlay :video="video" />
            </template>

            <VideoTitle :video="video" />
            <div class="top-right-items flex-list">
                <button
                    class="wishlist-count pill white w-xxs"
                    @click="
                        showSavedProductsDrawer = true
                        savedProductsView = 'Wishlist'
                    "
                >
                    <i class="far fa-heart"></i>
                    <span>{{ wishlist.length }}</span>
                </button>
                <button
                    class="basket-count pill white w-xxs"
                    @click="
                        showSavedProductsDrawer = true
                        savedProductsView = 'Basket'
                    "
                >
                    <i class="far fa-shopping-bag"></i>
                    <span>{{ basket.length }}</span>
                </button>
            </div>

            <div class="bottom-center-items flex-list">
                <AddToWishlistButton
                    class="circle white"
                    :class="!currentVariant && 'disabled'"
                    :disabled="!currentVariant"
                    :variants="currentTiming.variants"
                />
                <BaseButton buttonClass="white pill" :disabled="!currentVariant">
                    <i class="far fa-shopping-bag" />
                    <span>Add to basket</span>
                </BaseButton>
            </div>

            <PreviewList v-if="currentTiming" />

            <PlayerControls />

            <ProductDetailsFlyin :show="!!sidebarItem" @close="SET_SIDEBAR_ITEM(null)" />
            <SavedStylesFlyin
                :show="!!showSavedProductsDrawer"
                :view.sync="savedProductsView"
                @close="showSavedProductsDrawer = false"
            />
        </VideoPlayer>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../../../components/PLAY/VideoPlayer'
import PlayerControls from '../../../../components/PLAY/PresentationPlayer/Desktop/PlayerControls'

import BeforeStartOverlay from './BeforeStartOverlay'
import VideoTitle from './VideoTitle'
import PreviewList from './PreviewList'
import AddToWishlistButton from './AddToWishlistButton'

import ProductDetailsFlyin from './ProductDetailsFlyin/'
import SavedStylesFlyin from './SavedStylesFlyin/'

export default {
    name: 'watchVideoPage',
    components: {
        VideoPlayer,
        PlayerControls,
        BeforeStartOverlay,
        VideoTitle,
        PreviewList,
        ProductDetailsFlyin,
        SavedStylesFlyin,
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
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            videoTimings: 'getTimings',
            sidebarItem: 'getSidebarItem',
            currentTimingIndex: 'getCurrentTimingIndex',
            currentTiming: 'getCurrentTiming',
            currentVariant: 'getCurrentVariant',
        }),
        ...mapGetters('player', {
            isPlaying: 'getIsPlaying',
            desiredStatus: 'getDesiredStatus',
            duration: 'getDuration',
            timestamp: 'getTimestamp',
            recentlyStarted: 'getPlayerRecentlyStarted',
            playerStarted: 'getPlayerStarted',
        }),
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
        }),
        ...mapGetters('basket', {
            basket: 'getBasket',
        }),
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_SIDEBAR_ITEM']),
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
    .top-right-items {
        position: absolute;
        right: 12px;
        top: 8px;
        @include bg-blur;
        padding: 8px;
        border-radius: 52px;
    }
    .bottom-center-items {
        position: absolute;
        bottom: 48px;
        margin: 0 auto;
        @include bg-blur;
        padding: 8px;
        border-radius: 52px;
        left: 50%;
        transform: translateX(-50%);
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
