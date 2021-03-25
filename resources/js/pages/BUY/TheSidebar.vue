<template>
    <TheSidebar>
        <template slot="top">
            <SidebarItem label="Files" :to="{ name: 'buy.files' }" iconClass="fas fa-folder" />
            <SidebarItem label="Users" :to="{ name: 'buy.users' }" iconClass="fas fa-user" />
        </template>
    </TheSidebar>
</template>

<script>
import TheSidebar from '../../components/layout/TheSidebar'
import SidebarItem from '../../components/layout/SidebarItem'

export default {
    name: 'Buy.Sidebar',
    components: {
        TheSidebar,
        SidebarItem,
    },
}
</script>

<style lang="scss" scoped></style>
