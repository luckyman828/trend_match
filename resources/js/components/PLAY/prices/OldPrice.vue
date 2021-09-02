<template>
    <div class="old-price ft-10 ft-bd ft-strike" v-if="variant.yourPrice.wholesale_price">
        {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
    </div>
</template>

<script>
export default {
    name: 'OldPrice',
    props: {
        variant: {
            type: Object,
        },
    },
}
</script>

<style></style>
