<template>
    <div>
        <h3>Map fields</h3>
        <BaseMapFieldsTable>
            <MapFieldsTableHeader />
            <MapFieldsTableRow
                v-for="field in fieldsToMap.filter(
                    x => !x.scope && (!uploadOptions || getUploadOptionField(x).enabled)
                )"
                :key="field.id"
                :mappedFile="field.file"
                :mappedField="field"
                @show-field-context="$emit('show-field-context', $event, field)"
            />
        </BaseMapFieldsTable>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import workbookUtils from '../../../mixins/workbookUtils'
import MapFieldsTableRow from './MapFieldsTableRow'
import MapKeysTableRow from './MapKeysTableRow'
import MapFieldsTableHeader from './MapFieldsTableHeader'
import MapKeysTableHeader from './MapKeysTableHeader'

export default {
    name: 'mapProductFieldsForm',
    components: {
        MapFieldsTableRow,
        MapKeysTableRow,
        MapFieldsTableHeader,
        MapKeysTableHeader,
    },
    mixins: [workbookUtils],
    props: ['fieldsToMap', 'availableFiles', 'uploadOptions'],
    methods: {
        ...mapActions('mapProductData', ['fetchProductFields']),
        async initProductFields() {
            const newFields = await this.fetchProductFields({ scope: null })
            this.fieldsToMap.push(...newFields)

            // Automap fields
            newFields.map(field => {
                this.autoMapField(field, this.availableFiles)
                // And then validate the field
                if (field.enabled && !!field.fieldName) {
                    const fieldIsValid = this.validateMappedField(field, field.customEntry ? [] : field.file.rows, 10)
                    if (!fieldIsValid) {
                        return false
                    }
                }
            })
        },
        getUploadOptionField(field) {
            if (!this.uploadOptions) return
            let fieldToReturn = this.uploadOptions.fields.find(x => x.name == field.name)
            if (field.customProperty) {
                fieldToReturn = this.uploadOptions.fields.find(
                    x => x.name == field.name && x.displayName == field.displayName
                )
            }
            return fieldToReturn
        },
    },
    created() {
        this.initProductFields()
    },
}
</script>

<style></style>
