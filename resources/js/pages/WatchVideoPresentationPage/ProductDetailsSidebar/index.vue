<template>
    <div class="product-details-sidebar" v-if="product">
        <ProductPreview @click.native="showFlyin = true" />
        <ProductDetailsSidebar v-if="product" :product="product" :show="showFlyin" @close="showFlyin = false" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProductPreview from './ProductPreview'
import ProductDetailsSidebar from './ProductDetailsSidebar'
export default {
    name: 'productDetailsSidebarHandler',
    components: {
        ProductPreview,
        ProductDetailsSidebar,
    },
    data: function() {
        return {
            showFlyin: false,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-details-sidebar {
    pointer-events: all;
    display: inline-block;
}
</style>
