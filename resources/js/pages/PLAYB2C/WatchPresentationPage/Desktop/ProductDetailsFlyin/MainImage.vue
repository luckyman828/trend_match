<template>
    <div class="main-image" :style="{ backgroundImage: `url(${variantImage(variant, imgIndex)})` }">
        <BaseImageSizer class="img-wrapper" fit="contain">
            <BaseVariantImage :variant="variant" :index="imgIndex" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <button class="pill red xs" v-if="!variant.inStock">
                    <span>Sold out</span>
                </button>
            </div>
        </BaseImageSizer>
    </div>
</template>

<script>
import variantImage from '../../../../../mixins/variantImage'

export default {
    name: 'mainImage',
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
