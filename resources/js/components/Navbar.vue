<template>
    <nav class="navbar">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <NavbarFiles v-if="$route.name == 'files'"/>
        <NavbarFile v-if="$route.name == 'file' && currentTask && !loadingProducts"/>
        <NavbarEditFile v-if="$route.name == 'editFile'"/>
        <NavbarTeams v-if="$route.name == 'teams'"/>
        <NavbarUsers v-if="$route.name == 'users'"/>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'
import NavbarFile from './NavbarFile'
import NavbarFiles from './NavbarFiles'
import NavbarTeams from './NavbarTeams'
import NavbarUsers from './NavbarUsers'
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
        NavbarTeams,
        NavbarUsers,
        NavbarEditFile,
    },
    computed: {
        ...mapGetters('persist', ['currentTask']),
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
