<template>
    <div class="folders-table-wrapper">
        <BaseFlexTable class="folders-table">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <!-- <BaseSearchField :searchKey="['title','name']"/> -->
                    </template>
                    <template v-slot:right>
                        <span>showing <strong>{{files.length}}</strong> of 
                        <strong>{{files.length}}</strong> records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <th class="select"><BaseCheckbox/></th>
                <th class="title">Name <i class="fas fa-sort"></i></th>
                <th>Modified <i class="fas fa-sort"></i></th>
                <!-- <th>Deadline <i class="fas fa-sort"></i></th> -->
                <th>Items <i class="fas fa-sort"></i></th>
                <th>Owners <i class="fas fa-sort"></i></th>
                <!-- <th>Status <i class="fas fa-sort"></i></th> -->
                <th class="action">Action</th>
            </template>
            <template v-slot:body>
                <tr v-for="folder in foldersToShow" :key="folder.id" class="folder" @contextmenu.prevent="showContextMenu($event, folder, 'folder')">
                    <td class="select"><BaseCheckbox/></td>
                    <td v-if="toEdit && toEdit.item.id == folder.id && toEdit.type == 'folder' && toEdit.field == 'title'" class="title">
                        <i v-if="folder.id" class="fas fa-folder dark15"></i>
                        <i v-else class="far fa-folder dark15"></i>
                        <BaseEditInputWrapper :activateOnMount="true" :type="'text'" :ref="'editTitleInput-' + toEdit.item.id"
                            :value="toEdit.item.name" :oldValue="folder.name" v-model="toEdit.item.name"
                            @submit="insertOrUpdateFile(toEdit.item); clearToEdit()" @cancel="clearToEdit(); removeUnsavedFolders()"/>
                        </td>
                    <td v-else-if="!folder.id" class="title"><i class="far fa-folder dark15"></i> {{folder.name}}</td>
                    <td v-else class="title clickable" @click="setCurrentFolder(folder)"><i class="fas fa-folder dark15"></i> {{folder.name}}</td>
                    <td class="modified">-</td>
                    <!-- <td class="deadline">-</td> -->
                    <td class="items">{{folder.children_count || '-'}}</td>
                    <td class="owners">
                        <button class="ghost editable sm" @click="showFolderOwnersFlyin(folder)">
                            <i class="far fa-user"></i><span>{{folder.owner_count || 0}}</span>
                        </button>
                    </td>
                    <!-- <td class="status">-</td> -->
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showContextMenu($event, folder, 'folder')"><i class="fas fa-ellipsis-h"></i></button>
                    </td>
                </tr>
                <tr v-for="file in filesToShow" :key="file.id" class="file" @contextmenu.prevent="showContextMenu($event, file, 'file')">
                    <td class="select"><BaseCheckbox/></td>
                    <td v-if="toEdit && toEdit.item.id == file.id && toEdit.type == 'file' && toEdit.field == 'title'" class="title">
                        <BaseEditInputWrapper :activateOnMount="true" :type="'text'"
                            :value="toEdit.item.name" :oldValue="file.name" v-model="toEdit.item.name"
                            @submit="updateFile(toEdit.item); clearToEdit()" @cancel="clearToEdit()"/>
                        </td>
                    <td v-else class="title clickable" @click="showSingleFile(file)"><i class="fas fa-file dark15"></i> {{file.name}}</td>
                    <td class="modified">-</td>
                    <!-- <td class="deadline">{{file.end_date}}</td> -->
                    <td class="items">{{file.children_count || '-'}}</td>
                    <td class="owners">
                        <button class="ghost editable sm" @click="showFileOwnersFlyin(file)">
                            <i class="far fa-user"></i><span>{{file.owner_count || 0}}</span>
                        </button>
                    </td>
                    <!-- <td class="status">-</td> -->
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showContextMenu($event, file, 'file')"><i class="fas fa-ellipsis-h"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer>
                <!-- <td><button class="primary invisible icon-left context-right" @click="onNewFolder"><i class="far fa-plus"></i>Add new: Folder <i class="fas fa-caret-down context"></i></button></td> -->
                <td><button class="primary invisible" @click="onNewFolder"><i class="far fa-plus"></i><span>Add new: Folder</span></button></td>
            </template>
        </BaseFlexTable>

        <BaseModal ref="editFileModal" :header="'Add data to <br><strong>' + fileToEdit.name + '<strong>'" 
        :subHeader="'Upload more csvs to add data to the file'">
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
                        <BaseLoader :message="'Uploading'" />
                    </template>
                </form>
            </template>
        </BaseModal>

        <BaseModal
            ref="moveItemModal"
            :header="'Move item to..'"
            :subHeader="'Select a place to move the current item to'"
            :classes="'move-item-modal'"
        >
            <template v-slot>
                <div class="inner" v-if="toMove != null">
                    <div style="margin-bottom: 12px">
                        <button v-if="folderToMoveToId != null" class="invisible ghost-hover true-square" @click="folderToMoveToId = folderToMoveTo.parent_id">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span v-if="folderToMoveToId != null">{{folderToMoveTo.name}}</span>
                        <span v-else><span class="square true-square"><i class="far fa-building"></i></span> {{currentWorkspace.name}}</span>
                    </div>
                    <div class="folders-wrapper">
                        <template v-for="thisFolder in folderToMoveTo.folders">
                            <div class="folder" :key="thisFolder.id">
                                <p v-if="thisFolder.id != toMove.id" class="clickable"
                                @click="folderToMoveToId = thisFolder.id">
                                    <i class="fas fa-folder dark15"></i> {{thisFolder.name}}
                                </p>
                                <p v-else :key="thisFolder.id" class="disabled" style="opacity: .5;">
                                    <i class="fas fa-folder dark15"></i> {{thisFolder.name}}
                                </p>
                            </div>
                        </template>
                        <p v-if="folderToMoveTo.folders.length <= 0">No folders..</p>
                    </div>
                    <div class="controls" style="display: flex; justify-content: flex-end; margin-top: 12px;">
                        <button class="invisible dark ghost-hover" @click="$refs.moveItemModal.toggle(); toMove = null"><span>Cancel</span></button>
                        <button class="primary" :class="{disabled: folderToMoveToId == toMove.id || folderToMoveToId == folder.id}" @click="submitMoveItem()"
                        ><span>Move here</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseModal>

        <FolderOwnersFlyin :folder="flyinFolder" :show="folderOwnersFlyinVisible" @close="folderOwnersFlyinVisible = false"/>

        <BaseContextMenu ref="contextMenuFolder" class="context-folder" v-slot
        @keybind-o="setCurrentFolder(contextMenuItem)"
        @keybind-r="onEditField(contextMenuItem, 'folder', 'title')"
        @keybind-a="showFolderOwnersFlyin(contextMenuItem)"
        @keybind-m="onMoveTo(contextMenuItem, 'folder')"
        @keybind-d="onDeleteFolder(contextMenuItem.id)">
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
                <div class="item" @click="showFolderOwnersFlyin(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-user-plus"></i>
                    </div>
                    <u>A</u>dd owner(s)
                </div>
                <div class="item" @click="onMoveTo(contextMenuItem, 'folder')">
                    <div class="icon-wrapper">
                        <i class="far fa-folder"><i class="fas fa-long-arrow-alt-right"></i></i>
                    </div>
                    <u>M</u>ove to
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onDeleteFolder(contextMenuItem.id)">
                    <div class="icon-wrapper">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <u>D</u>elete folder
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuFile" class="context-file" v-slot
        @keybind-v="viewSingle(contextMenuItem.id)"
        @keybind-e="viewEditSingle(contextMenuItem.id)"
        @keybind-r="onEditField(contextMenuItem, 'file', 'title')"
        @keybind-a="showFileOwnersFlyin(contextMenuItem)"
        @keybind-m="onMoveTo(contextMenuItem, 'file')"
        @keybind-d="onDeleteFile(contextMenuItem.id)">
            <div class="item-group">
                <div class="item" @click="viewSingle(contextMenuItem.id)">
                    <div class="icon-wrapper">
                        <i class="far fa-file"></i>
                    </div>
                    <u>V</u>iew file
                </div>
                <div class="item" @click="viewEditSingle(contextMenuItem.id)">
                    <div class="icon-wrapper">
                        <i class="far fa-file-edit"></i>
                    </div>
                    View / <u>e</u>dit products
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onEditField(contextMenuItem, 'file', 'title')">
                    <div class="icon-wrapper">
                        <i class="far fa-pen"></i>
                    </div>
                    <u>R</u>ename
                </div>
                <div class="item" @click="showFileOwnersFlyin(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-user-plus"></i>
                    </div>
                    <u>A</u>dd owner(s)
                </div>
                <div class="item" @click="onMoveTo(contextMenuItem, 'file')">
                    <div class="icon-wrapper">
                        <i class="far fa-folder"><i class="fas fa-long-arrow-alt-right"></i></i>
                    </div>
                    <u>M</u>ove to
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onDeleteFile(contextMenuItem.id)">
                    <div class="icon-wrapper">
                        <i class="far fa-trash-alt"></i>
                    </div>
                    <u>D</u>elete file
                </div>
            </div>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FolderOwnersFlyin from '../../components/FolderOwnersFlyin'

export default {
    name: 'filesTable',
    props: [
        'folder',
        'files',
        'selected',
    ],
    components: {
        FolderOwnersFlyin,
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
            toEdit: null,
            toMove: null,
            folderToMoveTo: this.folder,
            flyinFolder: null,
            folderOwnersFlyinVisible: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        foldersToShow() {
            return this.files.filter(x => x.type =='Folder')
        },
        filesToShow() {
            return this.files.filter(x => x.type =='File')
        }
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'deleteFile', 'updateFile', 'uploadToExistingFile']),
        ...mapMutations('files', ['removeUnsavedFiles']),
        ...mapActions('folders', ['deleteFolder', 'updateFolder']),
        showFileOwnersFlyin(file) {
            this.$emit('showFileOwnersFlyin', file)
        },
        showFolderOwnersFlyin(folder) {
            this.flyinFolder = folder
            this.folderOwnersFlyinVisible = true
        },
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
        showSingleFile(file) {
            this.$emit('showSingleFile', file)
        },
        onMoveTo(item, type) {
            this.toMove = item
            this.toEdit = {item: item, type: type}
            this.folderToMoveToId = this.folder.id
            this.$refs.moveItemModal.toggle()
        },
        submitMoveItem() {
            const item = this.toEdit.item
            // Check the type of the item to move
            if (this.toEdit.type == 'folder') {
                // Set the new parent_id
                item.parent_id = this.folderToMoveToId
                this.updateFolder(item)

                // Remove the moved item from the current array
                const currentItemIndex = this.files.findIndex(x => x.id == item.id)
                this.files.splice(currentItemIndex, 1)
            } else {
                // Set the folder id
                item.folder_id = this.folderToMoveToId
                item.catalog_id = this.folderToMoveToId
                this.updateFile(item)

                // Remove the moved item from the current array
                const currentItemIndex = this.folder.files.findIndex(x => x.id == item.id)
                this.folder.files.splice(currentItemIndex, 1)
            }
            // Reset the item to edit
            this.toMove = null
            this.toEdit = null
            this.$refs.moveItemModal.toggle()
        },
        onEditField(item, type, field) {
            // If the new item to edit has an ID, remove all unsaved folders, to avoid confusion as to whether they are saved or not
            if(item.id) this.removeUnsavedFolders()
            // Set the item to edit
            this.toEdit = {item: item, type: type, field: field}
        },
        clearToEdit() {
            this.toEdit = null
        },
        removeUnsavedFolders() {
            this.removeUnsavedFiles()
        },
        onDeleteFolder(folderId) {
            if (window.confirm(
                'Are you sure you want to delete this folder?\nThe folder and all of its contents will be permanently deleted.'
            )) {
                this.deleteFile(folderId)
            }
        },
        onNewFolder() {
            // Check if we already have added a new folder
            const existingNewFolder = this.files.find(x => x.id == null && type == 'Folder')
            // If we already have a new folder, focus the edit title field
            if (existingNewFolder) {
                this.onEditField(existingNewFolder, 'folder', 'title')
                // Focus the edit field
                this.$refs['editTitleInput-null'][0].setActive()
            }
            // Else create a new folder
            else {
                const newFolder = {
                    id: null,
                    name: 'New folder',
                    type: 'Folder',
                    parent_id: this.folder ? this.folder.id : 0,
                    workspace_id: this.currentWorkspace.id,
                    children: [],
                    owners: [],
                    children_count: 0,
                    owner_count: 0,
                }
                // Push new folder to the current folder
                this.files.push(newFolder)
                // Activate title edit of new folder
                this.onEditField(newFolder, 'folder', 'title')
            }
            
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
        viewEditSingle(fileId) {
            this.$router.push({ name: 'editFile', params: { fileId: fileId } })
        },
        onDeleteFile(fileId) {
            if (window.confirm(
                'Are you sure you want to delete this file?\nAll comments, requests and actions will be permanently deleted.'
            )) {
                this.deleteFile(fileId)
            }
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
    th, td {
        &.title {
            min-width: 244px;
            max-width: 244px;
            display: flex;
            align-items: center;
        }
    }
}
.clickable {
    cursor: pointer;
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
.move-item-modal {
    .folders-wrapper {
        display: block;
        min-height: 40px;
        border: solid 1px #f3f3f3;
        color: #3c3b54;
        border-radius: 4px;
        padding: 8px 12px;
        background: white;
        width: 100%;
    }
    .folder {
        &:not(:last-child) {
            margin-bottom: 8px;
        }
        &:hover i {
            color: $darkAlt;
        }
        .disabled {
            cursor: default;
        }
    }
    .controls {
        button {
            margin-left: 8px;
        }
    }
}
</style>
