<template>
    <div class="root-play-b2c" :class="[{ 'full-screen': $route.meta.isFullscreen }]">
        <PlaySidebar v-if="!$route.meta.isFullscreen" />
        <div class="main">
            <transition name="fade">
                <router-view :key="$route.path"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import PlaySidebar from './TheSidebar'

export default {
    name: 'PLAYB2CRoot',
    components: { PlaySidebar },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root-play-b2c {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    height: 100vh;
    background: $bg;
    position: relative;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-areas: 'sidebar main';
    .main {
        grid-area: main;
        padding: 32px 60px;
    }
    &.full-screen {
        display: block;
        max-height: 100vh;
        overflow: hidden;
        .main {
            padding: 0;
        }
    }
}
</style>
