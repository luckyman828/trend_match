<template>
    <div class="old-price ft-10 ft-bd ft-strike" v-if="product.yourPrice.wholesale_price">
        {{ product.yourPrice.recommended_retail_price }} {{ product.yourPrice.currency }}
    </div>
</template>

<script>
export default {
    name: 'OldPrice',
    props: {
        product: {
            type: Object,
        },
    },
}
</script>

<style></style>
