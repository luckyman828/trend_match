<template>
    <div class="product-preview flex-list flex-v min" @click="SET_PDP_ITEM({ product: variant.product, variant })">
        <BaseImageSizer class="img-wrapper" fit="contain">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <SavingPercentagePill size="xxs" :variant="variant" />
                <button class="pill red xxs" v-if="!variant.inStock">
                    <span>{{ $t('play.product.soldOut') }}</span>
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
import SavingPercentagePill from '../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'PreviewListItem',
    components: { CurrentPrice, OldPrice, SavingPercentagePill },
    props: ['variant'],
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
    },
}
</script>

<style lang="scss" scoped>
.product-preview {
    width: 65px;
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
        font-size: 10px;
        font-weight: 500;
    }
    .labels {
        position: absolute;
        bottom: 4px;
        left: 4px;
        line-height: 15px;
    }
    img.sold-out {
        opacity: 0.5;
    }
}
</style>
