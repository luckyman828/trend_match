<template>
    <div class="main-image-section flex-list space-md">
        <ImageRail :variant="variant" :imgIndex.sync="imgIndex" v-if="variant.pictures.length > 1" />
        <MainImage :variant="variant" :imgIndex="imgIndex" />
    </div>
</template>

<script>
import ImageRail from './ImageRail'
import MainImage from './MainImage'

export default {
    name: 'mainImageSection',
    components: { MainImage, ImageRail },
    props: ['variant'],
    data() {
        return {
            imgIndex: 0,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.main-image-section {
    height: 320px;
}
</style>
