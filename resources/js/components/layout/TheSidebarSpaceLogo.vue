<template>
    <v-popover trigger="click" class="sidebar-item sidebar-space-logo-wrapper" placement="right">
        <div class="sidebar-space-logo" v-hover="{ over: () => (hasHover = true), leave: () => (hasHover = false) }">
            <BaseImageSizer class="sizer" aspect="1:1" fit="contain">
                <img :src="currentSpaceLogo" />
            </BaseImageSizer>
        </div>
        <div class="space-selector space-list flex-list flex-v" slot="popover">
            <SpaceListItem v-for="(space, index) in allSpaces" :key="index" :space="space" />
        </div>
    </v-popover>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SpaceListItem from './SpaceListItem'
export default {
    name: 'theSidebarSpaceLogo',
    components: { SpaceListItem },
    data() {
        return {
            hasHover: false,
        }
    },
    computed: {
        ...mapGetters('kollektSpaces', {
            allSpaces: 'getSpaces',
            currentSpace: 'getCurrentSpace',
        }),
        currentSpaceLogo() {
            if (!this.currentSpace) return
            const spaceLogo = this.currentSpace.logo
            return this.hasHover ? spaceLogo.whiteOnColor : spaceLogo.white
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar-item.sidebar-space-logo-wrapper {
    cursor: pointer;
    display: block;
}
.sidebar-space-logo {
    .sizer {
        width: 100%;
    }
}
.space-list {
    padding: 6px;
}
</style>
