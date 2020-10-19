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
            status: 'success',
        }
    },
    computed: {
        ...mapGetters('auth', {
            isAuthenticated: 'isAuthenticated',
            authUser: 'authUser',
        }),
        workspaceId() {
            return this.$route.params.workspaceId
        },
        fileId() {
            return this.$route.params.fileId
        },
        selectionId() {
            return this.$route.params.selectionId
        },
    },
    methods: {
        ...mapActions('selections', ['fetchSelection']),
        fetchData() {},
        async joinSelection() {
            // A. Check if the user is logged in
            if (this.isAuthenticated) {
                // A. 1. Check if the user has access to the selection
                const selection = await this.fetchSelection({ selectionId: this.selectionId })
                if (selection) {
                    // If we have the selection, then we have access to it and will simply direct there
                    this.$router.push({
                        name: 'selection',
                        params: { fileId: this.fileId, selectionId: this.selectionId },
                    })
                    return
                }

                // Call API to let the user join
                // if the user does not have access to the selection, send an API requst to have the user join
                this.joinSelectionViaLink()
            }

            // The user is not authenticated. Let the user create a user
        },
        joinSelectionViaLink() {
            console.log('JOIN VIA LINK')
        },
    },
    created() {
        this.joinSelection()
    },
}
</script>

<style></style>
