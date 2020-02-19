<template>
    <div class="files-page">
        <div class="breadcrumbs">
            <button @click="setCurrentFolder(null)" class="invisible white-hover">
                <i class="far fa-building"></i><span>{{currentWorkspace.title}}</span>
            </button>
            <div class="breadcrumb" v-for="(folder, index) in path" :key="folder.id">
                <template v-if="folder.id != currentFolderId">
                    <button @click="setCurrentFolder(folder, index)" class="invisible white-hover icon-left">
                        <i class="far fa-folder"></i>
                        <span>{{folder.title}}</span>
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
                <template v-else>
                    <button class="invisible white-hover icon-left">
                        <i class="far fa-folder-open"></i>
                        <span>{{folder.title}}</span>
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
            </div>
        </div>

        <FilesTable :files="files" :folder="currentFolder" :selected="selected" 
        @setCurrentFolder="setCurrentFolder" @showSingleFile="showSingleFile"
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
import Folder from '../../store/models/Folder'
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
        currentFolderId: null,
        path: [],
        fileFlyinVisible: false,
        fileOwnersFlyinVisible: false,
        fileApproversFlyinVisible: false,
    }},
    watch: {
        // folders(newVal, oldVal) {
        //     console.log('folders changed')
        //     // Refresh the current folder if a change is detected
        //     if (this.currentFolderId) {
        //         this.currentFolder = this.folders.find(x => x.id == this.currentFolderId)
        //     } else {
        //         this.currentFolder = this.rootFolder
        //     }
        // }
        
    },
    computed: {
        ...mapGetters('files', ['files', 'currentFile']),
        ...mapGetters('folders', ['currentFolder']),
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
        ...mapActions('files', ['setCurrentFile']),
        ...mapMutations('files', ['setAvailableFileIds']),
        ...mapMutations('folders', ['setCurrentFolderId']),
        showSingleFile(file) {
            // Set the current file id
            this.setCurrentFile(file)
            // Set available files (for navigation) to the currently visible files
            this.setAvailableFileIds(this.currentFolder.files.map(x => x.id))
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
        setCurrentFolder(folder, pathIndex) {
            // if (folder != null) {
            //     // Remove folders after the new folder from the current path
            //     if (pathIndex != null) {
            //         this.path.splice(pathIndex)
            //     }
            //     // Store what folder we are in now, so we know the path
            //     this.path.push(folder)
            //     // Set the current folder to the new id
            //     this.currentFolderId = folder.id
            //     this.currentFolder = this.folders.find(x => x.id == this.currentFolderId)
            //     // Set current folder in store
            //     this.setCurrentFolderId(folder.id)
            // } else {
            //     // Reset the folder and path
            //     this.path = []
            //     this.currentFolderId = null
            //     this.currentFolder = this.rootFolder
            //     // Set current folder in store
            //     this.setCurrentFolderId(null)
                
            // }
        },
    },

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
