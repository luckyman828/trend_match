<template>
    <PageLoader>
        <div class="system-admin-page">
            <h2>Well met commander</h2>
            <div class="form-wrapper">
                <div class="form-section">
                    <h3>Enter the secret system admin page</h3>
                    <p><i>Tread softly for your steps carry the weight of the world.</i></p>
                </div>

                <div class="form-section">
                    <h4>What would you like to do today?</h4>
                    <button class="primary" @click="showNewWorkspaceModal = true">
                        <i class="far fa-building"></i>
                        <span>Create workspace</span>
                    </button>
                </div>
            </div>
        </div>

        <NewWorkspaceModal :show="showNewWorkspaceModal" @close="showNewWorkspaceModal = false" />
    </PageLoader>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLoader from '../../components/common/PageLoader'
import NewWorkspaceModal from './NewWorkspaceModal'

export default {
    name: 'systemAdminPage',
    components: {
        PageLoader,
        NewWorkspaceModal,
    },
    data: function() {
        return {
            showNewWorkspaceModal: false,
        }
    },
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
    },
    created() {
        if (!this.isSystemAdmin) this.$router.push({ name: 'files' })
    },
}
</script>

<style></style>
