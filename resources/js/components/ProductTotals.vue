<template>
    <div class="product-totals">
        <span>{{selectedCount}} selected</span>
        <span>{{products.length}} showing</span>
        <span>{{totalProductCount}} records</span>
     </div>
</template>

<script>
export default {
    name: 'product-totals',
    props: [
        'selectedCount',
        'products',
        'totalProductCount'
    ],
}
</script>

<style scoped lang="scss">
    .product-totals {
        position: absolute;
        right: 0;
        top: -40px;
        height: 40px;
        line-height: 40px;
    }
    span {
        font-weight: 500;
        font-size: 14px;
        margin-right: 20px;
    }
</style>
