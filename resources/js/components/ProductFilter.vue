<template>
    <div class="product-filter">
        <span :class="{active: currentFilter == 'overview'}" class="button" @click="setProductFilter('overview')">Overview {{productTotals.products}}</span>
        <span :class="{active: currentFilter == 'ins'}" class="button" @click="setProductFilter('ins')">IN Styles {{productTotals.ins}}</span>
        <span :class="{active: currentFilter == 'outs'}" class="button" @click="setProductFilter('outs')">OUT Styles {{productTotals.outs}}</span>
    </div>
</template>

<script>
export default {
    name: 'productFilter',
    props: [
        'productTotals',
        'currentFilter'
    ],
    methods: {
        setProductFilter(filter) {
            this.$emit('setProductFilter', filter)
        }
    }
}
</script>

<style scoped lang="scss">
    .button {
        display: inline-block;
    }
</style>
