<template>
    <!-- <div
        class="watch-video-page"
        @wheel.capture.prevent="onScroll"
        :class="[
            `desired-${desiredStatus}`,
            { 'recently-started': recentlyStarted },
            { 'show-timing-list': showTimingList },
        ]"
    > -->
    <div
        class="watch-video-page"
        :class="[
            `desired-${desiredStatus}`,
            { 'recently-started': recentlyStarted },
            { 'show-timing-list': showTimingList },
            { 'pdp-open': !!pdpItem },
        ]"
    >
        <VideoPlayer :video="video" :autoplay="true" :muted="true" >
            <template v-slot:beforeStart>
                <BeforeStartOverlay :video="video" />
            </template>
            
            <div class="volume-screen-overlay">
                <div class="volume-screen-container" @click="togglePlayerMuted(false)">
                    <div class="volume-screen-icon"><i :class="['fas', isMuted ? 'fa-volume-mute' : 'fa-volume']"></i></div>
                    <p class="font-bold">Video is muted</p>
                    <p class="leading-snug">Click to unmute</p>
                </div>
            </div>

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
                <v-popover
                    trigger="click"
                    :autoHide="false"
                    :disabled="!currentTiming && !addToBasketPopoverIsVisible"
                    ref="addToBasketPopover"
                    @show="onShowAddToBasketPopover"
                    @hide="onHideBasketPopover"
                >
                    <BaseStateAlternatingButton
                        buttonClass="pill"
                        :disabled="!currentTiming"
                        :active="
                            addToBasketPopoverIsVisible ? addToBasketPopoverVariantIsInBasket : currentTimingIsInBasket
                        "
                        :baseState="{
                            class: 'white',
                            iconLeft: 'far fa-shopping-bag',
                            text: $t('play.basket.addLong'),
                        }"
                        :activeState="{
                            class: 'primary',
                            iconLeft: 'far fa-shopping-bag white',
                            text: $t('play.basket.addedLong'),
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
                        <span>{{ $t('play.basket.view') }}</span>
                    </button>
                    <button
                        class="white pill lg w-lg"
                        @click="$store.dispatch('playEmbed/postMessage', { action: 'closePresentation' })"
                    >
                        <span>{{ $t('play.continueShopping') }}</span>
                    </button>
                </div>
            </template>
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
            showTimingList: false,
            addToBasketPopoverVariantList: [],
            addToBasketPopoverIsVisible: false,
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
            isMuted: 'getIsMuted',
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
        ...mapActions('player', ['togglePlayerMuted']),
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

/* Volume muted */
.volume {
    &-screen-overlay {
        opacity: 0;
        display: block;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }

    &-screen-container {
        cursor: pointer;
        width: 220px;
        height: 220px;
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

    &-screen-icon {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        height: 130px;
        display: flex;
        align-items: center;
        & i {
            text-align: center;
            width: 100%;
            line-height: 100px;
            font-size: 100px;
            color: white;
            opacity: 0;
        }
    }
}

/* Volume muted animations */
.volume-screen-overlay {
    animation: toggleAnimation 4s forwards ease;
}

.volume {
    &-screen-overlay &-screen-icon i {
	    animation: fadeIn 0.5s 0.8s forwards ease;
    }

    &-screen-overlay &-screen-container p {
	    animation: fadeIn 0.5s 1.1s forwards ease;
    }
}

/* Volume muted keyframes */
/* Display animation */
@keyframes toggleAnimation {
	0% { opacity: 0 }
    30% { opacity: 1 }
	100% { 
        opacity: 1;
        visibility: hidden;
    }
}

/* fade-in  */
@keyframes fadeIn {
	100% { opacity: 1; }
}
</style>

<style lang="scss">
.watch-video-page {
    .flyin-wrapper .overlay {
        z-index: 1;
        width: calc(100% - 384px);
    }
    .flyin.placement-right + .overlay {
        left: auto;
        right: 0;
    }
}
</style>
