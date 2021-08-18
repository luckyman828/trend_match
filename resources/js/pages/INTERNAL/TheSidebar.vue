<template>
    <TheSidebar>
        <template v-slot:top>
            <!-- <SidebarItem label="Files" :to="{ name: 'files' }" iconClass="fas fa-folder" /> -->
        </template>
        <template v-slot:bottom> </template>
    </TheSidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import TheSidebar from '../../components/layout/TheSidebar'
import SidebarItem from '../../components/layout/SidebarItem'

export default {
    name: 'Internal.Sidebar',
    components: {
        TheSidebar,
        SidebarItem,
    },
}
</script>

<style lang="scss" scoped></style>
