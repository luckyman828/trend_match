<template>
    <div class="collection">
        <h1>Files AD</h1>
        <div class="underline"></div>
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
        <FilesTable :authUser="authUser" :files="userFiles" :selected="selected" @onSelect="onSelect"/>
    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import Loader from '../Loader'
import FilesTable from '../FilesTable'
import RadioButtons from '../RadioButtons'
import CheckboxButtons from '../input/CheckboxButtons'
import Dropdown from '../Dropdown'

// import Team from '../../store/models/Team'
// import User from '../../store/models/User'
// import UserTeam from '../../store/models/UserTeam';
// import AuthUser from '../../store/models/AuthUser';

export default {
    name: 'collection',
    store,
    components: {
        Loader,
        FilesTable,
        Dropdown,
        CheckboxButtons,
        RadioButtons
    },
    data: function() { return {
        selected: [],
        itemFilterIds: [],
        // teamFilterId: '-1',
        loadingOverwrite: false,
        unsub: '',
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections', 'files']),
        ...mapGetters('persist', ['teamFilterId', 'currentTeam', 'currentWorkspaceId', 'userPermissionLevel', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
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
    },
    methods: {
        ...mapActions('persist', ['setTeamFilter']),
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        // initRequiresWorkspace() {
        //     if (Collection.all().length <= 0)
        //         this.fetchCollections(this.currentWorkspaceId)
        //     if (User.all().length <= 0)
        //         this.fetchUsers(this.currentWorkspaceId)
        // }
    },
    // created() {
    //     // If we already have a workspace id, fetch the data we are missing
    //     if (this.currentWorkspaceId != null)
    //         this.initRequiresWorkspace()
    //     // Else, wait till a workspace id is set, and then fetch the data
    //     this.unsub = this.$store.subscribe((mutation, state) => {
    //         if(mutation.type == 'persist/setCurrentWorkspace') {
    //             this.initRequiresWorkspace()
    //         } 
    //     })
    // },
    // destroyed() {
    //     this.unsub()
    // }

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
