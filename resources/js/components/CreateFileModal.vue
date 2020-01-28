<template>
    <Modal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" 
    ref="modal" :header="currentScreen.header">
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
                    <Droparea multiple="true" accept=".csv, text/csv" ref="droparea"
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
                    </Droparea>
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

                <div class="map-fields link-ids">
                    <div class="table-wrapper">
                        <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                        <table class="map-fields-table">
                            <tr class="header">
                                <th><label>File</label></th>
                                <th></th>
                                <th><label>Key to match</label></th>
                                <th><label>Example</label></th>
                            </tr>
                            <tr v-for="(file, index) in availableFiles" :key="index">
                                <td><InputField class="input-field" disabled=true :value="file.fileName" readOnly=true /></td>
                                <td><i class="fas fa-equals"></i></td>
                                <td><InputField class="input-field" disabled=true :value="file.key.fieldName" type="select" @click="showSelectKeyContext($event, file)"/></td>
                                <td><InputField class="input-field" disabled=true readOnly=true
                                    :value="previewExampleValue(file.key)"/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="map-fields">
                    <div class="tables">
                        <div class="table-wrapper">
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
                                    <td><Checkbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><InputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td><InputField class="input-field" disabled=true :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)"/></td>
                                    <td><InputField class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue)"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-wrapper">
                            <h3>Map currencies</h3>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th></th>
                                    <th><label>Database</label></th>
                                    <th></th>
                                    <th><label>Matched Datasource</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(field, index) in fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                    <td><Checkbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><InputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td><InputField class="input-field" disabled=true :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)"/></td>
                                    <td><InputField class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue)"/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="available-fields">
                        <label>Available fields ({{availableFiles.reduce((result, x) => result+=x.headers.length,0)}})</label>
                        <div class="inner">
                            <div class="fields-wrapper" v-for="(file, index) in availableFiles" :key="index">
                                <label>{{file.fileName}}</label>
                                <div class="field" v-for="(field, index) in file.headers" :key="index">
                                    <span :title="field.fieldName">{{field.fieldName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-controls">
                    <button type="submit" class="lg primary full-width" :disabled="newFile.files.length <= 0 || newFile.title.length <= 0">
                        <span>Create file</span>
                    </button>
                </div>
            </template>

        </form>

        <ContextMenu ref="contextSelectFileKey" class="context-select-key">
            <template v-slot:header>
                Select key to link
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <SelectButtons :type="'radio'" :options="slotProps.item.headers" :optionNameKey="'fieldName'"
                    v-model="slotProps.item.key" :submitOnChange="true" :search="true" @submit="slotProps.hide()"/>
                </div>
            </template>
        </ContextMenu>

        <ContextMenu ref="contextSelectField" class="context-select-field">
            <template v-slot:header>
                Select field to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <!-- <SelectButtons :type="'radio'" :options="availableFiles"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :search="true"/> -->
                    <SelectButtons :type="'radio'" :options="availableFiles" multipleOptionArrays="true" optionGroupNameKey="fileName" optionGroupOptionsKey="headers"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :optionDescriptionKey="'fileName'"
                    :optionNameKey="'fieldName'" :search="true" @submit="slotProps.hide()"/>
                </div>
            </template>
        </ContextMenu>

    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Phase from '../store/models/Phase';
import File from '../store/models/Collection';

export default {
    name: 'createFileModal',
    data: function () { return {
        currentScreen: {name: 'chooseFiles', header: 'Create new file'},
        // currentScreen: {name: 'mapFields', header: 'Map fields'},
        newFile: {
            title: '',
            files: [],
            phase: null,
        },
        uploadingFile: false,
        csvDelimiter: ';',
        availableFiles: [],
        filePreviews: [],
        csvFiles: [],
        fieldsToMatch: [
            {name: 'title', displayName: 'Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'description', displayName: 'Description',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'brand', displayName: 'Brand',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'category', displayName: 'Category',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'quantity', displayName: 'Minimum Order Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'variant_min_quantity', displayName: 'Minimum Variant Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'composition', displayName: 'Composition',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'delivery_date', displayName: 'Delivery (date/month)',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'editors_choice', displayName: 'Editors Choice',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'assortment_name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'color', displayName: 'Variant Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'sizes', displayName: 'Variant Sizes',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'eans', displayName: 'EANs',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'buyer_group', displayName: 'Buyer Group',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
        ],
        currencies: [
            {name: 'currency', displayName: 'Product ID',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'markup', displayName: 'Product ID',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'wholesale_price', displayName: 'Product ID',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'recommended_retailPrice', displayName: 'Product ID',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true},
        ]
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFolderId']),
        productsToUpload() {
            const productsToReturn = []
            
            // STEP 1) Loop through each of our available files and instantiate our products by key
            let fileIndex = 0
            this.availableFiles.forEach(file => {
                // Check that the file has been linked by id key
                if (file.key.fieldIndex != null) {
                    // Loop through the files lines and instantiate product
                    file.lines.forEach(line => {
                        const keyValue = line[file.key.fieldIndex]
                        // Check that the value does not already exists
                        let product = productsToReturn.find(x => x.datasource_id == keyValue)
                        if (!product) {
                            product = {
                                datasource_id: keyValue, 
                                color_variants: [],
                                assortments: [],
                                prices: []
                            }
                            productsToReturn.push(product)
                        }

                        // Loop thorugh our fields to match, and check if they are matched to the current file
                        this.fieldsToMatch.forEach(field => {
                            // Check that the field has not been disabled
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                // Check for special case fields that need to be turned into arrays

                                // Variants
                                if (field.name in ['color','image','sizes']) {
                                    let variant = product.color_variants.find(x => x[field.name] == fieldValue)
                                    if (!variant) {
                                        product.color_variants.push = {[field.name]: fieldValue}
                                    }
                                }

                                // Assortments
                                if (field.name in ['assortment_name','box_ean','box_size']) {
                                    let assortment = product.assortments.find(x => x[field.name] == fieldValue)
                                    if (!assortment) {
                                        product.assortments.push = {[field.name]: fieldValue}
                                    }
                                }

                                // EANs
                                if (field.name == 'eans') {
                                    product.eans.push(fieldValue)
                                }


                                // If we don't have a special case, simply write the key value pair to the product
                                product[field.name] = line[field.newValue.fieldIndex]
                            }
                        })

                    })
                }
                fileIndex++
            })

            // Loop through our available files
            // Check that the file has been linked by id
            // Loop through the files lines
            // Find the existing product
            // Loop thorugh our fields to match, and test that they are matched to this file
            // If true, find the cell with the provided index and push to our product

            return productsToReturn
        }
    },
    methods: {
        ...mapActions('entities/collections', ['uploadFile']),
        previewExampleValue(newValue) {
            const files = this.availableFiles
            // First check that we have any previews available, and that we have a new value defined
            if (files.length > 0 && newValue.fileIndex != null && newValue.fieldIndex != null) {
                const csvFile = files[newValue.fileIndex]
                return csvFile.lines[0][newValue.fieldIndex]
            }
            return 'No example'
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
            newFile.phase = Phase.query().first().id
            newFile.folderId = this.currentFolderId
            newFile.workspace_id = this.currentWorkspaceId
            // Ignore the new files files(csvs)
            newFile.files = []
            this.uploadingFile = true
            this.uploadFile(newFile)
            .then(success => {
                this.uploadingFile = false

                // Close modal on succes
                if (success)
                    this.$refs.modal.hide()
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
        loadHandler(event, fileName) {
            const csv = event.target.result
            this.csvFiles.push(csv)


            this.readFiles(csv, fileName)
        },
        readFiles(csv, fileName) {
            // Split the csv into lines by line breaks
            const allTextLines = csv.split(/\r\n|\n/)
            
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
                } else {
                    // Push the cells to our lines array
                    csvLines.push(cells)
                }
                lineIndex++
            })
            this.availableFiles.push({fileName: fileName, key: {fileIndex: null, fieldName: null, fieldIndex: null}, headers: csvHeaders, lines: csvLines})
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
        }
        // setHeader(e, index) {
        //     this.headers[index].newValue = e
        // }
        // uploadFiles() {
        //     // Set new file data
        //     const newFile = this.newFile
        //     newFile.phase = Phase.query().first().id
        //     newFile.folderId = this.currentFolderId
        //     newFile.workspace_id = this.currentWorkspaceId


        //     // Create collection from name
        //     this.uploadingFile = true
        //     this.uploadFile(newFile)
        //     .then(success => {
        //         this.uploadingFile = false

        //         // Close modal on succes
        //         if (success)
        //             this.$refs.modal.hide()
        //         else window.alert('Something went wrong. Please try again')
        //     })


        //     // Do some validation with fileReader

        //     // newFile.files.forEach(file => {
        //     //     this.filesToProces++
        //     //     const fileReader = new FileReader()
        //     //     fileReader.readAsText(file)
        //     //     fileReader.onload = this.loadHandler
        //     // })
        // },
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
        .form-controls {
            margin-top: 32px;
        }
    }

</style>