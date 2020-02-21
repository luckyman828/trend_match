<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left">

        </div>
        <div class="item-right">
            <span class="button wide primary" @click="$refs.addFileModal.toggle()">Add file</span>
        </div>

        <Modal ref="addFileModal" :header="'Create new file'" :subHeader="'A file is a collection of products that users will be able to view in the dashboard and/or app<br>Select CSV files to upload to get started.'">
            <!-- <div class="overview">
                <span>1) Upload</span>
                <span>2) Proces</span>
                <span>3) Access</span>
            </div> -->
            
            <!-- <template v-if="currentPage == 1"> -->
                <form enctype="multipart/form-data">
                    <template v-if="!uploadingFile">

                        <div class="form-element">
                            <label>File name* (required)</label>
                            <input type="text" class="input-wrapper" placeholder="example title" v-model="newFile.title">
                        </div>
                        <div class="form-element">
                            <div class="drop-area input-wrapper">
                                <input type="file" multiple accept=".csv, text/csv" @change="filesChange($event)">
                                <!-- <input type="file" multiple accept=".csv" @change="filesChange($event)"> -->
                                <p>Drop your file(s) here or click to upload</p>
                                <span class="button dark">Upload files</span>
                            </div>
                        </div>
                        <div class="form-element file-list" v-if="newFile.files.length > 0">
                            <label>Selected files ({{newFile.files.length}})</label>
                            <p v-for="(file, index) in newFile.files" :key="index">
                                {{file.name}} 
                                <i class="remove far fa-times-circle" @click="removeFile(index)"></i>
                            </p>
                        </div>
                        <!-- <span class="button xl dark" @click="currentPage = 2; uploadFiles()" :class="{disabled: newFile.files.length <= 0}">Continue</span> -->
                        <!-- <input type="submit" class="button xl dark" value="Upload files" :disabled="newFile.files.length <= 0" @click="uploadFiles"> -->
                        <span class="button xl dark" :disabled="newFile.files.length <= 0 || newFile.title.length <= 0" @click="uploadFiles">Upload files</span>

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
        ...mapGetters('persist', ['currentWorkspaceId']),
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
        uploadFiles() {
            // Set new file data
            const newFile = this.newFile
            newFile.phase = Phase.query().first().id
            newFile.folderId = (File.query().first()) ? (File.query().first().catalog_id) : 9999 
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
    .drop-area {
        outline: 2px dashed $light2;
        outline-offset: -10px;
        background: white;
        padding: 12px 12px;
        height: 200px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        input[type=file] {
            opacity: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            cursor: pointer;
            z-index: 1;
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
    .button.xl {
        margin-bottom: 48px;
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