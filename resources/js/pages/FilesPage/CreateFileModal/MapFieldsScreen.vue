<template>
    <form class="map-fields-screen">
        <div class="form-element" style="text-align: center;">
            <!-- <p>Map the fields from your files to Kollekt's data fields</p> -->
            <p><strong>Select Fields to keep, and match with headers from your file(s).</strong></p>
        </div>

        <div class="map-fields" v-if="!uploadingFile">
            <div class="tables">

                <div class="table-wrapper link-ids">
                    <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                    <table class="map-fields-table">
                        <tr class="header">
                            <th><label>File</label></th>
                            <th></th>
                            <th><label>Mapped key</label></th>
                            <th><label>Example</label></th>
                        </tr>
                        <MapKeysTableRow v-for="(file, index) in availableFields" :key="index"
                            :mappedFile="file"
                            :mappedField="file.mappedKey"
                            @show-field-context="showSelectFieldContext($event, file.mappedKey, file)"
                        />
                    </table>
                </div>

                <div class="table-wrapper map-main-fields">
                    <h3>Map fields</h3>
                    <table class="map-fields-table">
                        <tr class="header">
                            <th></th>
                            <th><label>Kollekt product key</label></th>
                            <th></th>
                            <th><label>Mapped key</label></th>
                            <th><label>Example</label></th>
                        </tr>
                        <MapFieldsTableRow v-for="(field, index) in fieldsToMap.filter(x => !x.scope)" 
                            :key="index"
                            :mappedFile="field.file"
                            :mappedField="field"
                            @show-field-context="showSelectFieldContext($event, field, availableFields[fieldsToMap.fileIndex])"
                        />
                    </table>
                </div>

                    <!-- START Map Variants -->
                <!-- <div class="table-wrapper map-assortments">
                    <h3>Map Variants</h3>

                    <table class="map-fields-table">
                        <tr class="header">
                            <th></th>
                            <th><label>Database</label></th>
                            <th></th>
                            <th><label>Matched Datasource</label></th>
                            <th><label>Example</label></th>
                        </tr>
                        <tr v-for="(field, index) in variantFieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                            <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                            <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                            <td><i class="fas fa-equals"></i></td>
                            <td>
                                <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </td>
                            <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                :value="previewExampleValue(field.newValue, field.name)"/>
                            </td>
                        </tr>
                        <tr v-for="(field, index) in variantImagesToMap" :key="'variant-image-'+index" :class="{disabled: !field.enabled}"
                        class="variant-image-row">
                            <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                            <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                            <td><i class="fas fa-equals"></i></td>
                            <td>
                                <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField>
                            </td>
                            <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                :value="previewExampleValue(field.newValue, field.name)"/>
                            </td>

                            <td>
                                <button class="dark ghost remove-variant-image"
                                @click="variantImagesToMap.splice(index, 1)">
                                    <i class="far fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    </table>

                    <button class="dark" style="margin-top: 12px"
                    @click="variantImagesToMap.push(JSON.parse(JSON.stringify(variantImageDefaultObject)))">
                        <i class="fas fa-plus"></i><span>Add variant image map</span>
                    </button>
                </div> -->
                <!-- END Map Variants -->

                <!-- <div class="table-wrapper map-currencies">
                    <h3>Map currencies</h3>
                    <table class="single-currency-file-table">
                        <tr>
                            <td><BaseCheckbox :value="true" v-model="singleCurrencyFile"/></td>
                            <td><p>One CSV contains all currencies in a single header <span class="small">(i.e. there is a header like "currency" in a csv)</span></p></td>
                        </tr>
                    </table>
                    <div class="currency-wrapper" v-for="(currency, index) in currenciesToMatch" :key="index">
                        <template v-if="!singleCurrencyFile || index < 1">
                            <h4 v-if="!singleCurrencyFile">Currency {{index+1}}</h4>
                            <div class="currency-header" v-if="!singleCurrencyFile">
                                <div class="left">
                                    <table class="map-fields-table">
                                        <tr class="header">
                                            <th></th>
                                            <th><label :for="'currency-'+index+'-name'">Currency Name (ex. EUR)</label></th>
                                            <th></th>
                                            <th><label :for="'currency-'+index+'-file'">Linked File</label></th>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td><BaseInputField :id="'currency-'+index+'-name'" :errorTooltip="currency.nameError"
                                            class="input-field" placeholder="Fx. EUR" v-model="currency.currencyName"
                                            @blur="validateCurrency(currency)"
                                            @input.native="currency.currencyName = currency.currencyName.toUpperCase()"/></td>
                                            <td><i class="fas fa-equals"></i></td>
                                            <td><BaseInputField :id="'currency-'+index+'-file'" 
                                            class="input-field" disabled=true
                                            :value="currency.fileIndex != null ? availableFiles[currency.fileIndex].fileName : null" 
                                            type="select" @click="showSelectCurrencyFileContext($event, currency)">
                                                <i class="fas fa-caret-down"></i>
                                            </BaseInputField></td>
                                        </tr>
                                    </table>
                                </div>
                                <button v-if="index > 0" class="dark" @click="currenciesToMatch.splice(index,1)">
                                    <i class="fas fa-trash-alt"></i><span>Remove currency</span>
                                </button>
                            </div>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th></th>
                                    <th><label>Database</label></th>
                                    <th></th>
                                    <th><label>Matched Datasource</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(field, index) in currency.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                    <template v-if="field.name != 'currency' || singleCurrencyFile">
                                        <td><BaseCheckbox v-if="field.name != 'currency' || singleCurrencyFile" :value="field.enabled" v-model="field.enabled"/></td>
                                        <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                        <td><i class="fas fa-equals"></i></td>
                                        <td><BaseInputField :readOnly="currency.fileIndex == null"
                                        v-tooltip="currency.fileIndex == null && 'You must select a file to map first'"
                                        :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" 
                                        @click="currency.fileIndex != null && showSelectContext($event, field, currency)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField></td>
                                        <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                            :value="previewExampleValue(field.newValue, field.name)"/>
                                        </td>
                                    </template>
                                </tr>
                            </table>
                        </template>
                    </div>
                    <button v-if="!singleCurrencyFile" class="dark" 
                    @click="currenciesToMatch.push(JSON.parse(JSON.stringify(currencyDefaultObject)))">
                        <i class="fas fa-plus"></i><span>Add currency</span>
                    </button>
                </div> -->

                <!-- START Map Assortments -->
                <!-- <div class="table-wrapper map-assortments">
                    <h3>Map Assortments</h3>
                    <div class="assortment-wrapper" v-for="(assortment, index) in assortmentsToMatch" :key="index">
                        <h4>Assortment {{index+1}}</h4>
                        <div class="assortment-header">
                            <div class="left">
                                <table class="map-fields-table">
                                    <tr class="header">
                                        <th></th>
                                        <th><label :for="'assortment-'+index+'-file'">Linked File</label></th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><BaseInputField :id="'assortment-'+index+'-file'" 
                                        class="input-field" disabled=true
                                        :value="assortment.fileIndex != null ? availableFiles[assortment.fileIndex].fileName : null" 
                                        type="select" @click="showSelectAssortmentFileContext($event, assortment)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField></td>
                                    </tr>
                                </table>
                            </div>
                            <button v-if="index > 0" class="dark" @click="assortmentsToMatch.splice(index,1)">
                                <i class="fas fa-trash-alt"></i><span>Remove assortment</span>
                            </button>
                        </div>
                        <table class="map-fields-table">
                            <tr class="header">
                                <th></th>
                                <th><label>Database</label></th>
                                <th></th>
                                <th><label>Matched Datasource</label></th>
                                <th><label>Example</label></th>
                            </tr>
                            <tr v-for="(field, index) in assortment.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                <td><i class="fas fa-equals"></i></td>
                                <td><BaseInputField :readOnly="assortment.fileIndex == null"
                                v-tooltip="assortment.fileIndex == null && 'You must select a file to map first'"
                                :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                :value="field.newValue.fieldName" type="select" 
                                @click="assortment.fileIndex != null && showSelectContext($event, field, assortment)">
                                    <i class="fas fa-caret-down"></i>
                                </BaseInputField></td>
                                <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                    :value="previewExampleValue(field.newValue, field.name)"/>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <button class="dark" 
                    @click="assortmentsToMatch.push(JSON.parse(JSON.stringify(assortmentDefaultObject)))">
                        <i class="fas fa-plus"></i><span>Add assortment</span>
                    </button>
                </div> -->
                <!-- END Map Assortments -->

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

        <!-- <BaseContextMenu ref="contextSelectFileKey" class="context-select-key">
            <template v-slot:header>
                Select key to link
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" @unset="slotProps.item.newValue={fileIndex: null, fieldName: null, fieldIndex: null}"
                    :options="slotProps.item.headers" :optionNameKey="'fieldName'"
                    v-model="slotProps.item.key" :submitOnChange="true" :search="true" @submit="validateKey(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu> -->

        <SelectFieldToMapContextMenu ref="contextSelectField"
        :fieldToMap="contextField" :availableFields="filesToChooseFrom"/>

        <!-- <BaseContextMenu ref="contextSelectField" class="context-select-field">
            <template v-slot:header>
                Select field to map
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="onUnsetFieldMapping();slotProps.hide()"
                    :options="filesToChooseFrom" multipleOptionArrays="true" optionGroupNameKey="fileName" optionGroupOptionsKey="headers"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :optionDescriptionKey="'fileName'"
                    :optionNameKey="'fieldName'" :search="true" @submit="validateField(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu> -->

        <!-- <BaseContextMenu ref="contextSelectCurrencyFile" class="context-select-file">
            <template v-slot:header>
                Select file to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.fileIndex = null;slotProps.hide()"
                    :options="availableFiles"
                    v-model="slotProps.item.fileIndex" :submitOnChange="true" :optionValueKey="'index'"
                    :optionNameKey="'fileName'" @submit="autoMapCurrency(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectAssortmentFile" class="context-select-file">
            <template v-slot:header>
                Select file to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.fileIndex = null;slotProps.hide()"
                    :options="availableFiles"
                    v-model="slotProps.item.fileIndex" :submitOnChange="true" :optionValueKey="'index'"
                    :optionNameKey="'fileName'" @submit="autoMapAssortment(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu> -->

        <!-- END CONTEXT MENUS -->


    </form>
</template>

<script>
import { mapGetters } from 'vuex'
import MapFieldsTableRow from '../../../components/common/MapProductData/MapFieldsTableRow'
import MapKeysTableRow from '../../../components/common/MapProductData/MapKeysTableRow'
import SelectFieldToMapContextMenu from '../../../components/common/MapProductData/SelectFieldToMapContextMenu'
import workbookUtils from '../../../mixins/workbookUtils'

export default {
    name: 'mapFieldsScreen',
    components: {
        MapFieldsTableRow,
        MapKeysTableRow,
        SelectFieldToMapContextMenu,
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
        // STATUS
        uploadingFile: false,
        submitStatus: null,
    }},
    computed: {
        ...mapGetters('mapProductData', ['getProductFields']),
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
        }
    },
    methods: {
        instantiateFields() {
            this.fieldsToMap = this.getProductFields.filter(x => x.scope != 'key')

            // Attempt to autoMap the fields
            this.fieldsToMap.map(field => {
                this.autoMapField(field, this.availableFields)
            })
            this.availableFields.map(file => {
                this.autoMapField(file.mappedKey, [file])
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
        showSelectContext(e, field, context) {
            const contextMenu = this.$refs.contextSelectField
            this.filesToChooseFrom = this.availableFiles
            if (context && context.fileIndex != null) {
                this.filesToChooseFrom = [this.availableFiles[context.fileIndex]]
            }
            contextMenu.item = field
            contextMenu.show(e)
        },
        showSelectKeyContext(e, file) {
            const contextMenu = this.$refs.contextSelectFileKey
            contextMenu.item = file
            contextMenu.show(e)
        },
        showSelectCurrencyFileContext(e, currency) {
            const contextMenu = this.$refs.contextSelectCurrencyFile
            contextMenu.item = currency
            contextMenu.show(e)
        },
        showSelectAssortmentFileContext(e, assortment) {
            const contextMenu = this.$refs.contextSelectAssortmentFile
            contextMenu.item = assortment
            contextMenu.show(e)
        },
        validateCurrency(currency) {
            if (currency.currencyName.length != 3) {
                currency.nameError = 'Currency must be a <strong>3 letter</strong> currency code.'
                return false
            } else {
                currency.nameError = null
                return true
            }
        },
        validateKey(file) {
            // Assume no error
            file.keyError = false   
        },
        validateField(field, limit=10) {
            const fieldName = field.name
            // Find the file the field is mapped to
            const file = this.availableFiles[field.newValue.fileIndex]

            // Assume no error
            let valid = true
            field.error = false

            // Set the limit to a maximum of the number of lines in the file
            const linesToValidate = file.lines.length < limit ? file.lines.length : limit

            // Test n values
            for (let i = 0;i<linesToValidate;i++) {
                // Find the field value
                const fieldValue = file.lines[i][field.newValue.fieldIndex]

                // Test that the field actually has a value
                if (fieldValue && valid) {

                    // Test for integers
                    if (['min_order','min_variant_order','box_size','eans','mark_up','recommended_retail_price','wholesale_price'].includes(fieldName)) {
                        if (isNaN(fieldValue)) {
                            field.error = `Must be a <strong>number</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }
                    // Test for correct date
                    if (['delivery_date'].includes(fieldName)) {
                        // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
                        // Regex that looks for a work with exactly 3 characters between A-z.
                        const reg = new RegExp('\\b[A-z]{3}\\b')
                        let valueToTest = JSON.parse(JSON.stringify(fieldValue))
                        if (reg.test(valueToTest)) {
                            // If true then add a "1-" to the date to avoid ambiguity
                            valueToTest= '1-' + valueToTest
                        }
                        const dateValue = new Date (valueToTest)
                        if (!dateValue instanceof Date || isNaN(dateValue)) {
                            field.error = `Invalid <strong>Date format</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>
                            <br>Make sure that values only contain <strong>English</strong> month names`
                            valid = false
                        }
                    }
                    // Test for correct url
                    if (['image'].includes(fieldName)) {
                        const urlReg = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)
                        if (!urlReg.test(fieldValue)) {
                            field.error = `Must be a <strong>valid URL</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }

                    // Test for correct currency
                    if (this.singleCurrencyFile && ['currency'].includes(fieldName)) {
                        if (fieldValue.length != 3) {
                            field.error = `Currency must be a <strong>3 letter</strong> currency code.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }
                }
            }
            return valid
        },
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

.map-fields {
    display: flex;
    justify-content: center;
    h3 {
        padding-left: 24px;
        margin: 48px 0 12px;
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
    .link-ids {
        .map-fields-table {
            padding-left: 24px;
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
                padding-left: 28px;
                margin-top: 0;
                margin-bottom: 4px;
            }
            .currency-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                align-items: flex-end;
                padding-left: 20px;
                    p {
                    padding-left: 24px;
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
        padding-left: 28px;
        margin-top: 0;
        margin-bottom: 4px;
    }
}
.assortment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    align-items: flex-end;
    padding-left: 20px;
        p {
        padding-left: 24px;
        .small {
            font-size: 12px;
        }
    }
}
.remove-variant-image {
    margin-right: -32px;
}
</style>