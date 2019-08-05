<template>
    <div class="product-tabs">
        <span :class="{active: currentFilter == 'overview'}" class="tab" @click="setProductFilter('overview')">Overview <span class="count">{{productTotals.final.products}}</span></span>
        <span :class="{active: currentFilter == 'nds'}" class="tab" @click="setProductFilter('nds')">ND Styles <span class="count">{{productTotals.final.nds}}</span></span>
        <span :class="{active: currentFilter == 'ins'}" class="tab" @click="setProductFilter('ins')">IN Styles <span class="count">{{productTotals.final.ins}}</span></span>
        <span :class="{active: currentFilter == 'outs'}" class="tab" @click="setProductFilter('outs')">OUT Styles <span class="count">{{productTotals.final.outs}}</span></span>
    </div>
</template>

<script>
export default {
    name: 'productTabs',
    props: [
        'productTotals',
        'currentFilter',
    ],
    methods: {
        setProductFilter(filter) {
            this.$emit('setProductFilter', filter)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .tab {
        display: inline-block;
        width: 184px;
        background: $light1;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: $dark2;
        margin-right: 4px;
        font-weight: 500;
        cursor: pointer;
        border-radius: 6px 6px 0 0;
        .count {
            margin-left: 8px;
        }
        &.active {
            background: white;
            color: $dark;
            box-shadow: 0 -2px 4px rgba(0,0,0,.05);
            .count {
                color: $dark2;
            }
        }
    }
</style>
