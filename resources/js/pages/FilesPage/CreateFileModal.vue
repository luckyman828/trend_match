<template>
    <BaseModal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" 
    ref="modal" :header="currentScreen.header" :goBack="currentScreen.name == 'mapFields'" @goBack="onGoBack">
        <form @submit.prevent enctype="multipart/form-data">

            <template v-if="currentScreen.name == 'chooseFiles'">
                <div class="form-element" style="text-align: center;">
                    <p>A file is a collection of products that users will be able to view in the dashboard and/or app</p>
                    <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
                </div>

                <div class="form-element">
                    <label for="file-name-input">File name* (required)</label>
                    <input type="text" id="file-name-input" class="input-wrapper" placeholder="unnamed file" v-model="newFile.title">
                </div>
                <div class="form-element">
                    <BaseDroparea multiple="true" accept=".csv, text/csv" ref="droparea"
                    @input="filesChange">
                        <template v-slot="slotProps">
                            <template v-if="newFile.files.length < 1">
                                <strong>Drop your file(s) here or click to upload</strong>
                                <i class="fal fa-file-csv big-icon primary"></i>
                                <button type="button" class="dark md" @click="slotProps.activate">
                                    <i class="far fa-file-csv"></i>
                                    <span>Browse files</span>
                                </button>
                            </template>
                            <template v-else>
                                <strong>Drag and drop files here to upload</strong>
                                <div class="files-wrapper">
                                    <div class="file-to-upload" v-for="(file, index) in newFile.files" :key="index">
                                        <span>{{file.name}}</span>
                                        <button class="ghost" type="button" @click="removeFile(index)">
                                            <i class="remove far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" class="dark md" @click="slotProps.activate">
                                    <i class="far fa-file-csv"></i>
                                    <span>Browse files</span>
                                </button>
                            </template>
                        </template>
                        <template v-slot:dragDisplay>
                            <i class="big-icon fas fa-smile-beam"></i>
                            <span>Drop file(s) here</span>
                        </template>
                    </BaseDroparea>
                </div>
                <div class="form-controls">
                    <button type="button" class="lg primary ghost" :disabled="newFile.title.length < 1"
                    @click="createEmpty">
                        <span>Create Empty</span>
                    </button>
                    <button type="button" class="lg primary" :disabled="newFile.files.length <= 0 || newFile.title.length <= 0"
                    @click="onGoToMapFields">
                        <span>Next: Map fields</span>
                    </button>
                </div>
            </template>
            <template v-if="currentScreen.name == 'mapFields'">
                <div class="form-element" style="text-align: center;">
                    <p>Some text to help understand what mapping means. Should be short.</p>
                    <p><strong>Select Fields to keep, and match with headers from your file(s).</strong></p>
                </div>

                <div class="map-fields">
                    <div class="tables">

                        <div class="table-wrapper link-ids">
                            <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th><label>File</label></th>
                                    <th></th>
                                    <th><label>Key to match</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(file, index) in availableFiles" :key="index">
                                    <td><BaseInputField class="input-field" disabled=true :value="file.fileName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td><BaseInputField class="input-field" disabled=true :class="{'auto-match': file.key.autoMatch}"
                                    :value="file.key.fieldName" type="select" @click="showSelectKeyContext($event, file)"/></td>
                                    <td><BaseInputField :errorTooltip="file.keyError" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(file.key, 'datasource_id')"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-wrapper map-main-fields">
                            <h3>Map fields</h3>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th></th>
                                    <th><label>Database</label></th>
                                    <th></th>
                                    <th><label>Matched Datasource</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(field, index) in fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                    <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td>
                                        <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)"/>
                                    </td>
                                    <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue, field.name)"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-wrapper map-currencies">
                            <h3>Map currencies</h3>
                            <table class="single-currency-file-table">
                                <tr>
                                    <td><BaseCheckbox :value="singleCurrencyFile" v-model="singleCurrencyFile"/></td>
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
                                                    <td><BaseInputField :id="'currency-'+index+'-name'" 
                                                    class="input-field" placeholder="Fx. EUR" v-model="currency.currencyName"/></td>
                                                    <td><i class="fas fa-equals"></i></td>
                                                    <td><BaseInputField :id="'currency-'+index+'-file'" 
                                                    class="input-field" disabled=true
                                                    :value="currency.fileIndex != null ? availableFiles[currency.fileIndex].fileName : null" 
                                                    type="select" @click="showSelectFileContext($event, currency)"/></td>
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
                                                <td><BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                                class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                                :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)"/></td>
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
                        </div>

                    </div>

                </div>

                <div class="form-controls">
                    <button :disabled="!submitValid" type="submit" class="lg primary full-width"
                    @click="submitFiles">
                        <span>Create file</span>
                    </button>
                </div>
            </template>

        </form>

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

    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import File from '../../store/models/Collection';
import Phase from '../../store/models/Phase';

export default {
    name: 'createFileModal',
    data: function () { return {
        currentScreen: {name: 'chooseFiles', header: 'Create new file'},
        newFile: {
            title: '',
            files: [],
        },
        uploadingFile: false,
        csvDelimiter: ';',
        availableFiles: [],
        filePreviews: [],
        singleCurrencyFile: true,
        fieldsToMatch: [
            {name: 'title', displayName: 'Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['title','name','style name','product name']},
            {name: 'sale_description', displayName: 'Description',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['description','sales description']},
            {name: 'brand', displayName: 'Brand',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['brand','brand name']},
            {name: 'category', displayName: 'Category',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['category','style category','product category']},
            {name: 'quantity', displayName: 'Minimum Order Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['minimum','minimum quantity','quantity','minimum order quantity','order minimum','order minimum quantity']},
            {name: 'variant_min_quantity', displayName: 'Minimum Variant Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['variant minimum','variant minimum quantity','minimum variant','minimum variant quantity','color minimum','colour minimum','minimum per color']},
            {name: 'composition', displayName: 'Composition',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['composition','materials','quality','material']},
            {name: 'delivery_date', displayName: 'Delivery (date/month)',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['delivery','delivery date','delivery month','del. date','del. month','del. period','delivery period']},
            {name: 'editors_choice', displayName: 'Editors Choice',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['editors choice','focus','focus style','focus product']},
            {name: 'assortment_name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['assortment name','box name']},
            {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['box ean','assortment box ean','assortment ean']},
            {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['box size','assortment box size', 'ass.']},
            {name: 'color', displayName: 'Variant Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['color','colour','variant','variant name','color name','colour name','main colour name']},
            {name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['picture url','image url','img url','picture','image','img']},
            {name: 'sizes', displayName: 'Variant Sizes',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['sizes','variant sizes','size','variant size']},
            {name: 'eans', displayName: 'EANs',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['eans','ean','variant ean','style ean']},
            {name: 'buyer_group', displayName: 'Buyer Group',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['buyer group','buyer','pricelist']},
        ],
        currencyDefaultObject: {
            currencyName: '',
            fileIndex: null,
            fieldsToMatch: [
                {name: 'currency', displayName: 'Currency Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['currency','currency name']},
                {name: 'markup', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['markup','mark up']},
                {name: 'wholesale_price', displayName: 'Wholesale Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['whs','wholesale price','whs price']},
                {name: 'recommended_retail_price', displayName: 'Recommended Retail Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['rrp','recommended retail price','retail price']},
            ]
        },
        currenciesToMatch: [{
            currencyName: '',
            fileIndex: null,
            fieldsToMatch: [
                {name: 'currency', displayName: 'Currency Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['currency','currency name']},
                {name: 'markup', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['markup','mark up']},
                {name: 'wholesale_price', displayName: 'Wholesale Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['whs','wholesale price','whs price']},
                {name: 'recommended_retail_price', displayName: 'Recommended Retail Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['rrp','recommended retail price','retail price']},
            ]
        }]
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFolderId']),
        submitValid() {
            //assume true
            let valid = true
            // Check that all files have a valid key
            this.availableFiles.forEach(file => {
                if (file.key.fileIndex == null) {
                    valid = false
                }
            })
            // Loop through the fields and look for errors
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.enabled && field.newValue.fieldIndex != null) {
                    if (!this.validateField(field)) {
                        valid = false
                    }
                }
            })
            return valid
        }
    },
    methods: {
        ...mapActions('entities/collections', ['uploadFile']),
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
        validateKey(file) {
            // Assume no error
            file.keyError = false

            // Test n values
            // const limit = 10
            // for (let i = 0;i<limit;i++) {
            //     // Find the field value
            //     const fieldValue = file.lines[i][file.key.fieldIndex]
            //     // Test that the field is an integer
            //     if (typeof fieldValue != 'number') {
            //         file.keyError = "Value must be a number"
            //     }
            // }
            
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
                    if (['quantity','variant_min_quantity','box_size','eans','markup','recommended_retail_price','wholesale_price'].includes(fieldName)) {
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
                }
            }
            return valid
        },
        filesChange(fileList) {
            const files = fileList
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const extension = file.name.split('.').pop();

                // Check that the file is a csv
                if (extension == 'csv') {
                    if (!this.newFile.files.find(x => x.name == file.name)) {
                        this.newFile.files.push(file)
                    }
                } else {
                    // Throw error
                    console.log('invalid file extension')
                }
            }
        },
        removeFile(index) {
            this.newFile.files.splice(index, 1)
        },
        createEmpty() {
            // Create a copy of the new file object
            const newFile = JSON.parse(JSON.stringify(this.newFile))
            newFile.folder_id = this.currentFolderId
            newFile.workspace_id = this.currentWorkspaceId
            newFile.id = this.$uuid.v4()
            newFile.phase = Phase.query().first().id
            this.uploadingFile = true
            this.uploadFile(newFile)
            .then(success => {
                this.uploadingFile = false

                // Close modal on succes
                if (success) {
                    this.$refs.modal.hide()
                    // Reset modal
                    this.reset()
                }
                else window.alert('Something went wrong. Please try again')
            })
        },
        onGoToMapFields() {
            //Change the current screen
            this.currentScreen={name: 'mapFields', header: 'Map fields'}
            // Process the uploaded files
            this.newFile.files.forEach(file => {
                const fileReader = new FileReader()
                fileReader.readAsText(file)
                fileReader.onload = e => this.loadHandler(e, file.name)
            })
        },
        onGoBack() {
            //Change the current screen
            this.currentScreen={name: 'chooseFiles', header: 'Create new file'}
        },
        loadHandler(event, fileName) {
            const csv = event.target.result

            // First read the files and process them
            this.processFile(csv, fileName)
        },
        processFile(csv, fileName) {

            // Split the csv into lines by line breaks
            const allTextLines = csv.split(/\r\n|\r|\n/g)
            
            const csvLines = []
            const csvHeaders = []
            // Loop thorugh the lines
            let lineIndex = 0
            allTextLines.forEach(line => {
                
                // Split the line by our delimiter
                const cells = line.split(this.csvDelimiter)

                // Read the first line as headers
                if (lineIndex == 0) {
                    // Loop through the headerCells and push an object
                    let cellIndex = 0
                    cells.forEach(cell => {
                        // Push the cells to our headers array
                        csvHeaders.push({fileIndex: this.availableFiles.length, fieldName: cell, fieldIndex: cellIndex})
                        cellIndex++
                    })
                }
                // Make sure that there are not fewer lines than headers
                else if (cells.length >= csvHeaders.length) {
                    // Push the cells to our lines array
                    csvLines.push(cells)
                }
                lineIndex++
            })
            const fileToPush = {fileName: fileName, key: {fileIndex: null, fieldName: null, fieldIndex: null}, headers: csvHeaders, lines: csvLines, error: false}
            // Check if the file already exists. If so, replace it instead of adding
            const existingFile = this.availableFiles.find(x => x.fileName == fileName)
            if (existingFile) {
                existingFile = fileToPush
            } else {
                this.availableFiles.push(fileToPush)
            }
            this.autoMapHeaders(fileToPush, this.availableFiles.length-1)
        },
        autoMapHeaders(file, fileIndex) {
            // Loop through the fields we still need to match to a header
            this.fieldsToMatch.forEach(field => {
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
                const keysToMatch = ['id','style number','style no','product id','number']
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
        showSelectContext(e, field) {
            const contextMenu = this.$refs.contextSelectField
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
        instantiateProducts(fileId) {
            const productsToReturn = []
            
            // STEP 1) Loop through each of our available files and instantiate our products by key
            let fileIndex = 0
            this.availableFiles.forEach(file => {
                // Check that the file has been linked by id key
                if (file.key.fieldIndex != null) {
                    // Loop through the files lines and instantiate product
                    file.lines.forEach(line => {
                        // PRODUCTS
                        // Find the key value that we will use to check for unique products
                        const keyValue = line[file.key.fieldIndex]
                        // Check that the value does not already exists
                        let product = productsToReturn.find(x => x.datasource_id == keyValue)
                        if (!product) {
                            product = {
                                datasource_id: keyValue,
                                id: this.$uuid.v4(),
                                collection_id: fileId,
                                color_variants: [],
                                assortments: [],
                                prices: [],
                                eans: []
                            }
                            productsToReturn.push(product)
                        }

                        // VARIANTS
                        // Find / Instantiate this lines variant
                        let variantKeyField = this.fieldsToMatch.find(x => x.name == 'color')
                        let variant = null
                        // Check that the variant key is from this file
                        if (variantKeyField.newValue.fileIndex == fileIndex && variantKeyField.newValue.fieldIndex != null) {
                            // Find the variant keys index
                            let variantKeyIndex = variantKeyField.newValue.fieldIndex
                            // Find the variant keys value
                            let variantKeyValue = line[variantKeyIndex]
                            // Find this lines variant name
                            variant = product.color_variants.find(x => x.color == variantKeyValue)
                            if (!variant) {
                                variant = {
                                    color: variantKeyValue,
                                    image: null,
                                    sizes: []
                                }
                                product.color_variants.push(variant)
                            }
                        }

                        // Assortments
                        // Find / Instantiate this lines assortments
                        let assortmentKeyField = this.fieldsToMatch.find(x => x.name == 'assortment_name')
                        let assortment = null
                        // Check that the assortment key is from this file
                        if (assortmentKeyField.newValue.fileIndex == fileIndex) {
                            // Find the assortment keys index
                            let assortmentKeyIndex = assortmentKeyField.newValue.fieldIndex
                            // Find the assortment keys value
                            let assortmentKeyValue = line[assortmentKeyIndex]
                            // Find this lines assortment name
                            assortment = product.assortments.find(x => x.assortment_name == assortmentKeyValue)
                            if (!assortment) {
                                assortment = {
                                    assortment_name: assortmentKeyValue,
                                    box_ean: null,
                                    box_size: null,
                                }
                                product.assortments.push(assortment)
                            }
                        }

                        // CURRENCIES
                        // Find / Instantiate this lines currencies
                        let currency = null
                        let currencies = this.currenciesToMatch
                        
                        // Check if we have single file containing all currencies
                        if (this.singleCurrencyFile) {
                            currencies = [this.currenciesToMatch[0]]
                            let currencyObject = this.currenciesToMatch[0]
                            // If so instantiate currencies the same way as we do for variants and assortments
                            let currencyKeyField = currencyObject.fieldsToMatch.find(x => x.name == 'currency')
                            // Check if the mapped currency field belongs to this file and is mapped
                            if (currencyKeyField.newValue.fileIndex == fileIndex && currencyKeyField.newValue.fieldIndex != null) {
                                // Find the currency keys index
                                let currencyKeyIndex = currencyKeyField.newValue.fieldIndex
                                // Find the currency keys value
                                let currencyKeyValue = line[currencyKeyIndex]
                                // Find this lines variant name
                                currency = product.prices.find(x => x.currency == currencyKeyValue)

                                if (!currency) {
                                    currency = {
                                        currency: currencyKeyValue,
                                        wholesale_price: 0,
                                        recommended_retail_price: 0,
                                        markup: 0
                                    }
                                    product.prices.push(currency)
                                }
                            }
                        }

                        // Loop through our currencies to match
                        currencies.forEach(thisCurrencyObject => {
                            // Check if we have single file containing all currencies
                            if (!this.singleCurrencyFile) {
                                // Instantiate a currency object
                                currency = product.prices.find(x => x.currency == thisCurrencyObject.currencyName)
                                if (!currency) {
                                    currency = {
                                        currency: thisCurrencyObject.currencyName,
                                        wholesale_price: 0,
                                        recommended_retail_price: 0,
                                        markup: 0
                                    }
                                    product.prices.push(currency)
                                }
                            }
                            // Loop through the currencies fields
                            thisCurrencyObject.fieldsToMatch.forEach(field => {
                                if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                    const currencyFieldValue = line[field.newValue.fieldIndex]
                                    const currencyFieldName = field.name
                                    // Check if we have matched a currency for this line
                                    if (currency && currencyFieldName != 'currency') {
                                        // If the currency exists, add the field value to it
                                        currency[currencyFieldName] = currencyFieldValue
                                    }
                                }
                            })
                        })
                             
                        // FIELDS
                        // Loop thorugh our fields to match, and check if they are matched to the current file
                        this.fieldsToMatch.forEach(field => {
                            // Check that the field has not been disabled
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name

                                // Check for special case fields that need to be added to objects in json fields
                                // Variants
                                if (['color','image','sizes'].includes(fieldName)) {
                                    // Check if we have matched a variant for this line
                                    if (variant) {
                                        // If the variant exists, add the field value to it
                                        // Check if the field is an array, because then it should be added to the sizes array
                                        if (Array.isArray(variant[fieldName])) {
                                            variant[fieldName].push(fieldValue)
                                        } else {
                                            variant[fieldName] = fieldValue
                                        }
                                    }
                                }
                                // Assortments
                                else if (['assortment_name','box_ean','box_size'].includes(fieldName)) {
                                    // Check if we have matched an assortment for this line
                                    if (assortment) {
                                        // If the variant exists, add the field value to it
                                        assortment[fieldName] = fieldValue
                                    }
                                }

                                // If we don't have a special case, simply write the key value pair to the product
                                else {
                                    // Check if the field is an array, because then it should be added to the array
                                    if (Array.isArray(product[fieldName])) {
                                        // Check that the value does not already exist in the array
                                        let arrayValueExists = product[fieldName].includes(fieldValue)
                                        if (!arrayValueExists) {
                                            product[fieldName].push(fieldValue)
                                        }
                                    } else {
                                        // Else simply write the key value pair to the product
                                        product[fieldName] = line[field.newValue.fieldIndex]
                                    }
                                }
                            }
                        })

                    })
                }
                fileIndex++
            })

            return productsToReturn
        },
        submitFiles() {

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
            if (!valid) {
                alert('Error. One or more fields have an error')
                return
            }

            // Set new file data
            const newFile = this.newFile
            newFile.folder_id = this.currentFolderId
            newFile.workspace_id = this.currentWorkspaceId
            newFile.id = this.$uuid.v4()
            newFile.products = this.instantiateProducts(newFile.id)
            newFile.phase = Phase.query().first().id

            // Create collection from name
            this.uploadingFile = true
            this.uploadFile(newFile)
            .then(success => {
                this.uploadingFile = false

                // Close modal on succes
                if (success) {
                    this.$refs.modal.hide()
                    // Reset modal
                    this.reset()
                }
                else window.alert('Something went wrong. Please try again')
            })
        },
        reset() {
            this.availableFiles = []
            this.singleCurrencyFile = true
            this.currentScreen = {name: 'chooseFiles', header: 'Create new file'}
            this.currenciesToMatch = [JSON.parse(JSON.stringify(this.currencyDefaultObject))]
            this.newFile = {
                title: '',
                files: [],
            }
            // Reset fields to match
            this.fieldsToMatch.forEach(field => {
                field.enabled = true
                field.error = false
                field.newValue = {fileIndex: null, fieldName: null, fieldIndex: null}
            })
        }
    },
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

    .create-file-modal {
        &.map-fields {
            .modal {
                width: 1068px;
                max-width: 90vw;
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
    }

</style>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .create-file-modal {
        .form-controls {
            display: flex;
            justify-content: flex-end;
            > :not(:last-child) {
                margin-right: 16px;
            }
        }
        .big-icon {
            font-size: 60px;
            margin: 32px 0 48px;
        }
        .files-wrapper {
            margin: 32px 0 32px;
            width: 100%;
            .file-to-upload {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                height: 40px;
                padding: 4px 4px 4px 8px;
                border: solid 1px $divider;
                border-radius: 4px;
                span {
                    color: $primary;
                }
                &:not(:last-child) {
                    margin-bottom: 4px;
                }
            }
        }
    }
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

</style>