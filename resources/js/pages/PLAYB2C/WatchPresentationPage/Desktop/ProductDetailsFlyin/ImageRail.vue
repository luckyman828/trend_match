<template>
    <div class="image-rail">
        <div class="rail flex-list flex-v space-xs" v-dragscroll>
            <BaseImageSizer
                class="img-wrapper"
                fit="cover"
                v-for="(picture, index) in variant.pictures"
                :key="index"
                @click="$emit('update:imgIndex', index)"
            >
                <BaseVariantImage class="variant-image" :variant="variant" :index="index" size="lg" />
            </BaseImageSizer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'imageRail',
    props: ['variant', 'imgIndex'],
    data() {
        return {
            pictureIndex: 0,
        }
    },
}
</script>

<style lang="scss" scoped>
.image-rail {
    .rail {
        display: flex;
        overflow-y: auto;
        height: 100%;
        margin-right: -4px;
        padding-right: 8px;
        .img-wrapper {
            position: relative;
            width: 48px;
            min-width: 48px;
            border: $borderEl;
            border-radius: $borderRadiusSm;
        }
        &::after {
            content: '';
            height: 16px;
            width: 1px;
            display: block;
        }
    }
}
</style>
