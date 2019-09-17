<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <div class="filters">
            <Dropdown class="dropdown-parent left">
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
                    <!-- <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span> -->
                </template>
                <template v-slot:body>
                    <CheckboxButtons :options="uniqueCollections" ref="filterSelect" v-model="itemFilterIds" @change="$refs.filterSelect.submit()"/>
                </template>
            </Dropdown>

            <Dropdown class="dropdown-parent right" ref="countryDropdown">
                <template v-slot:button="slotProps">
                    <div class="dropdown-button" @click="slotProps.toggle">
                        <img src="/assets/Path5699.svg">
                        <span v-if="currentTeamId > 0">{{teams.find(x => x.id == currentTeamId).title}}</span>
                        <span v-else-if="currentTeamId == 0">Global</span>
                        <span v-else>No team available</span>
                        <i class="far fa-chevron-down"></i>
                    </div>
                </template>
                <template v-slot:header="slotProps">
                    <span>Switch team</span>
                </template>
                <template v-slot:body>
                    <RadioButtons :options="teamsForFilter" :currentOptionId="currentTeamId" :optionNameKey="'title'" :optionValueKey="'id'" ref="countryRadio" @change="setCurrentTeam($event); $refs.countryDropdown.toggle()"/>
                </template>
            </Dropdown>
        </div>
        <FilesTable :isLoading="isLoading" :authUser="authUser" :files="userFiles" :loading="loadingCollections" :selected="selected" @onSelect="onSelect"/>
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

import Collection from '../../store/models/Collection'
import Team from '../../store/models/Team'
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam';
import AuthUser from '../../store/models/AuthUser';

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
        ...mapGetters('persist', ['currentTeamId', 'currentTeam', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'viewAdminPermissionLevel', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        collections () {
            return Collection.query().all()
        },
        userFiles() {
            const files = this.files
            let filesToReturn = []
            // Get the files the user has access to
            if (this.userPermissionLevel <= 2) {
                this.authUser.teams.forEach(team => {
                    team.teamFiles.forEach(file => {
                        if (file.role_level <= this.userPermissionLevel)
                            if (!filesToReturn.find(x => x.id == file.file_id))
                                filesToReturn.push(files.find(x => x.id == file.file_id))
                    })
                })
            }
            else {
                filesToReturn = this.collections
            }

            return filesToReturn
        },
        uniqueCollections() {
            const inputData = this.collections
            let uniqueData = []
            inputData.forEach(data => {
                const filterKey = data.title
                const found = (uniqueData.includes(filterKey))
                if (!found)
                    uniqueData.push(filterKey)
            })
            return uniqueData
        },
        users() {
            return User.query().with('teams').all()
        },
        // authUser() {
        //     // return this.$store.getters.authUser;
        //     return AuthUser.query().with('teams').with('workspaces').first()
        // },
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
        isLoading () {
            let loading = false
            if (!this.loadingOverwrite)
                if (this.loadingCollections || this.authUser == null)
                    loading = true
            return loading
        }
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        ...mapActions('persist', ['setCurrentTeam']),
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        initRequiresWorkspace() {
            if (Collection.all().length <= 0)
                this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                this.fetchUsers(this.currentWorkspaceId)
        }
    },
    created() {
        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
    },
    destroyed() {
        this.unsub()
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
