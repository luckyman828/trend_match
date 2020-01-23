<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left">

        </div>
        <div class="item-right">
            <button class="primary" @click="$refs.addFileModal.toggle()"><span>Add file</span></button>
        </div>

        <Modal class="add-file-modal" ref="addFileModal" :header="'Create new file'">
            <!-- <div class="overview">
                <span>1) Upload</span>
                <span>2) Proces</span>
                <span>3) Access</span>
            </div> -->

            <!-- <template v-if="currentPage == 1"> -->
                <form @submit.prevent enctype="multipart/form-data">
                    <div class="form-element" style="text-align: center;">
                        <p>A file is a collection of products that users will be able to view in the dashboard and/or app</p>
                        <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
                    </div>
                    <template v-if="!uploadingFile">

                        <div class="form-element">
                            <label for="file-name-input">File name* (required)</label>
                            <input type="text" id="file-name-input" class="input-wrapper" placeholder="unnamed file" v-model="newFile.title">
                        </div>
                        <div class="form-element">
                            <Droparea multiple="true" accept=".csv, text/csv"
                            @change="filesChange($event)">
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
                                        <button type="button" class="dark md"><i class="far fa-file-csv"></i><span>Browse files</span></button>
                                    </template>
                                </template>
                                <template v-slot:dragDisplay>
                                    <i class="big-icon fas fa-smile-beam"></i>
                                    <span>Drop file(s) here</span>
                                </template>
                            </Droparea>
                        </div>
                        <!-- <span class="button xl dark" @click="currentPage = 2; uploadFiles()" :class="{disabled: newFile.files.length <= 0}">Continue</span> -->
                        <!-- <input type="submit" class="button xl dark" value="Upload files" :disabled="newFile.files.length <= 0" @click="uploadFiles"> -->
                        <div class="form-controls">
                            <button type="button" class="lg primary ghost" :disabled="newFile.title.length < 1"
                            @click="createEmpty">
                                <span>Create Empty</span>
                            </button>
                            <button type="button" class="lg primary" :disabled="newFile.files.length <= 0 || newFile.title.length <= 0" @click="uploadFiles">
                                <span>Next: Map fields</span>
                            </button>
                        </div>

                    </template>
                    <template v-else>
                        <Loader :message="'Uploading file'"/>
                    </template>
                </form>
            <!-- </template> -->

            <!-- <template v-else-if="currentPage == 2">
                <h2>Review your file</h2>
                <strong>Match your headers</strong>
                <div v-dragscroll class="table-wrapper" v-if="currentFileLines.length > 0"> -->
                    <!-- <table>
                        <tr v-for="(line, index) in currentFileLines" :key="index">
                            <td v-for="(cell, index) in line" :key="index">{{cell}}</td>
                        </tr>
                    </table> -->
                    <!-- <div v-for="(header, index) in headers" :key="index">
                        <label>{{header.oldValue}}</label> -->
                        <!-- <Dropdown class="dark">
                            <template v-slot:button="slotProps">
                                <span @click="slotProps.toggle(); $refs.headerSelect[index].focusSearch()" class="dropdown-parent button dark" :class="{active: !slotProps.collapsed}">
                                    {{header.newValue}}
                                </span>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Select header</span>
                                <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                            </template>
                            <template v-slot:body>
                                <RadioButtons @keyup.esc="$refs.headerSelect[index].toggle();" :options="currentFileLines[0].split(';')" :search="true" ref="headerSelect" v-model="headers[index].newValue"/>
                            </template>
                            <template v-slot:footer="slotProps">
                                <div class="grid-2">
                                    <span class="button green" @click="$refs.headerSelect[index].submit(); slotProps.toggle()">Save</span>
                                    <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                </div>
                            </template>
                        </Dropdown> -->
                        <!-- <Dropdown class="dropdown-parent right" ref="taskDropdown">
                            <template v-slot:button="slotProps">
                                <span @click="slotProps.toggle(); $refs.headerSelect[index].focusSearch()" class="dropdown-parent button dark" :class="{active: !slotProps.collapsed}">
                                    {{header.newValue}}
                                </span>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Select header</span>
                                <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                            </template>
                            <template v-slot:body>
                                <RadioButtons @keyup.esc="$refs.headerSelect[index].toggle();" :options="currentFileLines[0].split(';')" :search="true" ref="headerSelect" @change="setHeader($event, index); $refs.taskDropdown[index].toggle()" v-model="headers[index].newValue"/>
                            </template>
                        </Dropdown>
                    </div> -->
                <!-- </div>
            </template> -->

        </Modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RadioButtons from './RadioButtons'
import Dropdown from './Dropdown'
import Phase from '../store/models/Phase';
import File from '../store/models/Collection';

export default {
    name: 'navbarFiles',
    components: {
        RadioButtons,
        Dropdown
    },
    data: function () { return {
        newFile: {
            title: '',
            files: [],
            phase: null,
            // csvFiles: []
        },
        uploadingFile: false,
        // filesToProces: 0,
        // currentPage: 1,
        // currentFileLines: [],
        // headers: [
        //     {oldValue: 'id', newValue: ''},
        //     {oldValue: 'title', newValue: ''},
        //     {oldValue: 'description', newValue: ''},
        //     {oldValue: 'brand', newValue: ''},
        //     {oldValue: 'category', newValue: ''},
        //     {oldValue: 'currency', newValue: ''},
        //     {oldValue: 'wholesale_price', newValue: ''},
        //     {oldValue: 'recommended_retailPrice', newValue: ''},
        //     {oldValue: 'markup', newValue: ''},
        //     {oldValue: 'minimum_quantity', newValue: ''},
        //     {oldValue: 'composition', newValue: ''},
        //     {oldValue: 'delivery_date', newValue: ''},
        //     {oldValue: 'editors_choise', newValue: ''},
        //     {oldValue: 'box_ean', newValue: ''},
        //     {oldValue: 'box_size', newValue: ''},
        //     {oldValue: 'assortment_name', newValue: ''},
        //     {oldValue: 'variant_name', newValue: ''},
        //     {oldValue: 'variant_image_url', newValue: ''},
        //     {oldValue: 'variant_sizes', newValue: ''},
        // ]
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFolderId']),
    },
    methods: {
        ...mapActions('entities/collections', ['uploadFile']),
        filesChange(e) {
            const files = e.target.files
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
                    this.$refs.addFileModal.toggle()
                else window.alert('Something went wrong. Please try again')
            })
        },
        uploadFiles() {
            // Set new file data
            const newFile = this.newFile
            newFile.phase = Phase.query().first().id
            newFile.folderId = this.currentFolderId
            newFile.workspace_id = this.currentWorkspaceId


            // Create collection from name
            this.uploadingFile = true
            this.uploadFile(newFile)
            .then(success => {
                this.uploadingFile = false

                // Close modal on succes
                if (success)
                    this.$refs.addFileModal.toggle()
                else window.alert('Something went wrong. Please try again')
            })


            // Do some validation with fileReader

            // newFile.files.forEach(file => {
            //     this.filesToProces++
            //     const fileReader = new FileReader()
            //     fileReader.readAsText(file)
            //     fileReader.onload = this.loadHandler
            // })
        },
        // loadHandler(event) {
        //     const csv = event.target.result
        //     this.newFile.csvFiles.push(csv)

        //     // Check if all the files are processesd
        //     if (this.newFile.csvFiles.length >= this.filesToProces) {
        //         this.uploadFile(this.newFile)
        //     }
        //     // this.procesFile(csv)
        // },
        // procesFile(file) {
        //     // Split the csv into lines by line breaks
        //     const allTextLines = file.split(/\r\n|\n/)
        //     // Split the lines into cells by delimiter
        //     const limit = 100
        //     let i = 0
        //     allTextLines.forEach(line => {
        //         if (i++ < limit)
        //             this.currentFileLines.push(line.split(';'))
        //     })
        //     // this.currentFileLines = allTextLines
        // },
        // setHeader(e, index) {
        //     this.headers[index].newValue = e
        // }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .add-file-modal {
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

    .flex-wrapper {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
        > * {
            display: flex;
            align-items: center;
        }
    }
    .file-list {
        p {
            position: relative;
        }
        p:hover .remove {
            opacity: 1;
        }
        .remove {
            opacity: 0;
            transition: .3s;
            margin-left: 4px;
            cursor: pointer;
            &:hover {
                color: $red;
            }
        }
    }
    .table-wrapper {
        width: 600px;
        margin-left: -100px;
        overflow: auto;
        table, th, td {
            border-collapse: collapse;
            border: solid 1px $dark;
        }
    }

</style>