<template>
    <BaseDrawer position="bottom" :show="show" class="product-details-drawer" @close="$emit('close')">
        <template v-slot:header v-if="product">
            <div class="header-inner flex-list justify">
                <h3 class="product-name">{{ product.name }}</h3>
                <span class="price">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
            </div>
        </template>
        <template v-slot:default v-if="product">
            <div class="body-inner">
                <div class="variant-list">
                    <div class="image-rail">
                        <BaseVariantImage
                            class="variant-image"
                            v-for="variant in product.variants"
                            :key="variant.id"
                            :variant="variant"
                            size="sm"
                        />
                    </div>
                    <!-- <div class="pagination" v-for="variant in product.variants" :key="variant.id"></div> -->
                </div>
            </div>
        </template>
    </BaseDrawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'productDetailsDrawer',
    props: ['show'],
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-details-drawer {
    pointer-events: all;
    line-height: 1.4;
    .product-name {
        max-width: 50%;
        margin: 0;
    }
    .variant-list {
        .image-rail {
            display: flex;
            padding-left: 16px;
            overflow: auto;
            .variant-image {
                width: 270px;
                height: 360px;
                object-fit: cover;
                margin-right: 12px;
            }
        }
    }
}
</style>
