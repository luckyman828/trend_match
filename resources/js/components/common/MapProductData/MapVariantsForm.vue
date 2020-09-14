<template>
    <div>
        <h3>Map variants</h3>
        <div class="form-element">

            <!-- MAP KEYS -->
        <div class="form-element">
            <h4>
                <strong>Map variant name fields</strong>
                <i class="far fa-info-circle"
                    v-tooltip="'We will create one variant on the products for each unique name found in the mapped name fields.'"
                ></i>
            </h4>
            <BaseMapFieldsTable class="map-fields-table">
                <MapKeysTableHeader/>
                <template v-for="file in availableFiles">
                    <MapKeysTableRow v-for="(variantKey, index) in file.variantKeyList" :key="file.fileName + '-' + index"
                        :mappedFile="file"
                        :mappedField="variantKey"
                        @show-field-context="$emit('show-field-context', $event, variantKey, file)"
                    >
                        <template v-slot:right>
                            <button class="ghost dark"
                                v-tooltip="'Add additional variant key map for this. file.\nUseful if you have multiple variants in the same row.'"
                                @click="onAddAdditionalVariantKeyMap(file)"
                            >
                                <i class="far fa-plus"></i>
                            </button>
                            <button class="ghost dark" v-if="file.variantKeyList.length > 1"
                                v-tooltip="'Remove variant key map'"
                                @click="onRemoveAdditionalVariantKeyMap(file, index)"
                            >
                                <i class="far fa-trash"></i>
                            </button>
                        </template>
                    </MapKeysTableRow>
                </template>
            </BaseMapFieldsTable>
        </div>

            <!-- MAP FIELDS -->
            <BaseMapFieldsTable>
                <MapFieldsTableHeader/>
                <MapFieldsTableRow v-for="field in fieldsToMap.filter(x => x.scope == 'variants' && x.name != 'name')" 
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                />
                <MapFieldsTableRow v-for="field in fieldsToMap.filter(x => x.scope == 'images')" 
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    :removeEnabled="true"
                    @show-field-context="$emit('show-field-context', $event, field)"
                    @remove="onRemoveVariantImageMap(field.id)"
                />
            </BaseMapFieldsTable>

        </div>
        <button class="dark" 
            type=button
            @click="onAddVariantImageMap"
        >
            <i class="fas fa-plus"></i><span>Add variant image map</span>
        </button>
        

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
    name: 'mapVariantsForm',
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
    computed: {
        // mappedFiles() {
        //     const fields = this.fieldsToMap.filter(x => ['images', 'variants'].includes(x.scope))
        //     let files = []
        //     fields.map(field => {
        //         if (!field.file) return
        //         const existingFile = files.find(file => file.fileName == field.file.fileName)
        //         if (!existingFile) files.push(field.file)
        //     })
        //     return files
        // }
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async initVariantMap() {
            const newFields = await this.getProductFields({scope: 'variants'})
            this.fieldsToMap.push(...newFields)
            await this.onAddVariantImageMap()

            // Automap fields
            newFields.map(field => {
                this.autoMapField(field, this.availableFiles)
            })

            // Attemp to determine how many image-maps we need
            // Get our first variant image map
            const imageField = this.fieldsToMap.find(x => x.scope == 'images')
            const imageFieldMatches = this.autoMapField(imageField, this.availableFiles)
            
            let firstImageMatchIgnored = false
            imageFieldMatches.map(fileMatch => {
                fileMatch.matches.map(match => {
                    // ignore the first match
                    if (!firstImageMatchIgnored) {
                        firstImageMatchIgnored = true
                    } else {
                        this.onAddVariantImageMap()
                    }
                })
            })

            // // Attemp to determine how many variant keys we need
            // // Get our first variant image map
            // const variantKeyFields = await this.getProductFields({scope: 'variantKey'})
            // const variantKeyFiledMatches = this.autoMapField(variantKeyFields[0], this.availableFiles)
            
            // let firstKeyMatchIgnored = false
            // variantKeyFiledMatches.map(fileMatch => {
            //     fileMatch.matches.map(match => {
            //         // ignore the first match
            //         if (!firstKeyMatchIgnored) {
            //             firstKeyMatchIgnored = true
            //         } else {
            //             this.onAddAdditionalVariantKeyMap(fileMatch.file)
            //         }
            //     })
            // })
        },
        async onAddVariantImageMap() {
            const newFields = await this.getProductFields({scope: 'images'})
            const newField = newFields[0]
            this.fieldsToMap.push(newField)
            // Attempt to automatch the field
            // Provide the existing matches to avoid mapping the same field multiple times
            const existingMatches = this.fieldsToMap.filter(x => x.scope == 'images').map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
            this.autoMapField(newField, this.availableFiles, existingMatches)
        },
        onRemoveVariantImageMap(fieldId) {
            const index = this.fieldsToMap.findIndex(x => x.id == fieldId)
            this.fieldsToMap.splice(index, 1)
        },
        async onAddAdditionalVariantKeyMap(file) {
            const variantKey = await this.getProductFields({scope: 'variantKey'})
            const newVariantKey = variantKey[0]
            file.variantKeyList.push(newVariantKey)
            // Attempt to automatch the field
            // Provide the existing matches to avoid mapping the same field multiple times
            const existingMatches = file.variantKeyList.map(variantKey => {
                return {fieldName: variantKey.fieldName, fileName: file.fileName}
            })
            this.autoMapField(newVariantKey, [file], existingMatches)
        },
        onRemoveAdditionalVariantKeyMap(file, index) {
            file.variantKeyList.splice(index, 1)
        }
    },
    created() {
        this.initVariantMap()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

</style>