<template>
    <div class="map-fields">
        <form @submit.prevent class="map-fields">
        <div class="form-element" style="text-align: center;">
            <p>Choose columns to match from your uploaded datasource.</p>
        </div>

            <div class="form-section link-ids">
                <h3>Link IDs <BaseTooltipButton :msg="'Select the ID field for each file to link them'"/></h3>
                <table class="map-fields-table">
                    <tr class="header">
                        <th><label>File</label></th>
                        <th></th>
                        <th><label>Key to match</label></th>
                        <th><label>Example</label></th>
                    </tr>
                    <tr v-for="(file, index) in availableFiles" :key="index">
                        <td><BaseInputField class="input-field" :value="file.fileName"
                        disabled=true readOnly=true v-tooltip="file.fileName"/></td>
                        <td class="equals"><i class="fas fa-equals"></i></td>
                        <td><BaseInputField class="input-field" disabled=true :class="{'auto-match': file.key.autoMatch}"
                        :value="file.key.fieldName" type="select" @click="showSelectKeyContext($event, file)">
                            <i class="fas fa-caret-down"></i>
                        </BaseInputField></td>
                        <td><BaseInputField :errorTooltip="file.keyError" class="input-field" disabled=true readOnly=true
                            :value="previewExampleValue(file.key, 'datasource_id')"/>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="form-section map-main-fields" v-if="fields.length > 0">
                <h3>Map fields</h3>
                <table class="map-fields-table">
                    <tr class="header">
                        <th><label>Database field name</label></th>
                        <th></th>
                        <th><label>Matched Datasource field name</label></th>
                        <th><label>Example</label></th>
                    </tr>
                    <tr v-for="(field, index) in fields" :key="index" :class="{disabled: !field.enabled}">
                        <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                        <td class="equals"><i class="fas fa-equals"></i></td>
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
                </table>
            </div>

            <div class="form-section map-currencies" v-if="replacePrices">
                <h3>Map currencies</h3>
                <table class="single-currency-file-table">
                    <tr>
                        <td><BaseCheckbox :value="true" :modelValue="singleCurrencyFile"
                        @change="checked => $emit('update:singleCurrencyFile', checked)"/></td>
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
                                        <th><label :for="'currency-'+index+'-name'">Currency Name (ex. EUR)</label></th>
                                        <th></th>
                                        <th><label :for="'currency-'+index+'-file'">Linked File</label></th>
                                    </tr>
                                    <tr>
                                        <!-- <td><BaseInputField :id="'currency-'+index+'-name'" 
                                        class="input-field" placeholder="Fx. EUR" v-model="currency.currencyName"/></td> -->
                                        <td><BaseInputField :id="'currency-'+index+'-name'" :errorTooltip="currency.nameError"
                                        class="input-field" placeholder="Fx. EUR" v-model="currency.currencyName"
                                        @blur="validateCurrency(currency)"
                                        @input.native="currency.currencyName = currency.currencyName.toUpperCase()"/></td>
                                        <td class="equals"><i class="fas fa-equals"></i></td>

                                        <td><BaseInputField :id="'currency-'+index+'-file'" 
                                        class="input-field" disabled=true
                                        :value="currency.fileIndex != null ? availableFiles[currency.fileIndex].fileName : null" 
                                        type="select" @click="showSelectFileContext($event, currency)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="right">
                                <button v-if="index > 0" class="dark" @click="$emit('removeCurrency', index)">
                                    <i class="fas fa-trash-alt"></i><span>Remove currency</span>
                                </button>
                            </div>
                        </div>
                        <table class="map-fields-table">
                            <tr class="header">
                                <th><label>Database field name</label></th>
                                <th></th>
                                <th><label>Matched Datasource field name</label></th>
                                <th><label>Example</label></th>
                            </tr>
                            <tr v-for="(field, index) in currency.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                <template v-if="field.name != 'currency' || singleCurrencyFile">
                                    <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td class="equals"><i class="fas fa-equals"></i></td>
                                    <!-- <td><BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                    class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                    :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                        <i class="fas fa-caret-down"></i>
                                    </BaseInputField></td> -->
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
                <button v-if="!singleCurrencyFile" type="button" class="dark" 
                @click="$emit('addCurrency')">
                    <i class="fas fa-plus"></i><span>Add currency</span>
                </button>
            </div>

            <!-- START Map Assortments -->
            <div class="table-wrapper map-assortments" v-if="replaceAssortments">
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
                        <button v-if="index > 0" class="dark" @click="$emit('removeAssortment', index)">
                            <i class="fas fa-trash-alt"></i><span>Remove assortment</span>
                        </button>
                    </div>
                    <table class="map-fields-table">
                        <tr class="header">
                            <th><label>Database</label></th>
                            <th></th>
                            <th><label>Matched Datasource</label></th>
                            <th><label>Example</label></th>
                        </tr>
                        <tr v-for="(field, index) in assortment.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                            <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                            <td><i class="fas fa-equals"></i></td>
                            <!-- <td><BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                            class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                            :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                <i class="fas fa-caret-down"></i>
                            </BaseInputField></td> -->
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
                @click="$emit('addAssortment')">
                    <i class="fas fa-plus"></i><span>Add assortment</span>
                </button>
            </div>
            <!-- END Map Assortments -->

        </form>


        <div class="form-controls">
            <button :disabled="!submitValid" type="submit" class="lg primary full-width"
            @click="$emit('submit')">
                <span>Upload new data</span>
            </button>
        </div>

        <BaseContextMenu ref="contextSelectFileKey" class="context-select-key">
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
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectField" class="context-select-field">
            <template v-slot:header>
                Select field to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.newValue={fileIndex: null, fieldName: null, fieldIndex: null};slotProps.item.error=false;slotProps.hide()"
                    :options="availableFiles" multipleOptionArrays="true" optionGroupNameKey="fileName" optionGroupOptionsKey="headers"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :optionDescriptionKey="'fileName'"
                    :optionNameKey="'fieldName'" :search="true" @submit="validateField(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectFile" class="context-select-file">
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
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'mapFieldsScreen',
    props: [
        'fields',
        'availableFiles',
        'replacePrices',
        'currenciesToMatch',
        'singleCurrencyFile',
        'assortmentsToMatch',
        'replaceAssortments',
    ],
    data: function () { return {
        filesToChooseFrom: []
    }},
    computed: {
        submitValid() {
            // //assume true
            // let valid = true
            // // Check that all files have a valid key
            // this.availableFiles.forEach(file => {
            //     if (file.key.fileIndex == null) {
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
            // return valid
            // return true

            //assume true
            let valid = true
            // Check that all files have a valid key
            this.availableFiles.forEach(file => {
                if (file.key.fileIndex == null) {
                    valid = false
                }
            })
            // Loop through the fields and look for errors
            this.fields.forEach(field => {
                // Check if the field has been mapped
                if (field.newValue.fieldIndex != null) {
                    if (!this.validateField(field)) {
                        valid = false
                    }
                }
            })
            // Loop through the currencies and look check their names
            if (!this.singleCurrencyFile) {
                this.currenciesToMatch.forEach(currency => {
                    console.log('valdiate currency', currency)
                    if(currency.fileIndex != null && !this.validateCurrency(currency)) {
                        valid = false
                    }
                })
            }
            return valid
        }
    },
    methods: {
        previewExampleValue(newValue, fieldName) {
            const files = this.availableFiles
            // First check that we have any previews available, and that we have a new value defined
            if (files.length > 0 && newValue.fileIndex != null && newValue.fieldIndex != null) {
                const csvFile = files[newValue.fileIndex]
                const fieldValue = csvFile.lines[0][newValue.fieldIndex]
                return fieldValue
            }
            return 'Not matched'
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
        autoMapHeaders(file, fileIndex) {
            // Loop through the fields we still need to match to a header
            this.fields.forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })

            // Step 2: Match Keys (ID)
            // Check if the file already has a key
            if (file.key.fieldIndex == null) {
                const keysToMatch = ['id','style number','style no','product id','number', 'style_no', 'style_number']
                let keyAutoMatchIndex = file.headers.findIndex(header => keysToMatch.includes(header.fieldName.toLowerCase()))
                if (keyAutoMatchIndex >= 0) {
                    const keyToPush = {fileIndex: fileIndex, fieldName: file.headers[keyAutoMatchIndex].fieldName, fieldIndex: keyAutoMatchIndex, autoMatch: true}
                    file.key = keyToPush
                    // Validate the value of the new mapping
                    this.validateKey(file)
                }
            }
        },
        autoMapCurrency(currency) {
            // Loop through the fields we still need to match to a header
            const file = this.availableFiles[currency.fileIndex]
            currency.fieldsToMatch.forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: currency.fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })
        },
        autoMapAssortment(assortment) {
            // Loop through the fields we still need to match to a header
            const file = this.availableFiles[assortment.fileIndex]
            assortment.fieldsToMatch.forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: assortment.fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })
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
        showSelectFileContext(e, currency) {
            const contextMenu = this.$refs.contextSelectFile
            contextMenu.item = currency
            contextMenu.show(e)
        },
        showSelectAssortmentFileContext(e, assortment) {
            const contextMenu = this.$refs.contextSelectAssortmentFile
            contextMenu.item = assortment
            contextMenu.show(e)
        },
    },
    created() {
        // Attempt to auto map our headers, every time this screen is shown
        for (let index = 0; index < this.availableFiles.length; index++) {
            const file = this.availableFiles[index]
            this.autoMapHeaders(file, index)
        }
    }
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

.upload-to-file-modal.map-fields {
    .modal {
        // width: 900px;
        // max-width: 90vw;
        .body {
            max-width: none;
            .input-field {
                &.auto-match {
                    .input-wrapper {
                        border-color: $primary
                    }
                }
            }
        }
    }
}

</style>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .map-fields {
        h3 {
            &:not(:first-child) {
                margin-top: 48px;
            }
        }
        table {
            border-spacing: 0 2px;
            width: 100%;
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
            .equals {
                width: 60px;
                text-align: center;
            }
        }
        .map-fields-table {
            width: 100%;
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
                    align-items: center;
                }
                .input-field {
                    width: 240px;
                }
            }
        }
    }
.assortment-wrapper {
    margin-bottom: 20px;
    h4 {
        margin-top: 32px;
        margin-bottom: 4px;
    }
}
.assortment-header {
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
.map-assortments {
    button {
        margin-bottom: 32px;
    }
}

</style>