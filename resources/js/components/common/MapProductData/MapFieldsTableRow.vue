<template>
    <tr class="map-fields-table-row" :class="{ disabled: !mappedField.enabled }">
        <td class="select">
            <BaseCheckbox class="select-button" :value="mappedField.enabled" v-model="mappedField.enabled" />
        </td>
        <td>
            <BaseInputField disabled="true" :value="mappedField.displayName" readOnly="true" />
        </td>
        <td>
            <i class="fas fa-equals"></i>
        </td>
        <td>
            <BaseInputField
                class="select-field-button"
                :class="[{ 'auto-match': mappedField.autoMatched }, { 'custom-entry': mappedField.customEntry }]"
                disabled="true"
                :value="mappedField.fieldName"
                :label="mappedFile ? mappedFile.fileName : ''"
                type="select"
                @click="$emit('show-field-context', $event)"
            >
                <i class="fas fa-caret-down"></i>
                <i
                    v-if="mappedField.autoMatched"
                    class="fas fa-bolt primary automatch-icon"
                    v-tooltip="'Field was auto-matched'"
                ></i>
                <i
                    v-if="mappedField.customEntry"
                    style="right: -18px"
                    class="fas fa-pen orange automatch-icon"
                    v-tooltip="'Manual entry. Value will be set for all products'"
                ></i>
            </BaseInputField>
        </td>
        <td>
            <BaseInputField disabled="true" readOnly="true" :errorTooltip="mappedField.error" :value="previewValue" />
        </td>
        <td v-if="removeEnabled">
            <button class="dark ghost remove-button" type="button" @click="$emit('remove')">
                <i class="far fa-trash"></i>
            </button>
        </td>
        <td v-if="$scopedSlots.right">
            <div class="right-slot">
                <slot name="right" />
            </div>
        </td>
    </tr>
</template>

<script>
import workbookUtils from '../../../mixins/workbookUtils'

export default {
    name: 'mapFieldsTableRow',
    mixins: [workbookUtils],
    props: ['mappedFile', 'mappedField', 'removeEnabled'],
    computed: {
        mappedFieldName() {
            return `${this.mappedField.fieldName} - ${this.mappedFile && this.mappedFile.fileName}`
        },
        previewValue() {
            // If custom enrtry, simply display the custom entry
            let valueToReturn = 'Not mapped'
            if (!this.mappedField.customEntry && (!this.mappedFile || !this.mappedField.fieldName)) return valueToReturn
            if (this.mappedField.customEntry) valueToReturn = this.mappedField.fieldName
            else {
                valueToReturn = this.mappedFile.rows[0][this.mappedField.fieldName]
            }

            // No value available
            if (valueToReturn == null) return ''

            // Change how the value is displayed
            if (this.mappedField.type == 'date') {
                // if (this.mappedField.type == 'date' && !this.mappedField.error) {
                valueToReturn = DateTime.fromJSDate(new Date(valueToReturn)).toFormat('MMMM yyyy')
            }

            // Format numbers
            if (this.mappedField.type == 'number') {
                // if (this.mappedField.type == 'number' && !this.mappedField.error) {
                valueToReturn = Math.round(valueToReturn * 1e2) / 1e2
            }

            return valueToReturn
        },
    },
    watch: {
        mappedFieldName(newVal) {
            this.validateField()
        },
    },
    methods: {
        validateField() {
            if ((!this.mappedFile || !this.mappedField.fieldName) && !this.mappedField.customEntry) return
            const rows = this.mappedField.customEntry ? [] : this.mappedFile.rows
            const valid = this.validateMappedField(this.mappedField, rows, 10)
        },
    },
}
</script>

<style scoped lang="scss">
.map-fields-table-row {
    &.disabled {
        .input-field {
            opacity: 0.5;
        }
    }
    .input-field {
        width: 240px;
    }
    .select-button {
        margin-left: -24px;
    }
    .select-field-button {
        padding-right: 12px;
        .automatch-icon {
            position: absolute;
            right: -14px;
        }
    }
}
.remove-button {
    margin-right: -32px;
}
.right-slot {
    margin-right: -32px;
}
// .select {
//     margin-left: -20px;
// }
</style>
