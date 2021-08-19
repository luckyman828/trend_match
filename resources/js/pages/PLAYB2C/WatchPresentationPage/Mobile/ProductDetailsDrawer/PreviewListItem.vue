<template>
    <div class="preview-list-item" :class="{ current: isCurrent }">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" />
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
@import '~@/_variables.scss';
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
</style>
