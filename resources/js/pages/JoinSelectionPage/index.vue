<template>
    <PageLoader
        :status="status"
        loadingMsg="loading selection"
        errorMsg="error loading selection"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <JoinSelectionPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageLoader from '../../components/common/PageLoader'
import JoinSelectionPage from './JoinSelectionPage'

export default {
    name: 'joinSelectionPageLoader',
    components: {
        PageLoader,
        JoinSelectionPage,
    },
    data: function() {
        return {
            status: 'loading',
        }
    },
    computed: {
        ...mapGetters('auth', {
            isAuthenticated: 'isAuthenticated',
        }),
        ...mapGetters('selections', {
            selectionId: 'getCurrentSelectionId',
        }),
        ...mapGetters('workspaces', {
            currentWorkspace: 'currentWorkspace',
        }),
    },
    methods: {
        ...mapActions('selections', ['fetchSelection', 'joinSelection']),
        ...mapActions('files', ['fetchFile']),
        ...mapActions('workspaces', ['fetchWorkspaces', 'setCurrentWorkspaceIndex']),
        async init() {
            await this.handleLink()
            this.status = 'success'
        },
        async handleLink() {
            console.log('loader handling link')
            // A. Check if the user is logged in
            if (this.isAuthenticated) {
                // A. 1. Check if the user has access to the selection
                let selection = await this.fetchSelection({ selectionId: this.selectionId })

                if (!selection || !selection.your_role) {
                    // If we didn't get any selection, join it.
                    const joinResponse = await this.joinSelection(this.selectionId)

                    // Check that we are on the workspace that the new selection belongs to
                    if (!this.currentWorkspace || this.currentWorkspace.id != joinResponse.workspace_id) {
                        const workspaces = await this.fetchWorkspaces()
                        console.log('workspaces', workspaces, joinResponse, joinResponse.workspace_id)
                        const newWorkspaceIndex = workspaces.findIndex(x => x.id == joinResponse.workspace_id)
                        await this.setCurrentWorkspaceIndex(newWorkspaceIndex)
                    }

                    // Fetch workspaces again to check if we have been added to a new one

                    // Now fetch the selection again
                    selection = await this.fetchSelection({ selectionId: this.selectionId })
                }

                // Navigate to the selection
                let routeName = 'selection'
                // If the file has a video, then navigate to the video
                const file = await this.fetchFile(selection.file_id)
                if (file.video_count > 0) {
                    routeName = 'watchVideoPresentation'
                }

                console.log('route change from loader')
                this.$router.push({
                    name: routeName,
                    params: { fileId: selection.file_id, selectionId: this.selectionId },
                })
                return
            }

            // The user is not authenticated do nothing.
            // The user will be shown the join selection page
            console.log('done handling link')
        },
    },
    created() {
        console.log('loader created')
        this.init()
    },
}
</script>

<style></style>
