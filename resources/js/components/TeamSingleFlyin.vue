<template>
    <div class="team-single">
        <FlyinHeader :title="team.title" @closeFlyin="onClose" class="flyin-header" :next="nextTeamId" :prev="prevTeamId"
        @next="showNext" @prev="showPrev">
            <div class="item-group">
                <!-- <button class="invisible underline">{{team.subfiles.length}} Subfiles</button> -->
                <button class="invisible underline">{{team.users.length}} Users</button>
            </div>
            <div class="item-group">
                <button class="ghost icon-left light-2"><i class="far fa-pen"></i>Edit</button>
                <button class="square true-square light-2 more" style="margin-left: 16px"><i class="far fa-ellipsis-h medium"></i></button>
            </div>
            <!-- <div class="item-group">
                <button class="circle primary prev" :disabled="!prevTeamId" @click="showPrev"><i class="far fa-angle-left"></i></button>
                <button class="circle primary next" :disabled="!nextTeamId" @click="showNext"><i class="far fa-angle-right"></i></button>
            </div> -->
        </FlyinHeader>
        <div class="body">
            <FlexTable>
                <template v-slot:topBar>
                    <TableTopBar>
                        <template v-slot:left>
                            <button class="primary">Example</button>
                        </template>
                        <template v-slot:right>
                            <span>{{selected.length}} selected</span>
                            <span>{{team.users.length}} records</span>
                        </template>
                    </TableTopBar>
                </template>
                <template v-slot:header>
                    <TableHeader class="select"><Checkbox/></TableHeader>
                    <TableHeader :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</TableHeader>
                    <TableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</TableHeader>
                    <TableHeader :sortKey="'role_id'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Role</TableHeader>
                    <TableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Currency</TableHeader>
                    <TableHeader class="action">Action</TableHeader>
                </template>
                <template v-slot:body>
                    <TeamSingleFlyinUsersTableRow v-for="(user, index) in team.users" :key="user.id" :user="user" :index="index"/>
                </template>
            </FlexTable>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import TeamSingleFlyinUsersTableRow from './TeamSingleFlyinUsersTableRow'
import sortArray from '../mixins/sortArray'

export default {
    name: 'teamSingleFlyin',
    components: {
        TeamSingleFlyinUsersTableRow,
    },
    props: [
        'team'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
    }},
    computed: {
        ...mapGetters('entities/teams', ['nextTeamId', 'prevTeamId']),
    },
    methods: {
        ...mapMutations('entities/teams', ['setCurrentTeamId']),
        onClose() {
            this.$emit('closeFlyin')
        },
        showNext() {
            if (this.nextTeamId)
                this.setCurrentTeamId(this.nextTeamId)
        },
        showPrev() {
            if (this.prevTeamId)
                this.setCurrentTeamId(this.prevTeamId)
        },
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(this.team.users, this.sortAsc, this.sortKey)
        }
    }
}
</script>

<style scoped lang="scss">

</style>