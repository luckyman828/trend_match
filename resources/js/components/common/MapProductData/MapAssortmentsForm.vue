<template>
    <div>
        <h3>Map assortments</h3>
        <div
            class="form-element assortment-map-group"
            v-for="(assortmentMap, key, index) in assortmentMapGroups"
            :key="'group-' + assortmentMap[0].groupId"
        >
            <h4>
                <button
                    v-if="index > 0"
                    class="dark ghost"
                    style="margin-left: -36px; margin-right: 4px"
                    @click="onRemoveAssortmentMap(assortmentMap[0].groupId)"
                >
                    <i class="far fa-trash"></i>
                </button>
                <span>Assortment map {{ index + 1 }}</span>
            </h4>

            <!-- Map File -->
            <BaseMapFieldsTable class="form-element" v-if="availableFiles.length > 1">
                <tr>
                    <th>File</th>
                </tr>
                <BaseInputField
                    class="select-file-button"
                    disabled="true"
                    :value="
                        getAssortmentMapGroupFileMap(assortmentMap).file
                            ? getAssortmentMapGroupFileMap(assortmentMap).file.fileName
                            : 'No file mapped'
                    "
                    type="select"
                    @click="$emit('show-file-context', $event, getAssortmentMapGroupFileMap(assortmentMap))"
                    @change="onMappedFileChange(assortmentMap[0].groupId)"
                >
                    <i class="fas fa-caret-down"></i>
                </BaseInputField>
            </BaseMapFieldsTable>

            <BaseMapFieldsTable class="form-element">
                <MapFieldsTableHeader />
                <MapFieldsTableRow
                    v-for="field in assortmentMap"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="
                        $emit('show-field-context', $event, field, getAssortmentMapGroupFileMap(assortmentMap).file)
                    "
                />
            </BaseMapFieldsTable>
        </div>

        <div class="action-list">
            <button class="dark" type="button" @click="onAddAssortmentMap">
                <i class="fas fa-plus"></i><span>Add assortment map</span>
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
    name: 'mapAssortmentsForm',
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
            assortmentsMapGroupId: 0,
            assortmentMapGroupFileMaps: [],
        }
    },
    computed: {
        assortmentMapGroups() {
            const assortmentFields = this.fieldsToMap.filter(x => x.scope == 'assortments')
            return assortmentFields.reduce(function(r, a) {
                r[a.groupId] = r[a.groupId] || []
                r[a.groupId].push(a)
                return r
            }, Object.create(null))
        },
        mappedFiles() {
            // Find cases where the same field and group is mapped to the same file
            const fields = this.fieldsToMap.filter(x => x.scope == 'assortments')
            let files = []
            let fileGroupPairs = []
            fields.map(field => {
                if (!field.file) return
                const existingPair = fileGroupPairs.find(
                    pair => pair.file.fileName == field.file.fileName && pair.groupId == field.groupId
                )
                if (!existingPair) fileGroupPairs.push({ file: field.file, groupId: field.groupId })
                if (
                    fileGroupPairs.find(x => x.groupId == field.groupId && x.file.fileName != field.file.fileName) &&
                    !files.find(x => x.fileName == field.file.fileName)
                ) {
                    files.push(field.file)
                }
            })
            return files
        },
    },
    methods: {
        ...mapActions('mapProductData', ['fetchProductFields']),
        async instantiateAssortmentMaps() {
            // Add one assortment map first
            await this.onAddAssortmentMap()
            // Test the amount of matches returned for the assortment name field
            const assortmentNameField = this.fieldsToMap.find(x => x.name == 'name' && x.scope == 'assortments')
            const assortmentMatches = this.autoMapField(assortmentNameField, this.availableFiles)

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

            // Instantaite a groupIdFilePairMap to force assortment groups to be mapped to the same file
            const assortmentMapGroupFile = {
                file: null,
                groupId: this.assortmentsMapGroupId,
            }
            this.assortmentMapGroupFileMaps.push(assortmentMapGroupFile)

            const newFields = await this.fetchProductFields({
                scope: 'assortments',
                groupId: this.assortmentsMapGroupId,
            })
            this.fieldsToMap.push(...newFields)

            // Automap fields
            this.automapAssortmentFields(newFields)

            const autoMatchedFile = newFields.find(x => !!x.file)
            if (autoMatchedFile) {
                assortmentMapGroupFile.file = autoMatchedFile.file
            }
        },
        onRemoveAssortmentMap(groupId) {
            const fileIndex = this.assortmentMapGroupFileMaps.findIndex(x => x.groupId == groupId)
            this.assortmentMapGroupFileMaps.splice(fileIndex, 1)

            for (let i = this.fieldsToMap.length - 1; i >= 0; i--) {
                const field = this.fieldsToMap[i]
                if (field.scope == 'assortments' && field.groupId == groupId) {
                    this.fieldsToMap.splice(i, 1)
                }
            }
        },
        automapAssortmentFields(fields) {
            // Automap fields
            // Force the fields to be mapped to the same file
            let fileMatch = this.assortmentMapGroupFileMaps.find(x => x.groupId == fields[0].groupId).file
            fields.map(field => {
                // Provide the existing matches to avoid mapping the same field multiple times
                // Only allow box size to mapped multiple times
                let existingMatches = null
                if (field.name != 'box_size') {
                    existingMatches = this.fieldsToMap
                        .filter(x => x.name == field.name)
                        .map(x => {
                            return { fieldName: x.fieldName, fileName: x.file && x.file.fileName }
                        })
                }
                const availableFiles = fileMatch ? [fileMatch] : this.availableFiles

                this.autoMapField(field, availableFiles, existingMatches)
                if (!fileMatch) {
                    fileMatch = field.file
                }
            })
        },
        onMappedFileChange(groupId) {
            // Find the groups fields
            const assortmentGroupFields = this.fieldsToMap.filter(x => x.scope == 'assortments' && x.groupId == groupId)
            // Reset the fields
            assortmentGroupFields.map(field => {
                field.error = false
                field.fieldName = null
                field.autoMatched = false
                field.file = null
                field.customEntry = false
            })
            // Automatch the fields to the new file
            this.automapAssortmentFields(assortmentGroupFields)
        },
        getAssortmentMapGroupFileMap(assortmentMap) {
            return this.assortmentMapGroupFileMaps.find(x => x.groupId == assortmentMap[0].groupId)
        },
    },
    created() {
        this.instantiateAssortmentMaps()
    },
}
</script>

<style lang="scss">
.select-file-button {
    width: 260px;
}
</style>
