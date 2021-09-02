<template>
    <div class="current-price ft-bd" :class="product.yourPrice.wholesale_price && 'color-red'">
        {{
            product.yourPrice.wholesale_price
                ? product.yourPrice.wholesale_price
                : product.yourPrice.recommended_retail_price
        }}
        {{ product.yourPrice.currency }}
    </div>
</template>

<script>
export default {
    name: 'CurrentPrice',
    props: {
        product: {
            type: Object,
        },
    },
}
</script>

<style lang="scss" scoped>
.current-price {
    font-size: 11px;
}
</style>
