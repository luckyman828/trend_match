<template>
    <div>
        <h3>Map fields</h3>
        <BaseMapFieldsTable>
            <MapFieldsTableHeader/>
            <MapFieldsTableRow v-for="field in fieldsToMap.filter(x => !x.scope)" 
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
    mixins: [
        workbookUtils,
    ],
    props: [
        'fieldsToMap',
        'availableFields',
    ],
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async initProductFields() {
            const newFields = await this.getProductFields({scope: null})
            this.fieldsToMap.push(...newFields)

            // Automap fields
            newFields.map(field => {
                this.autoMapField(field, this.availableFields)
            })
        },
    },
    created() {
        this.initProductFields()
    }
}
</script>

<style>

</style>