<template>
    <div class="files-page">
        <div class="breadcrumbs">
            <button @click="onSetCurrentFolder(null)" class="invisible white-hover">
                <i class="far fa-building"></i><span>{{currentWorkspace.title}}</span>
            </button>
            <div class="breadcrumb" v-for="(folder, index) in path" :key="folder.id">
                <template v-if="!currentFolder || folder.id != currentFolder.id">
                    <button @click="onSetCurrentFolder(folder, index)" class="invisible white-hover">
                        <i class="far fa-folder"></i>
                        <span>{{folder.name}}</span>
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
                <template v-else>
                    <button class="invisible white-hover">
                        <i class="far fa-folder-open"></i>
                        <span>{{folder.name}}</span>
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
            </div>
        </div>
        <h1>Files</h1>

        <FilesTable :files="files" :folder="currentFolder" :selected="selected"
        v-model="selected"
        @setCurrentFolder="onSetCurrentFolder" @showSingleFile="showSingleFile"
        @showFileOwnersFlyin="showFileOwnersFlyin"
        @showMultiItemContextMenu="showMultiItemContextMenu"/>

        <FileFlyin :file="currentFile" :show="fileFlyinVisible" @close="fileFlyinVisible = false"
        @showFileOwnersFlyin="showFileOwnersFlyin" @showFileApproversFlyin="showFileApproversFlyin"/>

        <!-- <FileOwnersFlyin :file="currentFile" :show="fileOwnersFlyinVisible" @close="fileOwnersFlyinVisible = false"/> -->

        <!-- <FileApproversFlyin :file="currentFile" :show="fileApproversFlyinVisible" @close="fileApproversFlyinVisible = false"/> -->

        <BaseContextMenu ref="contextMenuMultipleItems" class="context-file"
        @keybind-d="authUserWorkspaceRole == 'Admin' && onDeleteMultipleFiles(selected)"
        @keybind-c="selected = []"
        >
            <template slot="header">
                <span>Choose action for {{selected.length}} items</span>
            </template>
            <template slot>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times"
                    @click="selected = []">
                        <span><u>C</u>lear selection</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-trash-alt" :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete files'"
                    @click="onDeleteMultipleFiles(selected)">
                        <span><u>D</u>elete items</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>
    
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FilesTable from './FilesTable'
import FileFlyin from './FileFlyin'
import FileOwnersFlyin from '../../components/FileOwnersFlyin'
import FileApproversFlyin from '../../components/FileApproversFlyin'

export default {
    name: 'filesPage',
    components: {
        FilesTable,
        FileFlyin,
        FileOwnersFlyin,
        FileApproversFlyin,
    },
    data: function() { return {
        selected: [],
        itemFilterIds: [],
        // teamFilterId: '-1',
        loadingOverwrite: false,
        unsub: '',
        path: [],
        fileFlyinVisible: false,
        fileOwnersFlyinVisible: false,
        fileApproversFlyinVisible: false,
    }},
    computed: {
        ...mapGetters('files', ['files', 'currentFile', 'currentFolder', 'currentFolderId']),
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
        folders() {
            return this.files.filter(x => x.type == 'Folder')
        },
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
    },
    methods: {
        ...mapActions('files', ['setCurrentFolder', 'fetchFile', 'fetchFolder', 'deleteFile']),
        ...mapMutations('files', ['setCurrentFile']),
        showSingleFile(file) {
            // Set the current file id
            this.setCurrentFile(file)
            // Show the flyin
            this.fileFlyinVisible = true
        },
        showFileOwnersFlyin(file) {
            // Set the current file id
            this.setCurrentFile(file)
            this.fileOwnersFlyinVisible = true
        },
        showFileApproversFlyin(file) {
            // Set the current file id
            this.setCurrentFile(file)
            this.fileApproversFlyinVisible = true
        },
        onSetCurrentFolder(folder, pathIndex) {
            if (folder != null) {
                // Remove folders after the new folder from the current path
                if (pathIndex != null) {
                    this.path.splice(pathIndex)
                }
                // Store what folder we are in now, so we know the path
                this.path.push(folder)
                // Set current folder
                this.setCurrentFolder(folder)
            } else {
                // Reset the folder and path
                this.path = []
                // Set the current folder
                this.setCurrentFolder(null)
            }
            this.selected = []
        },
        showMultiItemContextMenu(e) {
            this.$refs.contextMenuMultipleItems.show(e)
        },
        onDeleteMultipleFiles(files) {
            if (window.confirm(
                'Are you sure you want to delete your selection?\nAll folders and files contained in your selection and all their comments, requests and actions will be permanently deleted.'
            )) {
                for(let i = files.length; i--;) {
                    this.deleteFile(files[i].id)
                }
                for(let i = files.length; i--;) {
                    // Remove the item from our selection
                    this.selected = this.selected.filter(x => x.id != files[i].id)
                }
            }
        }
    },
    async created() {
        // If the route has a fileId param set, then show that file in a flyin and set the current folder to the files parent
        const routeFileId = this.$route.params.fileId
        if (routeFileId) {
            // Set the file as current file
            // Check if we already have the file fetched as current
            let file
            if (!this.currentFile || this.currentFile.id != routeFileId) {
                file = await this.fetchFile(routeFileId)
            } else {
                file = this.currentFile
            }
            // Show the file flyin
            this.showSingleFile(file)
        }
        const routeFolderId = this.$route.params.folderId
        if (routeFolderId) {
            const folder = await this.fetchFolder(routeFolderId)
            this.setCurrentFolder(folder)
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    h1 {
        margin-bottom: 16px;
    }
    .underline {
        width: 100%;
        border-bottom: solid 2px $light2;
        margin-bottom: 20px;
    }
    .filters {
        display: flex;
        justify-content: space-between;
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
    
</style>
