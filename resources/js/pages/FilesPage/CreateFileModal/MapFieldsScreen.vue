<template>
    <form class="map-fields-screen" @submit.prevent>

        <div class="map-fields" v-if="!uploadInProgress">
            <div class="tables">
                <div class="form-element" style="text-align: center;">
                    <!-- <p>Map the fields from your files to Kollekt's data fields</p> -->
                    <p><strong>Select Fields to keep, and match with headers from your file(s).</strong></p>
                </div>

                <!-- MAP KEYS -->
                <div class="form-section">
                    <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                    <BaseMapFieldsTable>
                        <MapKeysTableHeader/>
                        <MapKeysTableRow v-for="(file, index) in availableFields" :key="index"
                            :mappedFile="file"
                            :mappedField="file.mappedKey"
                            @show-field-context="showSelectFieldContext($event, file.mappedKey, file)"
                        />
                    </BaseMapFieldsTable>
                </div>

                <!-- MAP MAIN FIELDS -->
                <MapProductFieldsForm class="form-section"
                    :fieldsToMap="fieldsToMap"
                    :availableFields="availableFields"
                    @show-field-context="showSelectFieldContext"
                />

                <!-- MAP VARIANTS -->
                <MapVariantsForm class="form-section"
                    :fieldsToMap="fieldsToMap"
                    :availableFields="availableFields"
                    @show-field-context="showSelectFieldContext"
                />
                
                <!-- MAP PRICES -->
                <MapPricesForm class="form-section"
                    :fieldsToMap="fieldsToMap"
                    :availableFields="availableFields"
                    @show-field-context="showSelectFieldContext"
                />

                <!-- MAP PRICES -->
                <MapAssortmentsForm class="form-section"
                    :fieldsToMap="fieldsToMap"
                    :availableFields="availableFields"
                    @show-field-context="showSelectFieldContext"
                    @show-file-context="showSelectFileContext"
                />

            </div>
        </div>

        <BaseLoader v-else :msg="submitStatus"/>

        <div class="form-controls">
            <BaseButton :disabled="!!submitDisabled" :type="'submit'" buttonClass="lg primary full-width"
            :disabledTooltip="submitDisabled"
            style="width: 100%"
            @click="onSubmit">
                <span>Create file</span>
            </BaseButton>
        </div>

        <!-- START CONTEXT MENUS -->
        <SelectFieldToMapContextMenu ref="contextSelectField"
        :fieldToMap="contextField" :availableFields="filesToChooseFrom"/>

        <SelectFileToMapContextMenu ref="contextSelectFile"
        :fileToMap="contextFile" :availableFields="availableFields"/>
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
        'availableFields',
        'newFile',
    ],
    data: function() { return {
        fieldsToMap: [],
        filesToChooseFrom: this.availableFields,
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
            for (let i = 0; i < this.availableFields.length; i++) {
                const file = this.availableFields[i]
                if (!file.mappedKey.fieldName) return 'A file  has no product key mapped'
                if (!file.variantKey.fieldName) return 'A file has no variant key mapped'
            }

            // Check that no fields have an error
            for (let i = 0; i < this.fieldsToMap.length; i++) {
                const field = this.fieldsToMap[i]
                if (field.enabled && !!field.error) return 'One or more fields has an error'
            }
            return false
        },
        // theProducts() {
        //     return this.instantiateProductsFromMappedFields(this.fieldsToMap, this.availableFields)
        // }
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        ...mapActions('files', ['insertOrUpdateFile', 'syncExternalImages']),
        ...mapActions('products', ['insertProducts']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async instantiateFields() {
            // const fields = await this.getProductFields()
            // this.fieldsToMap = fields.filter(x => x.scope != 'key')

            // Attempt to autoMap the fields
            this.fieldsToMap.map(field => {
                this.autoMapField(field, this.availableFields)
            })
            this.availableFields.map(file => {
                this.autoMapField(file.mappedKey, [file])
                this.autoMapField(file.variantKey, [file])
                // this.autoMapField(file.assortmentKey, [file])
            })
        },
        showSelectFieldContext(e, field, file) {
            this.contextField = field
            if (file) {
                this.filesToChooseFrom = [file]
            } else {
                this.filesToChooseFrom = this.availableFields
            }
            const contextMenu = this.$refs.contextSelectField
            contextMenu.show(e)
        },
        showSelectFileContext(e, file) {
            this.contextFile = file
            const contextMenu = this.$refs.contextSelectFile
            contextMenu.show(e)
        },
        validateAllFields() {
            for (let i = 0; i < this.fieldsToMap.length; i++) {
                const field = this.fieldsToMap[i]

                // Only check enabled and mapped fields
                if (field.enabled && !!field.fieldName) {
                    const fieldIsValid =  this.validateMappedField(field, field.customEntry ? [] : field.file.rows)
                    if (!fieldIsValid) return false
                }
            }
            return true
        },

        async onSubmit() {
            // First validate all fields
            // Loop through the fields and look for errors
            // assume no errors
            const valid = this.validateAllFields()
            
            if (!valid) {
                this.SHOW_SNACKBAR({ 
                    msg: `One or more fields have an error'`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle', 
                })
                return
            }
            this.uploadInProgress = true

            // Instantiate products now, so we know that the method won't throw any errors after we have created a new file
            this.submitStatus = 'Creating products'
            const newProducts = this.instantiateProductsFromMappedFields(this.fieldsToMap, this.availableFields) 

            this.submitStatus = 'Creating file'
            // Set new file data
            const newFile = this.newFile
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id


            // Assume upload success (we use this variabel to tell whether the upload was succesful or not)
            let uploadSuccess = true

            // First we need to create a file for the products, since the API requires that products be uploaded to an existing file
            await this.insertOrUpdateFile(newFile)

            // Then we will instantiate the products and attempt to upload them
            

            this.submitStatus = 'Uploading new products'
            await this.insertProducts({file: newFile, products: newProducts, addToState: false}).catch(err => {
                window.alert('Something went wrong. Please try again')
                this.submitStatus = 'Error'
                uploadSuccess = false
            })

            if (uploadSuccess) {
                this.submitStatus = 'Uploading images. This may take a while'
                await this.syncExternalImages({file: newFile, products: newProducts, progressCallback: this.uploadImagesProgressCalback}).catch(err => {
                    this.SHOW_SNACKBAR({ 
                        msg: `<p><strong>Hey you!</strong><br></p>
                        <p>We will display your images from your provided URLs.</p>
                        <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                        <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                        type: 'info', 
                        iconClass: 'fa-exclamation-circle', 
                    })
                })
            }

            if (uploadSuccess) {
                this.$emit('close')
                this.reset()
            }
            this.uploadInProgress = false
        },
        uploadImagesProgressCalback(progress) {
            this.submitStatus = `Uploading images. This may take a while.<br>
            <strong>${progress}%</strong> done.`
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
    max-height: 60vh;
    overflow-y: auto;
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