<template>
    <div class="card selected-controller" :class="{active: selected.length}">
        <div class="inner">
            <span>{{selected.length}} of {{productTotals.final.products}} selected</span>
            <span :class="{active: method == 'in'}" class="button" @click="setMethod('in')">In <i class="far fa-heart"></i></span>
            <span :class="{active: method == 'out'}" class="button" @click="setMethod('out')">Out <i class="far fa-times-circle"></i></span>
            <span :class="{disabled: method == ''}" class="button green" @click="onSubmitAction()">Choose action</span>
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
@import '~@/_variables.scss';

    span {
        display: inline-block;
        font-size: 14px;
        font-weight: 700;
        &:first-child {
            margin-right: 12px;
        }
    }
    .selected-controller {
        position: fixed;
        bottom: 20px;
        left: 50%;
        box-shadow: 0 3px 6px rgba(0,0,0,.5);
        transform: translateY(calc(100% + 20px));
        margin: 0;
        transition: .3s;
        background: $light1;
        padding: 22px 32px;
        &.active {
            transform: none;
        }
    }
    .button {
        width: 86px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        border-radius: 4px;
        padding: 0;
        line-height: 28px;
        position: relative;
        font-weight: 700;
        padding-right: 22px;
        color: $dark;
        border-color: white;
        background: white;
        &.green {
            width: 155px;
            background: $green;
            color: white;
            border-color: $green;
            padding: 0;
            &.disabled {
                pointer-events: none;
                opacity: .5;
            }
        }
        i {
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 5px;
            margin: 0;
        }
        &.active {
            i {
                font-weight: 900;
            }
        }
    }
</style>
