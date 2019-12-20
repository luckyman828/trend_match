<template>
    <div class="folders-table">
        <GridTable>
            <template v-slot:header="slotProps">
                <th class="select"><Checkbox/></th>
                <th>Name <i class="fas fa-sort"></i></th>
                <th>Modified <i class="fas fa-sort"></i></th>
                <th>Deadline <i class="fas fa-sort"></i></th>
                <th>Items <i class="fas fa-sort"></i></th>
                <th>Teams <i class="fas fa-sort"></i></th>
                <th>Status <i class="fas fa-sort"></i></th>
                <th class="action">Action</th>
            </template>
            <template v-slot:body>
                <tr v-for="(folder) in folder.folders" :key="folder.id" class="folder" @contextmenu.prevent="showContextMenu($event, folder, 'folder')">
                    <td class="select"><Checkbox/></td>
                    <td v-if="toEdit && toEdit.item.id == folder.id && toEdit.type == 'folder' && toEdit.field == 'title'" class="title">
                        <i class="fas fa-folder dark15"></i> 
                        <EditInputWrapper :activateOnMount="true" :type="'text'" 
                            :value="toEdit.item.title" :oldValue="folder.title" v-model="toEdit.item.title"
                            @submit="updateFolder(toEdit.item); clearToEdit()" @cancel="clearToEdit()"/>
                        </td>
                    <td v-else class="title clickable" @click="setCurrentFolder(folder)"><i class="fas fa-folder dark15"></i> {{folder.title}}</td>
                    <!-- <td class="title" @click="setCurrentFolder(folder)"><i class="fas fa-folder dark15"></i> <Editable :value="folder.title"/></td> -->
                    <td class="modified">-</td>
                    <td class="deadline">-</td>
                    <td class="items">{{folder.folders.length + folder.files.length}}</td>
                    <td class="teams">-</td>
                    <td class="status">-</td>
                    <td class="action">
                        <span class="button invisible ghost dark-hover true-square"><i class="fas fa-ellipsis-h"></i></span>
                    </td>
                </tr>
                <tr v-for="(file) in folder.files" :key="file.id" class="file" @contextmenu.prevent="showContextMenu($event, file, 'file')">
                    <td class="select"><Checkbox/></td>
                    <td v-if="toEdit && toEdit.item.id == file.id && toEdit.type == 'file' && toEdit.field == 'title'" class="title">
                        <EditInputWrapper :activateOnMount="true" :type="'text'" 
                            :value="toEdit.item.title" :oldValue="file.title" v-model="toEdit.item.title"
                            @submit="updateFile(toEdit.item); clearToEdit()" @cancel="clearToEdit()"/>
                        </td>
                    <td v-else class="title clickable" @click="viewSingle(file.id)"><i class="fas fa-file dark15"></i> {{file.title}}</td>
                    <td class="modified">-</td>
                    <td class="deadline">{{file.end_date}}</td>
                    <td class="items">-</td>
                    <td class="teams">-</td>
                    <td class="status">Stage {{file.phase.id}}</td>
                    <td class="action">
                        <span class="button invisible ghost dark-hover true-square"><i class="fas fa-ellipsis-h"></i></span>
                    </td>
                </tr>
            </template>
            <template v-slot:footer="slotProps">
                <td></td>
                <td><button class="primary invisible icon-left context-right"><i class="far fa-plus"></i>Add new: Folder <i class="fas fa-caret-down context"></i></button></td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
            </template>
        </GridTable>

        <button class="primary">Default</button>
        <button class="primary invisible ghost">Invisible</button>
        <button class="primary ghost">Ghost</button>

        <!-- <div class="flex-table">
            <div class="header-row flex-table-row">
                <div class="flex-group">
                    <th v-if="authUser.role_id >= 3" class="select">Select <i class="fas fa-chevron-down"></i></th>
                    <th class="clickable id" :class="{ active: this.sortBy == 'id' }" @click="onSortBy('id', true)">
                        ID
                        <i
                            class="fas"
                            :class="[
                                this.sortBy == 'id' && !sortAsc ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down',
                            ]"
                        ></i>
                    </th>
                    <th
                        :class="{ active: this.sortBy == 'title' }"
                        class="clickable title"
                        @click="onSortBy('title', true)"
                    >
                        File name
                        <i
                            class="fas"
                            :class="[
                                this.sortBy == 'title' && !sortAsc ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down',
                            ]"
                        ></i>
                    </th>
                </div>
                <div class="flex-group">
                    <th
                        :class="{ active: this.sortBy == 'start_time' }"
                        class="clickable"
                        @click="onSortBy('start_time', false)"
                    >
                        Created
                        <i
                            class="fas"
                            :class="[
                                this.sortBy == 'start_time' && !sortAsc
                                    ? 'fa-long-arrow-alt-up'
                                    : 'fa-long-arrow-alt-down',
                            ]"
                        ></i>
                    </th>
                    <th
                        :class="{ active: this.sortBy == 'end_time' }"
                        class="clickable"
                        @click="onSortBy('end_time', false)"
                    >
                        Deadline
                        <i
                            class="fas"
                            :class="[
                                this.sortBy == 'end_time' && !sortAsc
                                    ? 'fa-long-arrow-alt-up'
                                    : 'fa-long-arrow-alt-down',
                            ]"
                        ></i>
                    </th>
                    <th :class="{ active: this.sortBy == 'phase' }" class="clickable" @click="onSortBy('phase', false)">
                        Status
                        <i
                            class="fas"
                            :class="[
                                this.sortBy == 'phase' && !sortAsc ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down',
                            ]"
                        ></i>
                    </th>
                </div>
                <div class="flex-group">
                    <th class="action">Action</th>
                </div>
            </div>

            <div v-if="files.length <= 0" class="catalogue-row flex-table-row item-row">
                <span style="text-align: center">You don't have access to any files</span>
            </div>

            <div class="catalogue-row flex-table-row item-row" v-for="(catalogue, index) in files" :key="catalogue.id">
                <div class="flex-group">
                    <td v-if="authUser.role_id >= 3" class="select">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" />
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable" @click="viewSingle(catalogue.id, catalogue.title)">
                        <span :title="catalogue.id">{{ catalogue.id | truncate(10) }}</span>
                    </td>
                    <td class="title clickable">
                        <span
                            v-if="fileToEdit.id != catalogue.id || editingFile == false"
                            @click="viewSingle(catalogue.id, catalogue.title)"
                            >{{ catalogue.title }}</span
                        >
                        <div
                            :class="{ hidden: fileToEdit.id != catalogue.id || editingFile == false }"
                            class="edit-title input-parent controls-right"
                        >
                            <input
                                type="text"
                                :ref="'editTitleField-' + catalogue.id"
                                class="input-wrapper"
                                v-model="fileToEdit.title"
                                @keyup.enter="
                                    updateFile(fileToEdit)
                                    resetFileToEdit()
                                "
                                @keyup.esc="resetFileToEdit()"
                            />
                            <div class="controls">
                                <span
                                    class="button green true-square"
                                    @click="
                                        updateFile(fileToEdit)
                                        resetFileToEdit()
                                    "
                                    ><i class="fas fa-check"></i
                                ></span>
                                <span class="button red true-square" @click="resetFileToEdit()"
                                    ><i class="fas fa-times"></i
                                ></span>
                            </div>
                        </div>
                    </td>
                </div>
                <div class="flex-group">
                    <td class="created">
                        <span class="square light">{{
                            catalogue.start_date != null
                                ? new Date(catalogue.start_date).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                  })
                                : 'Unset'
                        }}</span>
                    </td>
                    <td class="deadline">
                        <span class="square light">{{
                            catalogue.end_date != null
                                ? new Date(catalogue.end_date).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                  })
                                : 'Unset'
                        }}</span>
                    </td>

                    <td class="stage">
                        <span class="square light stage">STAGE {{ catalogue.phase }}</span>
                        <span class="square light status">tbd%</span>
                    </td>
                </div>
                <div class="flex-group">
                    <td class="action">
                        <span
                            class="button invisible ghost dark-hover "
                            @click="viewSingle(catalogue.id, catalogue.title)"
                            >View</span
                        >
                        <Dropdown v-if="userPermissionLevel >= 3" :ref="'moreOptions-' + catalogue.id">
                            <template v-slot:button>
                                <span class="button invisible ghost light-1-hover true-square" @click="testCon(catalogue.id)">{{key}}</span>
                                <span
                                    class="button invisible ghost dark-hover true-square"
                                    @click="$refs['moreOptions-' + catalogue.id][0].toggle()"
                                    ><i class="fas fa-ellipsis-v"></i
                                ></span>
                            </template>
                            <template v-slot:body>
                                <div class="option-buttons">
                                    <span
                                        class="option icon-left"
                                        @click="
                                            onRenameFile(catalogue, index)
                                            $refs['moreOptions-' + catalogue.id][0].toggle()
                                        "
                                        ><i class="fas fa-pencil primary"></i> Rename</span
                                    >
                                    <span
                                        class="option icon-left"
                                        @click="
                                            onAddToFile(catalogue)
                                            $refs['moreOptions-' + catalogue.id][0].toggle()
                                        "
                                        ><i class="fas fa-plus green"></i> Add to file</span
                                    >
                                    <span
                                        class="option icon-left"
                                        @click="
                                            onEdit(catalogue)
                                            $refs['moreOptions-' + catalogue.id][0].toggle()
                                        "
                                        ><i class="fas fa-pencil primary"></i> Edit products</span
                                    >
                                    <span
                                        class="option icon-left"
                                        @click="
                                            onDeleteFile(catalogue.id)
                                            $refs['moreOptions-' + catalogue.id][0].toggle()
                                        "
                                        ><i class="fas fa-trash-alt red"></i> Delete</span
                                    >
                                </div>
                            </template>
                        </Dropdown>
                    </td>
                </div>
            </div>
        </div> -->

        <Modal
            ref="editFileModal"
            :header="'Add data to <br><strong>' + fileToEdit.title + '<strong>'"
            :subHeader="'Upload more csvs to add data to the file'"
        >
            <template v-slot:body>
                <form>
                    <template v-if="!uploadingToFile">
                        <div class="form-element">
                            <div class="drop-area input-wrapper">
                                <input type="file" multiple accept=".csv, text/csv" @change="filesChange($event)" />
                                <!-- <input type="file" multiple accept=".csv" @change="filesChange($event)"> -->
                                <p>Drop your file(s) here or click to upload</p>
                                <span class="button dark">Upload files</span>
                            </div>
                        </div>
                        <div class="form-element file-list" v-if="filesToAdd.length > 0">
                            <label>Selected files ({{ filesToAdd.length }})</label>
                            <p v-for="(file, index) in filesToAdd" :key="index">
                                {{ file.name }}
                                <i class="remove far fa-times-circle" @click="removeFile(index)"></i>
                            </p>
                        </div>
                        <span :class="{ disabled: filesToAdd.length <= 0 }" class="button xl dark" @click="addToFile"
                            >Apply changes</span
                        >
                    </template>
                    <template v-else>
                        <Loader :message="'Uploading'" />
                    </template>
                </form>
            </template>
        </Modal>

        <ContextMenu ref="contextMenuFolder" class="context-folder">
            <div class="item-group">
                <div class="item" @click="setCurrentFolder(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-folder-open"></i>
                    </div>
                    <u>O</u>pen folder
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onEditField(contextMenuItem, 'folder', 'title')">
                    <div class="icon-wrapper">
                        <i class="far fa-pen"></i>
                    </div>
                    <u>R</u>ename
                </div>
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-folder"><i class="fas fa-long-arrow-alt-right"></i></i>
                    </div>
                    <u>M</u>ove to
                </div>
            </div>
            <div class="item-group">
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <u>D</u>elete folder
                </div>
            </div>
        </ContextMenu>
        <ContextMenu ref="contextMenuFile" class="context-file">
            <div class="item-group">
                <div class="item" @click="viewSingle(contextMenuItem.id)">
                    <div class="icon-wrapper">
                        <i class="far fa-file"></i>
                    </div>
                    <u>V</u>iew file
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onEditField(contextMenuItem, 'file', 'title')">
                    <div class="icon-wrapper">
                        <i class="far fa-pen"></i>
                    </div>
                    <u>R</u>ename
                </div>
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-folder"><i class="fas fa-long-arrow-alt-right"></i></i>
                    </div>
                    <u>M</u>ove to
                </div>
            </div>
            <div class="item-group">
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <u>D</u>elete file
                </div>
            </div>
        </ContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'
import ContextMenu from './ContextMenu'
import Editable from './Editable'
import EditInputWrapper from './EditInputWrapper'

export default {
    name: 'foldersTable',
    props: [
        'selected',
        'folder'
    ],
    components: {
        ContextMenu,
        Editable,
        EditInputWrapper,
    },
    data: function() {
        return {
            sortBy: 'id',
            sortAsc: true,
            fileToEdit: {
                id: '',
                title: '',
            },
            defaultFileToEdit: {
                id: '',
                title: '',
            },
            editingFile: false,
            filesToAdd: [],
            uploadingToFile: false,
            contextMenuItem: null,
            toEdit: null
        }
    },
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'authUser']),
        selectedCount() {
            return this.selected.length
        },
        // filesSorted() {
        //     const files = this.files
        //     let key = this.sortBy
        //     let sortAsc = this.sortAsc
        //     const dataSorted = files.sort((a, b) => {
        //         console.log('sorting')
        //         // If the keys don't have length - sort by the key
        //         if (!files[0][key].length) {
        //             if (sortAsc) return a[key] > b[key] ? 1 : -1
        //             else return a[key] < b[key] ? 1 : -1

        //             // If the keys have lengths - sort by their length
        //         } else {
        //             if (sortAsc) return a[key].length > b[key].length ? 1 : -1
        //             else return a[key].length < b[key].length ? 1 : -1
        //         }
        //     })
        //     return dataSorted
        // },
    },
    methods: {
        ...mapActions('entities/collections', ['deleteFile', 'updateFile', 'uploadToExistingFile']),
        ...mapActions('entities/folders', ['deleteFolder', 'updateFolder']),
        setCurrentFolder(folder) {
            this.$emit('setCurrentFolder', folder)
        },
        showContextMenu(e, item, type) {
            const folderMenu = this.$refs.contextMenuFolder
            const fileMenu = this.$refs.contextMenuFile
            // Hide any current contextMenus
            if (fileMenu) fileMenu.hide()
            if (folderMenu) folderMenu.hide()
            // Set the current context menu item
            this.contextMenuItem = item
            // Save a reference to the contextual menu to show
            let contextMenu
            if (type == 'folder') {
                contextMenu = folderMenu
            } else {
                contextMenu = fileMenu
            }
            // Position the contextual menu
            contextMenu.show(e)
        },
        onEditField(item, type, field) {
            this.toEdit = {item: item, type: type, field: field}
        },
        clearToEdit() {
            this.toEdit = null
        },
        // onSelect(index) {
        //     this.$emit('onSelect', index)
        // },
        hideTooltip() {
            this.tooltip.active = false
        },
        onSortBy(key, method) {
            // Check if the sorting key we are setting is already the key we are sorting by
            // If this is the case, toggle the sorting method (asc|desc)
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }
            this.sortFiles()
        },
        sortFiles() {
            console.log('sorting files')
            const files = this.files
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const dataSorted = files.sort((a, b) => {
                // If the keys don't have length - sort by the key
                if (!files[0][key].length) {
                    if (sortAsc) return a[key] > b[key] ? 1 : -1
                    else return a[key] < b[key] ? 1 : -1

                    // If the keys have lengths - sort by their length
                } else {
                    if (sortAsc) return a[key].length > b[key].length ? 1 : -1
                    else return a[key].length < b[key].length ? 1 : -1
                }
            })
            return dataSorted
        },
        viewSingle(fileId) {
            this.$router.push({ name: 'file', params: { fileId: fileId } })
        },
        onDeleteFile(fileId) {
            window.confirm(
                'Are you sure you want to delete this file?\nAll comments, requests and actions will be permanently deleted.'
            )
                ? this.deleteFile(fileId)
                : false
        },
        onRenameFile(file, index) {
            this.editingFile = true
            this.fileToEdit = JSON.parse(JSON.stringify(file))
            const el = this.$refs['editTitleField-' + file.id][0]
            this.$nextTick(() => el.focus())
            this.$nextTick(() => el.select())
        },
        onAddToFile(file) {
            this.fileToEdit = file
            this.$refs.editFileModal.toggle()
        },
        addToFile() {
            this.fileToEdit.files = this.filesToAdd
            this.uploadingToFile = true
            this.uploadToExistingFile(this.fileToEdit).then(success => {
                this.uploadingToFile = false
                this.$refs.editFileModal.toggle()
            })
        },
        onEdit(file) {
            this.$router.push(`/file/${file.id}/edit`)
        },
        resetFileToEdit() {
            this.editingFile = false
            this.fileToEdit = this.defaultFileToEdit
        },
        filesChange(e) {
            const files = e.target.files

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const extension = file.name.split('.').pop()

                // Check that the file is a csv
                if (extension == 'csv') {
                    if (!this.filesToAdd.find(x => x.name == file.name)) {
                        this.filesToAdd.push(file)
                    }
                } else {
                    // Throw error
                    console.log('invalid file extension')
                }
            }
        },
        removeFile(index) {
            this.filesToAdd.splice(index, 1)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.folders-table {
    margin-top: 52px;
    padding-top: 0;
    position: relative;
    td {
        vertical-align: top;
        line-height: 40px;
        &.title {
            display: flex;
            i {
                width: 24px;
                line-height: 40px;
                font-size: 16px;
                margin-right: 8px;
            }
        }
    }
}
.clickable {
    cursor: pointer;
}
// Table
.flex-table {
    .flex-group {
        display: flex;
        flex: 1;
        margin: 0 16px;
        align-items: center;
        &:nth-child(1) {
            flex: 3;
        }
        &:nth-child(2) {
            flex: 3;
            justify-content: flex-start;
            > * {
                flex: none;
                flex-basis: 100px;
                &.stage {
                    flex-basis: 132px;
                }
            }
        }
        &:nth-child(3) {
            flex: 2;
            max-width: 300px;
            min-width: 300px;
        }
        > * {
            flex: 1;
            margin: 0 8px;
            &.select {
                max-width: 80px;
            }
            &.id {
                white-space: nowrap;
                overflow: hidden;
                max-width: 75px;
            }
            &.action {
                display: flex;
                justify-content: flex-end;
                > * {
                    &:not(:last-child) {
                        margin-right: 8px;
                    }
                }
            }
        }
        > td {
            &.action {
                text-align: right;
            }
        }
    }
    .flex-table-row {
        height: 82px;
        > * {
            flex: 1;
            margin: 0 8px;
            &:first-child {
                margin-left: 16px;
            }
            &:last-child {
                margin-right: 16px;
            }
        }
        th {
            &.action {
                text-align: right;
                justify-content: flex-end;
            }
        }
    }
}
.show-more {
    width: 100%;
    margin: 16px auto 0;
    text-align: center;
    display: inline-block;
}
.view-single {
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}
.catalogue-totals {
    position: absolute;
    right: 0;
    top: -40px;
    height: 40px;
    line-height: 40px;
    span {
        font-weight: 500;
        font-size: 14px;
        margin-right: 20px;
    }
}
.edit-title {
    &.hidden {
        display: none;
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
        transition: 0.3s;
        margin-left: 4px;
        cursor: pointer;
        &:hover {
            color: $red;
        }
    }
}
</style>
