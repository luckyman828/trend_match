<template>
    <div>
        <h3>Map assortments</h3>
        <BaseMapFieldsTable>
            <MapFieldsTableHeader/>
            <MapFieldsTableRow v-for="field in fieldsToMap.filter(x => x.scope == 'assortments')" 
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
    name: 'mapAssortmentsForm',
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
    data: function() { return {
        assortmentsMapGroupId: 0,
    }},
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async onAddAssortmentMap() {
            this.assortmentsMapGroupId++

            const newFields = await this.getProductFields({scope: 'assortments', groupId: this.assortmentsMapGroupId})
            this.fieldsToMap.push(...newFields)

            // Automap fields
            newFields.map(field => {
                this.autoMapField(field, this.availableFields)
            })
        },
    },
    created() {
        this.onAddAssortmentMap()
    }
}
</script>

<style>

</style>