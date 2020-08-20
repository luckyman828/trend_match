<template>
    <tr class="map-fields-table-row"
    :class="{'disabled': !mappedField.enabled}">
        <td>
            <BaseCheckbox :value="mappedField.enabled" v-model="mappedField.enabled"/>
        </td>
        <td>
            <BaseInputField 
                disabled=true 
                :value="mappedField.displayName" 
                readOnly=true
            />
        </td>
        <td>
            <i class="fas fa-equals"></i>
        </td>
        <td>
            <BaseInputField
                :class="{'auto-match': mappedField.autoMatched}"
                disabled=true 
                :value="mappedField.fieldName" 
                :label="mappedFile ? mappedFile.fileName : ''" 
                type="select"
                @click="$emit('show-field-context', $event)"
            >
                <i class="fas fa-caret-down"></i>
            </BaseInputField>
        </td>
        <td>
            <BaseInputField 
                disabled=true 
                readOnly=true
                :errorTooltip="mappedField.error" 
                :value="previewValue"
            />
        </td>
    </tr>
</template>

<script>
import workbookUtils from '../../../mixins/workbookUtils'

export default {
    name: 'mapFieldsTableRow',
    mixins: [
        workbookUtils
    ],
    props: [
        'mappedFile',
        'mappedField',
    ],
    computed: {
        previewValue() {
            if (!this.mappedFile || !this.mappedField.fieldName) return 'Not mapped'

            return this.mappedFile.rows[0][this.mappedField.fieldName]
        }
    },
    watch: {
        previewValue(newVal) {
            if (!this.mappedFile || !this.mappedField.fieldName) return
            const valid = this.validateMappedField(this.mappedField, this.mappedFile.rows, 10)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.map-fields-table-row {
    &.disabled {
        .input-field {
            opacity: .5;
        }
    }
    .input-field {
        width: 240px;
    }
}

</style>