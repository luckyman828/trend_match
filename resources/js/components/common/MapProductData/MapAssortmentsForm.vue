<template>
    <div>
        <h3>Map assortments</h3>
        <div class="form-element assortment-map-group" v-for="(assortmentMap, key, index) in assortmentMapGroups" :key="'group-'+assortmentMap[0].groupId">
            <h4>
                <button v-if="index > 0" 
                    class="dark ghost"
                    style="margin-left: -36px; margin-right: 4px"
                    @click="onRemoveAssortmentMap(assortmentMap[0].groupId)"
                >
                    <i class="far fa-trash"></i>
                </button>
                <span>Assortment map {{index+1}}</span>
            </h4>
            <BaseMapFieldsTable class="form-element">
                <MapFieldsTableHeader/>
                <MapFieldsTableRow v-for="field in assortmentMap" 
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                />
            </BaseMapFieldsTable>
        </div>

        <div class="action-list">
            <button class="dark" 
                type=button
                @click="onAddAssortmentMap"
            >
                <i class="fas fa-plus"></i><span>Add price map</span>
            </button>

            <i class="far fa-info-circle" style="font-size: 16px;"
                v-tooltip="'Use this if you have currencies spread between multiple files or columns.'"
            ></i>
        </div>
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
    computed: {
        assortmentMapGroups() {
            const assortmentFields = this.fieldsToMap.filter(x => x.scope == 'assortments')
            return assortmentFields.reduce(function (r, a) {
                r[a.groupId] = r[a.groupId] || []
                r[a.groupId].push(a)
                return r
            }, Object.create(null))
        },
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async instantiateAssortmentMaps() {
            // Add one assortment map first 
            await this.onAddAssortmentMap()
            // Test the amount of matches returned for the assortment name field
            const assortmentNameField = this.fieldsToMap.find(x => x.name == 'assortment_name')
            const assortmentMatches = this.autoMapField(assortmentNameField, this.availableFields)

            let firstMatchIngored = false
            assortmentMatches.map(fileMatch => {
                fileMatch.matches.map(match => {
                    // ignore the first match
                    if (!firstMatchIngored) {
                        firstMatchIngored = true
                    } else {
                        this.onAddAssortmentMap()
                    }
                })
            })
        },
        async onAddAssortmentMap() {
            this.assortmentsMapGroupId++

            const newFields = await this.getProductFields({scope: 'assortments', groupId: this.assortmentsMapGroupId})
            this.fieldsToMap.push(...newFields)

            // Automap fields
            newFields.map(field => {
                // Provide the existing matches to avoid mapping the same field multiple times
                // Only allow box size to mapped multiple times
                let existingMatches = null
                if (field.name != 'box_size') {
                    existingMatches = this.fieldsToMap.filter(x => x.name == field.name).map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
                }

                this.autoMapField(field, this.availableFields, existingMatches)
            })
        },
        onRemoveAssortmentMap(groupId) {
            for (let i = this.fieldsToMap.length-1; i >= 0; i--) {
                const field = this.fieldsToMap[i]
                if (field.scope == 'assortments' && field.groupId == groupId) {
                    this.fieldsToMap.splice(i, 1)
                }
            }
        },
    },
    created() {
        this.instantiateAssortmentMaps()
    }
}
</script>

<style>

</style>