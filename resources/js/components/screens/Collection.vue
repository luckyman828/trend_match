<template>
    <div class="collection">
        <div class="breadcrumbs">
            <button @click="setCurrentFolder(null)" class="invisible white-hover icon-left"><i class="far fa-building"></i> {{currentWorkspace.name}}</button>
            <div class="breadcrumb" v-for="(folder, index) in path" :key="folder.id">
                <template v-if="folder.id != currentFolderId">
                    <button @click="setCurrentFolder(folder, index)" class="invisible white-hover icon-left">
                        <i class="far fa-folder"></i>
                        {{folder.title}}
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
                <template v-else>
                    <button class="invisible white-hover icon-left">
                        <i class="far fa-folder-open"></i>
                        {{folder.title}}
                        <!-- <i class="fas fa-caret-down contextual-menu-icon"></i> -->
                    </button>
                </template>
            </div>
        </div>
        <div class="filters">
            <!-- <Dropdown class="dropdown-parent left">
                <template v-slot:button="slotProps">
                    <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                        <span>Collection</span>
                        <i class="far fa-chevron-down"></i>
                        <span v-if="itemFilterIds.length > 0" class="bubble">
                            {{itemFilterIds.length}}
                        </span>
                    </div>
                    <span v-if="itemFilterIds.length > 0" class="clear button invisible primary" @click="$refs.filterSelect.clear()">Clear filter</span>
                </template>
                <template v-slot:header="slotProps">
                    <span>Filter by collection</span>
                </template>
                <template v-slot:body>
                    <CheckboxButtons :options="uniqueCollections" ref="filterSelect" v-model="itemFilterIds" @change="$refs.filterSelect.submit()"/>
                </template>
            </Dropdown> -->

            <div class="right">
                <!-- <Dropdown class="dropdown-parent right" ref="taskDropdown">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button" @click="slotProps.toggle">
                            <span v-if="currentTask">{{currentTask.title}}</span>
                            <span v-else>No task</span>
                            <i class="far fa-chevron-down"></i>
                        </div>
                    </template>
                    <template v-slot:header="slotProps">
                        <span>Switch task</span>
                    </template>
                    <template v-slot:body>
                        <RadioButtons :options="userTasks" :currentOptionId="currentTask.id" :optionNameKey="'title'" :optionValueKey="'id'" @change="setCurrentTaskId($event); $refs.taskDropdown.toggle()"/>
                    </template>
                </Dropdown> -->
            
                <!-- <Dropdown class="dropdown-parent right" ref="countryDropdown">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button" @click="slotProps.toggle">
                            <img src="/assets/Path5699.svg">
                            <span v-if="teamFilterId > 0">{{teams.find(x => x.id == teamFilterId).title}}</span>
                            <span v-else-if="teamFilterId == 0">Global</span>
                            <span v-else>No team available</span>
                            <i class="far fa-chevron-down"></i>
                        </div>
                    </template>
                    <template v-slot:header="slotProps">
                        <span>Switch team</span>
                    </template>
                    <template v-slot:body>
                        <RadioButtons :options="teamsForFilter" :currentOptionId="teamFilterId" :optionNameKey="'title'" :optionValueKey="'id'" ref="countryRadio" @change="setTeamFilter($event); $refs.countryDropdown.toggle()"/>
                    </template>
                </Dropdown> -->
            </div>
        </div>
        <FoldersTable v-if="currentFolder" :folder="currentFolder" :selected="selected" 
        @setCurrentFolder="setCurrentFolder" @onSelect="onSelect" @showSingleFile="showSingleFile"
        @showFileOwnersFlyin="showFileOwnersFlyin"/>

        <FileSingle :file="currentFile" :show="fileSingleVisible" @close="fileSingleVisible = false"
        @showFileOwnersFlyin="showFileOwnersFlyin"/>

        <FlyIn ref="fileOwnersFlyin" :visibleOverwrite="fileOwnersFlyinVisible" @close="fileOwnersFlyinVisible = false">
            <template v-slot:header>
                <FlyinHeader v-if="fileOwnersFlyinVisible" :title="currentFile.title" disableNavigation=true @close="fileOwnersFlyinVisible = false"/>
            </template>
            <template v-slot>
                <FileOwnersTable v-if="fileOwnersFlyinVisible" :file="currentFile"/>
            </template>
        </FlyIn>

    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FoldersTable from '../FoldersTable'
import FileSingle from '../FileSingle'
import Folder from '../../store/models/Folder'
import FileOwnersTable from '../FileOwnersTable'

export default {
    name: 'collection',
    store,
    components: {
        FoldersTable,
        FileSingle,
        FileOwnersTable,
    },
    data: function() { return {
        selected: [],
        itemFilterIds: [],
        // teamFilterId: '-1',
        loadingOverwrite: false,
        unsub: '',
        currentFolderId: null,
        path: [],
        currentFolder: {id: null, title: null, folders: [], files: []},
        currentFile: null,
        fileSingleVisible: false,
        fileOwnersFlyinVisible: false,
    }},
    watch: {
        folders(newVal, oldVal) {
            console.log('folders changed')
            // Refresh the current folder if a change is detected
            if (this.currentFolderId) {
                this.currentFolder = this.folders.find(x => x.id == this.currentFolderId)
            } else {
                this.currentFolder = this.rootFolder
            }
        }
        
    },
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections', 'files']),
        // ...mapGetters('entities/collections', ['loadingCollections', 'files', 'currentFile']),
        ...mapGetters('entities/folders', ['loadingFolders', 'folders']),
        ...mapGetters('persist', ['teamFilterId', 'currentTeam', 'currentWorkspace', 'currentWorkspaceId', 'userPermissionLevel', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        userFolders() {
            return this.folders
        },
        userFiles() {
            const files = this.files
            let filesToReturn = []
            // Get the files the user has access to
            if (this.userPermissionLevel <= 2) {
                this.authUser.teams.forEach(team => {
                    team.teamFiles.forEach(teamFile => {
                        if (teamFile.role_level <= this.userPermissionLevel) {
                            if (files.find(x => x.id == teamFile.file_id)) {
                                if (!filesToReturn.find(x => x.id == teamFile.file_id))
                                    filesToReturn.push(files.find(x => x.id == teamFile.file_id))
                            }
                        }
                        
                    })
                })
            }
            else {
                filesToReturn = this.files
            }

            return filesToReturn
        },
        uniqueCollections() {
            const inputData = this.files
            let uniqueData = []
            inputData.forEach(data => {
                const filterKey = data.title
                const found = (uniqueData.includes(filterKey))
                if (!found)
                    uniqueData.push(filterKey)
            })
            return uniqueData
        },
        teams () {
            return this.$store.getters['entities/teams/teams']
        },
        teamsForFilter() {
            if (this.userPermissionLevel >= 3) {
                const teamsToReturn = JSON.parse(JSON.stringify(this.teams))
                teamsToReturn.unshift({title: 'Global', id: 0})
                return teamsToReturn
            }
            else return this.teams
        },
        rootFolder() {
            // Find all folders and files of the root folder
            // Find folders in root
            const rootFolders = this.folders.filter(x => !x.parent_id)
            // Find files in root
            const rootFiles = this.files.filter(x => !x.folder_id)
            // Instantioate a rootfolder object
            return {files: rootFiles, folders: rootFolders}
        }
    },
    methods: {
        ...mapActions('persist', ['setTeamFilter', 'setCurrentFileId']),
        ...mapMutations('entities/collections', ['setAvailableFileIds']),
        ...mapMutations('persist', ['setCurrentFolderId']),
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        showSingleFile(file) {
            // Set the current file id
            // this.setCurrentFileId(fileId)
            this.currentFile =file
            // Set available files (for navigation) to the currently visible files
            this.setAvailableFileIds(this.currentFolder.files.map(x => x.id))
            // Show the flyin
            this.fileSingleVisible = true
        },
        showFileOwnersFlyin(file) {
            // Set the current file id
            this.currentFile = file
            this.fileOwnersFlyinVisible = true
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        setCurrentFolder(folder, pathIndex) {
            if (folder != null) {
                // Remove folders after the new folder from the current path
                if (pathIndex != null) {
                    this.path.splice(pathIndex)
                }
                // Store what folder we are in now, so we know the path
                this.path.push(folder)
                // Set the current folder to the new id
                this.currentFolderId = folder.id
                this.currentFolder = this.folders.find(x => x.id == this.currentFolderId)
                // Set current folder in store
                this.setCurrentFolderId(folder.id)
            } else {
                // Reset the folder and path
                this.path = []
                this.currentFolderId = null
                this.currentFolder = this.rootFolder
                // Set current folder in store
                this.setCurrentFolderId(null)
                
            }
        },
    },
    created() {
        // If we have no folder id we are the ROOT folder
        if(this.currentFolderId == null) {
            this.currentFolder = this.rootFolder
        } else {
            this.currentFolder = this.folders.find(x => x.id == this.currentFolderId)
        }
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
