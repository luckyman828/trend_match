<template>
    <Modal ref="modal">
        <template v-slot:header="slotProps" v-if="selectedTeam != null">
            <h2 class="title">Invite people to <strong>{{selectedTeam.title}}</strong></h2>
            <span class="desc">We'll send an invite via <strong>e-mail</strong> they need to accept</span>
        </template>
        <template v-slot:body="slotProps" v-if="selectedTeam != null">
            <form @submit="submitInvite">
                <label class="team dropdown-parent">
                    <input type="text" name="team" :value="selectedTeam.title" disabled>
                    <span class="square"><i class="fas fa-check"></i></span>

                    <Dropdown class="right dark">
                        <template v-slot:button="slotProps">
                            <span @click="slotProps.toggle" class="open-dropdown" :class="{active: !slotProps.collapsed}">Change team<i class="far fa-chevron-down"></i></span>
                        </template>
                        <template v-slot:header="slotProps">
                            <span>{{teams.length}} teams</span>
                            <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                        </template>
                        <template v-slot:body>
                            <RadioButtons :options="teams" :currentOptionId="selectedTeamId" ref="teamRadio" v-model="selectedTeamId"/>
                        </template>
                        <template v-slot:footer="slotProps">
                            <div class="grid-2">
                                <span class="button green" @click="$refs.teamRadio.submit(); slotProps.toggle()">Save</span>
                                <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                            </div>
                        </template>
                    </Dropdown>


                </label>
                <label>
                    Email
                    <input type="email" name="email" id="invite-email" placeholder="example@mail.com" v-model="newUser.email">
                </label>
                <label>
                    Name (optional)
                    <input type="text" name="name" id="invite-name" placeholder="Optional" v-model="newUser.name">
                </label>
                <input type="submit" class="button dark xl" value="Add email" :disabled="submitDisabled">
            </form>
        </template>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import Modal from './Modal'

export default {
    name: 'modalInviteToTeam',
    props: [
        'team',
        'users',
        'authUser',
        'teams',
    ],
    components: {
        Dropdown,
        RadioButtons,
        Modal
    },
    data: function () { return {
        newUser: {
            email: '',
            name: ''
        },
        selectedTeamId: null,
        showTeamDropdown: false,
    }},
    computed: {
        submitDisabled () {
            if (this.newUser.email.length > 7)
                return false
            else return true
        },
        selectedTeam() {
            return this.teams.find(x => x.id == this.selectedTeamId)
        }
    },
    watch: {
        team: function (newTeam) {
            if (newTeam) this.selectedTeamId = newTeam.id
        }
    },
    methods: {
        ...mapActions('entities/userTeams', ['inviteUserToTeam']),
        toggle() {
            this.$refs.modal.toggle()
        },
        close() {
            this.$refs.modal.close()
        },
        submitInvite(e) {
            e.preventDefault()
            this.inviteUserToTeam({user: this.newUser, team: this.selectedTeam, authUser: this.authUser})
            this.close()
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    label {
        &.team {
            position: relative;
            .square {
                position: absolute;
                left: 8px;
                top: 8px;
                background: $primary;
                color: white;
                height: 24px;
                width: 24px;
                text-align: center;
                i {
                    font-size: 10px;
                    line-height: 24px;
                }
            }
        }
    }
    .open-dropdown {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 500;
        color: $dark2;
        &.active {
            color: $dark;
        }
        &:hover {
            color: $dark1;
        }
        i {
            margin-left: 8px;
        }
    }

</style>