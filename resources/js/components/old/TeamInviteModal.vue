<template>
  <div class="invite-to-team card modal">
      <span class="circle" @click="closeModal"><i class="fal fa-times"></i></span>
      <h2>Invite people to <strong>{{theTeam.title}}</strong></h2>
      <p class="info">We'll send an invite via <strong>e-mail</strong> they need to accept</p>
      <form @submit="submitInvite">
          <label class="team dropdown-parent">
            <input type="text" name="team" :value="theTeam.title" disabled>
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
                    <RadioButtons :options="teams" :currentOptionId="theTeamId" ref="teamRadio" v-model="theTeamId"/>
                </template>
                <template v-slot:footer="slotProps">
                    <div class="grid-2">
                        <span class="button green" @click="$refs.teamRadio.submit(); slotProps.toggle()">Save</span>
                        <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                    </div>
                </template>
            </Dropdown>


          </label>
          <label class="dropdown-parent">
              Email
              <input type="email" name="email" id="invite-email" placeholder="example@mail.com" v-model="newUser.email">

              <Dropdown class="right dark">
                <template v-slot:button="slotProps">
                    <span @click="slotProps.toggle" class="open-dropdown" :class="{active: !slotProps.collapsed}">Change team<i class="far fa-chevron-down"></i></span>
                </template>
                <template v-slot:header="slotProps">
                    <span>{{teams.length}} teams</span>
                    <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                </template>
                <template v-slot:body>
                    <RadioButtons :options="teams" :currentOptionId="theTeamId" ref="teamRadio" v-model="theTeamId"/>
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
              Name (optional)
              <input type="text" name="name" id="invite-name" placeholder="Optional" v-model="newUser.name">
          </label>
          <input type="submit" value="Add email" :disabled="submitDisabled">
      </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'

export default {
    name: 'teamInviteModal',
    props: [
        'team',
        'users',
        'authUser',
        'teams',
    ],
    components: {
        Dropdown,
        RadioButtons,
    },
    data: function () { return {
        newUser: {
            email: '',
            name: ''
        },
        theTeamId: this.team.id,
        showTeamDropdown: false,
    }},
    computed: {
        submitDisabled () {
            if (this.newUser.email.length > 7)
                return false
            else return true
        },
        theTeam() {
            return this.teams.find(x => x.id == this.theTeamId)
        }
    },
    methods: {
        ...mapActions('entities/userTeams', ['inviteUserToTeam']),
        closeModal() {
            this.$emit('onCloseModal')
        },
        submitInvite(e) {
            e.preventDefault()
            this.inviteUserToTeam({user: this.newUser, team: this.theTeam, authUser: this.authUser})
            this.closeModal()
        },
        // toggleTeamDropdrown() {
        //     this.showTeamDropdown = !this.showTeamDropdown;
        // },
        // setTeam(id) {
        //     this.theTeamId = this.teams.find(x => x.id == id)
        // },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .invite-to-team {
        display: block;
        position: fixed;
        z-index: 120;
        left: 50%;
        top: 5vh;
        height: 70vh;
        transform: translateX(-50%);
        width: 100%;
        max-width: 646px;
        margin: 0;
        background: $light;
    }
    label.team {
        position: relative;
    }
    .circle {
        position: absolute;
        right: 8px;
        top: 8px;
        height: 40px;
        width: 40px;
        display: block;
        text-align: center;
        background: $light2;
        border-radius: 20px;
        transition: .3s;
        cursor: pointer;
        color: $dark05;
        i {
            font-size: 21px;
            line-height: 40px;
        }
        &:hover {
            color: $red;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
        }
    }
    h2 {
        font-size: 24px;
        font-weight: 400;
        text-align: center;
        margin-top: 20px;
        strong {
            font-weight: 500;
        }
    }
    p {
        &.info {
            font-size: 16px;
            color: $dark2;
            text-align: center;
        }
    }
    form {
        width: 100%;
        max-width: 400px;
        display: block;
        margin: auto;
    }
    label {
        font-size: 12px;
        font-weight: 500;
        color: $dark05;
        display: block;
        width: 100%;
        margin-bottom: 12px;
        &.team {
            position: relative;
            background: $light1;
            margin-bottom: 68px;
            margin-top: 40px;
            border-radius: 4px;
            input {
                background: transparent;
                border: none;
                padding-left: 40px;
            }
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
    input {
        display: block;
        width: 100%;
        border: solid 1px $light1;
        border-radius: 4px;
        height: 40px;
        box-sizing: border-box;
        padding: 0 12px;
        line-height: 40px;
        font-size: 14px;
        background: white;
        &::placeholder {
            color: $light2;
        }
        &[type=submit] {
            height: 50px;
            line-height: 50px;
            background: $primary;
            color: white;
            font-weight: 500;
            margin-top: 20px;
            cursor: pointer;
            &:disabled {
                background: rgba($dark05, .5);
                pointer-events: none;
                cursor: auto;
            }
        }
    }
    .open-dropdown {
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: $dark2;
        font-weight: 700;
        position: absolute;
        &.active {
            color: $dark05;
        }
        i {
            margin-left: 8px;
        }
        &:hover {
            color: $dark05;
        }
    }

</style>