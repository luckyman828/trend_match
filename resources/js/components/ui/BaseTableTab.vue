<template>
    <div class="tab" :class="{'active': modelValue == value}" @click="change">
        <span>{{label}}</span>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    props: [
        'modelValue',
        'value',
        'label'
    ],
    methods: {
        change() {
            this.$emit('input', this.value)
            this.$emit('change', this.value)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    $borderRadius: 4px;
    .tab {
        height: 40px;
        width: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: $borderRadius $borderRadius 0 0;
        background: $light1;
        font-weight: 700;
        font-size: 14px;
        color: $dark15;
        cursor: pointer;
        padding-bottom: $borderRadius;
        box-sizing: content-box;
        &:hover {
            background: $light2;
            color: $dark05;
        }
        &.active {
            background: white;
            color: $primary;
            cursor: auto;
        }
        &:not(:last-child) {
            margin-right: 8px;
        }
    }

</style>