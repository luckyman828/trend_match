<template>
    <v-popover trigger="click">
        <!-- TRIGGER -->
        <!-- <div class="dropdown-input-field input-wrapper"></div> -->
        <BaseInputField
            :disabled="true"
            :placeholder="placeholder"
            type="select"
            :value="valueToDisplay"
            :inputClass="inputClass"
        >
            <i class="far fa-angle-down"></i>
        </BaseInputField>

        <!-- DROPDOWN -->
        <div slot="popover" v-close-popover="type == 'radio'">
            <!-- <BaseSelectButtonsContextMenu :options="options" :emitOnChange="true" :inline="true" :search="search" /> -->
            <BaseSelectButtons
                :options="options"
                :emitOnChange="true"
                :search="search"
                :focusSearchOnMount="true"
                :type="type"
                :optionNameKey="optionNameKey"
                :optionValueKey="optionValueKey"
                :optionDescriptionKey="descriptionKey"
                :cloneOptionOnSubmit="cloneOptionOnSubmit"
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
            if (!this.value) return
            return this.optionNameKey ? this.value[this.optionNameKey] : this.value
        },
    },
}
</script>

<style></style>
