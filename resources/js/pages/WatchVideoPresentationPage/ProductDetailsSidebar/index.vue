<template>
    <div class="product-details-sidebar" v-if="product" tabindex="-1">
        <ProductPreview :product="product" @click.native="SET_SIDEBAR_PRODUCT(product)" />
        <ProductDetailsSidebar :product="sidebarProduct" :show="!!sidebarProduct" @close="SET_SIDEBAR_PRODUCT(null)" />
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
        ...mapGetters('videoPresentation', {
            sidebarProduct: 'getSidebarProduct',
        }),
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_SIDEBAR_PRODUCT']),
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
