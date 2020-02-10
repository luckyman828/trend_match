<template>
    <nav class="navbar">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <NavbarFiles v-if="$route.name == 'files'"/>
        <NavbarSelection v-if="$route.name == 'selection' && currentFile"/>
        <NavbarEditFile v-if="$route.name == 'editFile'"/>
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

export default {
    name: "navbar",
    components: {
        NavbarSelection,
        NavbarFiles,
        NavbarTeams,
        NavbarUsers,
        NavbarEditFile,
    },
    computed: {
        ...mapGetters('persist', ['currentFile']),
        ...mapGetters('entities/products', ['products']),
        loadingProducts() {
            if (this.products) {
                if (this.products.length > 0)
                    return false
            }
        }
    },
    methods: {
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
    > * {
        width: 100%;
    }
}

</style>
