<template>
    <nav class="navbar" style="height: 70px;">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <NavbarFiles v-if="$route.name == 'files'"/>
        <NavbarSelection v-if="$route.name == 'selection' && currentFile"/>
        <NavbarEditFile v-if="$route.name == 'editFile' && currentFile"/>
        <NavbarTeams v-if="$route.name == 'teams'"/>
        <NavbarUsers v-if="$route.name == 'users'"/>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'
import NavbarFile from './NavbarFile'
import NavbarFiles from './NavbarFiles'
import NavbarTeam from './NavbarTeam'
import NavbarEditFile from './NavbarEditFile'
import ModalCreateTeam from './ModalCreateTeam'
import Team from '../store/models/Team'

export default {
    name: "navbar",
    components: {
        Modal,
        ModalCreateTeam,
        NavbarFile,
        NavbarFiles,
        NavbarTeam,
        NavbarEditFile,
    },
    computed: {
        ...mapGetters('files', ['currentFile'])
    },
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
    > * {
        width: 100%;
    }
}

</style>
