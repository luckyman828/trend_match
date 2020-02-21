<template>
    <label class="checkbox-input input-wrapper">
        <BaseCheckbox ref="input" class="checkbox" 
        :value="value" :modelValue="true" @change="$emit('input', $event)"/>
        <span><slot/></span>
    </label>
</template>

<script>
export default {
    name: 'baseCheckboxInputField',
    props: [
        'value',
    ],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.checkbox-input {
    cursor: pointer;
    user-select: none;
    &.input-wrapper:not(.multiline):not(.drop-area) {
        display: flex;
        align-items: center;
        height: auto;
        min-height: 40px;
    }
    .checkbox {
        margin-right: 8px;
    }
}
</style>