<template>
    <div class="product-preview flex-list flex-v min" @click="SET_PDP_ITEM({ product: variant.product, variant })">
        <BaseImageSizer class="img-wrapper" fit="cover">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <button class="pill red xs" v-if="!variant.inStock">
                    <span>Sold out</span>
                </button>
            </div>
        </BaseImageSizer>
        <div class="price-wrapper flex-list">
            <CurrentPrice :variant="variant" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CurrentPrice from '../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../components/PLAY/prices/OldPrice'

export default {
    name: 'PreviewListItem',
    components: { CurrentPrice, OldPrice },
    props: ['variant'],
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
    },
}
</script>

<style lang="scss" scoped>
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
