<template>
    <div class="image-lightbox" @click.exact="$emit('hide')">
        <div class="img-wrapper">
            <img :src="imageToDisplay" @click.stop="nextImg">
            <span>Image {{index+1}} of {{images.length}}</span>
            <span>Use the arrow keys or click image to show next</span>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'imageLightbox',
    props: [
        'defaultIndex',
        'images',
    ],
    data: function() { return {
        index: this.defaultIndex || 0
    }},
    watch: {
        // Reset the index when our images changes
        images(newVal, oldVal) {
            this.index = 0
        }
    },
    computed: {
        imageToDisplay () {
            const index = this.index
            const image = this.images[index]
            // Check if it's an image from bestseller
            if (image.search('bestseller') >= 0) {
                const imageToReturn = `${image.substring(0, image.length-4)}false`
                return imageToReturn
            } else return image
        }
    },
    methods: {
        ...mapMutations('lightbox', ['SET_LIGHTBOX_VISIBLE']),
        nextImg() {
            if (this.index < this.images.length-1) {
                this.index++
            } else {
                this.index = 0
            }
        },
        prevImg() {
            if (this.index != 0) {
                this.index--
            } else {
                this.index = this.images.length-1
            }
        },
        hotkeyHandler(event) {
            const key = event.code
            // Only do these if the current target is not the comment box
            {
                if (key == 'ArrowRight')
                    this.nextImg()
                if (key == 'ArrowLeft')
                    this.prevImg()
            }
        }
    },
    created() {
        this.SET_LIGHTBOX_VISIBLE(true)
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        this.SET_LIGHTBOX_VISIBLE(false)
        document.body.removeEventListener('keydown', this.hotkeyHandler)
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
        strong {
            display: block;
            color: white;
        }
        img {
            max-height: 90vh;
            max-width: 80vw;
            cursor: pointer;
        }
    }
</style>