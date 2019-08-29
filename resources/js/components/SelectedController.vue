<template>
    <div class="card selected-controller" :class="{active: selected.length}">
        <div class="inner">
            <span>{{selected.length}} of {{totalCount}} selected</span>
            <span :class="[{active: method == 'in'}, {green: method == 'in'}]" class="button green-hover" @click="setMethod('in')">In <i class="far fa-heart"></i></span>
            <span :class="[{active: method == 'out'}, {red: method == 'out'}]" class="button red-hover" @click="setMethod('out')">Out <i class="far fa-times-circle"></i></span>
            <span :class="{disabled: method == ''}" class="button green submit" @click="onSubmitAction()">Choose action</span>
        </div>
        <span class="clear-selection" @click="clearSelection">Clear selection</span>
    </div>
</template>

<script>
export default {
    name: 'selectedController',
    props: [
        'selected',
        'totalCount'
    ],
    data: function() { return {
        method: ''
    }},
    methods: {
        setMethod(method) {
            if (this.method == method)
                this.method = ''
                else this.method = method
        },
        onSubmitAction() {
            this.$emit('onSelectedAction', this.method)
            this.method = ''
        },
        clearSelection() {
            this.$emit('onClearSelection')
        }
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
        left: calc(50% + 100px); //Sidebar width / 2
        box-shadow: 0 3px 6px rgba(0,0,0,.5);
        transform: translateX(-50%) translateY(calc(100% + 20px));
        margin: 0;
        transition: .3s;
        background: $light1;
        padding: 28px 32px 20px;
        &.active {
            transform: translateX(-50%) translateY(0);
        }
    }
    .clear-selection {
        position: absolute;
        z-index: 1;
        top: 8px;
        color: $red;
        cursor: pointer;
        font-size: 12px;
        &:hover {
            opacity: .8;
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
        // color: $dark;
        // border-color: white;
        // background: white;
        &.submit {
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
