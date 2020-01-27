<template>
    <Modal class="create-file-modal" ref="modal" :header="currentScreen.header" :fullwidth="currentScreen.name == 'mapFields'">
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

                <div class="map-fields">
                    <div class="table-wrapper">
                        <table class="map-fields-table">
                            <tr class="header">
                                <th></th>
                                <th><label>Database</label></th>
                                <th></th>
                                <th><label>Matched Datasource</label></th>
                                <th><label>Example</label></th>
                            </tr>
                            <tr v-for="(field, index) in fields" :key="index" :class="{disabled: !field.enabled}">
                                <td><Checkbox :value="field.enabled" v-model="field.enabled"/></td>
                                <td><InputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                <td><i class="fas fa-equals"></i></td>
                                <td><InputField class="input-field" disabled=true :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)"/></td>
                                <td><InputField v-if="filePreviews.length > 0" class="input-field" disabled=true readOnly=true
                                    :value="previewExampleValue(field.newValue)"/>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="available-fields">
                        <label>Not matched ({{availableFields.reduce((result, x) => result+=x.fields.length,0)}})</label>
                        <div class="fields-wrapper" v-for="(fieldArr, index) in availableFields" :key="index">
                            <label>{{fieldArr.fileName}}</label>
                            <div class="field" v-for="(field, index) in fieldArr.fields" :key="index">
                                <span>{{field.fieldName}}</span>
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

        <ContextMenu ref="contextSelectField" class="context-select-field">
            <template v-slot:header>
                Select field to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <!-- <SelectButtons :type="'radio'" :options="availableFields"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :search="true"/> -->
                    <SelectButtons :type="'radio'" :options="availableFields" multipleOptionArrays="true" optionGroupNameKey="fileName" optionGroupOptionsKey="fields"
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
        availableFields: [],
        filePreviews: [],
        csvFiles: [],
        fields: [
            {name: 'datasource_id', displayName: 'ID', newValue: {fileName: null, fieldName: null, fieldIndex: null, fieldIndex: null}, enabled: true},
            {name: 'title', displayName: 'Name',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'description', displayName: 'Description',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'brand', displayName: 'Brand',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'category', displayName: 'Category',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'quantity', displayName: 'Minimum Order Quantity',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'variant_min_quantity', displayName: 'Minimum Variant Quantity',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'composition', displayName: 'Composition',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'delivery_date', displayName: 'Delivery (date/month)',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'editors_choice', displayName: 'Editors Choice',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'assortment_name', displayName: 'Assortment Name',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'variant_name', displayName: 'Variant Name',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'variant_image_url', displayName: 'Variant Image URL',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'variant_sizes', displayName: 'Variant Sizes',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'eans', displayName: 'EANs',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
        ],
        currencies: [
            {name: 'currency', displayName: 'Product ID',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'markup', displayName: 'Product ID',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'wholesale_price', displayName: 'Product ID',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
            {name: 'recommended_retailPrice', displayName: 'Product ID',  newValue: {fileName: null, fieldName: null, fieldIndex: null}, enabled: true},
        ]
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFolderId']),
    },
    methods: {
        ...mapActions('entities/collections', ['uploadFile']),
        previewExampleValue(newValue) {
            const previews = this.filePreviews
            // First check that we have any previews available, and that we have a new value defined
            if (previews.length > 0 && newValue.fileName && newValue.fieldIndex != null) {
                const csvFile = previews.find(x => x.fileName == newValue.fileName)
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
            // console.log(fileName)
            const csv = event.target.result
            this.csvFiles.push(csv)


            this.readHeaders(csv, fileName)
            this.readPreview(csv, fileName)
            // this.procesFile(csv)
        },
        readPreview(csv, fileName) {
            // Split the csv into lines by line breaks
            const allTextLines = csv.split(/\r\n|\n/)
            
            const csvLines = []
            // Loop thorugh the lines
            let lineIndex = 0
            allTextLines.forEach(line => {
                //Exclude the first line, since we expect it to be the headers
                if (lineIndex > 0) {
                    // Split the line by our delimiter
                    const cells = line.split(this.csvDelimiter)
                    // Push the cells to our lines array
                    csvLines.push(cells)
                }
                lineIndex++
            })
            this.filePreviews.push({fileName: fileName, lines: csvLines})
        },
        readHeaders(csv, fileName) {
            // Split the csv into lines by line breaks
            const allTextLines = csv.split(/\r\n|\n/)
                
            const headerLine = allTextLines[0]
            // Split the headers by delimiter
            const headerCells = headerLine.split(this.csvDelimiter)
            const fieldsToPush = []
            // Loop through the headerCells and push an object
            let cellIndex = 0
            headerCells.forEach(cell => {
                fieldsToPush.push({fileName: fileName, fieldName: cell, fieldIndex: cellIndex})
                cellIndex++
            })
            // push the results to the available fields array
            this.availableFields.push({fileName: fileName, fields: fieldsToPush})
        },
        showSelectContext(e, field) {
            console.log('Show select ocntext!')
            const contextMenu = this.$refs.contextSelectField
            contextMenu.item = field
            contextMenu.show(e)
        }
        // procesFile(file) {
        //     // Split the csv into lines by line breaks
        //     const allTextLines = file.split(/\r\n|\n/)
                

        //     // Limit the amount of lines to read
        //     const limit = 10
        //     let i = 0
        //     // Split the lines into cells by delimiter
        //     allTextLines.forEach(line => {
        //         if (i++ < limit)
        //             this.currentFileLines.push(line.split(';'))
        //     })
        //     // this.currentFileLines = allTextLines
        // },
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
        .available-fields {
            margin-top: 28px;
            background: $grey2;
            border-radius: 4px;
            padding: 12px 8px 8px;
            margin-left: 12px;
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
    }

</style>