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
        ...mapGetters('videoPlayer', {
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
    margin-left: auto;
    padding: 8px;
    border-radius: 8px;
}
</style>
