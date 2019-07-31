<template>
    <div class="card selected-controller" :class="{active: selected.length}">
        <div class="inner">
            <span>{{selected.length}} of {{productTotals.products}} selected</span>
            <span :class="{active: method == 'in'}" class="button" @click="setMethod('in')">In</span>
            <span :class="{active: method == 'out'}" class="button" @click="setMethod('out')">Out</span>
            <span class="button green" @click="onSubmitAction()">Choose action</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'selectedController',
    props: [
        'selected',
        'productTotals'
    ],
    data: function() { return {
        method: ''
    }},
    methods: {
        setMethod(method) {
            this.method = method
        },
        onSubmitAction() {
            this.$emit('onSelectedAction', this.method)
        },
    }
}
</script>

<style scoped lang="scss">
    span {
        display: inline-block;
    }
    .selected-controller {
        position: fixed;
        bottom: 20px;
        left: 50%;
        box-shadow: 0 3px 6px rgba(0,0,0,.5);
        transform: translateY(calc(100% + 20px));
        margin: 0;
        transition: .3s;
        &.active {
            transform: none;
        }
    }
</style>
