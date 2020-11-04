<template>
    <div class="product-preview flex-list flex-v xs" v-if="product">
        <div class="img-wrapper">
            <BaseVariantImage :variant="product.variants[0]" size="sm" />
        </div>
        <span class="price">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'productPreview',
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-preview {
    width: 80px;
    position: absolute;
    right: 12px;
    bottom: 40px;
    background: white;
    border-radius: $borderRadiusEl;
    box-shadow: $shadowEl;
    overflow: hidden;
    pointer-events: all;
    padding: 4px;
    .img-wrapper {
        width: 100%;
        height: 102px;
        img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .price {
        font-size: 12px;
        font-weight: 500;
        padding: 0 4px;
        font-weight: 700;
    }
}
</style>
