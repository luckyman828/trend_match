<template>
    <nav class="navbar" style="height: 70px;">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <div class="flex-wrapper">
            <div class="items-left">

                <template v-if="$route.name == 'collection'">
                    <!-- <router-link :to="{name: 'collection'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Brand</span></router-link> -->
                </template>
                <template v-if="$route.name == 'catalogue'">
                    <router-link :to="{name: 'collection'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Collections</span></router-link>
                    <div class="breadcrumbs">
                        <router-link class="text-link" :to="{name: 'collection'}">Collections</router-link>
                        <span class="current"><strong>{{(currentFile != null) ? currentFile.title : 'Fetching..'}}</strong></span>
                    </div>
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
        ...mapGetters('persist', ['userPermissionLevel', 'adminPermissionLevel', 'currentFile']),
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
    grid-area: navbar;
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
    .items-left {
        display: flex;
        align-items: center;
    }
    .back-link {
        padding-right: 28px;
        border-right: solid 2px $light2;
        margin-right: 28px;
        .circle {
            margin-right: 8px;
        }
    }
    .breadcrumbs {
        display: flex;
        > * {
            display: inline-flex;
            align-items: center;
        }
        > *:not(:first-child)::before {
            content: '';
            pointer-events: none;
            color: $dark1;
            margin-left: 8px;
            margin-right: 10px;
            margin-bottom: 2px;
            font-size: 10px;
            font-family: "Font Awesome 5 Pro";
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        > *:last-child::before {
            content: '';
        }
    }
}

</style>
