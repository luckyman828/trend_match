<template>
    <div class="selection-page">
        <!-- Access denied -->
        <template v-if="!selection.your_role">
            <p>You don't have access to this selection</p>
            <div class="admin-action-list flex-list" v-if="authUserWorkspaceRole == 'Admin'">
                <button class="primary ghost" @click="onJoinSelection('Owner')">
                    <i class="far fa-user-shield"></i>
                    <span>Join as Owner</span>
                </button>
                <button class="primary ghost" @click="onJoinSelection('Member')">
                    <i class="far fa-user-plus"></i>
                    <span>Join as Member</span>
                </button>
            </div>

            <template v-if="getIsSystemAdmin">
                <h3>System Admin: View as</h3>
                <div class="admin-action-list flex-list">
                    <button class="primary ghost" @click="onViewSelectionAsRole('Owner')">
                        <i class="far fa-user-shield"></i>
                        <span>View as Owner</span>
                    </button>
                    <button class="primary ghost" @click="onViewSelectionAsRole('Member')">
                        <i class="far fa-user"></i>
                        <span>View as Member</span>
                    </button>
                    <button
                        class="primary ghost"
                        v-if="selection.type == 'Master'"
                        @click="onViewSelectionAsRole('Approver')"
                    >
                        <i class="far fa-user-clock"></i>
                        <span>View as Approver</span>
                    </button>
                </div>
            </template>
        </template>

        <!-- Access granted -->

        <ProductsTable
            ref="productsComponent"
            :file="currentFile"
            :products="productsFiltered"
            :selection="selection"
            :currentAction="currentAction"
            @updateAction="onUpdateAction"
        />

        <ProductFlyin
            :show="singleVisible"
            :selection="selection"
            :currentAction="currentAction"
            @close="setSingleVisisble(false)"
            @updateAction="onUpdateAction"
        />

        <ScannerModeControls />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import ProductFlyin from './ProductFlyin'
import ScannerModeControls from './ScannerModeControls'

export default {
    name: 'selectionPage',
    components: {
        ProductsTable,
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
        ...mapGetters('selectionProducts', {
            products: 'getProducts',
            getActiveSelectionInput: 'getActiveSelectionInput',
        }),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', [
            'currentSelection',
            'getCurrentSelections',
            'currentSelectionMode',
            'currentSelectionModeAction',
            'selections',
            'getCurrentSelectionRealRole',
        ]),
        ...mapGetters('auth', ['authUser', 'getAuthUserToken', 'getIsSystemAdmin']),
        ...mapGetters('scanner', ['getScannerModeActive']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        selection() {
            return this.currentSelection
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        // Get the action according to the current type of selection access
        currentAction() {
            return this.currentSelectionModeAction
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble', 'SET_ACTIONS', 'SET_FEEDBACKS', 'SET_PRODUCTS_COMPLETED']),
        ...mapMutations('comments', ['INSERT_OR_UPDATE_COMMENT', 'DELETE_COMMENT']),
        ...mapMutations('requests', [
            'INSERT_OR_UPDATE_REQUEST',
            'DELETE_REQUEST',
            'INSERT_OR_UPDATE_REQUEST_COMMENT',
            'DELETE_REQUEST_COMMENT',
        ]),
        ...mapActions('actions', ['initActions', 'insertOrUpdateActions', 'updateActions', 'updateFeedbacks']),
        ...mapActions('requests', ['initRequests', 'insertOrUpdateRequest']),
        ...mapActions('comments', ['initComments']),
        ...mapActions('selections', ['addUsersToSelection']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTION_REAL_ROLE']),
        onViewSelectionAsRole(role) {
            this.SET_CURRENT_SELECTION_REAL_ROLE(this.selection.your_role)
            this.selection.your_role = role
        },
        async onJoinSelection(role) {
            const user = JSON.parse(JSON.stringify(this.authUser))
            user.role = role
            await this.addUsersToSelection({ selection: this.selection, users: [user], ignoreRole: false })
            this.$router.go()
        },
        onUpdateAction(action, selectionInput) {
            if (this.currentSelectionMode == 'Feedback') {
                const selectionFeedback = selectionInput.yourSelectionFeedback
                const newAction = selectionFeedback.action == action ? 'None' : action
                this.updateFeedbacks({ actions: [selectionFeedback], newAction })
            }
            if (this.currentSelectionMode == 'Alignment') {
                const selectionAction = selectionInput.selectionAction
                const newAction = selectionAction.action == action ? 'None' : action
                this.updateActions({ actions: [selectionAction], newAction })
            }
        },

        async commentArrivedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentArrived", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                await this.initComments([comment])
                this.INSERT_OR_UPDATE_COMMENT({ selectionInput: this.getActiveSelectionInput(product), comment })
            }
        },
        commentDeletedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentDeleted", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                this.DELETE_COMMENT({ selectionInput: this.getActiveSelectionInput(product), comment })
            }
        },
        bulkAlignmentArrivedHandler(selectionId, alignments) {
            if (alignments[0].user_id != this.authUser.id) {
                this.SET_ACTIONS(alignments)
            }
        },
        alignmentArrivedHandler(selectionId, alignment) {
            if (alignment.user_id != this.authUser.id) {
                this.SET_ACTIONS([alignment])
            }
        },

        async connectToLiveUpdates() {
            const connection = this.$connection

            // Subscribe to our selections
            this.currentSelections.forEach(selection => {
                connection.invoke('Subscribe', selection.id).catch(function(err) {
                    return console.error(err.toString())
                })
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
        if (this.getCurrentSelectionRealRole) this.onViewSelectionAsRole(this.getCurrentSelectionRealRole)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
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
