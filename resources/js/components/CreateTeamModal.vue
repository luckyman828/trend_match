<template>
  <BaseModal ref="modal" v-slot header="Add new Team">
        <form @submit.prevent="onSubmit">
            <div class="form-element">
                <label for="new-team-name">Team name</label>
                <BaseInputField id="new-team-name" type="text" placeholder="New team" ref="addTeamInput" autocomplete="off" v-model="teamToCreate.title"/>
            </div>
            <button class="primary lg full-width" :disabled="teamToCreate.title.length < 1" type="submit"><span>Create team</span></button>
        </form>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'createTeamModal',
    data: function () { return {
        teamToCreate: {
            title: ''
        },
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId']),
    },
    methods: {
        ...mapActions('entities/teams', ['insertOrUpdateTeam']),
        onSubmit() {
            this.insertOrUpdateTeam(this.teamToCreate)
            this.close()
        },
        show() {
            this.$refs.modal.show()
        },
        close() {
            this.$refs.modal.hide()
        },
    }
}
</script>

<style>

</style>