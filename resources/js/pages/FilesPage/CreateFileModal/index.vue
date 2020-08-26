<template>
    <BaseModal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreen.name == 'mapFields'" @goBack="onGoBack">

            <BaseLoader v-if="processingFiles"
            :msg="processingFiles ? 'Reading files. This may take a few minutes' : ''"/>

            <UploadFilesScreen v-else-if="currentScreen.name == 'chooseFiles'"
                :fileList.sync="uploadedFiles"
                :newFile="newFile"
                @create-empty="createEmpty"
                @go-to-next-screen="onGoToMapFields"
            />


            <MapFieldsScreen v-else-if="currentScreen.name == 'mapFields' && availableFields.length > 0"
                :availableFields="availableFields"
                :newFile="newFile"
            />


    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import workbookUtils from '../../../mixins/workbookUtils'
import UploadFilesScreen from './UploadFilesScreen'
import MapFieldsScreen from './MapFieldsScreen'

export default {
    name: 'createFileModal',
    components: {
        UploadFilesScreen,
        MapFieldsScreen,
    },
    mixins: [
        workbookUtils,
    ],
    props: [
        'show'
    ],
    data: function () { return {
        currentScreen: {name: 'chooseFiles', header: 'Create new file'},
        uploadedFiles: [],
        availableFields: [],
        processingFiles: false,
        defalultNewFile: {
            id: null,
            name: 'New file',
            type: 'File',
            files: [],
        },
        newFile: null,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder']),
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
            // Loop through the currencies and look check their names
            if (!this.singleCurrencyFile) {
                this.currenciesToMatch.forEach(currency => {
                    if(currency.fileIndex != null && !this.validateCurrency(currency)) {
                        valid = false
                    }
                })
            }
            return valid
        }
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'syncExternalImages']),
        ...mapActions('products', ['insertProducts', 'uploadImage' ,'updateManyProducts']),
        ...mapActions('mapProductData', ['getProductFields']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        filesChange(fileList) {
            const files = fileList
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const extension = file.name.split('.').pop();

                // Check that the file is a csv
                if (['tsv', 'csv', 'xlsx', 'xml'].includes(extension)) {
                    if (!this.newFile.files.find(x => x.name == file.name)) {
                        this.newFile.files.push(file)
                    }
                } else {
                    this.SHOW_SNACKBAR({
                        msg: 'Invalid file type',
                        type: 'warning', 
                        iconClass: 'fa-exclamation-triangle',
                    })
                    // Throw error
                    // console.log('invalid file extension')
                }
            }
        },
        removeFile(index) {
            this.newFile.files.splice(index, 1)
        },
        createEmpty() {
            // Create a copy of the new file object
            const newFile = JSON.parse(JSON.stringify(this.newFile))
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id
            this.insertOrUpdateFile(newFile)
            // Reset modal
            this.$emit('close')
            this.reset()
        },
        async onGoToMapFields() {
            // Use promises to make sure we have processed all the uploaded files before we continue
            this.processingFiles = true
            await Promise.all(this.uploadedFiles.map(async file => {
                await new Promise((resolve, reject) => {
                    const fileReader = new FileReader()
                    fileReader.readAsArrayBuffer(file, 'ISO-8859-4')
                    fileReader.onload = async e => {
                        await this.processFile(e.target.result, file.name)
                        resolve()
                    }
                })
            }))
            // Remove files from available files that are no longer mapped
            for (let i = this.availableFields.length-1; i >= 0; i--) {
                const file = this.availableFields[i]
                // Check if the file exists in uploaded files
                const shouldBeRemoved = !this.uploadedFiles.find(x => x.name == file.fileName)
                if (shouldBeRemoved) {
                    this.availableFields.splice(i, 1)
                }
            }
            //Change the current screen
            this.processingFiles = false
            this.currentScreen={name: 'mapFields', header: 'Map fields'}
        },
        onGoBack() {
            //Change the current screen
            this.currentScreen={name: 'chooseFiles', header: 'Create new file'}
        },
        async processFile(workbook, fileName) {
            const rows = this.parseWorkbookToRowsAndCells(workbook)

            // // Check if the file already exists. If so, replace it instead of adding
            const existingFile = this.availableFields.find(x => x.fileName == fileName)
            if (existingFile) {
                Object.assign(existingFile, rows)
            } else {
                const mappedKey = await this.getProductFields({scope: 'key'})
                const variantKey = await this.getProductFields({scope: 'variantKey'})
                // const assortmentKey = await this.getProductFields({scope: 'assortmentKey'})
                // const priceKey = await this.getProductFields({scope: 'priceKey'})
                this.availableFields.push({
                    mappedKey: mappedKey[0],
                    variantKey : variantKey[0],
                    // assortmentKey : assortmentKey[0],
                    // priceKey : priceKey[0],
                    headers: Object.keys(rows[0]),
                    fileName,
                    rows
                })
            }
        },
        async getImageFromURL(url) {
            // Send a request to get the image
            let image
            await axios.get(url, {responseType: 'blob'}).then(response => {
                image = response.data
            }).catch(err => {
                image = false
                this.SHOW_SNACKBAR({ 
                    msg: `
                        <p><strong>Hey you!</strong><br></p>
                        <p>We will display your image(s) from <u>${url.substr(0, url.indexOf('/', 10))}</u>.</p>
                        <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                        <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                    type: 'info', 
                    iconClass: 'fa-info-circle', 
                })
            })
            return image
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
                        let variantKeyField = this.variantFieldsToMatch.find(x => x.name == 'name' && x.scope == 'variants')
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
                                    id: this.$uuid.v4(),
                                    name: variantKeyValue,
                                    image: null,
                                    images: [],
                                    pictures: [],
                                    sizes: []
                                }
                                product.variants.push(variant)
                            }
                        }

                        let assortment = null
                        let assortments = this.assortmentsToMatch
                        
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

                        this.variantFieldsToMatch.forEach(field => {
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
                                        }
                                        else if (fieldName != 'variant_name') { // Exclude variant_name to only write "name" to the variant
                                            variant[fieldName] = fieldValue
                                        }
                                    }
                                }
                            }
                        })

                        this.variantImagesToMap.forEach(field => {
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name
                                if (variant) {
                                    if (fieldValue && !variant.pictures.find(x => x.url == fieldValue)) {
                                        variant.pictures.push({
                                            name: null,
                                            url: fieldValue
                                        })
                                    }
                                }
                            }
                        })
                             
                        // FIELDS
                        // Loop thorugh our fields to match, and check if they are matched to the current file
                        this.fieldsToMatch.forEach(field => {
                            // Check that the field has not been disabled
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name
                                
                                // Parse dates
                                if (fieldValue instanceof Date) {
                                    product[fieldName] = fieldValue.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                                }

                                // Check if the field is an array, because then it should be added to the array
                                else if (Array.isArray(product[fieldName])) {
                                    // Check that the value does not already exist in the array
                                    let arrayValueExists = product[fieldName].includes(fieldValue)
                                    if (!arrayValueExists) {
                                        product[fieldName].push(fieldValue)
                                    }
                                } else {
                                    // Else simply write the key value pair to the product
                                    product[fieldName] = fieldValue
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
        this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
    }
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
                        &.custom-entry {
                            .input-wrapper {
                                border-color: $orange
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

    
</style>