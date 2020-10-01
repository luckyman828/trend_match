<template>
    <nav class="navbar">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <NavbarFiles v-if="$route.name == 'files'"/>
        <NavbarSelection v-if="$route.name == 'selection' && currentFile"/>
        <NavbarEditFile v-if="$route.name == 'editFile' && currentFile"/>
        <NavbarEditVideoPresentation v-if="$route.name == 'editVideoPresentation' && currentFile"/>
        <NavbarTeams v-if="$route.name == 'teams'"/>
        <NavbarUsers v-if="$route.name == 'users'"/>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NavbarSelection from '../../pages/SelectionPage/Navbar'
import NavbarFiles from '../../pages/FilesPage/Navbar'
import NavbarTeams from '../../pages/TeamsPage/Navbar'
import NavbarUsers from '../../pages/UsersPage/Navbar'
import NavbarEditFile from '../../pages/EditFilePage/Navbar'
import NavbarEditVideoPresentation from '../../pages/EditVideoPresentationPage/Navbar'

export default {
    name: "navbar",
    components: {
        NavbarSelection,
        NavbarFiles,
        NavbarTeams,
        NavbarUsers,
        NavbarEditFile,
        NavbarEditVideoPresentation,
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
    padding: 8px 60px;
    background: $bgModule;
    border-bottom: $borderModule;
    box-shadow: $shadowModule;
    @media screen and (max-width: $screenSm) {
        padding: 8px 20px;
    }
    > * {
        width: 100%;
    }
}

</style>
