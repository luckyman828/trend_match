<template>
    <tr class="map-keys-table-row">
        <td>
            <BaseInputField 
                disabled=true 
                :value="mappedFile ? mappedFile.fileName : ''" 
                readOnly=true
            />
        </td>
        <td>
            <i class="fas fa-equals"></i>
        </td>
        <td>
            <BaseInputField
                class="select-field-button"
                :class="{'auto-match': mappedField.autoMatched}"
                disabled=true 
                :value="mappedField.fieldName" 
                type="select" 
                @click="$emit('show-field-context', $event)"
            >
                <i class="fas fa-caret-down"></i>
                <i v-if="mappedField.autoMatched" 
                    class="fas fa-bolt primary automatch-icon"
                    v-tooltip="'auto-matched'"
                ></i>
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
    name: 'mapKeysTableRow',
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
.map-keys-table-row {
    .input-field {
        width: 240px;
    }
    .select-field-button {
        padding-right: 12px;
        .automatch-icon {
            position: absolute;
            right: -14px;
        }
    }
}

</style>