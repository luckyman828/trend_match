<template>
    <div class="subfile">
        <!-- <ThePageHeader :title="`${currentFile.name}: 
        ${!currentSelection.is_open ? '[Locked]' : ''} ${currentSelection.name || 'Untitled Selection'
        }${currentSelections.length > 1 ? ' + '+ Math.abs(currentSelections.length -1) + ' more' : ''}: 
        ${currentSelectionMode || 'Access Denied'}`"/> -->

        <h1>
            {{ currentFile.name }}: {{ !currentSelection.is_open ? '[Locked]' : '' }}
            {{ currentSelection.name || 'Untitled Selection' }}
            {{ currentSelections.length > 1 ? ' + ' + Math.abs(currentSelections.length - 1) + ' more' : '' }}:
            {{ currentSelectionMode || 'Access Denied' }}
        </h1>

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
        <template v-else>
            <div class="video-presentation" style="margin-bottom: 32px" v-if="currentFile.video_count > 0">
                <p><strong>This file has a video presentation</strong></p>
                <router-link
                    class="button primary md"
                    :to="{
                        name: 'watchVideoPresentation',
                        params: { fileId: currentFile.id, selectionId: currentSelection.id },
                    }"
                >
                    <i class="far fa-presentation"></i>
                    <span>Watch video presentation</span>
                </router-link>
            </div>

            <div
                class="quick-actions"
                v-if="
                    currentSelectionMode == 'Alignment' &&
                        currentSelections.length <= 1 &&
                        (productsNoOutNoComment.length > 0 || productsNoIn.length > 0)
                "
            >
                <p>Quick actions</p>
                <button
                    v-if="productsNoOutNoComment.length > 0"
                    class="green-hover md ghost"
                    @click="InNoOutNoCommentStyles()"
                    style="margin-right: 8px;"
                >
                    <span>'IN' styles with no OUT & no Comments ({{ productsNoOutNoComment.length }})</span>
                </button>
                <button
                    v-if="productsNoIn.length > 0"
                    class="red-hover md ghost"
                    @click="OutNoInStyles()"
                    style="margin-right: 8px;"
                >
                    <span>'OUT' styles with no IN ({{ productsNoIn.length }})</span>
                </button>
                <!-- <button class="invisible ghost-hover md" @click="setHideQuickIn(); setHideQuickOut()">
                    <span>Hide quick actions</span><i class="far fa-times-circle"></i>
                </button> -->
            </div>

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
        </template>

        <BaseDialog
            ref="quickOutDialog"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, mark them OUT"
            cancelText="No, keep them as is"
        >
            <div class="icon-graphic">
                <i class="far fa-cube lg dark"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-times red lg"></i>
            </div>
            <h3>You are about to mark {{ productsNoIn.length }} products OUT</h3>
            <p>
                Noone has said IN for these products.
                <br />
                Be aware that not all users may have given their feedback yet.
            </p>
        </BaseDialog>

        <BaseDialog
            ref="quickInDialog"
            type="confirm"
            confirmColor="green"
            confirmText="Yes, mark them IN"
            cancelText="No, keep them as is"
        >
            <div class="icon-graphic">
                <i class="far fa-cube lg primary"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-heart dark lg"></i>
            </div>
            <h3>Mark {{ productsNoOutNoComment.length }} products IN</h3>
            <p>
                Noone has said OUT for these products and they have NO comments.
                <br />
                Be aware that not all users may have given their feedback yet.
                <br />
                Style with only FOCUS will NOT be marked as FOCUS.
            </p>
        </BaseDialog>

        <BaseDialog ref="presentationModeDialog">
            <div class="icon-graphic">
                <i class="far fa-file lg primary"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-presentation dark lg"></i>
            </div>
            <h3>The selection has entered Presentation Mode</h3>
            <p>To join the presentation login to the Kollekt mobile app.</p>
            <p><strong>You will now be redirected to the files overview</strong></p>
        </BaseDialog>

        <ScannerModeControls />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import ThePageHeader from '../../components/layout/ThePageHeader'
import ProductFlyin from './ProductFlyin'
import ScannerModeControls from './ScannerModeControls'

export default {
    name: 'selectionPage',
    components: {
        ProductsTable,
        ThePageHeader,
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
        ...mapGetters('products', ['getFilteredProducts', 'singleVisible']),
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
        productsFiltered() {
            return this.getFilteredProducts(this.products)
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        // Get the action according to the current type of selection access
        currentAction() {
            return this.currentSelectionModeAction
        },
        productsNoIn() {
            return this.products.filter(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                if (!selectionInput) return false
                return (
                    (!selectionInput[this.currentAction] || selectionInput[this.currentAction] == 'None') &&
                    selectionInput.ins.length <= 0 &&
                    selectionInput.focus.length <= 0 &&
                    selectionInput.alignmentIns.length <= 0 &&
                    selectionInput.alignmentFocus.length <= 0
                )
            })
        },
        productsNoOutNoComment() {
            return this.products.filter(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                if (!selectionInput) return false
                return (
                    (!selectionInput[this.currentAction] || selectionInput[this.currentAction] == 'None') &&
                    selectionInput.comments.length <= 0 &&
                    selectionInput.outs.length <= 0 &&
                    selectionInput.requests.length <= 0 &&
                    selectionInput.alignmentOuts.length <= 0
                )
            })
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
        async InNoOutNoCommentStyles() {
            if (await this.$refs.quickInDialog.confirm()) {
                if (this.currentSelectionMode == 'Feedback') {
                    this.updateFeedbacks({
                        actions: this.productsNoOutNoComment.map(
                            product => this.getActiveSelectionInput(product).yourSelectionFeedback
                        ),
                        newAction: 'In',
                    })
                }
                if (this.currentSelectionMode == 'Alignment') {
                    this.updateActions({
                        actions: this.productsNoOutNoComment.map(
                            product => this.getActiveSelectionInput(product).selectionAction
                        ),
                        newAction: 'In',
                    })
                }
            }
        },
        async OutNoInStyles() {
            if (await this.$refs.quickOutDialog.confirm()) {
                if (this.currentSelectionMode == 'Feedback') {
                    this.updateFeedbacks({
                        actions: this.productsNoIn.map(
                            product => this.getActiveSelectionInput(product).yourSelectionFeedback
                        ),
                        newAction: 'Out',
                    })
                }
                if (this.currentSelectionMode == 'Alignment') {
                    this.updateActions({
                        actions: this.productsNoIn.map(
                            product => this.getActiveSelectionInput(product).selectionAction
                        ),
                        newAction: 'Out',
                    })
                }
            }
        },
        setHideQuickOut() {
            this.hideQuickOut = true
            // this.$cookies.set(`quick_out_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        setHideQuickIn() {
            this.hideQuickIn = true
            // this.$cookies.set(`quick_in_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
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

        // SingalR Handlers
        subscribeSelectionsChangedHandler(message) {
            //
        },
        async selectionPresentationChangedHandler(eventName, args) {
            if (!args.selection_ids.includes[this.selection.id]) return
            // const selectionDetail = args.detail.find(detail => detail.selection_id == this.currentSelection.id)
            // If a presentation has started for this selection and the user is not an owner, kick them
            if (eventName == 'Begin') {
                // Wait for us to set the new presentation data
                setTimeout(async () => {
                    if (!this.selection.presentation.presenter.id == this.authUser.id) {
                        await this.$refs.presentationModeDialog.show()
                        this.$router.push({ name: 'files' })
                    }
                }, 1000)
            }
        },

        productCompletedStatusChangedHandler(selectionId, shouldBeCompleted, productIdList) {
            // console.log('productcompletd', selectionId, shouldBeCompleted, productIdList)
            const products = []
            productIdList.map(productId => {
                const product = this.products.find(x => x.id == productId)
                if (product) products.push(product)
            })
            this.SET_PRODUCTS_COMPLETED({ selectionId, shouldBeCompleted, products })
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
        async requestArrivedHandler(selectionId, request) {
            // if (request.author_id != this.authUser.id) {
            // console.log("OnRequestArrived", selectionId, request)
            const product = this.products.find(x => x.id == request.product_id)
            await this.initRequests([request])
            this.INSERT_OR_UPDATE_REQUEST({ selectionInput: this.getActiveSelectionInput(product), request })
            // }
        },
        requestDeletedHandler(selectionId, requestIdentifier) {
            // console.log("OnRequestArrived", selectionId, request)
            const product = this.products.find(x => x.id == requestIdentifier.product_id)
            const request = {
                id: requestIdentifier.request_id,
                author_id: requestIdentifier.author_id,
                product_id: requestIdentifier.product_id,
                selection_id: requestIdentifier.selection_id,
            }
            this.DELETE_REQUEST({ selectionInput: this.getActiveSelectionInput(product), request })
        },
        requestCommentArrivedHandler(selectionId, requestComment) {
            if (requestComment.author_id != this.authUser.id) {
                // console.log("OnRequestArrived", selectionId, request)
                const requestProduct = this.products.find(
                    product => !!product.requests.find(x => x.id == requestComment.request_id)
                )
                const request = requestProduct.requests.find(x => x.id == requestComment.request_id)
                this.INSERT_OR_UPDATE_REQUEST_COMMENT({ request, comment: requestComment })
            }
        },
        requestCommentDeletedHandler(selectionId, requestComment) {
            const requestProduct = this.products.find(
                product => !!product.requests.find(x => x.id == requestComment.request_id)
            )
            const request = requestProduct.requests.find(x => x.id == requestComment.request_id)
            this.DELETE_REQUEST_COMMENT({ request, comment: requestComment })
        },
        bulkFeedbackArrivedHandler(selectionId, feedbacks) {
            if (feedbacks[0].user_id != this.authUser.id) {
                // console.log('bulk feedback arrived', selectionId, feedbacks)
                this.SET_FEEDBACKS(feedbacks)
            }
        },
        feedbackArrivedHandler(selectionId, feedback) {
            if (feedback.user_id != this.authUser.id) {
                // console.log('feedback arrived', selectionId, feedback)
                this.SET_FEEDBACKS([feedback])
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

            connection.on('SubscribeSelectionsChanged', this.subscribeSelectionsChangedHandler)
            connection.on('OnSelectionPresentationChanged', this.selectionPresentationChangedHandler)

            connection.on('OnProductCompletedStatusChanged', this.productCompletedStatusChangedHandler)

            // Comments
            connection.on('OnCommentArrived', this.commentArrivedHandler)
            connection.on('OnCommentDeleted', this.commentDeletedHandler)

            // Requests
            connection.on('OnRequestArrived', this.requestArrivedHandler)
            connection.on('OnRequestDeleted', this.requestDeletedHandler)

            connection.on('OnAddOrUpdateDiscussion', this.requestCommentArrivedHandler)
            connection.on('OnDiscussionDeleted', this.requestCommentDeletedHandler)

            // Feedback
            connection.on('OnBulkFeedbackArrived', this.bulkFeedbackArrivedHandler)
            connection.on('OnFeedbackArrived', this.feedbackArrivedHandler)

            // Alignment
            connection.on('OnBulkAlignmentArrived', this.bulkAlignmentArrivedHandler)
            connection.on('OnAlignmentArrived', this.alignmentArrivedHandler)
        },
        disconnectSignalR() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')
            connection.off('SubscribeSelectionsChanged', this.subscribeSelectionsChangedHandler)
            connection.off('OnSelectionPresentationChanged', this.selectionPresentationChangedHandler)

            connection.off('OnProductCompletedStatusChanged', this.productCompletedStatusChangedHandler)

            // Comments
            connection.off('OnCommentArrived', this.commentArrivedHandler)
            connection.off('OnCommentDeleted', this.commentDeletedHandler)

            // Requests
            connection.off('OnRequestArrived', this.requestArrivedHandler)
            connection.off('OnRequestArrived', this.requestDeletedHandler)

            connection.off('OnAddOrUpdateDiscussion', this.requestCommentArrivedHandler)
            connection.off('OnDiscussionDeleted', this.requestCommentDeletedHandler)

            // Feedback
            connection.off('OnBulkFeedbackArrived', this.bulkFeedbackArrivedHandler)
            connection.off('OnFeedbackArrived', this.feedbackArrivedHandler)

            // Alignment
            connection.off('OnBulkAlignmentArrived', this.bulkAlignmentArrivedHandler)
            connection.off('OnAlignmentArrived', this.alignmentArrivedHandler)
        },
    },
    created() {
        // this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        // this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)

        // LIVE UPDATE
        this.connectToLiveUpdates()
    },
    async mounted() {
        // Route the user away if the current selection is live and your role is not Owner
        if (this.selection.is_presenting && !this.selection.presentation.presenter.id == this.authUser.id) {
            await this.$refs.presentationModeDialog.show()
            this.$router.push({ name: 'files' })
        }
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
