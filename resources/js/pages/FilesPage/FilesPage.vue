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

        <FilesTable :files="files" :folder="currentFolder" :selected="selected" 
        @setCurrentFolder="onSetCurrentFolder" @showSingleFile="showSingleFile"
        @showFileOwnersFlyin="showFileOwnersFlyin"/>

        <FileFlyin :file="currentFile" :show="fileFlyinVisible" @close="fileFlyinVisible = false"
        @showFileOwnersFlyin="showFileOwnersFlyin" @showFileApproversFlyin="showFileApproversFlyin"/>

        <FileOwnersFlyin :file="currentFile" :show="fileOwnersFlyinVisible" @close="fileOwnersFlyinVisible = false"/>

        <FileApproversFlyin :file="currentFile" :show="fileApproversFlyinVisible" @close="fileApproversFlyinVisible = false"/>
    
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
        ...mapGetters('workspaces', ['currentWorkspace']),
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
        ...mapActions('files', ['setCurrentFolder', 'fetchFile', 'fetchFolder']),
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
        },
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
    .breadcrumbs {
        display: flex;
        // Before Bracket
        > *:not(:first-child)::before {
            content: "\F105";
            font-family: "Font Awesome 5 Pro";
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
            padding: 0 8px 0 2px;
        }
    }
    
</style>
