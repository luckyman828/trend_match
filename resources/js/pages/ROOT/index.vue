<template>
    <div class="root-home" :class="[{ 'full-screen': $route.meta.isFullscreen }]" :style="backgroundStyle">
        <RootLoader v-if="isLoading" />
        <template v-else>
            <template v-if="!$route.meta.isFullscreen">
                <!-- <div class="navbar-wrapper">
                    <portal-target name="navbar" />
                </div> -->
                <div class="sidebar-wrapper">
                    <SidebarSelect v-if="currentApp && currentApp.name == 'select'" />
                    <SidebarBuy v-else-if="currentApp && currentApp.name == 'buy'" />
                </div>
            </template>
            <div class="main" id="main" ref="main" :class="{ 'hide-crisp': $route.meta.hideCrisp }">
                <div class="root-card">
                    <div class="inner">
                        <transition name="fade">
                            <router-view :key="$route.path"></router-view>
                        </transition>
                    </div>
                </div>
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
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace']),
        ...mapGetters('kollektApps', {
            currentApp: 'getCurrentApp',
        }),
        ...mapGetters('auth', ['getLoginBackgroundImage', 'getLoginLogo']),
        backgroundStyle() {
            return {
                backgroundImage: `url(${
                    this.currentWorkspace.cover_image
                        ? this.currentWorkspace.cover_image
                        : '/images/pexels-godisable-jacob-794064.jpg'
                })`,
            }
        },
        isLoading() {
            return !this.currentWorkspace //Check if we have a workspace
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root-home {
    background: #b08818;
    min-height: 100vh;
    position: relative;
    scroll-behavior: smooth;
    min-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    background-position: center;
    background-size: cover;
    &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(black, 0.7);
    }
    &:not(.full-screen) {
        display: grid;
        grid-template-columns: $sidebarWidth auto;
        grid-template-areas: 'sidebar main';
    }
    .main {
        grid-area: main;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;
        padding: 32px;
        width: 100%;
    }
    .sidebar-wrapper {
        grid-area: sidebar;
    }
    .navbar-wrapper {
        grid-area: navbar;
    }
    .root-card {
        height: 620px;
        min-width: 600px;
        background: white;
        z-index: 1;
        box-shadow: $shadowModule;
        border-radius: $borderRadiusModule;
        border: $borderModule;
        overflow: hidden;
        .inner {
            height: 100%;
            padding: 32px;
            overflow-y: auto;
        }
    }
}
</style>
