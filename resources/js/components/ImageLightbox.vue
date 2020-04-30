<template>
    <div class="image-lightbox" @click.exact="$emit('hide')">
        <div class="img-wrapper" @click.stop="onZoom" :class="{'zoom-active': zoomActive}" ref="imgWrapper">
            <img :src="imageToDisplay" ref="img">
        </div>
        <strong>Image {{index+1}} of {{images.length}}</strong>
        <span>Use the arrow keys change image. Click to zoom (centers the area you click)</span>
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
        index: this.defaultIndex || 0,
        zoomActive: false,
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
            let imageToReturn = image
            if (image.search('bestseller') >= 0) {
                const thumbnailTrueIndex = image.search('true')
                // test if the image is shown as thumbnail
                if (thumbnailTrueIndex >= 0) {
                    imageToReturn = `${image.substring(0, thumbnailTrueIndex)}false`
                }
            }
            return imageToReturn
        }
    },
    methods: {
        ...mapMutations('lightbox', ['SET_LIGHTBOX_VISIBLE']),
        onZoom(e) {
            // Toggle zoom
            this.zoomActive = !this.zoomActive
            if (this.zoomActive) {
                // Set the zoom position
                const img = this.$refs.img
                const wrapper = this.$refs.imgWrapper.getBoundingClientRect()
                const wrapperLeft = wrapper.left
                const wrapperWidth = wrapper.width
                const wrapperTop = wrapper.top
                const wrapperHeight = wrapper.height
                const mouseY = e.clientY
                const mouseX = e.clientX
                const widthPercent = (mouseX - wrapperLeft) / wrapperWidth * 100
                const heightPercent = (mouseY - wrapperTop) / wrapperHeight * 100
                const heightStyle = heightPercent > 75 ? 'bottom' : heightPercent > 25 ? 'center' : 'top'
                const widthStyle = widthPercent > 75 ? 'right' : widthPercent > 25 ? 'center' : 'left'
                const objectPositionStyle = widthStyle + ' ' + heightStyle
                console.log('position', objectPositionStyle)
                img.style.objectPosition = objectPositionStyle
            }
        },
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
                if (key == 'Escape')
                    this.$emit('hide')
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
        flex-direction: column;
        span {
            display: block;
        }
        strong {
            display: block;
            color: white;
        }
        .img-wrapper {
            max-height: 90vh;
            max-width: 67.5vh;
            cursor: zoom-in;
            position: relative;
            overflow: hidden;
            &.zoom-active {
                cursor: zoom-out;
                img {
                    object-fit: none;
                }
            }
        }
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }
    }
</style>