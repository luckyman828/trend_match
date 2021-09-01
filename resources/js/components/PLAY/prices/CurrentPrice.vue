<template>
    <div class="current-price ft-bd" v-if="product.yourPrice.wholesale_price">
        {{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}
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
    color: $red;
    font-size: 11px;
}
</style>
