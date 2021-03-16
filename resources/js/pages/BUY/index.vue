<template>
    <div class="root-buy" :class="[{ 'full-screen': $route.meta.isFullscreen }]">
        <RootLoader v-if="isLoading" />
        <template v-else>
            <template v-if="!$route.meta.isFullscreen">
                <TheSidebar />
                <TheNavbar />
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
import TheNavbar from './TheNavbar'
import TheImageLightbox from '../../components/layout/TheImageLightbox'
import TheSnackbarSpawner from '../../components/layout/TheSnackbarSpawner'
import RootLoader from '../../components/common/RootLoader'
import { mapGetters } from 'vuex'
export default {
    name: 'BUYRoot',
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
.root-buy {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    overflow: hidden;
    &:not(.full-screen) {
        display: grid;
        grid-template-columns: 80px auto;
        grid-template-rows: 60px auto;
        grid-template-areas:
            'sidebar navbar'
            'sidebar main';
        @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
            only screen and (-o-min-device-pixel-ratio: 13/10),
            only screen and (min-resolution: 120dpi) {
            .app {
                grid-template-columns: 200px auto;
            }
        }
        @media screen and (max-width: $screenSm) {
            grid-template-columns: 52px auto;
            grid-template-rows: 52px auto;
        }
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
        grid-area: main;
    }
}
</style>
