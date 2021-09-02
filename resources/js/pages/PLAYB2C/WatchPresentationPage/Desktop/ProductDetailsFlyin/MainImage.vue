<template>
    <div class="main-image" :style="{ backgroundImage: `url(${variantImage(variant, imgIndex)})` }">
        <BaseImageSizer class="img-wrapper" fit="contain">
            <BaseVariantImage :variant="variant" :index="imgIndex" :class="{ 'sold-out': !variant.inStock }" />
        </BaseImageSizer>
    </div>
</template>

<script>
import variantImage from '../../../../../mixins/variantImage'
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'mainImage',
    components: { SavingPercentagePill },
    mixins: [variantImage],
    props: ['variant', 'imgIndex'],
}
</script>

<style lang="scss" scoped>
.main-image {
    background-size: 100% 100%;
    border: $borderEl;
    border-radius: $borderRadiusSm;
    overflow: hidden;
    .img-wrapper {
        width: 240px;
        backdrop-filter: blur(10px);
    }
    .labels {
        position: absolute;
        bottom: 8px;
        left: 4px;
    }
}
</style>
