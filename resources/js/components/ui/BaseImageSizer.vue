<template>
    <div class="img-sizer">
        <div class="sizer" :class="fit">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseImgSizer',
    props: ['fit'],
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
    img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
