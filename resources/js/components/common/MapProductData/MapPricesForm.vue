<template>
    <div>
        <h3>Map prices</h3>
        <div
            class="form-element price-map-group"
            v-for="(currencyMap, key, index) in currencyMapGroups"
            :key="'group-' + currencyMap[0].groupId"
        >
            <h4>
                <button
                    v-if="index > 0"
                    class="dark ghost"
                    style="margin-left: -36px; margin-right: 4px"
                    @click="onRemovePriceMap(currencyMap[0].groupId)"
                >
                    <i class="far fa-trash"></i>
                </button>
                <span>Price map {{ index + 1 }}</span>
            </h4>
            <BaseMapFieldsTable class="form-element">
                <MapFieldsTableHeader />
                <MapFieldsTableRow
                    v-for="field in currencyMap"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                >
                    <template v-slot:right v-if="field.name == 'currency' && !field.fieldName">
                        <i class="far fa-info-circle md dark" v-tooltip="'No currency name is mapped'"></i>
                    </template>
                </MapFieldsTableRow>
            </BaseMapFieldsTable>
        </div>

        <div class="action-list">
            <button class="dark" type="button" @click="onAddPriceMap">
                <i class="fas fa-plus"></i><span>Add price map</span>
            </button>

            <i
                class="far fa-info-circle"
                style="font-size: 16px;"
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
    mixins: [workbookUtils],
    props: ['fieldsToMap', 'availableFiles'],
    data: function() {
        return {
            currencyMapGroupId: 0,
            currencyHeaderRegex: /^(?=.*(dkk|sek|nok|gbp|eur|chf|try)).*(rrp|whs|mu|mhs).*$/, // Regex that matches strings with a currency code and rrp, whs or mu
        }
    },
    computed: {
        currencyMapGroups() {
            const priceFields = this.fieldsToMap.filter(x => x.scope == 'prices')
            return priceFields.reduce(function(r, a) {
                r[a.groupId] = r[a.groupId] || []
                r[a.groupId].push(a)
                return r
            }, Object.create(null))
        },
    },
    methods: {
        ...mapActions('mapProductData', ['fetchProductFields']),
        async instantiatePricemaps() {
            // Add one price map first
            await this.onAddPriceMap()

            let currenciesToInstantiateCount = -1 // Start at -1 since we are already instantiating one from the start

            // Test the amount of matches returned for the currency field
            const currencyField = this.fieldsToMap.find(x => x.name == 'currency')
            const currencyMatches = this.autoMapField(currencyField, this.availableFiles)

            if (currencyMatches) {
                currencyMatches.map(match => {
                    currenciesToInstantiateCount += match.matches.length
                })
            }

            // Find currencies included in header names
            // Look for a 3-letter currency code + MU/RRP/WHS in a field name
            const currenciesInHeaders = []
            this.availableFiles.map(file => {
                const regexp = this.currencyHeaderRegex
                file.headers.map(header => {
                    // find a currency match
                    const headerMatch = header.toLowerCase().match(regexp)
                    // If we have a match the currency is in the 2nd group
                    if (headerMatch) {
                        const headerCurrency = headerMatch[1]

                        const existsInArray = currenciesInHeaders.includes(headerCurrency.toUpperCase())
                        if (!existsInArray) {
                            currenciesInHeaders.push(headerCurrency.toUpperCase())
                        }
                    }
                })
            })

            currenciesToInstantiateCount += currenciesInHeaders.length

            // Instantiate one additional price map, for each additional currency field
            for (let i = 0; i < currenciesToInstantiateCount; i++) {
                this.onAddPriceMap()
            }
        },
        async onAddPriceMap() {
            this.currencyMapGroupId++
            const newFields = await this.fetchProductFields({ scope: 'prices', groupId: this.currencyMapGroupId })

            this.fieldsToMap.push(...newFields)

            // Attempt to automatch the new fields
            // Force the fields to be mapped to the same file
            let fileMatch = null
            // Force the fields to be mapped to the same currency, if the mapped field contains the currency name
            let currencyBind = null
            newFields.map(field => {
                // Provide the existing matches to avoid mapping the same field multiple times
                const existingMatches = this.fieldsToMap
                    .filter(x => x.name == field.name)
                    .map(x => {
                        return { fieldName: x.fieldName, fileName: x.file && x.file.fileName }
                    })
                const availableFiles = fileMatch ? [fileMatch] : this.availableFiles
                this.autoMapField(field, availableFiles, existingMatches, currencyBind)
                // Check if the field has been mapped to a header that contains the currency name, so we can bind it to that
                if (field.fieldName) {
                    const regexp = this.currencyHeaderRegex
                    const fieldIncludesCurrencyName = field.fieldName.toLowerCase().match(regexp)
                    if (fieldIncludesCurrencyName) {
                        currencyBind = fieldIncludesCurrencyName[1]
                    }
                }

                if (!fileMatch) {
                    fileMatch = field.file
                }
            })

            const currencyField = newFields.find(field => field.name == 'currency')
            // If we didn't match a currency, check if one of the other mapped fields contain the currency name
            if (!currencyField.fieldName) {
                let currencyMatch = null
                const otherFields = newFields.filter(field => field.name != 'currency')

                for (let i = 0; i < otherFields.length; i++) {
                    const field = otherFields[i]
                    if (!field.fieldName) continue // Skip this field if it has no fieldName mapped

                    const regexp = this.currencyHeaderRegex // Regex that matches strings with a currency code and rrp, whs or mu
                    const regexpMatch = field.fieldName.toLowerCase().match(regexp)

                    if (regexpMatch) {
                        // The currency name is captured in the first capturing group (index 1)
                        currencyMatch = regexpMatch[1]
                        // Break loop if we have found a match
                        break
                    }
                }
                // Set a custom entry
                if (currencyMatch) {
                    currencyField.customEntry = true
                    currencyField.fieldName = currencyMatch.toUpperCase()
                }
            }
        },
        onRemovePriceMap(groupId) {
            for (let i = this.fieldsToMap.length - 1; i >= 0; i--) {
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
    },
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
