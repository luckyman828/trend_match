<template>
    <v-popover trigger="click" :disabled="readOnly || disabled">
        <!-- TRIGGER -->
        <!-- <div class="dropdown-input-field input-wrapper"></div> -->
        <div class="dropdown-field" v-tooltip="disabled && disabledTooltip">
            <BaseInputField
                :disabled="true"
                :placeholder="placeholder"
                type="select"
                :value="valueToDisplay"
                :inputClass="inputClass"
                :readOnly="readOnly || disabled"
                :innerLabel="innerLabel"
            />
            <i class="dropdown-icon fas fa-caret-down" v-if="!readOnly"></i>
        </div>

        <!-- DROPDOWN -->
        <div slot="popover" v-close-popover="type == 'radio'" v-if="!readOnly">
            <!-- <BaseSelectButtonsContextMenu :options="options" :emitOnChange="true" :inline="true" :search="search" /> -->
            <BaseSelectButtons
                :options="options"
                :emitOnChange="true"
                :search="search"
                :focusSearchOnMount="true"
                :type="type"
                :value="value"
                :optionNameKey="optionNameKey"
                :optionValueKey="optionValueKey"
                :optionDescriptionKey="descriptionKey"
                :cloneOptionOnSubmit="cloneOptionOnSubmit"
                :unsetOption="unsetOption"
                @input="$emit('input', $event)"
            />
        </div>
    </v-popover>
</template>

<script>
export default {
    name: 'baseDropdownInputField',
    props: [
        'placeholder',
        'options',
        'search',
        'type',
        'valueKey',
        'nameKey',
        'descriptionKey',
        'value',
        'inputClass',
        'cloneOptionOnSubmit',
        'readOnly',
        'innerLabel',
        'valueToDisplayOverwrite',
        'unsetOption',
        'disabled',
        'disabledTooltip',
    ],
    computed: {
        optionValueKey() {
            if (!!this.valueKey) return this.valueKey
            if (!this.options || this.options.length <= 0) return
            return Object.keys(this.options[0]).includes('value') ? 'value' : null
        },
        optionNameKey() {
            if (!!this.nameKey) return this.nameKey
            if (!this.options || this.options.length <= 0) return
            return Object.keys(this.options[0]).includes('name') ? 'name' : null
        },
        valueToDisplay() {
            // function returnValue(value) {
            //     return Array.isArray(value) ? value.join(', ') : value
            // }

            if (this.valueToDisplayOverwrite) return this.valueToDisplayOverwrite
            if (!this.value) return
            if (!this.options || this.options.length <= 0) return this.value

            // If we have no option name key, we must have a simple value that we want to display
            if (!this.optionNameKey) return Array.isArray(this.value) ? this.value.join(', ') : this.value

            // If we have no value key, we must have selected an entire object
            if (!this.optionValueKey) {
                return this.value[this.optionNameKey]
            }

            // In case we have both a name key and a value key
            // Read the available options and find our values match there
            const selectedOption = this.options.find(option => option[this.valueKey] == this.value)
            return selectedOption[this.optionNameKey]
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.dropdown-field {
    position: relative;
    .dropdown-icon {
        position: absolute;
        right: 8px;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
    }
    ::v-deep {
        input {
            font-weight: 700;
        }
    }
}
</style>
