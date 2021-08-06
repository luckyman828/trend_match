<template>
    <v-popover trigger="hover" placement="right" popoverClass="min pad-xs" ref="popover">
        <div
            class="preview-list-item flex-list flex-v min"
            v-if="variant"
            @click="SET_PDP_ITEM({ product: variant.product, variant })"
        >
            <BaseImageSizer class="img-wrapper" fit="cover">
                <BaseVariantImage :variant="variant" size="sm" />
            </BaseImageSizer>
            <div class="price-wrapper">
                <span class="price"
                    >{{
                        variant.product.yourPrice.wholesale_price
                            ? variant.product.yourPrice.wholesale_price
                            : variant.product.yourPrice.recommended_retail_price
                    }}
                    {{ variant.product.yourPrice.currency }}</span
                >
            </div>
            <div class="icon-list flex-list space-sm">
                <div class="circle xs red" v-if="isInWishlist">
                    <i class="fas fa-heart"></i>
                </div>
                <button class="circle xs primary" v-if="isInBasket">
                    <i class="far fa-shopping-bag">
                        <i class="fas fa-check pos-right pos-bottom white"></i>
                    </i>
                </button>
            </div>
        </div>
        <div class="action-list flex-list space-xs" slot="popover">
            <AddToWishlistButton
                :variants="[variant]"
                class="invisible true-square float-icon-hover"
                theme="invisible"
            />
            <AddToBasketButton
                :variant="variant"
                textStyle="none"
                buttonClass="invisible true-square float-icon-hover"
                :resetOnSubmit="true"
            />
        </div>
    </v-popover>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton.vue'
import AddToBasketButton from '../AddToBasketButton'

export default {
    name: 'PreviewListItem',
    components: { AddToWishlistButton, AddToBasketButton },
    props: ['variant'],
    computed: {
        ...mapGetters('basket', {
            getItemIsInBasket: 'getItemIsInBasket',
        }),
        ...mapGetters('wishlist', {
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        isInWishlist() {
            return this.getVariantIsInWishlist(this.variant)
        },
        isInBasket() {
            return this.getItemIsInBasket({
                variant: this.variant,
            })
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
        hidePopover() {
            this.$refs.popover.hide()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.preview-list-item {
    width: 100%;
    background: white;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px;
    position: relative;
    .img-wrapper {
        width: 100%;
    }
    .price-wrapper {
        padding: 0 8px;
    }
    .price {
        font-size: 12px;
        font-weight: 500;
    }
    .icon-list {
        top: 4px;
        right: 4px;
        position: absolute;
    }
}
</style>
