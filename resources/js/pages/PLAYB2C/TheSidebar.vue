<template>
    <TheSidebar>
        <template slot="top">
            <SidebarItem label="Find" :to="{ name: 'buy.home' }" iconClass="fas fa-search" />
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
