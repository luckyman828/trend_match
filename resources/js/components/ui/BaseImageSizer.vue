<template>
    <div class="img-sizer">
        <div class="sizer" :class="fit" :style="{ paddingTop: paddingTop }">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseImgSizer',
    props: ['fit', 'aspect'],
    computed: {
        paddingTop() {
            if (!this.aspect) return '133.3333%'
            const aspect = this.aspect
            const aspectWidth = aspect.split(':')[0]
            const aspectHeight = aspect.split(':')[1]
            return (aspectWidth / aspectHeight) * 100 + '%'
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
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
    img,
    > .image,
    .img,
    .resize-target {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
