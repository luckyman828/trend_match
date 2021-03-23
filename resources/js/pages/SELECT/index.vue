<template>
    <div class="root-select" :class="[{ 'full-screen': $route.meta.isFullscreen }]">
        <RootLoader v-if="isLoading" />
        <template v-else>
            <template v-if="!$route.meta.isFullscreen">
                <TheNavbar />
                <TheSidebar />
            </template>
            <div class="main" id="main" ref="main" :class="{ 'hide-crisp': $route.meta.hideCrisp }">
                <transition name="fade">
                    <router-view :key="$route.path"></router-view>
                </transition>
            </div>
            <TheImageLightbox v-if="getLightboxIsVisible" />
            <TheSnackbarSpawner />
            <TheChangelogModal v-if="getShowChangelog" />
        </template>
    </div>
</template>

<script>
import TheSidebar from './TheSidebar'
import TheNavbar from '../../components/layout/TheNavbar'
import TheImageLightbox from '../../components/layout/TheImageLightbox'
import TheSnackbarSpawner from '../../components/layout/TheSnackbarSpawner'
import RootLoader from '../../components/common/RootLoader'
import { mapGetters } from 'vuex'
export default {
    name: 'SELECTRoot',
    components: {
        TheSidebar,
        TheNavbar,
        TheImageLightbox,
        TheSnackbarSpawner,
        RootLoader,
        TheChangelogModal: () => import('../../components/layout/TheChangelogModal/index'),
    },
    computed: {
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace', 'currentWorkspaceIndex']),
        ...mapGetters('lightbox', ['getLightboxIsVisible']),
        ...mapGetters('changelog', ['getShowChangelog']),
        isLoading() {
            return !this.currentWorkspace //Check if we have a workspace
        },
    },
    watch: {
        $route(to, from) {
            // Reset main window scroll on navigation
            if (this.$refs.main) {
                this.$refs.main.scrollTo(0, 0)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root-select {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    overflow: hidden;
    &:not(.full-screen) {
        display: grid;
        grid-template-columns: $sidebarWidth auto;
        grid-template-rows: $navbarHeight auto;
        grid-template-areas:
            'sidebar navbar'
            'sidebar main';

        .main {
            max-height: calc(100vh - #{$navbarHeight});
            overflow-y: scroll;
            overflow-x: auto;
        }
    }
    .main {
        background: $bg;
        position: relative;
        height: 100%;
    }
}
</style>
