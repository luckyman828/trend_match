<template>
    <label class="checkbox-input input-wrapper" :class="{'read-only': disabled}"
    :tabindex="disabled ? -1 : 0">
        <BaseCheckbox ref="input" class="checkbox" :disabled="disabled"
        :value="value" :modelValue="true" @change="$emit('input', $event)"/>
        <span><slot/></span>
    </label>
</template>

<script>
export default {
    name: 'baseCheckboxInputField',
    props: [
        'value',
        'disabled'
    ],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.checkbox-input {
    &.read-only{
        cursor: auto;
    }
    cursor: pointer;
    user-select: none;
    &.input-wrapper:not(.multiline):not(.drop-area) {
        display: flex;
        align-items: center;
        height: auto;
        min-height: 40px;
        &.small {
            min-height: 32px;
            width: auto;
        }
    }
    .checkbox {
        margin-right: 8px;
    }
}
</style>