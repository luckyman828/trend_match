<template>
    <div class="main-image-section flex-list space-md">
        <MainImage
            :variant="variant"
            :imgIndex="imgIndex"
            @click.native="onShowLightbox(0)"
            :key="variant.id + '-' + imgIndex"
        />
        <ImageRail
            :variant="variant"
            :imgIndex.sync="imgIndex"
            v-if="variant.pictures.length > 1"
            @show-lightbox="onShowLightbox"
        />
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
    methods: {
        onShowLightbox(index) {
            this.$store.commit('lightbox/SET_LIGHTBOX_VISIBLE', true)
            const images = this.variant.pictures.map(picture => picture.url)
            this.$store.commit('lightbox/SET_LIGHTBOX_IMAGES', images)
            const lightboxIndex = index != null ? index : 0
            this.$store.commit('lightbox/SET_LIGHTBOX_IMAGE_INDEX', lightboxIndex)
        },
    },
}
</script>

<style lang="scss" scoped>
.main-image-section {
    height: 320px;
}
</style>
