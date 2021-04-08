<template>
    <label class="checkbox-input input-wrapper" :class="{ 'read-only': disabled }" :tabindex="disabled ? -1 : 0">
        <BaseCheckbox
            ref="input"
            class="checkbox"
            :disabled="disabled"
            :value="modelValue ? modelValue : value"
            :modelValue="modelValue ? value : true"
            @change="onChange"
        />
        <span><slot /></span>
    </label>
</template>

<script>
export default {
    name: 'baseCheckboxInputField',
    props: ['value', 'disabled', 'modelValue'],
    methods: {
        onChange(value) {
            this.$emit('input', value)
            this.$emit('check', value)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.checkbox-input {
    &.read-only {
        cursor: auto;
    }
    cursor: pointer;
    user-select: none;
    &.input-wrapper:not(.multiline):not(.drop-area) {
        display: flex;
        align-items: center;
        height: auto;
        min-height: 40px;
        &.small,
        &.sm {
            min-height: 32px;
            padding-left: 8px;
        }
    }
    .checkbox {
        margin-right: 8px;
    }
}
</style>
