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
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
        ...mapActions('selections', ['fetchSelection', 'joinSelection', 'fetchPublicSelectionInfo']),
        ...mapActions('files', ['fetchFile']),
        ...mapActions('workspaces', ['fetchWorkspaces', 'setCurrentWorkspaceIndex']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTION_ID']),
        ...mapMutations('auth', ['SET_BACKGROUND_IMAGE', 'SET_LOGO', 'SET_WORKSPACE_NAME']),
        async init() {
            await this.handleLink()
            this.status = 'success'
        },
        async handleLink() {
            const linkHash = this.$route.params.linkHash
            const selectionInfo = await this.fetchPublicSelectionInfo(linkHash)
            // await store.dispatch('selections/readSelectionLinkHash', this.$route.params.linkHash)
            this.SET_CURRENT_SELECTION_ID(selectionInfo.selection_id)
            let coverImage = selectionInfo.workspace_cover
            if (selectionInfo.video && selectionInfo.video.thumbnail) {
                coverImage = selectionInfo.video.thumbnail
            }
            if (coverImage) {
                this.SET_BACKGROUND_IMAGE(coverImage)
            }
            if (selectionInfo.workspace_logo) {
                this.SET_LOGO(selectionInfo.workspace_logo)
            }
            if (selectionInfo.workspace_name) {
                this.SET_WORKSPACE_NAME(selectionInfo.workspace_name)
            }

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
                        const newWorkspaceIndex = workspaces.findIndex(x => x.id == joinResponse.workspace_id)
                        await this.setCurrentWorkspaceIndex(newWorkspaceIndex)
                    }

                    // Fetch workspaces again to check if we have been added to a new one

                    // Now fetch the selection again
                    selection = await this.fetchSelection({ selectionId: this.selectionId })
                }

                // Navigate to the selection
                let routeName = 'selection'
                if (!!selectionInfo.video) {
                    routeName = 'watchVideoPresentation'
                }
                // // If the file has a video, then navigate to the video
                // const file = await this.fetchFile(selection.file_id)
                // if (file.video_count > 0) {
                // }

                this.$router.push({
                    name: routeName,
                    params: { fileId: selection.file_id, selectionId: this.selectionId },
                })
                return
            }

            // The user is not authenticated do nothing.
            // The user will be shown the join selection page
        },
    },
    created() {
        this.init()
    },
}
</script>

<style></style>
