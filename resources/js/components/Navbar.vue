<template>
    <nav class="navbar" style="height: 70px;">
        <!-- <div class="logo-wrapper">
            <router-link to="/collection" class="navbar-brand">
                <img src="/images/kollekt-logo-color-1.svg" />
            </router-link>
        </div> -->
        <template v-if="$route.name == 'file' && currentTask && !loadingProducts">
            <NavbarFile/>
        </template>
        <template v-if="$route.name == 'teams'">
            <NavbarTeam/>
        </template>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Modal from './Modal'
import NavbarFile from './NavbarFile'
import NavbarTeam from './NavbarTeam'
import ModalCreateTeam from './ModalCreateTeam'
import Team from '../store/models/Team'

export default {
    name: "navbar",
    components: {
        Modal,
        ModalCreateTeam,
        NavbarFile,
        NavbarTeam,
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
