<template>
    <div class="tab" :class="[{'active': active}, {'has-count': count != null}, {'disabled': disabled}]" @click="!disabled && change($event)">
        <span>{{label}}</span>
        <div class="toggle" v-if="toggle"><BaseCheckbox @change="$emit('toggle', $event)"/>{{toggle}}</div>
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
        'toggle',
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
        border: $borderModule;
        border-radius: $borderRadiusModule $borderRadiusModule 0 0;
        background: $bgTab;
        color: $fontColorTab;
        .toggle {
            display: flex;
            font-size: 12px;
            .checkbox {
                margin-right: 4px;
            }
        }
        .pill.count {
            color: $fontSoft;
            &.primary {
                color: white;
            }
        }
        &:hover:not(.disabled):not(.active) {
            background: $bgTabHover;
            color: $fontColorTabHover;
        }
        &.active {
            background: $bgTabActive;
            color: $fontColorTabActive;
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