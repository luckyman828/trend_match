<template>
  <BaseModal ref="modal" v-slot header="Add new Team"
  :show="show" @close="$emit('close')">
        <form @submit.prevent="onSubmit">
            <div class="form-element">
                <label for="new-team-name">Team name</label>
                <BaseInputField id="new-team-name" type="text" placeholder="New team" ref="teamNameInput" autocomplete="off" v-model="teamToCreate.title"/>
            </div>
            <button class="primary lg full-width" :disabled="teamToCreate.title.length < 1" type="submit"><span>Create team</span></button>
        </form>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'createTeamModal',
    props: [
        'show'
    ],
    data: function () { return {
        teamToCreate: {
            title: '',
            currency: null
        },
    }},
    watch: {
        show: function(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.$refs.teamNameInput.select()
                        this.$refs.teamNameInput.focus()
                    })
                })
            }
        }
    },
    methods: {
        ...mapActions('teams', ['insertOrUpdateTeam']),
        onSubmit() {
            this.insertOrUpdateTeam(this.teamToCreate).then(response => {
                this.$emit('close')
            })
            this.teamToCreate = {
                title: '',
                currency: null
            }
        },
    },
}
</script>

<style>

</style>