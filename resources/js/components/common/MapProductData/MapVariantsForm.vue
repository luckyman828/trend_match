<template>
    <div class="table-wrapper map-variant-fields">
        <h3>Map variants</h3>

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

        <!-- MAP KEYS -->
        <template v-if="mappedFiles.length > 1">
            <p>
                <strong>Map variant keys</strong>
                <i class="far fa-info-circle"
                    v-tooltip="'You have mapped different files to the variant fields. Please provide the keys that we should map the variants together by (for instance; Name or Id'"
                ></i>
            </p>
            <table class="map-fields-table">
                <tr class="header">
                    <th><label>File</label></th>
                    <th></th>
                    <th><label>Key to map</label></th>
                    <th><label>Example</label></th>
                </tr>
                <MapKeysTableRow v-for="(file, index) in mappedFiles" :key="index"
                    :mappedFile="file"
                    :mappedField="file.variantKey"
                    @show-field-context="showSelectFieldContext($event, file.variantKey, file)"
                />
            </table>
        </template>

        <button class="dark" 
            style="margin-top: 12px"
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

export default {
    name: 'mapVariantsForm',
    components: {
        MapFieldsTableRow,
        MapKeysTableRow,
        MapFieldsTableHeader,
    },
    mixins: [
        workbookUtils,
    ],
    props: [
        'fieldsToMap',
        'availableFields',
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
        async onAddVariantImageMap() {
            const newFields = await this.getProductFields({scope: 'images'})
            const newField = newFields[0]
            this.fieldsToMap.push(newField)
            // Attempt to automatch the field
            // Provide the existing matches to avoid mapping the same field multiple times
            const existingMatches = this.fieldsToMap.filter(x => x.scope == 'images').map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
            this.autoMapField(newField, this.availableFields, existingMatches)
        },
        onRemoveVariantImageMap(fieldId) {
            const index = this.fieldsToMap.findIndex(x => x.id == fieldId)
            this.fieldsToMap.splice(index, 1)
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
h3 {
    margin: 48px 0 12px;
}

</style>