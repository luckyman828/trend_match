<template>
    <div>
        <h3>Map variants</h3>
        <div class="form-element">
            <!-- MAP FIELDS -->
            <BaseMapFieldsTable>
                <MapFieldsTableHeader />
                <!-- COLORS -->
                <MapFieldsTableRow
                    v-for="field in fieldsToMap.filter(x => x.name == 'color')"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                >
                    <template v-slot:right>
                        <button class="ghost dark" v-tooltip="'Add addtional color map'" @click="onAddMap('color')">
                            <i class="far fa-plus"></i>
                        </button>
                        <button v-if="colorMapCount > 1" class="ghost dark" @click="onRemoveMap(field.id)">
                            <i class="far fa-trash"></i>
                        </button>
                    </template>
                </MapFieldsTableRow>

                <!-- VARIANTS -->
                <MapFieldsTableRow
                    v-for="field in fieldsToMap.filter(x => x.name == 'variant')"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                >
                    <template v-slot:right>
                        <button class="ghost dark" v-tooltip="'Add addtional variant map'" @click="onAddMap('variant')">
                            <i class="far fa-plus"></i>
                        </button>
                        <button v-if="variantMapCount > 1" class="ghost dark" @click="onRemoveMap(field.id)">
                            <i class="far fa-trash"></i>
                        </button>
                    </template>
                </MapFieldsTableRow>

                <MapFieldsTableRow
                    v-for="field in fieldsToMap.filter(
                        x => x.scope == 'variants' && !['name', 'color', 'variant'].includes(x.name)
                    )"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                />

                <MapFieldsTableRow
                    v-for="field in fieldsToMap.filter(x => x.scope == 'images')"
                    :key="field.id"
                    :mappedFile="field.file"
                    :mappedField="field"
                    @show-field-context="$emit('show-field-context', $event, field)"
                >
                    <template v-slot:right>
                        <button class="ghost dark" v-tooltip="'Add addtional image map'" @click="onAddVariantImageMap">
                            <i class="far fa-plus"></i>
                        </button>
                        <button v-if="imageMapCount > 1" class="ghost dark" @click="onRemoveMap(field.id)">
                            <i class="far fa-trash"></i>
                        </button>
                    </template>
                </MapFieldsTableRow>
            </BaseMapFieldsTable>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import workbookUtils from '../../../mixins/workbookUtils'
import MapFieldsTableRow from './MapFieldsTableRow'
import MapFieldsTableHeader from './MapFieldsTableHeader'

export default {
    name: 'mapVariantsForm',
    components: {
        MapFieldsTableRow,
        MapFieldsTableHeader,
    },
    mixins: [workbookUtils],
    props: ['fieldsToMap', 'availableFiles', 'uploadOptions'],
    computed: {
        imagesOnly() {
            return this.uploadOptions && this.uploadOptions.scopes.find(x => x.name == 'variants' && x.imagesOnly)
        },
        imageMapCount() {
            return this.fieldsToMap.filter(x => x.scope == 'images').length
        },
        variantMapCount() {
            return this.fieldsToMap.filter(x => x.name == 'variant').length
        },
        colorMapCount() {
            return this.fieldsToMap.filter(x => x.name == 'color').length
        },
    },
    methods: {
        ...mapActions('mapProductData', ['fetchProductFields', 'getField']),
        async initVariantMap() {
            let newFields
            if (!this.imagesOnly) {
                newFields = await this.fetchProductFields({ scope: 'variants' })
                this.fieldsToMap.push(...newFields)
            }

            await this.onAddVariantImageMap()

            // Automap fields
            if (!this.imagesOnly) {
                newFields.map(field => {
                    this.autoMapField(field, this.availableFiles)
                })
            }

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
        },
        async onAddVariantImageMap() {
            const newFields = await this.fetchProductFields({ scope: 'images' })
            const newField = newFields[0]
            this.fieldsToMap.push(newField)
            // Attempt to automatch the field
            // Provide the existing matches to avoid mapping the same field multiple times
            const existingMatches = this.fieldsToMap
                .filter(x => x.scope == 'images')
                .map(x => {
                    return { fieldName: x.fieldName, fileName: x.file && x.file.fileName }
                })
            this.autoMapField(newField, this.availableFiles, existingMatches)
        },
        onRemoveMap(fieldId) {
            const index = this.fieldsToMap.findIndex(x => x.id == fieldId)
            this.fieldsToMap.splice(index, 1)
        },
        async onAddMap(fieldName) {
            const newField = await this.getField({ fieldName })
            this.fieldsToMap.push(newField)
            // Attempt to automatch the field
            // Provide the existing matches to avoid mapping the same field multiple times
            const existingMatches = this.fieldsToMap
                .filter(x => x.name == fieldName)
                .map(x => {
                    return { fieldName: x.fieldName, fileName: x.file && x.file.fileName }
                })
            this.autoMapField(newField, this.availableFiles, existingMatches)
        },
    },
    created() {
        this.initVariantMap()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
</style>
