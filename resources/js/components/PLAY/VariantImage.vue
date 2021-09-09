<template>
    <div class="variant-image">
        <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
        <div class="labels flex-list flex-wrap flex-end-v" :class="labelSize == 'xxs' ? 'space-sm' : ''">
            <SavingPercentagePill :variant="variant" size="xxs" />
            <button
                class="pill red"
                :class="labelSize"
                v-if="!variant.inStock"
                :style="`margin-top: ${labelSize == 'xxs' ? 2 : 4}px`"
            >
                <span>Sold out</span>
            </button>
        </div>
    </div>
</template>

<script>
import SavingPercentagePill from './prices/SavingPercentagePill'

export default {
    name: 'VariantImage',
    components: { SavingPercentagePill },
    props: {
        variant: {},
        labelSize: { default: 'xs' },
    },
}
</script>

<style scoped lang="scss">
.labels {
    position: absolute;
    bottom: 4px;
    left: 4px;
}
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    img.sold-out {
        opacity: 0.5;
    }
}
</style>
