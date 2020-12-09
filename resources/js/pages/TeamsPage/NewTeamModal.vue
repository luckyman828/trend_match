<template>
    <BaseModal :show="show" @close="$emit('close')" classes="sm">
        <div class="form-wrapper">
            <h3>Create new team</h3>
            <div class="form-element">
                <label>Team name</label>
                <BaseInputField
                    v-model="teamName"
                    placeholder="New team name. Finish with ENTER"
                    :focusOnMount="true"
                    :selectOnFocus="true"
                    @submit="onSubmit"
                >
                    <button class="circle primary" @click="onSubmit">
                        <i class="far fa-arrow-right"></i>
                    </button>
                </BaseInputField>
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'newTeamModal',
    props: ['show'],
    data: function() {
        return {
            teamName: '',
        }
    },
    methods: {
        ...mapActions('teams', ['insertOrUpdateTeam']),
        async onSubmit() {
            const newTeam = await this.onNewTeam()
            this.$emit('close')
        },
        async onNewTeam() {
            const newTeam = {
                title: this.teamName.length > 0 ? this.teamName : 'New team',
            }
            await this.insertOrUpdateTeam(newTeam)
            this.teamName = ''
        },
    },
}
</script>

<style></style>
