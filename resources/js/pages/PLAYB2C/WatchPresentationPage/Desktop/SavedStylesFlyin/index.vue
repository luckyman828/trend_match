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
                        v-for="item in wishlist"
                        :key="item.id"
                        :variant="item"
                        @update="saveWishlistSnapshot"
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
        <div class="cta-wrapper">
            <!-- <BaseButton
                v-if="view == 'Basket'"
                class="checkout-button full-width"
                buttonClass="dark full-width checkout-button"
                :disabled="basket.length <= 0 || !isEmbedded || !(playShop && playShop.checkout_url)"
                :disabledTooltip="!isEmbedded ? 'Presentation must be opened from webshop to go to checkout' : ''"
                @click="onGoToCheckout"
            >
                <template v-slot:iconLeft>
                    <i class="far fa-credit-card white"></i>
                </template>
                <span
                    >Go to Checkout
                    <template v-if="basket.length > 0"> - {{ basketTotal }} {{ basketCurrency }}</template></span
                >
            </BaseButton> -->

            <!-- TEMP  -->
            <BaseButton
                v-if="view == 'Basket'"
                class="checkout-button full-width"
                buttonClass="dark full-width checkout-button"
                @click="onGoToCheckout"
            >
                <span>{{ $t('play.continueShopping') }}</span>
            </BaseButton>
            <!-- END TEMP  -->
        </div>

        <BaseContextMenu ref="addToWishlistPopover" :autoWidth="true">
            <AddToWishlistPopover :product="popoverProduct" />
        </BaseContextMenu>

        <BaseContextMenu ref="addToBasketPopover" :autoWidth="true">
            <AddToBasketPopover
                :variants="popoverProduct ? popoverProduct.variants : []"
                :sizePopoverContainer="false"
            />
        </BaseContextMenu>
    </BaseFlyin>
</template>

<script>
import { mapGetters } from 'vuex'
import WishlistItem from './WishlistItem'
import BasketItem from './BasketItem'
import AddToWishlistPopover from './AddToWishlistPopover'
import AddToBasketPopover from '../AddToBasketPopover'

export default {
    name: 'savedStylesFlyin',
    components: { BasketItem, WishlistItem, AddToWishlistPopover, AddToBasketPopover },
    props: ['view', 'show'],
    data() {
        return {
            wishlistSnapshot: [],
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
        segmentedControlOptions() {
            return [
                { name: 'Wishlist', iconClass: 'far fa-heart', count: this.wishlist.length },
                { name: this.$t('play.basket.basket'), iconClass: 'far fa-shopping-bag', count: this.basket.length },
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
            this.$store.dispatch('playEmbed/postMessage', { action: 'closePresentation' })
            // this.$store.dispatch('basket/goToCheckout')
        },
        onEditWishlistVariants(mouseEvent, variant) {
            this.popoverProduct = variant.product
            this.$refs.addToWishlistPopover.show(mouseEvent)
        },
        onEditBasketVariants(mouseEvent, basketItem) {
            this.popoverProduct = basketItem.variant.product
            this.$refs.addToBasketPopover.show(mouseEvent)
        },
    },
}
</script>

<style lang="scss" scoped>
.saved-styles-flyin {
    &::v-deep {
        .flyin {
            min-width: 0;
            width: 384px;
            > .flyin-inner {
                > .body {
                    padding: 8px;
                    background: $bluegrey250;
                }
            }
        }
        .overlay {
            opacity: 0;
        }
    }
    .saved-item-list {
        padding-bottom: 60px;
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
