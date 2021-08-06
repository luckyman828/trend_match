<template>
    <BaseFlyin position="right" :show="show" class="saved-styles-flyin" @close="$emit('close')">
        <template v-slot:header="slotProps" v-if="show">
            <div class="header-inner flex-list center-v justify">
                <button class="close circle" @click="slotProps.close()">
                    <i class="far fa-times"></i>
                </button>
                <BaseSegmentedControl
                    theme="light"
                    activeClass="white"
                    :options="segmentedControlOptions"
                    :currentOptionIndex="view == 'Wishlist' ? 0 : 1"
                    v-slot="slotProps"
                    @change="$event => $emit('update:view', segmentedControlOptions[$event].name)"
                >
                    <i :class="[slotProps.option.iconClass]"></i>
                    <span>{{ slotProps.option.name }}</span>
                </BaseSegmentedControl>
                <div></div>
            </div>
        </template>
        <template v-if="show">
            <div class="saved-item-list flex-list flex-v space-sm">
                <template v-if="view == 'Wishlist'">
                    <WishlistItem
                        v-for="item in wishlistSnapshot"
                        :key="item.id"
                        :variant="item"
                        @add-to-basket="$event => (addToBasketVariant = $event)"
                        @update="saveWishlistSnapshot"
                    />
                </template>
                <template v-else>
                    <BasketItem v-for="item in basket" :key="item.id" :item="item" />
                </template>
            </div>
        </template>
        <AddToBasketSelector
            class="add-to-basket-selector"
            :class="{ show: !!addToBasketVariant }"
            :variant="addToBasketVariant"
            :hideWishlist="true"
            :autoHide="true"
            @hide="addToBasketVariant = null"
        />
        <div class="cta-wrapper">
            <BaseButton
                v-if="view == 'Basket'"
                class="checkout-button full-width"
                buttonClass="dark full-width checkout-button"
                :disabled="basket.length <= 0 || !isEmbedded || !(playShop && playShop.checkout_url)"
                @click="onGoToCheckout"
            >
                <template v-slot:iconLeft>
                    <i class="far fa-credit-card white"></i>
                </template>
                <span
                    >Go to Checkout
                    <template v-if="basket.length > 0"> - {{ basketTotal }} {{ basketCurrency }}</template></span
                >
            </BaseButton>
        </div>
    </BaseFlyin>
</template>

<script>
import { mapGetters } from 'vuex'
import WishlistItem from './WishlistItem'
import BasketItem from './BasketItem'
import AddToBasketSelector from '../AddToBasketSelector'
import RequestInputAreaVue from '../../../../SelectionPage/ProductFlyin/RequestInputArea.vue'

export default {
    name: 'savedStylesFlyin',
    components: { BasketItem, WishlistItem, AddToBasketSelector },
    props: ['view', 'show'],
    data() {
        return {
            wishlistSnapshot: [],
            addToBasketVariant: null,
        }
    },
    computed: {
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
            wishlistTotal: 'getWishlistTotal',
        }),
        ...mapGetters('basket', {
            basket: 'getBasket',
            basketTotal: 'getBasketTotal',
            basketCurrency: 'getBasketCurrency',
        }),
        ...mapGetters('player', {
            isEmbedded: 'getIsEmbedded',
        }),
        ...mapGetters('workspaces', {
            playShop: 'getWebshop',
        }),
        segmentedControlOptions() {
            return [
                { name: 'Wishlist', iconClass: 'far fa-heart', count: this.wishlist.length },
                { name: 'Basket', iconClass: 'far fa-shopping-bag', count: this.basket.length },
            ]
        },
    },
    watch: {
        show(isVisible) {
            if (isVisible) {
                this.saveWishlistSnapshot()
            }
        },
        view() {
            this.saveWishlistSnapshot()
        },
    },
    methods: {
        saveWishlistSnapshot() {
            this.wishlistSnapshot = [...this.wishlist]
        },
        onGoToCheckout() {
            this.$store.dispatch('basket/goToCheckout')
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.saved-styles-flyin {
    &::v-deep {
        .flyin {
            min-width: 0;
            width: 384px;
            .body {
                padding: 8px;
                background: $bluegrey250;
            }
        }
        .overlay {
            opacity: 0;
        }
    }
    .header-inner {
        padding: 8px;
        background: white;
    }
    .add-to-basket-selector {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
        transform: translateY(calc(100% + 8px));
        transition: transform 0.2s ease-out;
        &.show {
            transform: none;
        }
    }
    .cta-wrapper {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 16px;
    }
}
</style>
