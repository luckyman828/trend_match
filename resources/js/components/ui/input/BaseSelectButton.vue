<template>
    <div class="select-button" tabindex="0" :class="{ disabled: disabled }" v-tooltip="disabled && disabledTooltip">
        <span v-if="header" class="header" v-html="header"></span>
        <div class="button-wrapper">
            <label class="select-button">
                <BaseRadiobox
                    v-if="type == 'radio'"
                    :value="modelValue"
                    :modelValue="value"
                    @change="$emit('input', $event)"
                />
                <BaseCheckbox v-else :value="modelValue" :modelValue="value" @change="$emit('input', $event)" />

                <div class="label">
                    <slot />
                </div>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: 'selectButton',
    props: ['type', 'value', 'modelValue', 'label', 'header', 'disabled', 'disabledTooltip'],
    data: function() {
        return {}
    },
}
</script>

<style scoped lang="scss">
.select-button {
    &.disabled .button-wrapper {
        opacity: 0.5;
        pointer-events: none;
    }
    .header {
        font-size: 12px;
        font-weight: 500;
        padding: 0 16px;
        color: $primary;
        margin-bottom: 12px;
        display: inline-block;
    }
    label {
        padding: 8px 16px;
        font-weight: 400;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        .label {
            width: 100%;
        }
        .description {
            font-size: 12px;
            font-weight: 400;
            width: calc(100% - 16px);
            overflow: hidden;
        }
        &:hover,
        &.active {
            background: $bgModuleActive;
        }
    }
    .checkbox {
        margin-right: 10px;
    }
}
</style>
