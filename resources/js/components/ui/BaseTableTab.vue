<template>
    <div class="tab" :class="[{'active': active}, {'has-count': count != null}]" @click="change">
        <span>{{label}}</span>
        <span v-if="count != null" class="count pill sm" :class="active ? 'primary' : 'white'">
            <span>{{count}}</span>
        </span>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    props: [
        'modelValue',
        'value',
        'label',
        'count',
    ],
    computed: {
        active() {
            return this.modelValue == this.value
        }
    },
    methods: {
        change() {
            this.$emit('input', this.modelValue)
            this.$emit('change', this.modelValue)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    $borderRadius: 4px;
    .tab {
        height: 44px;
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
        &.has-count {
            justify-content: space-between;
            padding: 0 32px $borderRadius;
        }
    }

</style>