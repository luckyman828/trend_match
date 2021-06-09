<template>
    <div class="product-preview flex-list flex-v min" @click="SET_PDP_ITEM({ product: variant.product, variant })">
        <BaseImageSizer class="img-wrapper" fit="cover">
            <BaseVariantImage :variant="variant" size="sm" />
        </BaseImageSizer>
        <div class="price-wrapper">
            <span class="price"
                >{{ variant.product.yourPrice.wholesale_price }} {{ variant.product.yourPrice.currency }}</span
            >
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'PreviewListItem',
    props: ['variant'],
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-preview {
    width: 80px;
    background: white;
    border-radius: $borderRadiusSm;
    overflow: hidden;
    .img-wrapper {
        width: 100%;
    }
    .price-wrapper {
        padding: 0 4px;
    }
    .price {
        font-size: 12px;
        font-weight: 500;
    }
}
</style>
