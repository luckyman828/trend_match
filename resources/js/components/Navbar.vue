<template>
    <nav class="navbar" style="height: 70px;">
        <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div>
        <div class="flex-wrapper">
            <div class="items-left">

                <template v-if="$route.name == 'catalogue'">

                </template>


            </div>
            <div class="items-right">

                <template v-if="$route.name == 'teams' && userPermissionLevel >= adminPermissionLevel">
                    <span class="button wide primary" @click="$refs.createTeamModal.toggle()">Add team</span>
                </template>

            </div>

        </div>
        <ModalCreateTeam ref="createTeamModal"/>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'
import ModalCreateTeam from './ModalCreateTeam'
import Team from '../store/models/Team'

export default {
    name: "navbar",
    data: function () { return {
        addTeamName: '',
    }},
    components: {
        Modal,
        ModalCreateTeam
    },
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'adminPermissionLevel', 'actionScope', 'actionScopeName']),
        addTeamValid () {
            if (this.teams.length <= 0)
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
        consoleLog(msg) {
            console.log(msg)
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

.navbar {
    background-color: white;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    align-items: center;
    display: flex;
    .logo-wrapper {
        min-width: $sidebarWidth;
        padding-left: 20px;
    }
    img {
        display: block;
        height: 100%;
    }
    .flex-wrapper {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
    }
}

</style>
