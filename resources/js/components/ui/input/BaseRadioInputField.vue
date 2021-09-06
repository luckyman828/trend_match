<template>
    <label class="radio-input input-wrapper" :class="{ 'read-only': disabled }" :tabindex="disabled ? -1 : 0">
        <BaseRadiobox
            ref="input"
            class="radio"
            :disabled="disabled"
            :value="value"
            :modelValue="modelValue"
            @change="$emit('input', $event)"
        />
        <span><slot /></span>
    </label>
</template>

<script>
export default {
    name: 'baseRadioInputField',
    model: {
        prop: 'modelValue',
    },
    props: ['value', 'modelValue', 'disabled'],
}
</script>

<style lang="scss" scoped>
.radio-input {
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
    }
    .radio {
        margin-right: 8px;
    }
}
</style>
