<template>
    <div class="tab" :class="[{'active': active}, {'has-count': count != null}, {'disabled': disabled}]" @click="!disabled && change($event)">
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
        'disabled',
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
    .tab {
        height: 44px;
        width: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: 700;
        font-size: 14px;
        color: $dark15;
        cursor: pointer;
        padding-bottom: $borderRadiusModule;
        color: $fontSoft;
        border: $borderModule;
        border-radius: $borderRadiusModule $borderRadiusModule 0 0;
        background: $bgModuleInactive;
        .pill.count {
            color: $fontSoft;
            &.primary {
                color: white;
            }
        }
        &:hover:not(.disabled) {
            background: $bgModuleHover;
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
            padding: 0 32px $borderRadiusModule;
        }
        &.disabled {
            cursor: default;
            opacity: .5;
        }
    }

</style>