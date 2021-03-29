<template>
    <div class="root" :class="[{ 'full-screen': $route.meta.isFullscreen }]">
        <RootLoader v-if="isLoading" />
        <template v-else>
            <template v-if="!$route.meta.isFullscreen">
                <div class="navbar-wrapper">
                    <portal-target name="navbar" />
                </div>
                <div class="sidebar-wrapper">
                    <SidebarSelect v-if="currentSpace && currentSpace.name == 'select'" />
                    <SidebarBuy v-else-if="currentSpace && currentSpace.name == 'buy'" />
                    <TheSidebar v-else type="min" />
                </div>
            </template>
            <div class="main" id="main" ref="main" :class="{ 'hide-crisp': $route.meta.hideCrisp }">
                <transition name="fade">
                    <router-view :key="$route.path"></router-view>
                </transition>
            </div>
            <TheSnackbarSpawner />
        </template>
    </div>
</template>

<script>
import TheSidebar from '../../components/layout/TheSidebar'
import TheSnackbarSpawner from '../../components/layout/TheSnackbarSpawner'
import RootLoader from '../../components/common/RootLoader'
import SidebarSelect from '../SELECT/TheSidebar'
import SidebarBuy from '../BUY/TheSidebar'
import { mapGetters } from 'vuex'
export default {
    name: 'ROOT',
    components: {
        TheSidebar,
        TheSnackbarSpawner,
        RootLoader,
        SidebarSelect,
        SidebarBuy,
    },
    computed: {
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace', 'currentWorkspaceIndex']),
        ...mapGetters('kollektSpaces', {
            currentSpace: 'getCurrentSpace',
        }),
        isLoading() {
            return !this.currentWorkspace //Check if we have a workspace
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root {
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
    .sidebar-wrapper {
        grid-area: sidebar;
        height: 100%;
    }
    .navbar-wrapper {
        grid-area: navbar;
    }
    .main {
        grid-area: main;
        background: $bg;
        position: relative;
        height: 100%;
    }
}
</style>
