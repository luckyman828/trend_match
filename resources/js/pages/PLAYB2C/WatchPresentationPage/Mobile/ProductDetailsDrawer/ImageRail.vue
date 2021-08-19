<template>
    <div class="image-rail">
        <div class="rail" v-dragscroll>
            <BaseImageSizer class="img-wrapper" fit="cover" v-for="(picture, index) in variant.pictures" :key="index">
                <BaseVariantImage
                    class="variant-image"
                    :variant="variant"
                    :index="index"
                    size="lg"
                    v-observe-visibility="{
                        callback: isVisible => isVisible && pictureVisibilityChange(index),
                        intersection: {
                            threshold: 0.7,
                        },
                    }"
                />
            </BaseImageSizer>
        </div>
        <div class="pagination flex-list center-h">
            <BaseButton buttonClass="no-bg circle dark xs" v-for="(picture, index) in variant.pictures" :key="index">
                <i class="fa-circle" :class="pictureIndex == index ? 'fas' : 'far'"></i>
            </BaseButton>
        </div>
    </div>
</template>

<script>
export default {
    name: 'imageRail',
    props: ['variant'],
    data() {
        return {
            pictureIndex: 0,
        }
    },
    methods: {
        pictureVisibilityChange(index) {
            this.pictureIndex = index
        },
    },
}
</script>

<style lang="scss" scoped>
.image-rail {
    .rail {
        display: flex;
        overflow-x: scroll;
        padding-bottom: 8px;
        margin-bottom: -8px;
        width: 100%;
        .img-wrapper {
            position: relative;
            width: 60vw;
            min-width: 60vw;
            flex: 1 0 auto;
            overflow: hidden;
            margin-right: 8px;
            border-radius: 4px;
            border: $borderElSoft;
            background: $grey300;
            .variant-image {
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        }
        &::after {
            content: '';
            height: 1px;
            width: 16px;
            display: block;
        }
    }
    .pagination {
        i {
            font-size: 12px;
        }
    }
}
</style>
