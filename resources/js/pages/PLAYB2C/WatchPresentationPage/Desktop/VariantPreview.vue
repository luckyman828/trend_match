<template>
    <v-popover trigger="hover" placement="right" popoverClass="min pad-xs">
        <div
            class="variant-preview flex-list flex-v min"
            v-if="variant"
            @click="SET_SIDEBAR_ITEM({ product: variant.product, variant })"
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
            <button
                class="invisible true-square float-icon-hover"
                @click="toggleInWishlist(variant)"
                :class="isInWishlist ? 'primary active' : 'dark'"
            >
                <i class="far fa-heart ft-16"></i>
            </button>
            <button class="invisible true-square float-icon-hover" :class="isInWishlist ? 'primary active' : 'dark'">
                <i class="far fa-shopping-bag ft-16"></i>
            </button>
        </div>
    </v-popover>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'play.variantPreview',
    props: ['variant'],
    computed: {
        ...mapGetters('wishlist', {
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        isInWishlist() {
            return this.getVariantIsInWishlist(this.variant)
        },
    },
    methods: {
        ...mapActions('wishlist', ['toggleInWishlist']),
        ...mapMutations('playPresentation', ['SET_SIDEBAR_ITEM']),
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
        padding: 0 4px;
    }
    .price {
        font-size: 12px;
        font-weight: 500;
    }
}
</style>
