<template>
  <Modal ref="modal">
        <template v-slot:header="slotProps">
            <h2 class="title">Add a new Team</h2>
            <span class="desc">We will create a new team as per your specifications</span>
        </template>
        <template v-slot:body="slotProps">
            <form @submit="createTeam({name: addTeamName, workspace_id: currentWorkspaceId}), close()">
                <label>
                    Team name
                    <input type="text" placeholder="My new team" ref="addTeamInput" v-model="addTeamName">
                </label>
                <input class="button dark xl" :class="{disabled: !addTeamValid}" type="submit" value="Create team">
            </form>
        </template>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'
import Team from '../store/models/Team'

export default {
    name: 'modalCreateTeam',
    data: function () { return {
        addTeamName: '',
    }},
    components: {
        Modal,
    },
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId']),
        addTeamValid () {
            if (this.teams == null || this.addTeamName.length < 2 || this.currentWorkspaceId == null)
                return false
                else
                    if (this.teams.find(x => x.title.toLowerCase() == this.addTeamName.toLowerCase()))
                        return false
            return true
        },
        teams () {
            return Team.all()
        }
    },
    methods: {
        ...mapActions('entities/teams', ['createTeam']),
        toggle() {
            this.$refs.modal.toggle()
        },
        close() {
            this.$refs.modal.close()
        },
        // createTeam() {
        //     this.createTeam(this.addTeamName, this.currentWorkspaceId)
        // }
    }
}
</script>

<style>

</style>