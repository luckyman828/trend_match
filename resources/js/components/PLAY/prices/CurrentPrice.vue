<template>
    <div class="current-price ft-bd" :class="variant.yourPrice.wholesale_price && 'color-red'">
        {{
            variant.yourPrice.wholesale_price
                ? variant.yourPrice.wholesale_price
                : variant.yourPrice.recommended_retail_price
        }}
        {{ variant.yourPrice.currency }}
    </div>
</template>

<script>
export default {
    name: 'CurrentPrice',
    props: {
        variant: {
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
