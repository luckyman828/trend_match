<template>
    <TheSidebar>
        <template slot="top">
            <SidebarItem label="Find" :to="{ name: 'play.find' }" iconClass="fas fa-search" />
        </template>
    </TheSidebar>
</template>

<script>
import TheSidebar from '../../components/layout/TheSidebar'
import SidebarItem from '../../components/layout/SidebarItem'

export default {
    name: 'Play.Sidebar',
    components: {
        TheSidebar,
        SidebarItem,
    },
}
</script>

<style lang="scss" scoped></style>
