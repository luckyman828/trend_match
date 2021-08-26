<template>
    <div class="preview-list-item" :class="{ current: isCurrent }">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <button class="pill red xxs" v-if="!variant.inStock">
                    <span>Out</span>
                </button>
            </div>
        </BaseImageSizer>
    </div>
</template>

<script>
export default {
    name: 'previewListItem',
    props: ['variant', 'isCurrent'],
}
</script>

<style scoped lang="scss">
.preview-list-item {
    width: 44px;
    border-radius: 6px;
    overflow: hidden;
    &.current {
        border: solid $primary 2px;
    }
}
.image {
    width: 100%;
}
.labels {
    position: absolute;
    bottom: 4px;
    left: 4px;
}
// img.sold-out {
//     opacity: 0.5;
// }
</style>
