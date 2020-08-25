<template>
    <form class="map-fields-screen" @submit.prevent>
        <div class="form-element" style="text-align: center;">
            <!-- <p>Map the fields from your files to Kollekt's data fields</p> -->
            <p><strong>Select Fields to keep, and match with headers from your file(s).</strong></p>
        </div>

        <div class="map-fields" v-if="!uploadingFile">
            <div class="tables">

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
            <BaseButton :disabled="!submitValid || uploadingFile" :type="'submit'" buttonClass="lg primary full-width"
            style="width: 100%"
            @click="submitFiles">
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
import { mapGetters, mapActions } from 'vuex'
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
        uploadingFile: false,
        submitStatus: null,
    }},
    computed: {
        submitValid() {
            //assume true
            let valid = true
            // // Check that all files have a valid key
            // this.availableFields.forEach(file => {
            //     if (file.key == null) {
            //         valid = false
            //     }
            // })
            // // Loop through the fields and look for errors
            // this.fieldsToMatch.forEach(field => {
            //     // Check if the field has been mapped
            //     if (field.enabled && field.newValue.fieldIndex != null) {
            //         if (!this.validateField(field)) {
            //             valid = false
            //         }
            //     }
            // })
            // // Loop through the currencies and look check their names
            // if (!this.singleCurrencyFile) {
            //     this.currenciesToMatch.forEach(currency => {
            //         if(currency.fileIndex != null && !this.validateCurrency(currency)) {
            //             valid = false
            //         }
            //     })
            // }
            return valid
        },
        instantiatedProducts() {
            const products = []
            this.availableFields.map(file => {

                const keyField = file.mappedKey.fieldName
                if (!keyField) return

                file.rows.map(row => {

                    // Find the product corresponding to this row, or instantiate a new product if none exists
                    const keyValue = row[keyField]

                    const existingProduct = products.find(x => x.datasource_id == keyValue)
                    const baseProduct = {
                        datasource_id: keyValue,
                        variants: [],
                        prices:[],
                        assortments: [],
                        eans: [],
                    }
                    const product = existingProduct ? existingProduct : baseProduct

                    console.log('made it 1')

                    if (!existingProduct) {
                        products.push(product)
                    }

                    console.log('made it 2')

                    // // Instantiate variants 
                    // const variantKeyField = this.fieldsToMap.find(field => field.name == 'variant_name')
                    // if (!variantKeyField.fieldName)
                    // const variantKeyValue = variantKeyField.fieldName
                    // const existingVariant = product.variants
                    // const baseVariant = {
                    //     name: variantKeyField,
                    //     sizes: [],
                    //     pictures: []
                    // }

                    // Map variants
                    this.fieldsToMap.filter(x => x.scope == 'variants').map(field => {
                        // Check that the field is mapped to the current file
                        if (!field.file || field.file.fileName != file.fileName) return

                        // const variantKeyValue = field.

                        console.log('made it 3')

                        // product[field.name] = row[field.fieldName]
                    })

                    // Now that we know what product we are updating we can start looping through the mapped fields
                    this.fieldsToMap.filter(x => !x.scope).map(field => {
                        // Check that the field is mapped to the current file
                        if (!field.file || field.file.fileName != file.fileName) return


                        console.log('made it 3')

                        product[field.name] = row[field.fieldName]
                    })
                })
            })

            return products
        }
    },
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
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
        // async onAddVariantImageMap() {
        //     const newFields = await this.getProductFields({scope: 'images'})
        //     const newField = newFields[0]
        //     this.fieldsToMap.push(newField)
        //     // Attempt to automatch the field
        //     // Provide the existing matches to avoid mapping the same field multiple times
        //     const existingMatches = this.fieldsToMap.filter(x => x.scope == 'images').map(x => {return {fieldName: x.fieldName, fileName: x.file && x.file.fileName}})
        //     this.autoMapField(newField, this.availableFields, existingMatches)
        // },
        // onRemoveVariantImageMap(fieldId) {
        //     const index = this.fieldsToMap.findIndex(x => x.id == fieldId)
        //     this.fieldsToMap.splice(index, 1)
        // },
        // showSelectContext(e, field, context) {
        //     const contextMenu = this.$refs.contextSelectField
        //     this.filesToChooseFrom = this.availableFiles
        //     if (context && context.fileIndex != null) {
        //         this.filesToChooseFrom = [this.availableFiles[context.fileIndex]]
        //     }
        //     contextMenu.item = field
        //     contextMenu.show(e)
        // },
        // showSelectKeyContext(e, file) {
        //     const contextMenu = this.$refs.contextSelectFileKey
        //     contextMenu.item = file
        //     contextMenu.show(e)
        // },
        // showSelectCurrencyFileContext(e, currency) {
        //     const contextMenu = this.$refs.contextSelectCurrencyFile
        //     contextMenu.item = currency
        //     contextMenu.show(e)
        // },
        // showSelectAssortmentFileContext(e, assortment) {
        //     const contextMenu = this.$refs.contextSelectAssortmentFile
        //     contextMenu.item = assortment
        //     contextMenu.show(e)
        // },
        // validateCurrency(currency) {
        //     if (currency.currencyName.length != 3) {
        //         currency.nameError = 'Currency must be a <strong>3 letter</strong> currency code.'
        //         return false
        //     } else {
        //         currency.nameError = null
        //         return true
        //     }
        // },
        // validateKey(file) {
        //     // Assume no error
        //     file.keyError = false   
        // },
        // validateField(field, limit=10) {
        //     const fieldName = field.name
        //     // Find the file the field is mapped to
        //     const file = this.availableFiles[field.newValue.fileIndex]

        //     // Assume no error
        //     let valid = true
        //     field.error = false

        //     // Set the limit to a maximum of the number of lines in the file
        //     const linesToValidate = file.lines.length < limit ? file.lines.length : limit

        //     // Test n values
        //     for (let i = 0;i<linesToValidate;i++) {
        //         // Find the field value
        //         const fieldValue = file.lines[i][field.newValue.fieldIndex]

        //         // Test that the field actually has a value
        //         if (fieldValue && valid) {

        //             // Test for integers
        //             if (['min_order','min_variant_order','box_size','eans','mark_up','recommended_retail_price','wholesale_price'].includes(fieldName)) {
        //                 if (isNaN(fieldValue)) {
        //                     field.error = `Must be a <strong>number</strong>.
        //                     <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
        //                     valid = false
        //                 }
        //             }
        //             // Test for correct date
        //             if (['delivery_date'].includes(fieldName)) {
        //                 // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
        //                 // Regex that looks for a work with exactly 3 characters between A-z.
        //                 const reg = new RegExp('\\b[A-z]{3}\\b')
        //                 let valueToTest = JSON.parse(JSON.stringify(fieldValue))
        //                 if (reg.test(valueToTest)) {
        //                     // If true then add a "1-" to the date to avoid ambiguity
        //                     valueToTest= '1-' + valueToTest
        //                 }
        //                 const dateValue = new Date (valueToTest)
        //                 if (!dateValue instanceof Date || isNaN(dateValue)) {
        //                     field.error = `Invalid <strong>Date format</strong>.
        //                     <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>
        //                     <br>Make sure that values only contain <strong>English</strong> month names`
        //                     valid = false
        //                 }
        //             }
        //             // Test for correct url
        //             if (['image'].includes(fieldName)) {
        //                 const urlReg = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)
        //                 if (!urlReg.test(fieldValue)) {
        //                     field.error = `Must be a <strong>valid URL</strong>.
        //                     <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
        //                     valid = false
        //                 }
        //             }

        //             // Test for correct currency
        //             if (this.singleCurrencyFile && ['currency'].includes(fieldName)) {
        //                 if (fieldValue.length != 3) {
        //                     field.error = `Currency must be a <strong>3 letter</strong> currency code.
        //                     <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
        //                     valid = false
        //                 }
        //             }
        //         }
        //     }
        //     return valid
        // },
        async submitFiles() {

            // First validate all fields
            // Loop through the fields and look for errors
            // assume no errors
            let valid = true
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.enabled && field.newValue.fieldIndex != null) {
                    // Loop through all lines in the csv
                    // Find the file the field is mapped to to get the number of lines
                    const file = this.availableFiles[field.newValue.fileIndex]
                    if (!this.validateField(field, file.lines.length)) {
                        valid = false
                    }
                }
            })
            // Loop through mapped currencies
            this.currenciesToMatch.forEach(currency => {
                currency.fieldsToMatch.forEach(field => {
                    // Check if the field has been mapped
                    if (field.enabled && field.newValue.fieldIndex != null) {
                        // Loop through all lines in the csv
                        // Find the file the field is mapped to to get the number of lines
                        const file = this.availableFiles[field.newValue.fileIndex]
                        if (!this.validateField(field, file.lines.length)) {
                            valid = false
                        }
                    }
                })
            })
            // Loop through mapped assortments
            this.assortmentsToMatch.forEach(assortment => {
                assortment.fieldsToMatch.forEach(field => {
                    // Check if the field has been mapped
                    if (field.enabled && field.newValue.fieldIndex != null) {
                        // Loop through all lines in the csv
                        // Find the file the field is mapped to to get the number of lines
                        const file = this.availableFiles[field.newValue.fileIndex]
                        if (!this.validateField(field, file.lines.length)) {
                            valid = false
                        }
                    }
                })
            })
            if (!valid) {
                this.SHOW_SNACKBAR({ 
                    msg: `One or more fields have an error'`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle', 
                })
                return
            }

            // Set new file data
            const newFile = this.newFile
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id

            this.uploadingFile = true
            this.submitStatus = 'Uploading'
            let uploadSuccess = true

            // First we need to create a file for the products, since the API requires that products be uploaded to an existing file
            this.submitStatus = 'Creating file'
            // console.log('create file', newFile)
            await this.insertOrUpdateFile(newFile)

            // Then we will instantiate the products and attempt to upload them
            this.submitStatus = 'Creating products'
            const newProducts = this.instantiateProducts().filter(x => !!x.datasource_id)

            this.submitStatus = 'Saving new products'
            await this.insertProducts({file: newFile, products: newProducts, addToState: false})
            .then(() => {
                this.submitStatus = 'Success'
            }).catch(err => {
                window.alert('Something went wrong. Please try again')
                this.submitStatus = 'Error'
                uploadSuccess = false
            })

            let imageUploadSuccess = true
            if (this.submitStatus != 'Error') {
                this.submitStatus = 'Uploading images. This may take a while'
                await this.syncExternalImages({file: newFile, products: newProducts, progressCallback: this.uploadImagesProgressCalback}).catch(err => {
                    imageUploadSuccess = false
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
            this.uploadingFile = false
        },
        uploadImagesProgressCalback(progress) {
            this.submitStatus = `Uploading images. This may take a while.<br>
            <strong>${progress}%</strong> done.`
        },
        reset() {
            this.$emit('reset')
            // this.availableFiles = []
            // this.singleCurrencyFile = false
            // this.currentScreen = {name: 'chooseFiles', header: 'Create new file'}
            // this.currenciesToMatch = [JSON.parse(JSON.stringify(this.currencyDefaultObject))]
            // this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
            // this.variantImagesToMap = JSON.parse(JSON.stringify(this.variantImageDefaultObject))
            // // Reset fields to match
            // this.fieldsToMatch.concat(this.variantFieldsToMatch).forEach(field => {
            //     field.enabled = true
            //     field.error = false
            //     field.newValue = {fileIndex: null, fieldName: null, fieldIndex: null}
            // })
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