<template>
    <div class="product-preview flex-list flex-v min" v-if="product" @click="SET_SIDEBAR_PRODUCT(product)">
        <BaseImageSizer class="img-wrapper" fit="cover">
            <BaseVariantImage :variant="product.variants[0]" size="sm" />
        </BaseImageSizer>
        <div class="price-wrapper">
            <span class="price">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'productPreview',
    computed: {
        ...mapGetters('playPresentation', {
            product: 'getCurrentProduct',
        }),
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_SIDEBAR_PRODUCT']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-preview {
    width: 100%;
    background: white;
    border-radius: 2px;
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
