<template>
    <div class="selection-page">
        <!-- Access denied -->
        <template v-if="!selection.your_job || selection.your_job == 'None'">
            <p>You don't have access to this selection</p>
            <div class="admin-action-list flex-list" v-if="authUserWorkspaceRole == 'Admin'">
                <button class="primary ghost" @click="onJoinSelection('Feedback')">
                    <i class="far fa-user-shield"></i>
                    <span>Join Feedback</span>
                </button>
                <button class="primary ghost" @click="onJoinSelection('Alignment')">
                    <i class="far fa-user-plus"></i>
                    <span>Join Alignment</span>
                </button>
                <button v-if="selection.type == 'Master'" class="primary ghost" @click="onJoinSelection('Approval')">
                    <i class="far fa-user-plus"></i>
                    <span>Join Approval</span>
                </button>
            </div>

            <template v-if="getIsSystemAdmin">
                <h3>System Admin: View as</h3>
                <div class="admin-action-list flex-list">
                    <button class="primary ghost" @click="onViewSelectionAsJob('Alignment')">
                        <i class="far fa-user-shield"></i>
                        <span>View as Alignment</span>
                    </button>
                    <button class="primary ghost" @click="onViewSelectionAsJob('Feedback')">
                        <i class="far fa-user"></i>
                        <span>View as Feedback</span>
                    </button>
                    <button
                        class="primary ghost"
                        v-if="selection.type == 'Master'"
                        @click="onViewSelectionAsJob('Approval')"
                    >
                        <i class="far fa-user-clock"></i>
                        <span>View as Approval</span>
                    </button>
                </div>
            </template>
        </template>

        <!-- Access granted -->
        <template v-else>
            <ProductTable ref="productsComponent" :file="currentFile" :selection="selection" />

            <ProductFlyin :show="singleVisible" :selection="selection" @close="setSingleVisisble(false)" />
        </template>
        <ScannerModeControls />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Import Components
import ProductTable from './ProductTable/'
import ProductFlyin from './ProductFlyin'
import ScannerModeControls from './ScannerModeControls'

export default {
    name: 'selectionPage',
    components: {
        ProductTable,
        ProductFlyin,
        ScannerModeControls,
    },
    data: function() {
        return {
            hideQuickOut: false,
            hideQuickIn: false,
        }
    },
    computed: {
        ...mapGetters('products', ['productsFiltered', 'singleVisible']),
        ...mapGetters('products', {
            products: 'getProducts',
        }),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            currentSelectionRealJob: 'getCurrentSelectionRealJob',
        }),
        ...mapGetters('auth', ['authUser', 'getIsSystemAdmin']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble', 'SET_ALIGNMENTS']),
        ...mapMutations('comments', ['INSERT_OR_UPDATE_COMMENT', 'DELETE_COMMENT']),
        ...mapActions('actions', ['initActions', 'insertOrUpdateActions', 'updateActions', 'updateFeedbacks']),
        ...mapActions('comments', ['initComments']),
        ...mapActions('selections', ['addUsersToSelection']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTION_REAL_JOB']),
        onViewSelectionAsJob(job) {
            this.SET_CURRENT_SELECTION_REAL_JOB(this.selection.your_job)
            this.selection.your_job = job
        },
        async onJoinSelection(job) {
            const user = JSON.parse(JSON.stringify(this.authUser))
            user.job = job
            user.role = 'Member'
            await this.addUsersToSelection({ selection: this.selection, users: [user], ignoreRole: false })
            this.$router.go()
        },

        async commentArrivedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentArrived", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                await this.initComments([comment])
                this.INSERT_OR_UPDATE_COMMENT({ product, comment })
            }
        },
        commentDeletedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentDeleted", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                this.DELETE_COMMENT({ product, comment })
            }
        },
        bulkAlignmentArrivedHandler(selectionId, alignments) {
            if (alignments[0].user_id != this.authUser.id) {
                this.SET_ALIGNMENTS(alignments)
            }
        },
        alignmentArrivedHandler(selectionId, alignment) {
            if (alignment.user_id != this.authUser.id) {
                this.SET_ALIGNMENTS([alignment])
            }
        },

        async connectToLiveUpdates() {
            const connection = this.$connection

            // Subscribe to our selection
            connection.invoke('Subscribe', this.selection.id).catch(function(err) {
                return console.error(err.toString())
            })

            // Comments
            connection.on('OnCommentArrived', this.commentArrivedHandler)
            connection.on('OnCommentDeleted', this.commentDeletedHandler)

            // Alignment
            connection.on('OnBulkAlignmentArrived', this.bulkAlignmentArrivedHandler)
            connection.on('OnAlignmentArrived', this.alignmentArrivedHandler)
        },
        disconnectSignalR() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')

            // Comments
            connection.off('OnCommentArrived', this.commentArrivedHandler)
            connection.off('OnCommentDeleted', this.commentDeletedHandler)

            // Alignment
            connection.off('OnBulkAlignmentArrived', this.bulkAlignmentArrivedHandler)
            connection.off('OnAlignmentArrived', this.alignmentArrivedHandler)
        },
    },
    created() {
        // LIVE UPDATE
        this.connectToLiveUpdates()
    },
    destroyed() {
        this.disconnectSignalR()
        if (this.currentSelectionRealRole) this.onViewSelectionAsJob(this.currentSelectionRealJob)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.selection-page {
    padding-top: 8px;
}
.quick-actions {
    border-bottom: $borderDivider;
    padding-bottom: 16px;
    margin-bottom: 16px;
    p {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
    }
    .button {
        &:not(:last-child) {
            margin-right: 12px;
        }
    }
}
</style>
