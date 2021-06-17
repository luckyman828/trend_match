<template>
    <TheSidebar>
        <template slot="top">
            <SidebarItem label="Find" :to="{ name: 'play.find' }" iconClass="fas fa-folder" />
            <SidebarItem label="Users" :to="{ name: 'play.users' }" iconClass="fas fa-user" />
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
