<template>
    <div class="root-play-b2c" :class="[{ 'full-screen': $route.meta.isFullscreen }]">
        <transition name="fade">
            <router-view :key="$route.path"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'PLAYB2CRoot',
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.root-play-b2c {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    max-height: 100vh;
    height: 100vh;
    overflow: hidden;
    background: $bg;
    position: relative;
}
</style>
