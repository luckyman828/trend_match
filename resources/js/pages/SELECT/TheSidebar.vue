<template>
    <TheSidebar>
        <template v-slot:top>
            <SidebarItem label="Files" :to="{ name: 'files' }" iconClass="fas fa-folder" />
            <SidebarItem
                v-if="workspaceRole == 'Admin'"
                label="Teams"
                :to="{ name: 'teams' }"
                iconClass="fas fa-users"
            />
            <SidebarItem label="Users" :to="{ name: 'users' }" iconClass="fas fa-user" />
        </template>
        <template v-slot:bottom>
            <v-popover placement="right" v-if="jobs.length > 0" trigger="click" popoverClass="auto-width">
                <SidebarItem>
                    <div
                        class="pill count xs"
                        :class="jobStatus == 'success' ? 'green' : jobStatus == 'failed' ? 'yellow' : ''"
                    >
                        <span>{{ remainingSyncCount > 0 ? remainingSyncCount : 'Done' }}</span>
                    </div>
                </SidebarItem>
                <ImageSyncPopover slot="popover" />
            </v-popover>
        </template>
    </TheSidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import TheSidebar from '../../components/layout/TheSidebar'
import SidebarItem from '../../components/layout/SidebarItem'
import ImageSyncPopover from '../../components/common/ImageSyncPopover/'

export default {
    name: 'Select.Sidebar',
    components: {
        TheSidebar,
        SidebarItem,
        ImageSyncPopover,
    },
    computed: {
        ...mapGetters('backgroundJobs', {
            jobs: 'getImageSyncJobs',
            jobStatus: 'getImageSyncJobStatus',
            remainingSyncCount: 'getRemainingImageSyncCount',
        }),
        ...mapGetters('workspaces', {
            workspaceRole: 'authUserWorkspaceRole',
        }),
    },
}
</script>

<style lang="scss" scoped></style>
