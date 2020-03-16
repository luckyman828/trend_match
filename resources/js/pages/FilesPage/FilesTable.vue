<template>
    <div class="folders-table-wrapper">
        <BaseFlexTable class="folders-table" stickyHeader="true">
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
                <BaseTableHeader class="select"><BaseCheckbox/></BaseTableHeader>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" @sort="onSort">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'modified'" :currentSortKey="sortKey" @sort="onSort">Modified</BaseTableHeader>
                <BaseTableHeader :sortKey="'items'" :currentSortKey="sortKey" @sort="onSort">Items</BaseTableHeader>
                <!-- <BaseTableHeader :sortKey="'owners'" :currentSortKey="sortKey" @sort="onSort">Owners</BaseTableHeader> -->
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="folder in foldersToShow" :key="folder.id" class="folder" @contextmenu.prevent="showContextMenu($event, folder, 'folder')">
                    <td class="select"><BaseCheckbox/></td>
                    <td v-if="toEdit && toEdit.item.id == folder.id && toEdit.type == 'folder' && toEdit.field == 'title'" class="title">
                        <i v-if="folder.id" class="fas fa-folder dark15"></i>
                        <i v-else class="far fa-folder dark15"></i>
                        <BaseEditInputWrapper :activateOnMount="true" :type="'text'" :ref="'editTitleInput-' + toEdit.item.id"
                            :value="toEdit.item.name" :oldValue="folder.name" v-model="toEdit.item.name"
                            @submit="removeUnsavedFolders(); insertOrUpdateFile(toEdit.item); clearToEdit()" @cancel="clearToEdit(); removeUnsavedFolders()"/>
                        </td>
                    <td v-else-if="!folder.id" class="title"><i class="far fa-folder dark15"></i> {{folder.name}}</td>
                    <td v-else class="title clickable" @click="setCurrentFolder(folder)"><i class="fas fa-folder dark15"></i> {{folder.name}}</td>
                    <td class="modified">-</td>
                    <!-- <td class="deadline">-</td> -->
                    <td class="items">{{folder.children_count || '-'}}</td>
                    <!-- <td class="owners">
                        <button class="ghost editable sm" @click="showFileOwnersFlyin(folder)">
                            <i class="far fa-user"></i><span>{{folder.owner_count || 0}}</span>
                        </button>
                    </td> -->
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
                            @submit="insertOrUpdateFile(toEdit.item); clearToEdit()" @cancel="clearToEdit()"/>
                        </td>
                    <td v-else class="title clickable" @click="showSingleFile(file)"><i class="fas fa-file dark15"></i> {{file.name}}</td>
                    <td class="modified">-</td>
                    <!-- <td class="deadline">{{file.end_date}}</td> -->
                    <td class="items">{{file.children_count || '-'}}</td>
                    <!-- <td class="owners">
                        <button class="ghost editable sm" @click="showFileOwnersFlyin(file)">
                            <i class="far fa-user"></i><span>{{file.owner_count || 0}}</span>
                        </button>
                    </td> -->
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

        <BaseContextMenu ref="contextMenuFolder" class="context-folder" v-slot
        @keybind-o="setCurrentFolder(contextMenuItem)"
        @keybind-r="authUserWorkspaceRole == 'Admin' && onEditField(contextMenuItem, 'folder', 'title')"
        @keybind-a="false && showFileOwnersFlyin(contextMenuItem)"
        @keybind-m="false && onMoveTo(contextMenuItem, 'folder')"
        @keybind-d="authUserWorkspaceRole == 'Admin' && onDeleteFolder(contextMenuItem.id)">
            <div class="item-group">
                <div class="item" @click="setCurrentFolder(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-folder-open"></i>
                    </div>
                    <u>O</u>pen folder
                </div>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can rename folders'"
                @click="onEditField(contextMenuItem, 'folder', 'title')">
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>
                <!-- <div class="item" @click="showFileOwnersFlyin(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-user-plus"></i>
                    </div>
                    <u>A</u>dd owner(s)
                </div> -->
                <!-- <BaseContextMenuItem iconClass="far fa-long-arrow-alt-right" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can move folders'"
                @click="onMoveTo(contextMenuItem, 'folder')">
                    <span><u>M</u>ove to</span>
                </BaseContextMenuItem> -->
                <!-- <div class="item" @click="onMoveTo(contextMenuItem, 'folder')">
                    <div class="icon-wrapper">
                        <i class="far fa-folder"><i class="fas fa-long-arrow-alt-right"></i></i>
                    </div>
                    <u>M</u>ove to
                </div> -->
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete folders'"
                @click="onDeleteFolder(contextMenuItem.id)">
                    <span><u>D</u>elete folder</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuFile" class="context-file" v-slot
        @keybind-v="viewSingle(contextMenuItem.id)"
        @keybind-e="authUserWorkspaceRole == 'Admin' && onGoToEditFile(contextMenuItem.id)"
        @keybind-r="authUserWorkspaceRole == 'Admin' && onEditField(contextMenuItem, 'file', 'title')"
        @keybind-a="false && showFileOwnersFlyin(contextMenuItem)"
        @keybind-m="false && onMoveTo(contextMenuItem, 'file')"
        @keybind-d="authUserWorkspaceRole == 'Admin' && onDeleteFile(contextMenuItem.id)">
            <div class="item-group">
                <div class="item" @click="showSingleFile(contextMenuItem)">
                    <div class="icon-wrapper">
                        <i class="far fa-file"></i>
                    </div>
                    <u>V</u>iew file
                </div>
                <BaseContextMenuItem iconClass="far fa-file-edit" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can edit files'"
                @click="onGoToEditFile(contextMenuItem.id)">
                    <span>View / <u>e</u>dit products</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can rename files'"
                @click="onEditField(contextMenuItem, 'file', 'title')">
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>
                <!-- Not implemented yet -->
                <!-- <div class="item" @click="showFileOwnersFlyin(contextMenuItem)">
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
                </div> -->
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete files'"
                @click="onDeleteFile(contextMenuItem.id)">
                    <span><u>D</u>elete file</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'filesTable',
    props: [
        'folder',
        'files',
        'selected',
    ],
    mixins: [
        sortArray
    ],
    data: function() {
        return {
            sortKey: null,
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
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
        foldersToShow() {
            return this.files.filter(x => x.type =='Folder')
        },
        filesToShow() {
            return this.files.filter(x => x.type =='File')
        }
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'deleteFile', 'uploadToExistingFile']),
        ...mapMutations('files', ['removeUnsavedFiles']),
        ...mapActions('folders', ['deleteFolder', 'updateFolder']),
        showFileOwnersFlyin(file) {
            this.$emit('showFileOwnersFlyin', file)
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
                this.insertOrUpdateFile(item)

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
        hideTooltip() {
            this.tooltip.active = false
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.files, sortAsc, sortKey)
        },
        viewSingle(fileId) {
            this.$router.push({ name: 'file', params: { fileId: fileId } })
        },
        onGoToEditFile(fileId) {
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
