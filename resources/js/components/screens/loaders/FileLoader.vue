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
import Product from '../../../store/models/Product'

export default {
    name: 'fileLoader',
    components: {
        File,
        ScreenLoader
    },
    data: function () { return {
        loadingFile: true,
        loadingTasks: true,
    }},
    computed: {
        ...mapGetters('entities/products', ['products']),
        ...mapGetters('entities/tasks', ['userTasks']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId', 'authUser']),
        loading () {
            return (this.products != null && !this.loadingFile && !this.loadingTasks) ? false : true
        },
    },
    watch: {
        userTasks(newVal, oldVal) {
            if (newVal.length > 0) this.initRequiresTasks()
        }
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts', 'setCurrentProductId']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setCurrentFileId', 'setCurrentTaskId']),
        // ...mapActions('entities/teamProducts', ['fetchTeamProducts']),
        // ...mapActions('entities/phaseProducts', ['fetchPhaseProducts']),
        // ...mapActions('entities/taskActions', ['fetchTaskActions']),
        // ...mapActions('entities/requests', ['fetchRequests']),
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
                this.fetchCommentVotes(this.currentFileId)
                // this.fetchTeamProducts(this.currentFileId),
                // this.fetchPhaseProducts(this.currentFileId)
                // this.fetchTaskActions(this.currentFileId),
                // this.fetchRequests(this.currentFileId)
            )
            this.setCurrentProductId(Product.query().first().id)
            this.loadingFile = false
        },
        async initRequiresTasks() {
            // START Set current task
            let taskToSet = null
            this.userTasks.forEach(task => {
                // Set the task to the users first uncompleted task
                // First check if the user has any task that is ready to start
                // If true -> Set the current task to any ready task
                // If not -> Set the current task to any task the user has access to

                if (task.parents.length <= 0) {
                    if (task.completed.find(x => x.file_id == this.currentFileId))
                        taskToSet = task
                } else {
                    let parentsCompleted = true
                    task.parents.forEach(parent => {
                        if (!parent.completed.find(x => x.file_id == this.currentFileId))
                            parentsCompleted = false
                    })
                    if (parentsCompleted) taskToSet = task
                    else {
                        // If we have no active task
                        if (!taskToSet) {
                            // If we don't already have set a task
                            taskToSet = task
                        }
                    }
                }

                if (task.parents.length > 0) {
                    task.parents.forEach(parent => {
                        if (parent.completed.length > 0) taskToSet = task
                    })
                } else taskToSet = task

            })
            if (taskToSet != null) {
                await this.setCurrentTaskId(taskToSet.id)
            }
            this.loadingTasks = false
            // END Set current task
        }
    },
    created() {
        // Save a reference to the currently loaded file in the store, so we know if we need to refetch the products
        const routeFileId = this.$route.params.catalogueId
        if (this.currentFileId != routeFileId) {
            this.setCurrentFileId(routeFileId)
            this.initRequiresFileId()
        } else {
            this.loadingFile = false
        }

        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsubWorkspace = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })

        if (this.userTasks != null) this.initRequiresTasks()
        else this.loadingTasks = false

    },
    destroyed() {
        this.unsubWorkspace()
        this.unsubTasks()
    }
}
</script>

<style scoped lang="scss">

</style>