<template>
    <div
        class="watch-video-page"
        :class="[
            `desired-${desiredStatus}`,
            { 'recently-started': recentlyStarted },
            { 'show-timing-list': showTimingList },
        ]"
    >
        <VideoPlayer :video="video" :autoplay="false">
            <template v-slot:beforeStart>
                <BeforeStartOverlay :video="video" />
            </template>

            <PresentationTitle :presentation="presentation" />
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
                    class="circle"
                    :class="!currentTiming && 'disabled'"
                    :disabled="!currentTiming"
                    :variants="currentTiming && currentTiming.variantList"
                />
                <v-popover trigger="click" :autoHide="false" :disabled="!currentTiming" ref="addToBasketPopover">
                    <BaseButtonV2 class="pill white" :disabled="!currentTiming">
                        <i class="far fa-shopping-bag"></i>
                        <span>Add to basket</span>
                    </BaseButtonV2>
                    <AddToBasketPopover
                        slot="popover"
                        :variants="currentTiming && currentTiming.variantList"
                        @hide="$refs.addToBasketPopover.hide()"
                    />
                </v-popover>
            </div>

            <PreviewList />

            <PlayerControls class="player-controls" @show-timing-list="showTimingList = !showTimingList" />

            <TimingListDrawer :show="showTimingList" @close="showTimingList = false" />

            <ProductDetailsFlyin :show="!!pdpItem" @close="SET_PDP_ITEM(null)" />
            <SavedStylesFlyin
                :show="!!showSavedProductsDrawer"
                :view.sync="savedProductsView"
                @close="showSavedProductsDrawer = false"
            />
        </VideoPlayer>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../../../components/PLAY/VideoPlayer'
import PlayerControls from '../../../../components/PLAY/PresentationPlayer/Desktop/PlayerControls'

import BeforeStartOverlay from './BeforeStartOverlay'
import PresentationTitle from './PresentationTitle'
import PreviewList from './PreviewList'
import AddToWishlistButton from '../AddToWishlistButton'
import AddToBasketPopover from './AddToBasketPopover'

import ProductDetailsFlyin from './ProductDetailsFlyin/'
import SavedStylesFlyin from './SavedStylesFlyin/'
import TimingListDrawer from './TimingListDrawer/'

export default {
    name: 'watchPresentationPage',
    components: {
        VideoPlayer,
        PlayerControls,
        BeforeStartOverlay,
        PresentationTitle,
        PreviewList,
        ProductDetailsFlyin,
        SavedStylesFlyin,
        AddToWishlistButton,
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
            addToBasketVariant: null,
            showTimingList: null,
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            presentation: 'getPresentation',
            videoTimings: 'getTimings',
            pdpItem: 'getPdpItem',
            currentTimingIndex: 'getCurrentTimingIndex',
            currentTiming: 'getCurrentTiming',
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
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
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
        transition: transform 0.2s ease-out;
        transform: translateX(-50%);
        z-index: 2;
    }
    .player-controls {
        z-index: 2;
    }
    .wishlist-button {
        &.active {
            i {
                font-weight: 900;
            }
        }
    }
    &.show-timing-list {
        .bottom-center-items {
            transform: translate(-50%, -216px);
        }
        &::v-deep {
            .player-controls {
                background: none;
            }
        }
    }
}
</style>
