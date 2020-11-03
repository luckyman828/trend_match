<template>
    <PageLoader :status="status">
        <SettingsPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SettingsPage from './SettingsPage'
import PageLoader from '../../components/common/PageLoader'

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
        status() {
            return this.loading ? 'loading' : 'success'
        },
    },
    methods: {
        ...mapActions('workspaces', ['fetchWorkspace']),
        async initData() {
            this.isLoading = true
            // const workspace = await this.fetchWorkspace(this.currentWorkspace.id)
            this.isLoading = false
        },
    },
    created() {
        this.initData()
    },
}
</script>

<style scoped lang="scss"></style>
