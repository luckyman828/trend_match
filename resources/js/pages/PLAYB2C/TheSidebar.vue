<template>
    <div class="play-sidebar flex-list flex-v">
        <div class="sidebar-item">
            <object key="the-logo" type="image/svg+xml" data="/images/kollekt-logo-play-animation (1).svg"></object>
        </div>
    </div>
</template>

<script>
export default {
    name: 'playSidebar',
    data() {
        return {
            logoTimeout: false,
        }
    },
    mounted() {
        setTimeout(() => {
            this.logoTimeout = true
        }, 3000)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.play-sidebar {
    background: white;
    width: 100%;
    height: 100%;
    grid-area: sidebar;
    box-shadow: $shadowModuleHard;
    border-radius: 0 24px 24px 0;
}
</style>
