<template>
    <div class="image-lightbox" @click.exact="$emit('hide')">
        <div class="img-wrapper">
            <img :src="images[index]" @click.stop="nextImg">
            <span>Click image to show next</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'imageLightbox',
    props: [
        'defaultIndex',
        'images',
    ],
    data: function() { return {
        index: this.defaultIndex || 0
    }},
    methods: {
        nextImg() {
            if (this.index < this.images.length-1) {
                this.index++
            } else {
                this.index = 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .image-lightbox {
        background: rgba(27, 28, 29, 0.7);
        position: fixed;
        z-index: 999;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        span {
            display: block;
        }
        img {
            max-height: 90vh;
            max-width: 80vw;
            cursor: pointer;
        }
    }
</style>