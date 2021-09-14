<template>
    <div class="pill dark" :class="size" v-if="savingPercentage">
        <span>-{{ savingPercentage }}%</span>
    </div>
</template>

<script>
export default {
    name: 'SavingPercentagePill',
    props: {
        variant: { type: Object },
        size: { type: String, default: 'xs' },
    },
    computed: {
        savingPercentage() {
            const price = this.variant.yourPrice
            if (!price) return
            if (!price.wholesale_price || !price.recommended_retail_price) return
            return Math.round((price.wholesale_price / price.recommended_retail_price) * 100)
        },
    },
}
</script>

<style></style>
