<template>
    <v-popover trigger="click" class="sidebar-item sidebar-space-logo-wrapper" placement="right">
        <div class="sidebar-space-logo">
            <BaseImageSizer class="sizer" aspect="1:1" fit="contain">
                <img :src="currentSpace.logo" />
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
    computed: {
        ...mapGetters('kollektSpaces', {
            allSpaces: 'getSpaces',
            currentSpace: 'getCurrentSpace',
        }),
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
