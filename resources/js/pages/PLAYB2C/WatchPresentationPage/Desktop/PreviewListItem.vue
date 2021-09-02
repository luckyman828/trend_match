<template>
    <v-popover
        trigger="hover"
        :open="showPopover || sizePopoverOpen"
        placement="right"
        popoverClass="min pad-xs allow-overflow"
        ref="popover"
        @hide="onHidePopover"
    >
        <div
            class="preview-list-item flex-list flex-v min"
            v-if="variant"
            @click="SET_PDP_ITEM({ product: variant.product, variant })"
            @mouseenter="showPopover = true"
        >
            <BaseImageSizer class="img-wrapper" fit="cover">
                <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
                <div class="labels">
                    <button class="pill red xs" v-if="!variant.inStock">
                        <span>Sold out</span>
                    </button>
                </div>
            </BaseImageSizer>
            <div class="price-wrapper flex-list">
                <CurrentPrice :product="variant.product" />
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
        <div
            class="action-list flex-list space-xs"
            slot="popover"
            ref="actionPopover"
            :id="`action-popover-${variant.id}`"
        >
            <AddToWishlistButton :variants="[variant]" class="no-bg true-square float-icon-hover" theme="no-bg" />
            <AddToBasketButton
                :variant="variant"
                textStyle="none"
                buttonClass="no-bg true-square float-icon-hover"
                :resetOnSubmit="true"
                :popoverContainer="`#action-popover-${variant.id}`"
                :sizePopoverOpen.sync="sizePopoverOpen"
                @update:sizePopoverOpen="$emit('size-popover-open', $event)"
            />
        </div>
    </v-popover>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton.vue'
import AddToBasketButton from '../AddToBasketButton'
import CurrentPrice from '../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../components/PLAY/prices/OldPrice'

export default {
    name: 'PreviewListItem',
    components: { AddToWishlistButton, AddToBasketButton, CurrentPrice, OldPrice },
    props: ['variant'],
    data() {
        return {
            sizePopoverOpen: false,
            showPopover: false,
        }
    },
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
    watch: {
        sizePopoverOpen(isOpen) {
            if (!isOpen) this.hidePopover()
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
        hidePopover() {
            this.$refs.popover.hide()
        },
        onHidePopover() {
            if (this.sizePopoverOpen) {
                this.$refs.popover.show()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
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
    .labels {
        position: absolute;
        bottom: 4px;
        left: 4px;
    }
    img.sold-out {
        opacity: 0.5;
    }
}
</style>
