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
                <span>Price map {{index+1}}</span>
            </h4>
            <BaseMapFieldsTable class="form-element">
                <MapFieldsTableHeader/>
                <MapFieldsTableRow v-for="field in currencyMap" 
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                >
                    <template v-slot:right v-if="field.name == 'currency' && !field.fieldName">
                        <i class="far fa-info-circle md dark"
                            v-tooltip="'No currency name is mapped'"
                        ></i>
                    </template>
                </MapFieldsTableRow>
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
        'availableFiles',
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
        async instantiatePricemaps() {
            // Add one price map first 
            await this.onAddPriceMap()
            // Test the amount of matches returned for the currency field
            const currencyField = this.fieldsToMap.find(x => x.name == 'currency')
            const currencyMatches = this.autoMapField(currencyField, this.availableFiles)
            // Instantiate one additional price map, for each additional currency field
            // for (let i = 1; i < currencyMatches.length; i++) {
            //     this.onAddPriceMap()
            // }
            let firstMatchIngored = false
            currencyMatches.map(fileMatch => {
                fileMatch.matches.map(match => {
                    // ignore the first match
                    if (!firstMatchIngored) {
                        firstMatchIngored = true
                    } else {
                        this.onAddPriceMap()
                    }
                })
            })
        },
        async onAddPriceMap() {
            this.currencyMapGroupId++
            const newFields = await this.getProductFields({scope: 'prices', groupId: this.currencyMapGroupId})

            this.fieldsToMap.push(...newFields)

            // Attempt to automatch the new fields
            // Force the fields to be mapped to the same file
            let fileMatch = null
            newFields.map(field => {
                // Provide the existing matches to avoid mapping the same field multiple times
                const existingMatches = this.fieldsToMap.filter(x => x.name == field.name).map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
                const availableFiles = fileMatch ? [fileMatch] : this.availableFiles
                this.autoMapField(field, availableFiles, existingMatches)
                if (!fileMatch) {
                    fileMatch = field.file
                }
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
    },
    created() {
        this.instantiatePricemaps()
        // this.onAddPriceMap()
        // Instantiate fields based on all currency fields
    }
}
</script>

<style scoped lang="scss">
.action-list {
    display: flex;
    align-items: center;
    > *:not(:first-child) {
        margin-left: 8px;
    }
}
</style>