<template>
    <div class="preview-list flex-list flex-v bg-blur">
        <ProductPreview v-for="product in timingProducts" :key="product.id" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductPreview from './ProductPreview'
export default {
    name: 'preview-list',
    components: { ProductPreview },
    computed: {
        ...mapGetters('playPresentation', {
            timing: 'getCurrentTiming',
        }),
        timingProducts() {
            return this.timing ? [this.timing.product] : []
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.preview-list {
    top: 8px;
    left: 16px;
    padding: 8px;
    border-radius: 8px;
    width: 128px;
    transition: transform $videoPauseTransition;
    .desired-paused &,
    .recently-started & {
        transform: translateY(60px);
    }
}
</style>
