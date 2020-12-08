<template>
    <div class="folders-table-wrapper">
        <BaseTable
            class="folders-table"
            stickyHeader="true"
            ref="tableComp"
            :contentStatus="readyStatus"
            loadingMsg="loading folder content"
            errorMsg="error loading folder content"
            :errorCallback="() => initData()"
            :items="files"
            :searchResult.sync="filesFilteredBySearch"
            :searchKey="['title', 'name']"
            itemKey="id"
            :itemSize="50"
            :selected.sync="selected"
            :contextItem.sync="contextMenuItem"
            :contextMouseEvent.sync="contextMouseEvent"
            :useVirtualScroller="false"
            @show-contextmenu="showContextMenu"
        >
            <template v-slot:header>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" @sort="onSort"
                    >Name</BaseTableHeader
                >
                <BaseTableHeader class="action" />
            </template>
            <template v-slot:row="rowProps">
                <FolderTableRow
                    v-if="rowProps.item.type == 'Folder'"
                    :folder="rowProps.item"
                    :fileToEdit.sync="fileToEdit"
                    :dragActive="dragActive"
                    :dragHoverId="dragHoverId"
                    @drag-start="onDragStart"
                    @drag-end="onDragEnd"
                    @mouseenter="onDragenter(rowProps.item)"
                    @mouseleave="onDragLeave"
                />

                <FileTableRow
                    v-else
                    :file="rowProps.item"
                    :fileToEdit.sync="fileToEdit"
                    @show-single-file="showSingleFile"
                />
            </template>
            <template v-slot:footer>
                <td class="flex-list">
                    <BaseButton
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new folders'"
                        buttonClass="primary invisible"
                        @click="onNewFile('Folder')"
                    >
                        <i class="far fa-folder-plus"></i><span>Add folder</span>
                    </BaseButton>
                    <BaseButton
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new files'"
                        buttonClass="primary invisible"
                        @click="onNewFile('File')"
                    >
                        <i class="far fa-file-plus"></i><span>Add file</span>
                    </BaseButton>
                </td>
            </template>
        </BaseTable>

        <BaseModal
            ref="moveItemModal"
            :header="`Move ${filesToMove.length} item${filesToMove.length > 1 ? 's' : ''} to..`"
            :classes="'move-item-modal'"
            :show="showMoveModal"
            @close="showMoveModal = false"
        >
            <template v-slot>
                <div class="inner" v-if="filesToMove != null">
                    <div style="margin-bottom: 12px">
                        <button
                            v-if="destinationFolder.id != currentWorkspace.id"
                            class="invisible ghost-hover true-square"
                            @click="setDestinationFolder(destinationFolder.parent_id)"
                        >
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <span v-if="destinationFolder && destinationFolder.id != currentWorkspace.id">{{
                            destinationFolder.name
                        }}</span>
                        <span v-else
                            ><span class="square true-square"><i class="far fa-building"></i></span>
                            {{ currentWorkspace.title }}</span
                        >
                    </div>
                    <div class="folders-wrapper">
                        <template v-for="thisFolder in destinationFolderContent.filter(x => x.type == 'Folder')">
                            <div class="folder" :key="thisFolder.id">
                                <span
                                    v-if="!filesToMove.find(x => x.id == thisFolder.id)"
                                    class="clickable"
                                    @click="setDestinationFolder(thisFolder.id)"
                                >
                                    <i class="fas fa-folder dark15"></i> {{ thisFolder.name }}
                                </span>
                                <span
                                    v-else
                                    class="disabled"
                                    style="opacity: .5;"
                                    v-tooltip="'Cannot place a folder inside itself'"
                                >
                                    <i class="fas fa-folder dark15"></i> {{ thisFolder.name }}
                                </span>
                            </div>
                        </template>
                        <p v-if="destinationFolderContent.filter(x => x.type == 'Folder').length <= 0">No folders..</p>
                    </div>
                    <div class="controls" style="display: flex; justify-content: flex-end; margin-top: 12px;">
                        <button class="invisible dark ghost-hover" @click="showMoveModal = false">
                            <span>Cancel</span>
                        </button>
                        <button
                            class="primary"
                            :class="{
                                disabled:
                                    destinationFolder.id == filesToMove.id ||
                                    destinationFolder.id == filesToMove.parent_id,
                            }"
                            @click="submitMoveItem()"
                        >
                            <span>Move here</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseModal>

        <BaseContextMenu ref="contextMenuFolder" class="context-folder">
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-folder-open"
                    hotkey="KeyO"
                    @click="setCurrentFolder(contextMenuItem)"
                >
                    <u>O</u>pen folder
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-pen"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can rename folders"
                    hotkey="KeyR"
                    @click="fileToEdit = contextMenuItem"
                >
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-long-arrow-alt-right"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can move folders"
                    hotkey="KeyM"
                    @click="onMoveFiles()"
                >
                    <span><u>M</u>ove to</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can delete folders"
                    hotkey="KeyD"
                    @click="onDeleteFolder(contextMenuItem)"
                >
                    <span><u>D</u>elete folder</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuFile" class="context-file">
            <div class="item-group" v-if="contextMenuItem">
                <BaseContextMenuItem iconClass="far fa-file" hotkey="KeyV" @click="showSingleFile(contextMenuItem)">
                    <u>V</u>iew file
                </BaseContextMenuItem>
                <BaseContextMenuItem
                    iconClass="far fa-file-edit"
                    :disabled="authUserWorkspaceRole != 'Admin' && !contextMenuItem.editable"
                    disabledTooltip="Only admins and editors can edit files"
                    hotkey="KeyE"
                    @click="onGoToEditFile(contextMenuItem.id)"
                >
                    <span>View / <u>e</u>dit products</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-pen"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can rename files"
                    hotkey="KeyR"
                    @click="fileToEdit = contextMenuItem"
                >
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-long-arrow-alt-right"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can move files"
                    hotkey="KeyM"
                    @click="onMoveFiles()"
                >
                    <span><u>M</u>ove to</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can delete files"
                    hotkey="KeyD"
                    @click="onDeleteFile(contextMenuItem)"
                >
                    <span><u>D</u>elete file</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuMultipleItems" class="context-file">
            <template slot="header">
                <span>Choose action for {{ selected.length }} items</span>
            </template>
            <template slot>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="selected = []">
                        <span><u>C</u>lear selection</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-long-arrow-alt-right"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can move files"
                        hotkey="KeyM"
                        @click="onMoveFiles()"
                    >
                        <span><u>M</u>ove to</span>
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-trash-alt"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can delete file"
                        hotkey="KeyD"
                        @click="onDeleteMultipleFiles(selected)"
                    >
                        <span><u>D</u>elete items</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseDialog
            ref="deleteFileDialog"
            type="confirm"
            confirmText="Yes, delete it"
            cancelText="No, keep it"
            confirmColor="red"
        >
            <div class="icon-graphic">
                <i class="far fa-file primary lg"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-trash lg dark"></i>
            </div>
            <h3>Really delete this file?</h3>
            <p>All comments, requests and actions will be permanently deleted.</p>
        </BaseDialog>

        <BaseDialog
            ref="deleteFolderDialog"
            type="confirm"
            confirmText="Yes, delete it"
            cancelText="No, keep it"
            confirmColor="red"
        >
            <div class="icon-graphic">
                <i class="far fa-file primary lg"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-trash lg dark"></i>
            </div>
            <h3>Really delete this folder?</h3>
            <p>The folder and all of its contents will be permanently deleted.</p>
        </BaseDialog>

        <BaseDialog
            ref="deleteMultipleDialog"
            type="confirm"
            confirmText="Yes, delete them"
            cancelText="No, keep them"
            confirmColor="red"
        >
            <div class="icon-graphic">
                <i class="far fa-copy primary lg"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-trash lg dark"></i>
            </div>
            <h3>Really delete {{ selected.length }} files/folders?</h3>
            <p>
                folders and files contained in your selection and all their comments, requests and actions will be
                permanently deleted.
            </p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortArray from '../../mixins/sortArray'
import FileTableRow from './FileTableRow'
import FolderTableRow from './FolderTableRow'

export default {
    name: 'filesTable',
    props: [],
    components: {
        FolderTableRow,
        FileTableRow,
    },
    mixins: [sortArray],
    data: function() {
        return {
            filesFilteredBySearch: [],
            selected: [],
            contextMouseEvent: null,
            sortKey: null,
            showMoveModal: false,
            fileToEdit: null,
            filesToAdd: [],
            uploadingToFile: false,
            contextMenuItem: null,
            filesToMove: [],
            destinationFolder: null,
            destinationFolderContent: [],
            dragActive: false,
            dragHoverId: null,
        }
    },
    computed: {
        ...mapGetters('files', ['files', 'getCurrentFolderStatus', 'getCurrentFolder', 'getFilesStatus']),
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
        ...mapGetters('tables', ['getFilesTable']),
        folder() {
            return this.getCurrentFolder
        },
        foldersToShow() {
            return this.files.filter(x => x.type == 'Folder')
        },
        filesToShow() {
            return this.files.filter(x => x.type == 'File')
        },
        readyStatus() {
            if (this.getCurrentFolderStatus == 'error') return 'error'
            if (this.getCurrentFolderStatus == 'loading') return 'loading'
            return 'success'
        },
    },
    watch: {
        currentWorkspace(newVal, oldVal) {
            this.initData(true)
        },
        getCurrentFolder(newVal, oldVal) {
            this.selected = []
        },
    },
    methods: {
        ...mapActions('files', [
            'deleteFile',
            'uploadToExistingFile',
            'deleteMultipleFiles',
            'fetchFolder',
            'fetchFolderContent',
            'fetchFiles',
            'moveFiles',
            'setCurrentFolder',
        ]),
        ...mapActions('folders', ['deleteFolder', 'updateFolder']),
        ...mapMutations('tables', ['SET_TABLE_PROPERTY']),
        initData(forceRefresh) {
            if (forceRefresh || (this.getCurrentFolderStatus != 'success' && this.getCurrentFolderStatus != 'loading'))
                this.setCurrentFolder(this.getCurrentFolder)
            this.SET_TABLE_PROPERTY('filesTable', 'workspaceId', this.currentWorkspace.id)
        },
        showFileOwnersFlyin(file) {
            this.$emit('showFileOwnersFlyin', file)
        },
        showContextMenu(e) {
            if (this.selected.length > 1) {
                this.showMultiItemContextMenu(e)
                return
            }
            const folderMenu = this.$refs.contextMenuFolder
            const fileMenu = this.$refs.contextMenuFile
            // Hide any current contextMenus
            if (fileMenu) fileMenu.hide()
            if (folderMenu) folderMenu.hide()
            // Save a reference to the contextual menu to show
            let contextMenu
            if (this.contextMenuItem.type == 'Folder') {
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
        onDragStart(file) {
            this.dragActive = true
            this.filesToMove = [file]
        },
        onDragEnd() {
            this.dragActive = false
            const destinationFolder = this.foldersToShow.find(x => x.id == this.dragHoverId)
            if (!destinationFolder || destinationFolder.id == this.filesToMove[0].id) return
            this.moveFiles({ destinationFolderId: destinationFolder.id, filesToMove: this.filesToMove })
            this.dragHoverId = null
        },
        onDragenter(file) {
            if (this.dragActive == true) {
                this.dragHoverId = file.id
            }
        },
        onDragLeave() {
            if (this.dragActive == true) {
                this.dragHoverId = null
            }
        },
        onMoveFiles() {
            // If we have a selection then move that, else move the context file
            if (this.selected.length > 0) {
                this.filesToMove = this.selected
            } else {
                this.filesToMove = [this.contextMenuItem]
            }
            this.destinationFolder = this.folder || { id: this.currentWorkspace.id, parent_id: null }
            this.destinationFolderContent = this.files
            this.showMoveModal = true
        },
        async setDestinationFolder(folderId) {
            // If there is no folder ID, then set the destination to the workspace
            if (folderId == 0 || !folderId) {
                this.destinationFolder = { id: this.currentWorkspace.id, parent_id: null }
                this.destinationFolderContent = await this.fetchFiles(false)
            } else {
                this.destinationFolder = await this.fetchFolder(folderId)
                this.destinationFolderContent = await this.fetchFolderContent(folderId)
            }
        },
        submitMoveItem() {
            this.moveFiles({ destinationFolderId: this.destinationFolder.id, filesToMove: this.filesToMove })
            this.showMoveModal = false
            this.selected = []
        },
        async onDeleteFolder(folder) {
            if (await this.$refs.deleteFolderDialog.confirm()) {
                this.deleteFile(folder)
                // Remove the item from our selection
                this.selected = this.selected.filter(x => x.id != folder.id)
            }
        },
        onNewFile(type) {
            // Check if we already have added a new folder
            const existingNewFolder = this.files.find(x => x.id == null && type == 'Folder')
            // If we already have a new folder, focus the edit title field
            if (existingNewFolder && type == 'folder') {
                this.fileToEdit = existingNewFolder
                // Focus the edit field
                this.$refs['editTitleInput-null'][0].setActive()
            }
            // Else create a new folder
            else {
                const newFolder = {
                    id: 0,
                    name: `New ${type}`,
                    type,
                    parent_id: this.folder ? this.folder.id : 0,
                    workspace_id: this.currentWorkspace.id,
                    children: [],
                }
                // Push new folder to the current folder
                this.files.push(newFolder)
                // Activate title edit of new folder
                this.fileToEdit = newFolder
            }
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.files, sortAsc, sortKey)
        },
        onGoToEditFile(fileId) {
            this.$router.push({ name: 'editFile', params: { fileId: fileId } })
        },
        async onDeleteFile(file) {
            if (await this.$refs.deleteFileDialog.confirm()) {
                this.deleteFile(file)
                // Remove the item from our selection
                this.selected = this.selected.filter(x => x.id != file.id)
            }
        },
        onRenameFile(file) {
            this.fileToEdit = file
        },
        showMultiItemContextMenu(e) {
            this.$refs.contextMenuMultipleItems.show(e)
        },
        async onDeleteMultipleFiles(files) {
            if (await this.$refs.deleteMultipleDialog.confirm()) {
                this.deleteMultipleFiles(files)
                this.selected = []
            }
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT' || this.singleVisible) return // Don't mess with user input

            if (key == 'KeyS') {
                this.$refs.tableComp.focusSearch()
                // this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
        },
    },
    created() {
        const forceRefresh = this.getFilesTable.workspaceId != this.currentWorkspace.id
        this.initData(forceRefresh)
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.sortable-drag {
    opacity: 1 !important;
    z-index: 999;
    background: white;
    padding: 8px 16px 8px 8px;
    border-radius: $borderRadiusEl;
    border: $borderEl;
    box-shadow: $shadowEl !important;
    height: auto !important;
    span {
        width: 100%;
        overflow: hidden;
    }
}
.folders-table {
    position: relative;
    th,
    ::v-deep td {
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
    user-select: none;
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
