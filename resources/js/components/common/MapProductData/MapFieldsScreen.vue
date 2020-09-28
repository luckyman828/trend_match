<template>
    <form class="map-fields-screen" @submit.prevent>

        <div class="map-fields" v-if="!uploadInProgress">
            <div class="tables">
                <div class="form-element" style="text-align: center;">
                    <p><strong>Map the fields from your files to Kollekt's data fields</strong></p>
                </div>

                <!-- MAP KEYS -->
                <div class="form-section">
                    <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                    <BaseMapFieldsTable>
                        <MapKeysTableHeader/>
                        <MapKeysTableRow v-for="(file, index) in availableFiles" :key="index"
                            :mappedFile="file"
                            :mappedField="file.mappedKey"
                            @show-field-context="showSelectFieldContext($event, file.mappedKey, file)"
                        />
                    </BaseMapFieldsTable>
                </div>

                <!-- MAP MAIN FIELDS -->
                <MapProductFieldsForm class="form-section"
                    v-if="!uploadOptions || uploadOptions.fields.find(x => !!x.enabled)"
                    :uploadOptions="uploadOptions"
                    :fieldsToMap="fieldsToMap"
                    :availableFiles="availableFiles"
                    @show-field-context="showSelectFieldContext"
                />

                <!-- MAP VARIANTS -->
                <MapVariantsForm class="form-section"
                    v-if="!uploadOptions || uploadOptions.scopes.find(x => x.name == 'variants').enabled"
                    :fieldsToMap="fieldsToMap"
                    :availableFiles="availableFiles"
                    @show-field-context="showSelectFieldContext"
                />
                
                <!-- MAP PRICES -->
                <MapPricesForm class="form-section"
                    v-if="!uploadOptions || uploadOptions.scopes.find(x => x.name == 'prices').enabled"
                    :fieldsToMap="fieldsToMap"
                    :availableFiles="availableFiles"
                    @show-field-context="showSelectFieldContext"
                />

                <!-- MAP ASSORTMENTS -->
                <MapAssortmentsForm class="form-section"
                    v-if="!uploadOptions || uploadOptions.scopes.find(x => x.name == 'assortments').enabled"
                    :fieldsToMap="fieldsToMap"
                    :availableFiles="availableFiles"
                    @show-field-context="showSelectFieldContext"
                    @show-file-context="showSelectFileContext"
                />

            </div>
        </div>

        <BaseLoader v-else :msg="submitStatus"/>

        <div class="form-controls">
            <slot name="actions"
                :submit="onSubmit"
                :disabled="!!submitDisabled"
                :disabledTooltip="submitDisabled"
            />
        </div>

        <!-- START CONTEXT MENUS -->
        <SelectFieldToMapContextMenu ref="contextSelectField"
        :fieldToMap="contextField" :availableFiles="filesToChooseFrom"/>

        <SelectFileToMapContextMenu ref="contextSelectFile"
        :fileToMap="contextFile" :availableFiles="availableFiles"/>
        <!-- END CONTEXT MENUS -->


    </form>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import MapFieldsTableRow from '../../../components/common/MapProductData/MapFieldsTableRow'
import MapKeysTableRow from '../../../components/common/MapProductData/MapKeysTableRow'
import SelectFieldToMapContextMenu from '../../../components/common/MapProductData/SelectFieldToMapContextMenu'
import SelectFileToMapContextMenu from '../../../components/common/MapProductData/SelectFileToMapContextMenu'
import MapProductFieldsForm from '../../../components/common/MapProductData/MapProductFieldsForm'
import MapVariantsForm from '../../../components/common/MapProductData/MapVariantsForm'
import MapPricesForm from '../../../components/common/MapProductData/MapPricesForm'
import MapAssortmentsForm from '../../../components/common/MapProductData/MapAssortmentsForm'
import MapFieldsTableHeader from '../../../components/common/MapProductData/MapFieldsTableHeader'
import MapKeysTableHeader from '../../../components/common/MapProductData/MapKeysTableHeader'
import workbookUtils from '../../../mixins/workbookUtils'

export default {
    name: 'mapFieldsScreen',
    components: {
        MapFieldsTableRow,
        MapKeysTableRow,
        SelectFieldToMapContextMenu,
        SelectFileToMapContextMenu,
        MapProductFieldsForm,
        MapVariantsForm,
        MapPricesForm,
        MapAssortmentsForm,
        MapFieldsTableHeader,
        MapKeysTableHeader,
    },
    mixins: [
        workbookUtils,
    ],
    props: [
        'availableFiles',
        'uploadOptions',
    ],
    data: function() { return {
        fieldsToMap: [],
        filesToChooseFrom: this.availableFiles,
        contextField: null,
        contextFile: null,
        // STATUS
        submitStatus: null,
        uploadInProgress: false,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder']),
        submitDisabled() {
            if (this.uploadInProgress) return 'Upload in progress'

            // Check that all files have keys mapped
            // Use a for function so we can break the submit valid check if we find an error
            for (let i = 0; i < this.availableFiles.length; i++) {
                const file = this.availableFiles[i]
                if (!file.mappedKey.fieldName) return 'A file  has no product key mapped'

                // If we are mapping variants
                if (!this.uploadOptions || this.uploadOptions.scopes.find(scope => scope.name == 'variants' && !!scope.enabled)) {
                    for (let i = 0; i < file.variantKeyList.length; i++) {
                        const variantKey = file.variantKeyList[i]
                        if (!variantKey.fieldName) return 'A file has no variant key mapped'
                    }
                }
            }

            // Check that no fields have an error
            for (let i = 0; i < this.fieldsToMap.length; i++) {
                const field = this.fieldsToMap[i]

                // Check that the field is in our scope
                if (this.uploadOptions && 
                    (!this.uploadOptions.fields.find(x => x.name == field.name && x.enabled))
                ) {
                    continue
                }

                if (field.enabled && !!field.error) return 'One or more fields have an error'
            }
            return false
        },
        // theProducts() {
        //     return this.instantiateProductsFromMappedFields(this.fieldsToMap, this.availableFiles)
        // }
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async instantiateFields() {
            // const fields = await this.getProductFields()
            // this.fieldsToMap = fields.filter(x => x.scope != 'key')

            // Attempt to autoMap the fields
            this.fieldsToMap.map(field => {
                this.autoMapField(field, this.availableFiles)
            })
            this.availableFiles.map(file => {
                this.autoMapField(file.mappedKey, [file])
                file.variantKeyList.map(variantKey => {
                    this.autoMapField(variantKey, [file])
                })
            })

            // When done automapping, validate all the fields
            this.validateAllFields(10)
        },
        showSelectFieldContext(e, field, file) {
            this.contextField = field
            if (file) {
                this.filesToChooseFrom = [file]
            } else {
                this.filesToChooseFrom = this.availableFiles
            }
            const contextMenu = this.$refs.contextSelectField
            contextMenu.show(e)
        },
        showSelectFileContext(e, file) {
            this.contextFile = file
            const contextMenu = this.$refs.contextSelectFile
            contextMenu.show(e)
        },
        validateAllFields(depth) {
            for (let i = 0; i < this.fieldsToMap.length; i++) {
                const field = this.fieldsToMap[i]

                // Only check enabled and mapped fields
                if (field.enabled && !!field.fieldName && (!this.uploadOptions || this.uploadOptions.fields.find(x => x.name == field.name && x.enabled))) {
                    const fieldIsValid =  this.validateMappedField(field, field.customEntry ? [] : field.file.rows, depth)
                    if (!fieldIsValid) {
                        return false
                    }
                }
            }
            return true
        },

        async onSubmit() {
            // console.log('on submit map fields screen')
            // First validate all fields
            // Loop through the fields and look for errors
            // assume no errors
            const valid = this.validateAllFields()
            // console.log('validate all fields', valid)
            
            if (!valid) {
                this.SHOW_SNACKBAR({ 
                    msg: `One or more fields have an error`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle', 
                })
                return
            }

            // Instantiate products now, so we know that the method won't throw any errors after we have created a new file
            // Filter the fields to map by our uploadOptions
            const newProducts = this.instantiateProductsFromMappedFields(this.fieldsToMap, this.availableFiles, this.uploadOptions) 
            this.$emit('submit', newProducts)
        },
        reset() {
            this.$emit('reset')
        },
    },
    created() {
        this.instantiateFields()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.table-wrapper {
    margin-bottom: 40px;
}

.map-fields {
    display: flex;
    justify-content: center;
    // max-height: 60vh;
    // overflow-y: auto;
    h3 {
        // margin: 48px 0 12px;
        i {
            margin-left: 8px;
        }
        &:hover {
            i {
                color: $font;
            }
        }
    }
    table {
        tr {
            &.disabled {
                .input-field {
                    opacity: .5;
                }
            }
            .input-field {
                width: 240px;
            }
        }
    }
    .map-currencies {
        .single-currency-file-table {
            margin-bottom: 32px;
            td {
                padding-right: 4px
            }
        }
        .currency-wrapper {
            margin-bottom: 32px;
            h4 {
                margin-top: 0;
                margin-bottom: 4px;
            }
            .currency-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                align-items: flex-end;
                    p {
                    .small {
                        font-size: 12px;
                    }
                }
            }
            .input-field {
                width: 240px;
            }
        }
    }
    .available-fields {
        margin-top: 116px;
        background: $grey2;
        border-radius: 4px;
        padding: 12px 4px 8px 8px;
        margin-left: 12px;
        .inner {
            max-height: 800px;
            overflow-y: auto;
            padding-right: 4px;
        }
        .fields-wrapper {
            margin-top: 12px;
        }
        .field {
            background: white;
            border-radius: 4px;
            height: 32px;
            line-height: 32px;
            padding: 0 8px;
            margin-top: 4px;
            width: 200px;
            white-space: nowrap;
        }
    }
    .form-controls {
        margin-top: 32px;
    }
}
.assortment-wrapper {
    margin-bottom: 32px;
    h4 {
        margin-top: 0;
        margin-bottom: 4px;
    }
}
.assortment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    align-items: flex-end;
        p {
        padding-left: 24px;
        .small {
            font-size: 12px;
        }
    }
}
</style>