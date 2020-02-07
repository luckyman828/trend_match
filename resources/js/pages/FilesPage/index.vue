<template>
    <PageLoader :loading="loading">
        <FilesPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FilesPage from './FilesPage'
import PageLoader from '../../components/common/PageLoader'

import Collection from '../../store/models/Collection'
import User from '../../store/models/User'

export default {
    name: 'filesLoader',
    components: {
        FilesPage,
        PageLoader
    },
    data: function () { return {
        loadingInit: true,
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections', 'files']),
        ...mapGetters('entities/subfiles', ['loadingSubfiles']),
        ...mapGetters('persist', ['currentWorkspaceId']),
        loading () {
            return (this.loadingCollections || this.files == null || this.loadingInit || this.loadingSubfiles) ? true : false
        }
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/users', ['fetchUsers']),
        async initRequiresWorkspace() {
            // if (Collection.all().length <= 0)
                // await this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                await this.fetchUsers(this.currentWorkspaceId)
            this.loadingInit = false
        }
    },
    created() {
        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
    },
    destroyed() {
        this.unsub()
    }
}
</script>

<style scoped lang="scss">

</style>