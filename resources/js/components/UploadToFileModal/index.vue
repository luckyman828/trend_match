<template>
    <BaseModal :classes="['upload-to-file-modal', currentScreen.class]" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreenIndex > 0" @goBack="currentScreenIndex--">

        <BaseLoader v-if="isSubmitting" :msg="submitStatus"/>

        <template v-else>
            <UploadFilesScreen v-if="currentScreenIndex == 0" :filesToUpload="filesToUpload"
            @goToNextScreen="currentScreenIndex++; processFilesToUpload()" ref="uploadFileScreen"
            @addFileToUpload="addFileToUpload" @removeFileToUpload="removeFileToUpload"
            @processFile="processFile"/>

            <SelectFieldsScreen v-if="currentScreenIndex == 1"
            :fields="fieldsToReplace" :replacePrices.sync="replacePrices"
            :replaceAssortments.sync="replaceAssortments"
            @goToNextScreen="currentScreenIndex++;"
            @goToPrevScreen="currentScreenIndex--"/>

            <MapFieldsScreen v-if="currentScreenIndex == 2"
            :fields="fieldsToMatch" :availableFiles="availableFiles"
            :fieldsToReplace="fieldsToReplace" :currenciesToMatch="currenciesToMatch"
            :assortmentsToMatch="assortmentsToMatch" :replaceAssortments="replaceAssortments"
            :replacePrices="replacePrices" :singleCurrencyFile.sync="singleCurrencyFile"
            @goToPrevScreen="currentScreenIndex--" @submit="onSubmit"
            @addCurrency="addCurrency" @removeCurrency="removeCurrency"
            @addAssortment="addAssortment" @removeAssortment="removeAssortment"/>
        </template>

    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UploadFilesScreen from './UploadFilesScreen'
import SelectFieldsScreen from './SelectFieldsScreen'
import MapFieldsScreen from './MapFieldsScreen'

export default {
    name: 'uploadToFileModal',
    props: [
        'show'
    ],
    components: {
        UploadFilesScreen,
        SelectFieldsScreen,
        MapFieldsScreen
    },
    data: function () { return {
        screens: [
            {
                header: 'Choose files to upload',
                class: 'index'
            },
            {
                header: 'Fields to replace',
                class: 'fields-to-replace'
            },
            {
                header: 'Map fields',
                class: 'map-fields'
            }
        ],
        isSubmitting: false,
        submitStatus: null,
        filesToUpload: [],
        currentScreenIndex: 0,
        availableFiles: [],
        filePreviews: [],
        singleCurrencyFile: false,
        replacePrices: false,
        replaceAssortments: false,
        fieldsToReplace: [
            {name: 'title', displayName: 'Name', enabled: false},
            {name: 'sale_description', displayName: 'Description', enabled: false},
            {name: 'brand', displayName: 'Brand', enabled: false},
            {name: 'category', displayName: 'Category', enabled: false},
            {name: 'min_order', displayName: 'Minimum Order Quantity', enabled: false},
            {name: 'min_variant_order', displayName: 'Minimum Variant Quantity', enabled: false},
            {name: 'composition', displayName: 'Composition', enabled: false},
            {name: 'delivery_date', displayName: 'Delivery (date/month)', enabled: false},
            {name: 'variants', displayName: 'Variants', enabled: false},
            {name: 'eans', displayName: 'Product EANs', enabled: false},
            {name: 'buying_group', displayName: 'Buyer Group', enabled: false},
        ],
        allFields: [
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
            {name: 'variant_name', displayName: 'Variant Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['color','colour','variant','variant name','color name','colour name','main colour name', 'colour_name']},
            {name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['picture url','image url','img url','picture','image','img', 'variant image']},
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
        }],
        assortmentDefaultObject: {
            fileIndex: null,
            fieldsToMatch: [
                {name: 'name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['assortment name','box name', 'ass name']},
                {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box ean','assortment box ean','assortment ean', 'ass ean']},
                {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box size','assortment box size', 'ass.', 'ass size', 'assortment size']},
            ]
        },
        assortmentsToMatch: [{
            fileIndex: null,
            fieldsToMatch: [
                {name: 'name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['assortment name','box name', 'ass name']},
                {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box ean','assortment box ean','assortment ean', 'ass ean']},
                {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box size','assortment box size', 'ass.', 'ass size', 'assortment size']},
            ]
        }]
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder', 'currentFile']),
        ...mapGetters('products', ['products']),
        currentScreen() {
            return this.screens[this.currentScreenIndex]
        },
        fieldsToMatch() {
            return this.allFields.filter(field => {
                // If the name of the field is included in the fields to replace array, include it
                if (this.fieldsToReplace.find(x => x.name == field.name && x.enabled)) {
                    return true
                }
                else if (['assortment_name', 'box_size', 'box_ean'].includes(field.name)
                && this.fieldsToReplace.find(x => x.name == 'assortments' && x.enabled)) {
                    return true
                }
                else if (['variant_name', 'image', 'sizes'].includes(field.name)
                && this.fieldsToReplace.find(x => x.name == 'variants' && x.enabled)) {
                    return true
                }
            })
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
                if (field.newValue.fieldIndex != null) {
                    if (!this.validateField(field)) {
                        valid = false
                    }
                }
            })
            return valid
        }
    },
    methods: {
        ...mapActions('products', ['updateProduct', 'uploadImage']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async getImageFromURL(url) {
            // Send a request to get the image
            let image
            await axios.get(url, {responseType: 'blob'}).then(response => {
                image = response.data
            }).catch(err => {
                image = false
                this.SHOW_SNACKBAR({ 
                    msg: 'Access Denied to download image to Kollekt. The image URL is used instead. This may mean slower load-times and less stability for your images on Kollekt. Conctact david@kollekt.dk to learn about what you can do.', 
                    type: 'info', 
                    iconClass: 'fa-exclamation-triangle', 
                })
            })
            return image
        },
        addFileToUpload(file) {
            this.filesToUpload.push(file)
        },
        removeFileToUpload(index) {
            // Check if the file exists in our availableFiles array.
            // If true also remove it there
            const availableFileIndex = this.availableFiles.findIndex(x => x.fileName == this.filesToUpload[index].name)
            if (availableFileIndex >= 0) this.availableFiles.splice(availableFileIndex, 1)
            // Remove the file from our filesToUpload array
            this.filesToUpload.splice(index, 1)
        },
        processFilesToUpload() {
            this.filesToUpload.forEach(file => {
                // Read the file into memory
                const fileReader = new FileReader()
                fileReader.readAsText(file, 'ISO-8859-4') // The default UTF-8 encoding was failing at scandinavian characters. This works for some reason.
                fileReader.onload = e => this.processFile(e.target.result, file.name)
            })
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
                // The split regex matches delimiters not in quotes
                const splitRegex = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g')
                const testCellCount = allTextLines[0].split(splitRegex).length
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
                // The split regex matches delimiters not in quotes
                const splitRegex = new RegExp(`${csvDelimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g')
                const cells = line.split(splitRegex)

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
                Object.assign(existingFile, fileToPush)
            } else {
                this.availableFiles.push(fileToPush)
            }
        },
        addCurrency() {
            this.currenciesToMatch.push(JSON.parse(JSON.stringify(this.currencyDefaultObject)))
        },
        removeCurrency(index) {
            this.currenciesToMatch.splice(index, 1)
        },
        addAssortment() {
            this.assortmentsToMatch.push(JSON.parse(JSON.stringify(this.assortmentDefaultObject)))
        },
        removeAssortment(index) {
            this.assortmentsToMatch.splice(index, 1)
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
        instantiateProducts() {
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
                            // Instantiate the product
                            product = {
                                datasource_id: keyValue,
                            }
                            if(this.fieldsToReplace.find(x => x.name == 'variants' && x.enabled)) 
                                product.variants = []
                            if(this.replacePrices) 
                                product.prices = []
                            if(this.replaceAssortments) 
                                product.assortments = []
                            if(this.fieldsToReplace.find(x => x.name == 'eans' && x.enabled)) 
                                product.eans = []

                            productsToReturn.push(product)
                        }

                        // VARIANTS
                        let variant = null
                        if (this.fieldsToReplace.find(x => x.name == 'variants' && x.enabled)) {
                            // Find / Instantiate this lines variant
                            let variantKeyField = this.fieldsToMatch.find(x => x.name == 'variant_name')
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
                        }

                        // Assortments
                        let assortment = null
                        let assortments = this.assortmentsToMatch
                        if (this.replaceAssortments) {
                            // Loop through our assortments to match
                            assortments.forEach(thisAssortmentObject => {

                                if (thisAssortmentObject.fileIndex == fileIndex) {
                                    // Instantiate an assortment object
                                    // FieldsToMatch[0] = assortment name
                                    const assortmentName = line[thisAssortmentObject.fieldsToMatch[0].newValue.fieldIndex]
                                    assortment = product.assortments.find(x => x.name == assortmentName)
                                    if (!!assortment || assortmentName) {
                                        if (!assortment) {
                                            assortment = {
                                                name: assortmentName,
                                                box_size: null,
                                                box_ean: null,
                                            }
                                            product.assortments.push(assortment)
                                        }
                                        // Loop through the currencies fields
                                        thisAssortmentObject.fieldsToMatch.forEach(field => {
                                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                                const assortmentFieldValue = line[field.newValue.fieldIndex]
                                                const assortmentFieldName = field.name
                                                assortment[assortmentFieldName] = assortmentFieldValue
                                            }
                                        })
                                    }
                                }
                            })
                        }

                        // CURRENCIES
                        let currency = null
                        if (this.replacePrices) {
                            // Find / Instantiate this lines currencies
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
                                    if (field.newValue.fileIndex == fileIndex) {
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
                        }
                             
                        // FIELDS
                        // Loop thorugh our fields to match, and check if they are matched to the current file
                        this.fieldsToMatch.forEach(field => {
                            // Check that the field has not been disabled
                            if (field.newValue.fileIndex == fileIndex) {
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
        async onSubmit() {
            this.isSubmitting = true

            // First validate all fields
            // Loop through the fields and look for errors
            // assume no errors
            let valid = true
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.newValue.fieldIndex != null) {
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
                alert('Error. One or more fields have an error')
                return
            }

            // Instantiate products from the mapped CSVs
            this.submitStatus = 'Processing products'
            const newProducts = this.instantiateProducts()

            this.submitStatus = 'Uploading images'
            await Promise.all(newProducts.map(async product => {
                await Promise.all(product.variants.map(async variant => {
                    if (variant.image) {
                        const imageFile = await this.getImageFromURL(variant.image)
                        if (imageFile) {
                            await this.uploadImage({ file: this.currentFile, product, variant, image: imageFile })
                        }
                    }
                }))
            }))


            // Loop through the instantiated products and find a match in the existing products to update them
            this.submitStatus = 'Updating products'
            this.products.forEach(product => {
                const newProduct = newProducts.find(x => x.datasource_id == product.datasource_id)
                Object.assign(product, newProduct)
            })

            // Send an update request to the API
            this.submitStatus = 'Saving to database'
            await Promise.all(this.products.map(async product => {
                await this.updateProduct(product)
            }))
            .then(() => {
                this.$emit('close')
                this.reset()
            }).catch(err => {
                console.log(err)
                window.alert('Something went wrong. Please try again')
            })
            this.submitStatus = null
            this.isSubmitting = false
        },
        reset() {
            this.availableFiles = []
            this.filesToUpload = []
            this.singleCurrencyFile = false
            this.currentScreenIndex = 0
            this.currenciesToMatch = [JSON.parse(JSON.stringify(this.currencyDefaultObject))]
            // Reset fields to match
            this.allFields.forEach(field => {
                field.enabled = true
                field.error = false
                field.newValue = {fileIndex: null, fieldName: null, fieldIndex: null}
            })
            this.replacePrices = false
            this.fieldsToReplace.forEach(field => {
                field.enabled = false
            })
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

</style>