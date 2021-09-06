<template>
    <div class="img-sizer" :style="{ width: controlWidth && aspectWidth }">
        <div class="sizer" :class="fit" :style="{ paddingTop: aspectHeight }">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseImgSizer',
    props: ['fit', 'aspect', 'controlWidth'],
    computed: {
        aspectWidth() {
            if (!this.aspect) return '133.3333%'
            const aspect = this.aspect
            const aspectWidth = aspect.split(':')[0]
            const aspectHeight = aspect.split(':')[1]
            return (aspectWidth / aspectHeight) * 100 + '%'
        },
        aspectHeight() {
            if (!this.aspect) return '133.3333%'
            const aspect = this.aspect
            const aspectWidth = aspect.split(':')[0]
            const aspectHeight = aspect.split(':')[1]
            return (aspectHeight / aspectWidth) * 100 + '%'
        },
    },
}
</script>

<style lang="scss" scoped>
.img-sizer .sizer {
    height: 0;
    padding-top: 133.3333%;
    position: relative;
    &.contain img {
        object-fit: contain;
    }
    &.cover img {
        object-fit: cover;
    }
    > img,
    > .image,
    > .img,
    > .resize-target {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-position: center;
    }
}
</style>
