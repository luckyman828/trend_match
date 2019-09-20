<template>
    <ScreenLoader :loading="loading">
        <File/>
    </ScreenLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import File from '../Catalogue'
import ScreenLoader from './ScreenLoader'
import Collection from '../../../store/models/Collection'
import User from '../../../store/models/User'

export default {
    name: 'fileLoader',
    components: {
        File,
        ScreenLoader
    },
    data: function () { return {
        loadingFile: true,
    }},
    computed: {
        ...mapGetters('entities/products', ['products']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId']),
        loading () {
            return (this.products != null && !this.loadingFile) ? false : true
        },
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setCurrentFileId']),
        ...mapActions('entities/teamProducts', ['fetchTeamProducts']),
        ...mapActions('entities/phaseProducts', ['fetchPhaseProducts']),
        async initRequiresWorkspace() {
            if (Collection.all().length <= 0)
                await this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                await this.fetchUsers(this.currentWorkspaceId)
        },
        async initRequiresFileId() {
            await (
                this.fetchProducts(this.currentFileId),
                this.fetchActions(this.currentFileId),
                this.fetchComments(this.currentFileId),
                this.fetchCommentVotes(this.currentFileId),
                this.fetchTeamProducts(this.currentFileId),
                this.fetchPhaseProducts(this.currentFileId)
            )
            this.loadingFile = false
        }
    },
    created() {
        // Save a reference to the currently loaded file in the store, so we know if we need to refetch the products
        const routeFileId = this.$route.params.catalogueId
        if (this.currentFileId != routeFileId)
            this.setCurrentFileId(routeFileId),
            this.initRequiresFileId()

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