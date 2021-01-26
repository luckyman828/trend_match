<template>
    <div class="product-preview flex-list flex-v min" v-if="product" @click="SET_SIDEBAR_PRODUCT(product)">
        <div class="img-wrapper">
            <BaseVariantImage :variant="product.variants[0]" size="sm" />
        </div>
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
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_SIDEBAR_PRODUCT']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-preview {
    width: 80px;
    position: absolute;
    right: 12px;
    bottom: 120px;
    background: white;
    border-radius: 2px;
    // box-shadow: $shadowEl;
    overflow: hidden;
    .img-wrapper {
        width: 100%;
        height: 102px;
        img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .price-wrapper {
        padding: 2px 4px;
    }
    .price {
        font-size: 12px;
        font-weight: 500;
    }
}
</style>
