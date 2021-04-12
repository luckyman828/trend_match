<template>
    <v-popover trigger="click" class="sidebar-item sidebar-space-logo-wrapper" placement="right">
        <div class="sidebar-space-logo" v-hover="{ over: () => (hasHover = true), leave: () => (hasHover = false) }">
            <BaseImageSizer class="sizer" aspect="1:1" fit="contain">
                <img :src="currentAppLogo" />
            </BaseImageSizer>
        </div>
        <AppSelectorPopover slot="popover" />
    </v-popover>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AppSelectorPopover from '../AppSelectorPopover/'
export default {
    name: 'theSidebarAppLogo',
    components: { AppSelectorPopover },
    data() {
        return {
            hasHover: false,
        }
    },
    computed: {
        ...mapGetters('kollektApps', {
            allApps: 'getApps',
            currentApp: 'getCurrentApp',
        }),
        currentAppLogo() {
            if (!this.currentApp) return
            const spaceLogo = this.currentApp.logo
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
