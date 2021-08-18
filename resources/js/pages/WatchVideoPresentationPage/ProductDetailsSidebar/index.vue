<template>
    <div class="product-details-sidebar" tabindex="-1">
        <ProductPreview v-if="product" :product="product" @click.native="SET_SIDEBAR_PRODUCT(product)" />
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
        return {}
    },
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('videoPresentation', {
            sidebarProduct: 'getSidebarProduct',
        }),
    },
    watch: {
        currentTiming(newVal, oldVal) {
            if (!newVal || (!!oldVal && newVal.product_id == oldVal.product_id)) return
            if (!!this.sidebarProduct && this.sidebarProduct.id != newVal.product_id)
                this.SET_SIDEBAR_PRODUCT(newVal.product)
        },
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_SIDEBAR_PRODUCT']),
    },
    created() {
        console.log('hello')
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-details-sidebar {
    pointer-events: all;
    display: inline-block;
    background: white;
    &::v-deep {
        .flyin-inner {
            background: white;
        }
    }
}
</style>
