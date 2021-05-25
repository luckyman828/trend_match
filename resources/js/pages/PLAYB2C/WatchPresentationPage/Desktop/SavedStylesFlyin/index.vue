<template>
    <BaseFlyin position="right" :show="show" class="saved-styles-flyin" @close="$emit('close')">
        <template v-slot:header v-if="show">
            <div class="header-inner flex-list justify">
                <div class="flex-list flex-v">
                    <h3 v-if="view == 'wishlist'">Your Wishlist</h3>
                    <h3 v-else>Your Basket</h3>
                    <BaseSegmentedControl
                        theme="light"
                        activeClass="white"
                        :options="segmentedControlOptions"
                        :currentOptionIndex="view == 'wishlist' ? 0 : 1"
                        v-slot="slotProps"
                        @change="$event => $emit('update:view', segmentedControlOptions[$event].name)"
                    >
                        <i :class="[slotProps.option.iconClass]"></i>
                        <span>{{ slotProps.option.size }}</span>
                    </BaseSegmentedControl>
                </div>

                <div class="flex-list flex-v flex-end">
                    <div class="total-price">
                        {{ view == 'wishlist' ? wishlistTotal : basketTotal }} {{ userCurrency }}
                    </div>
                    <button class="small light pill">
                        <i class="far fa-sliders-v-square"></i>
                        <span>Filter</span>
                    </button>
                </div>
            </div>
        </template>
        <template v-if="show">
            <div class="saved-item-list flex-list flex-v min">
                <template v-if="view == 'wishlist'">
                    <WishlistItem
                        v-for="item in wishlistSnapshot"
                        :key="item.id"
                        :variant="item"
                        @add-to-basket="$event => (addToBasketVariant = $event)"
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
                class="checkout-button full-width"
                buttonClass="dark full-width rounded lg checkout-button"
                :disabled="basket.length <= 0"
            >
                <template v-slot:iconLeft>
                    <i class="far fa-credit-card white"></i>
                </template>
                <span>Go to Checkout</span>
            </BaseButton>
        </div>
    </BaseFlyin>
</template>

<script>
import { mapGetters } from 'vuex'
import WishlistItem from './WishlistItem'
import BasketItem from './BasketItem'
import AddToBasketSelector from '../AddToBasketSelector'

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
        }),
        userCurrency() {
            return this.wishlist.length > 0
                ? this.wishlist[0].yourPrice.currency
                : this.basket.length > 0
                ? this.basket[0].variant.yourPrice.currency
                : ''
        },
        segmentedControlOptions() {
            return [
                { name: 'wishlist', iconClass: 'far fa-heart', size: this.wishlist.length },
                { name: 'basket', iconClass: 'far fa-shopping-bag', size: this.basket.length },
            ]
        },
    },
    watch: {
        show(isVisible) {
            if (isVisible) this.wishlistSnapshot = [...this.wishlist]
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
            width: 352px;
        }
    }
    .header-inner {
        padding: 8px 8px 0 16px;
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
}
</style>
