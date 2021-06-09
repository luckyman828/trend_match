<template>
    <v-popover trigger="hover" placement="right" popoverClass="min pad-xs" ref="popover">
        <div
            class="variant-preview flex-list flex-v min"
            v-if="variant"
            @click="SET_PDP_ITEM({ product: variant.product, variant })"
        >
            <BaseImageSizer class="img-wrapper" fit="cover">
                <BaseVariantImage :variant="variant" size="sm" />
            </BaseImageSizer>
            <div class="price-wrapper">
                <span class="price"
                    >{{ variant.product.yourPrice.wholesale_price }} {{ variant.product.yourPrice.currency }}</span
                >
            </div>
        </div>
        <div class="action-list flex-list space-xs" slot="popover">
            <AddToWishlistButton :variants="[variant]" class="invisible true-square float-icon-hover" />
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
import { mapMutations } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton.vue'
import AddToBasketButton from '../AddToBasketButton'

export default {
    name: 'PreviewListItem',
    components: { AddToWishlistButton, AddToBasketButton },
    props: ['variant'],
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

.variant-preview {
    width: 100%;
    background: white;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px;
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
}
</style>
