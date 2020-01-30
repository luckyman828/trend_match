<template>
    <ScreenLoader :loading="loading">
        <Subfile/>
    </ScreenLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Subfile from '../Subfile'
import ScreenLoader from './ScreenLoader'
import Collection from '../../../store/models/Collection'
import User from '../../../store/models/User'
import Product from '../../../store/models/Product'

export default {
    name: 'subfileLoader',
    components: {
        Subfile,
        ScreenLoader,
    },
    data: function () { return {
        loadingFile: true,
        loadingTasks: true,
        actionsProcessed: false,
        commentsProcessed: false,
        ndsProcessed: false,
    }},
    computed: {
        ...mapState('entities/products', ['productsStatic']),
        ...mapGetters('entities/products', ['products', 'loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/commentVotes', ['loadingCommentVotes']),
        ...mapGetters('entities/users', ['loadingUsers']),
        ...mapGetters('entities/collections', ['filesUpdated']),
        ...mapGetters('entities/tasks', ['userTasks']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId', 'authUser', 'currentTask']),
        loading () {
            return (this.products != null && !this.loadingFile && !this.loadingTasks && this.actionsProcessed && this.commentsProcessed && this.ndsProcessed) ? false : true
        },
        actionsReady() {
            if (!this.loadingProducts && !this.loadingTasks && !this.loadingActions && this.currentTask && this.ndsProcessed) {
                return true
            } else return false
        },
        commentsReady() {
            if (!this.loadingProducts && !this.loadingTasks && !this.loadingComments && this.currentTask && !this.loadingUsers && !this.loadingCommentVotes) {
                return true
            } else return false
        },
        currentTaskReady() {
            if (!this.loadingProducts && !this.loadingTasks && this.currentTask && !this.loadingUsers) {
                return true
            } else return false
        }
    },
    watch: {
        userTasks: function(newVal, oldVal) {
            if (newVal.length > oldVal) this.initRequiresTasks()
        },
        actionsReady: async function(newVal, oldVal) {
            // If the actions are ready, instantiate our products actions
            if (newVal == true) {
                await this.processActions()
                this.actionsProcessed = true
            }
        },
        commentsReady: async function(newVal, oldVal) {
            // If the comments are ready, instantiate our products comments
            if (newVal == true) {
                await this.processComments()
                this.commentsProcessed = true
            }
        },
        currentTaskReady: async function(newVal, oldVal) {
            // If the comments are ready, instantiate our products comments
            if (newVal == true) {
                await this.instantiateProductNDs()
                this.ndsProcessed = true
            }
        },
        currentTask: async function(newVal, oldVal) {
            if (oldVal && oldVal != newVal) {
                // If we have a new value, and we had an old value, recalculate our products
                await this.instantiateProductNDs()
                await this.processActions()
                await this.processComments()
            }
        },

    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapMutations('entities/collections', ['setFilesUpdated']),
        ...mapMutations('entities/subfiles', ['setCurrentSubfileId']),
        ...mapActions('entities/products', ['fetchProducts', 'updateActions', 'updateComments', 'instantiateProductNDs']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setCurrentFileId', 'setCurrentTaskId']),
        processActions() {
            // Instantiate our products actions
            const products = this.productsStatic
            // Loop through our products
            products.forEach(product => {
                this.updateActions(product.id, product)
            })
        },
        processComments() {
            // Instantiate our products comments
            const products = this.productsStatic
            // Loop through our products
            products.forEach(product => {
                this.updateComments(product.id, product)
            })
        },
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
            // END Set current task
            this.loadingTasks = false
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
        const routeSubfileId = this.$route.params.subfileId
        this.setCurrentSubfileId(routeSubfileId)

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