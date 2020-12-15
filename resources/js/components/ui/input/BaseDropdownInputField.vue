<template>
    <v-popover trigger="click">
        <!-- TRIGGER -->
        <!-- <div class="dropdown-input-field input-wrapper"></div> -->
        <BaseInputField :disabled="true" :placeholder="placeholder" type="select" :value="valueToDisplay">
            <i class="far fa-angle-down"></i>
        </BaseInputField>

        <!-- DROPDOWN -->
        <div slot="popover">
            <!-- <BaseSelectButtonsContextMenu :options="options" :emitOnChange="true" :inline="true" :search="search" /> -->
            <BaseSelectButtons
                :options="options"
                :emitOnChange="true"
                :search="search"
                :type="type"
                :optionNameKey="optionNameKey"
                :optionValueKey="optionValueKey"
                @input="$emit('input', $event)"
            />
        </div>
    </v-popover>
</template>

<script>
export default {
    name: 'baseDropdownInputField',
    props: ['placeholder', 'options', 'search', 'type', 'valueKey', 'nameKey', 'value'],
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
