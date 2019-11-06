<template>
    <ScreenLoader :loading="loading">
        <File/>
    </ScreenLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
        ...mapGetters('entities/collections', ['filesUpdated']),
        ...mapGetters('entities/tasks', ['userTasks']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId', 'authUser']),
        loading () {
            return (this.products != null && !this.loadingFile && !this.loadingTasks) ? false : true
        },
    },
    watch: {
        userTasks(newVal, oldVal) {
            if (newVal.length > oldVal) this.initRequiresTasks()
        }
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapMutations('entities/collections', ['setFilesUpdated']),
        ...mapActions('entities/products', ['fetchProducts', 'setCurrentProductId']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setCurrentFileId', 'setCurrentTaskId']),
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
                this.setFilesUpdated(false)
            )
            this.loadingFile = false
        },
        async initRequiresTasks() {
            console.log('FileLoader: Init Requires Tasks')
            // START Set current task
            let taskToSet = null
            this.userTasks.forEach(task => {

                if (task.parents.length <= 0) {
                    // If the task has no parents
                    if (!task.completed.find(x => x.file_id == this.currentFileId))
                        // If the task is not completed
                        taskToSet = task
                } else {
                    // If the task has parents
                    let parentsCompleted = true
                    task.parents.forEach(parent => {
                        // Loop through the tasks parents
                        if (!parent.completed.find(x => x.file_id == this.currentFileId)) {
                            // If the task is not completed
                            parentsCompleted = false
                        }
                    })
                    if (parentsCompleted) taskToSet = task
                }
                // If we have no active task
                if (!taskToSet) {
                    // If we don't already have set a task
                    taskToSet = task
                }

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
        const routeFileId = this.$route.params.fileId
        if (this.currentFileId != routeFileId || this.filesUpdated) {
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


        // this.$store.subscribe((mutation, state) => {
        //     console.log(mutation)
        // })

    },
    destroyed() {
        this.unsubWorkspace()
    }
}
</script>

<style scoped lang="scss">

</style>