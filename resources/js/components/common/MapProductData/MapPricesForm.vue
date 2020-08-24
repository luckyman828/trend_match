<template>
    <div>
        <h3>Map prices</h3>
        <div class="form-element price-map-group" v-for="(currencyMap, key, index) in currencyMapGroups" :key="'group-'+currencyMap[0].groupId">
            <h4>
                <button v-if="index > 0" 
                    class="dark ghost"
                    style="margin-left: -36px; margin-right: 4px"
                    @click="onRemovePriceMap(currencyMap[0].groupId)"
                >
                    <i class="far fa-trash"></i>
                </button>
                <span>Currency {{index+1}}</span>
            </h4>
            <BaseMapFieldsTable class="form-element">
                <MapFieldsTableHeader/>
                <MapFieldsTableRow v-for="field in currencyMap" 
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
                @click="onAddPriceMap"
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
    name: 'mapPricesForm',
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
        currencyMapGroupId: 0,
    }},
    computed: {
        currencyMapGroups() {
            const priceFields = this.fieldsToMap.filter(x => x.scope == 'prices')
            return priceFields.reduce(function (r, a) {
                r[a.groupId] = r[a.groupId] || []
                r[a.groupId].push(a)
                return r
            }, Object.create(null))
        },
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async onAddPriceMap() {
            this.currencyMapGroupId++
            const newFields = await this.getProductFields({scope: 'prices', groupId: this.currencyMapGroupId})

            this.fieldsToMap.push(...newFields)
            // Attempt to automatch the new fields
            newFields.map(field => {
                // Provide the existing matches to avoid mapping the same field multiple times
                const existingMatches = this.fieldsToMap.filter(x => x.name == field.name).map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
                this.autoMapField(field, this.availableFields, existingMatches)
            })
        },
        onRemovePriceMap(groupId) {
            for (let i = this.fieldsToMap.length-1; i >= 0; i--) {
                const field = this.fieldsToMap[i]
                if (field.scope == 'prices' && field.groupId == groupId) {
                    this.fieldsToMap.splice(i, 1)
                }
            }
        },
    }
}
</script>

<style lang="scss">
.action-list {
    display: flex;
    align-items: center;
    > *:not(:first-child) {
        margin-left: 8px;
    }
}
</style>