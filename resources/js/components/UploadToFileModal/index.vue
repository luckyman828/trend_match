<template>
    <BaseModal :classes="['upload-to-file-modal', currentScreen.header]" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreenIndex > 0" @goBack="currentScreenIndex--">

        <UploadFilesScreen v-if="currentScreenIndex == 0" :filesToUpload="filesToUpload"
        :replaceAllProducts.sync="replaceAllProducts"
        @goToNextScreen="currentScreenIndex++;"
        @processFile="processFile" @removeFileToUpload="removeFileToUpload"
        @addFileToUpload="addFileToUpload"/>

        <MapFieldsScreen v-if="currentScreenIndex == 1" 
        @goToPrevScreen="currentScreenIndex--"/>

    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UploadFilesScreen from './UploadFilesScreen'
import MapFieldsScreen from './MapFieldsScreen'

export default {
    name: 'uploadeToFileModal',
    props: [
        'show'
    ],
    components: {
        UploadFilesScreen,
        MapFieldsScreen
    },
    data: function () { return {
        screens: [
            {
                header: 'Choose files to upload',
                class: 'index'
            },
            {
                header: 'Map fields',
                class: 'map-fields'
            }
        ],
        filesToUpload: [],
        replaceAllProducts: true,
        currentScreenIndex: 0,
        newFile: null,
        uploadingFile: false,
        availableFiles: [],
        filePreviews: [],
        singleCurrencyFile: true,
        fieldsToMatch: [
            {name: 'title', displayName: 'Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['title','name','style name','product name' ,'style_name', 'product_name']},
            {name: 'sale_description', displayName: 'Description',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['description','sales description']},
            {name: 'brand', displayName: 'Brand',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['brand','brand name', 'brand_name']},
            {name: 'category', displayName: 'Category',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['category','style category','product category']},
            {name: 'min_order', displayName: 'Minimum Order Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['minimum','minimum quantity','quantity','minimum order quantity','order minimum','order minimum quantity']},
            {name: 'min_variant_order', displayName: 'Minimum Variant Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['variant minimum','variant minimum quantity','minimum variant','minimum variant quantity','color minimum','colour minimum','minimum per color']},
            {name: 'composition', displayName: 'Composition',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['composition','materials','quality','material']},
            {name: 'delivery_date', displayName: 'Delivery (date/month)',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['delivery','delivery date','delivery month','del. date','del. month','del. period','delivery period']},
            {name: 'editors_choice', displayName: 'Editors Choice',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['editors choice','focus','focus style','focus product']},
            {name: 'assortment_name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['assortment name','box name', 'ass name']},
            {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['box ean','assortment box ean','assortment ean', 'ass ean']},
            {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['box size','assortment box size', 'ass.', 'ass size', 'assortment size']},
            {name: 'variant_name', displayName: 'Variant Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['color','colour','variant','variant name','color name','colour name','main colour name', 'colour_name']},
            {name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['picture url','image url','img url','picture','image','img']},
            {name: 'sizes', displayName: 'Variant Sizes',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['sizes','variant sizes','size','variant size']},
            {name: 'eans', displayName: 'EANs',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['eans','ean','variant ean','style ean', 'ean_no']},
            {name: 'buying_group', displayName: 'Buyer Group',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['buyer group','buyer','pricelist', 'buying group']},
        ],
        currencyDefaultObject: {
            currencyName: '',
            fileIndex: null,
            fieldsToMatch: [
                {name: 'currency', displayName: 'Currency Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['currency','currency name']},
                {name: 'mark_up', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
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
                {name: 'mark_up', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['markup','mark up']},
                {name: 'wholesale_price', displayName: 'Wholesale Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['whs','wholesale price','whs price']},
                {name: 'recommended_retail_price', displayName: 'Recommended Retail Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['rrp','recommended retail price','retail price']},
            ]
        }]
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder']),
        currentScreen() {
            return this.screens[this.currentScreenIndex]
        },
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
        ...mapActions('files', ['insertOrUpdateFile']),
        ...mapActions('products', ['insertProducts']),
        addFileToUpload(file) {
            this.filesToUpload.push(file)
        },
        removeFileToUpload(index) {
            this.filesToUpload.splice(index, 1)
        },
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
                }
            }
            return valid
        },
        processFile(csv, fileName) {

            // Split the csv into lines by line breaks
            // NB: This regex is magic
            // It matches strings seperated by linebreaks (CLRF (windows,max,linux shouldb be supported)) 
            // not inside double quotation marks, while allowing for escaped " marks. 
            const allTextLines = csv.match(/(?:"(?:\\.|[^"])*"|\\.|[^\r\n|\r|\n])+/g)

            // Loop thorugh the lines
            let lineIndex = 0
            const csvLines = []
            const csvHeaders = []

            // Attempt to determine file delimiter
            const csvDelimiters = [';', ',', '\t']
            let delimiterIndex = 0
            // Loop through our delimiters and try to split the first row by it. Apply the delimiter with the highest number of matches
            // This should work because the first row should contain headers and therefore not include any other delimiters
            let cellCount = 0
            let testDelimiterIndex = 0
            csvDelimiters.forEach(delimiter => {
                const testCellCount = allTextLines[0].split(delimiter).length
                if (testCellCount >= cellCount) {
                    cellCount = testCellCount
                    delimiterIndex = testDelimiterIndex
                }
                testDelimiterIndex++
            })
            const csvDelimiter = csvDelimiters[delimiterIndex]

            while (lineIndex < allTextLines.length) {
                const line = allTextLines[lineIndex]
                
                // Split the line by our delimiter
                const cells = line.split(csvDelimiter)

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
                // Not the header row
                else {
                    // Push the cells to our lines array
                    csvLines.push(cells)
                }
                // Increment the row index
                lineIndex++
            }

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
                                variants: [],
                                assortments: [],
                                prices: [],
                                eans: []
                            }
                            productsToReturn.push(product)
                        }

                        // VARIANTS
                        // Find / Instantiate this lines variant
                        let variantKeyField = this.fieldsToMatch.find(x => x.name == 'variant_name')
                        let variant = null
                        // Check that the variant key is from this file
                        if (variantKeyField.newValue.fileIndex == fileIndex && variantKeyField.newValue.fieldIndex != null) {
                            // Find the variant keys index
                            let variantKeyIndex = variantKeyField.newValue.fieldIndex
                            // Find the variant keys value
                            let variantKeyValue = line[variantKeyIndex]
                            // Find this lines variant name
                            variant = product.variants.find(x => x.name == variantKeyValue)
                            if (!variant) {
                                variant = {
                                    name: variantKeyValue,
                                    image: null,
                                    sizes: []
                                }
                                product.variants.push(variant)
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
                                    name: assortmentKeyValue,
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
                                        mark_up: 0
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
                                        mark_up: 0
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
                                if (['variant_name','image','sizes'].includes(fieldName)) {
                                    // Check if we have matched a variant for this line
                                    if (variant) {
                                        // If the variant exists, add the field value to it
                                        // Check if the field is an array, because then it should be added to the sizes array
                                        if (Array.isArray(variant[fieldName])) {
                                            // Only push the value if it does not already exists
                                            let arrayValueExists = variant[fieldName].includes(fieldValue)
                                            if (!arrayValueExists) {
                                                variant[fieldName].push(fieldValue)
                                            }
                                        } else if (fieldName != 'variant_name') { // Exclude variant_name to only write "name" to the variant
                                            variant[fieldName] = fieldValue
                                        }
                                    }
                                }
                                // Assortments
                                else if (['assortment_name','box_ean','box_size'].includes(fieldName)) {
                                    // Check if we have matched an assortment for this line
                                    if (assortment) {
                                        // If the assortment exists, add the field value to it
                                        if (fieldName != 'assortment_name') { // Exclude assortment_name to only write "name" to the variant
                                            assortment[fieldName] = fieldValue
                                        }
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
            if (!valid) {
                alert('Error. One or more fields have an error')
                return
            }

            // Set new file data
            const newFile = this.newFile
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id

            this.uploadingFile = true

            // First we need to create a file for the products, since the API requires that products be uploaded to an existing file
            await this.insertOrUpdateFile(newFile)

            // Then we will instantiate the products and attempt to upload them
            const newProducts = this.instantiateProducts(newFile.id)
            await this.insertProducts({file: newFile, products: newProducts, addToState: false})
            .then(() => {
                this.$emit('close')
                this.reset()
            }).catch(err => {
                window.alert('Something went wrong. Please try again')
            })
            this.uploadingFile = false
        },
        reset() {
            this.availableFiles = []
            this.singleCurrencyFile = true
            this.currentScreenIndex = 0
            this.currenciesToMatch = [JSON.parse(JSON.stringify(this.currencyDefaultObject))]
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

    .upload-to-file-modal {
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

    .upload-to-file-modal {
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