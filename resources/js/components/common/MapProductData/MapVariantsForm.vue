<template>
    <div>
        <h3>Map variants</h3>
        <div class="form-element">

            <!-- MAP FIELDS -->
            <BaseMapFieldsTable>
                <MapFieldsTableHeader/>
                <MapFieldsTableRow v-for="field in fieldsToMap.filter(x => x.scope == 'variants')" 
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

        <!-- MAP KEYS -->
        <div class="form-element">
            <h4>
                <strong>Map variant keys</strong>
                <i class="far fa-info-circle"
                    v-tooltip="'We use the key to know which rows represent the same variant (use for instance; Name or Id)'"
                ></i>
            </h4>
            <BaseMapFieldsTable class="map-fields-table">
                <MapKeysTableHeader/>
                <MapKeysTableRow v-for="(file, index) in mappedFiles" :key="index"
                    :mappedFile="file"
                    :mappedField="file.variantKey"
                    @show-field-context="$emit('show-field-context', $event, file.variantKey, file)"
                />
            </BaseMapFieldsTable>
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
        mappedFiles() {
            const fields = this.fieldsToMap.filter(x => ['images', 'variants'].includes(x.scope))
            let files = []
            fields.map(field => {
                if (!field.file) return
                const existingFile = files.find(file => file.fileName == field.file.fileName)
                if (!existingFile) files.push(field.file)
            })
            return files
        }
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
            
            let firstMatchIngored = false
            imageFieldMatches.map(fileMatch => {
                fileMatch.matches.map(match => {
                    // ignore the first match
                    if (!firstMatchIngored) {
                        firstMatchIngored = true
                    } else {
                        this.onAddVariantImageMap()
                    }
                })
            })
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
    },
    created() {
        this.initVariantMap()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

</style>