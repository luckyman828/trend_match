<template>
    <div class="preview-list-item" :class="{ current: isCurrent }">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
        </BaseImageSizer>
    </div>
</template>

<script>
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'previewListItem',
    components: { SavingPercentagePill },
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
</style>
