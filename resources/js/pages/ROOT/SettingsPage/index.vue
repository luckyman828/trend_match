<template>
    <PageLoader :status="status">
        <SettingsPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SettingsPage from './SettingsPage'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'filesLoader',
    components: {
        PageLoader,
        SettingsPage,
    },
    data: function() {
        return {
            isLoading: true,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('users', ['getUsersStatus']),
        status() {
            return this.isLoading ? 'loading' : 'success'
        },
    },
    watch: {
        currentWorkspace(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                this.initData(true)
            }
        },
    },
    methods: {
        ...mapActions('workspaces', ['fetchWorkspace']),
        ...mapActions('users', ['fetchUsers']),
        async initData(forceRefresh) {
            this.isLoading = true
            const workspace = await this.fetchWorkspace(this.currentWorkspace.id)
            if (forceRefresh || (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading')) {
                await this.fetchUsers()
            }
            this.isLoading = false
        },
    },
    created() {
        this.initData()
    },
}
</script>

<style scoped lang="scss"></style>
