<template>
    <BaseDrawer position="bottom" :show="show" class="product-details-drawer" @close="$emit('close')">
        <template v-slot:header v-if="show">
            <div class="inner-header flex-list justify">
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
                        {{ view == 'wishlist' ? wishlistTotal : basketTotal | rounded(2) }} {{ userCurrency }}
                    </div>
                    <!-- <button class="small light pill">
                        <i class="far fa-sliders-v-square"></i>
                        <span>Filter</span>
                    </button> -->
                </div>
            </div>
        </template>
        <template v-if="show">
            <div class="saved-item-list flex-list flex-v min">
                <template v-if="view == 'wishlist'">
                    <WishlistItem
                        v-for="item in wishlist"
                        :key="item.id"
                        :variant="item"
                        @add-to-basket="$event => (addToBasketItem = $event)"
                        @edit-wishlist-variants="$event => onEditWishlistVariants($event, item)"
                    />
                </template>
                <template v-else>
                    <BasketItem
                        v-for="item in basket"
                        :key="item.sizeDetail.ref_id"
                        :item="item"
                        @edit-basket-variants="$event => onEditBasketVariants($event, item)"
                    />
                </template>
            </div>
        </template>

        <AddToBasketSelector
            :item="addToBasketItem"
            :show="addToBasketItem"
            :hideWishlist="true"
            :autoHide="true"
            @hide="addToBasketItem = null"
            @click.native="addToBasketItem = null"
        />

        <Portal to="popover">
            <BaseContextMenu ref="addToWishlistPopover" :autoWidth="true">
                <AddToWishlistPopover :product="popoverProduct" />
            </BaseContextMenu>

            <BaseContextMenu ref="addToBasketPopover" :autoWidth="true">
                <AddToBasketPopover
                    :variants="popoverProduct ? popoverProduct.variants : []"
                    :sizePopoverContainer="false"
                />
            </BaseContextMenu>
        </Portal>

        <BaseFloatyBar v-if="view == 'basket'" :show="show" pos="bottom" classes="rounded">
            <!-- <BaseButton
                class="checkout-button full-width"
                buttonClass="dark full-width pill lg checkout-button"
                :disabled="basket.length <= 0 || !isEmbedded || !(playShop && playShop.checkout_url)"
                @click="onGoToCheckout"
            >
                <template v-slot:iconLeft>
                    <i class="far fa-credit-card white"></i>
                </template>
                <span
                    >Go to Checkout<template v-if="basket.length > 0">
                        - {{ basketTotal }} {{ basketCurrency }}</template
                    ></span
                >
            </BaseButton> -->

            <!-- TEMP -->
            <BaseButton
                class="checkout-button full-width"
                buttonClass="dark full-width pill lg checkout-button"
                @click="onGoToCheckout"
            >
                <span>{{ $t('play.continueShopping') }}</span>
            </BaseButton>
            <!-- END TEMP -->
        </BaseFloatyBar>
    </BaseDrawer>
</template>

<script>
import { mapGetters } from 'vuex'
import WishlistItem from './WishlistItem'
import BasketItem from './BasketItem'
import AddToBasketSelector from '../AddToBasketSelector'
import AddToWishlistPopover from './AddToWishlistPopover'
import AddToBasketPopover from '../AddToBasketPopover'

export default {
    name: 'savedStylesDrawer',
    components: { BasketItem, WishlistItem, AddToBasketSelector, AddToWishlistPopover, AddToBasketPopover },
    props: ['view', 'show'],
    data() {
        return {
            wishlistSnapshot: [],
            addToBasketItem: null,
            popoverProduct: null,
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
    methods: {
        onGoToCheckout() {
            this.$store.dispatch('playEmbed/postMessage', { action: 'closePresentation' })
            // this.$store.dispatch('basket/goToCheckout')
        },
        onEditWishlistVariants(mouseEvent, variant) {
            this.popoverProduct = variant.product
            this.$nextTick(() => {
                this.$refs.addToWishlistPopover.show(mouseEvent)
            })
        },
        onEditBasketVariants(mouseEvent, basketItem) {
            this.popoverProduct = basketItem.variant.product
            this.$nextTick(() => {
                this.$refs.addToBasketPopover.show(mouseEvent)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.header {
    h3 {
        margin-bottom: 0;
    }
    .total-price {
        font-weight: 500;
    }
    ::v-deep {
        .checkout-button {
            font-size: 12px;
            font-weight: 500;
        }
    }
}
.saved-item-list {
    padding-bottom: 100px;
}
</style>
