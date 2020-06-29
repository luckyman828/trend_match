<template>
    <div class="subfile">
        <!-- <ThePageHeader :title="`${currentFile.name}: 
        ${!currentSelection.is_open ? '[Locked]' : ''} ${currentSelection.name || 'Untitled Selection'
        }${currentSelections.length > 1 ? ' + '+ Math.abs(currentSelections.length -1) + ' more' : ''}: 
        ${currentSelectionMode || 'Access Denied'}`"/> -->

        <h1>{{currentFile.name}}: {{!currentSelection.is_open ? '[Locked]' : ''}} {{currentSelection.name || 'Untitled Selection'}} 
            {{currentSelections.length > 1 ? ' + '+ Math.abs(currentSelections.length -1) + ' more' : ''}}: {{currentSelectionMode || 'Access Denied'}}</h1>

        <!-- Access denied -->
        <template v-if="!selection.your_role">
            <p>You don't have access to this selection</p>
        </template>

        <!-- Access granted -->
        <template v-else>
            <div class="quick-actions" v-if="currentSelections.length <= 1 && (productsNoOutNoComment.length > 0 || productsNoIn.length > 0)">
                <p>Quick actions</p>
                <button v-if="productsNoOutNoComment.length > 0" class="green-hover md ghost" 
                @click="InNoOutNoCommentStyles()" style="margin-right: 8px;">
                    <span>'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
                </button>
                <button v-if="productsNoIn.length > 0" class="red-hover md ghost" 
                @click="OutNoInStyles()" style="margin-right: 8px;">
                    <span>'OUT' styles with no IN ({{productsNoIn.length}})</span>
                </button>
                <!-- <button class="invisible ghost-hover md" @click="setHideQuickIn(); setHideQuickOut()">
                    <span>Hide quick actions</span><i class="far fa-times-circle"></i>
                </button> -->
            </div>

            <ProductsTable ref="productsComponent" :file="currentFile" :products="productsFiltered"
            :selection="selection" :currentAction="currentAction"
            @updateAction="onUpdateAction"/>

            <ProductFlyin :show="singleVisible" :selection="selection" :currentAction="currentAction"
            @close="setSingleVisisble(false)" @updateAction="onUpdateAction"/>
        </template>

        <BaseDialog ref="quickOutDialog" type="confirm" confirmColor="red"
        confirmText="Yes, mark them OUT" cancelText="No, keep them as is">
            <div class="icon-graphic">
                <i class="far fa-cube lg dark"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-times red lg"></i>
            </div>
            <h3>You are about to mark {{productsNoIn.length}} products OUT</h3>
            <p>
                Noone has said IN for these products.
                <br>
                Be aware that not all users may have given their feedback yet.
            </p>
        </BaseDialog>

        <BaseDialog ref="quickInDialog" type="confirm" confirmColor="green"
        confirmText="Yes, mark them IN" cancelText="No, keep them as is">
            <div class="icon-graphic">
                <i class="far fa-cube lg primary"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-heart dark lg"></i>
            </div>
            <h3>Mark {{productsNoOutNoComment.length}} products IN</h3>
            <p>
                Noone has said OUT for these products and they have NO comments.
                <br>
                Be aware that not all users may have given their feedback yet.
                <br>
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

    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import ThePageHeader from '../../components/layout/ThePageHeader'
import ProductFlyin from './ProductFlyin'

export default{
    name: 'selectionPage',
    components: {
        ProductsTable,
        ThePageHeader,
        ProductFlyin
    },
    data: function () { return {
        hideQuickOut: false,
        hideQuickIn: false,
    }},
    computed: {
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible', 'getActiveSelectionInput']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection', 'getCurrentSelections', 'currentSelectionMode', 'currentSelectionModeAction', 'selections']),
        ...mapGetters('auth', ['authUser', 'getAuthUserToken']),
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
        productsNoIn() {
            return this.products.filter(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                if (!selectionInput) return false
                return (!selectionInput[this.currentAction] || selectionInput[this.currentAction] == 'None') 
                && selectionInput.ins.length <= 0 && selectionInput.focus.length <= 0 && selectionInput.alignmentIns.length <= 0 && selectionInput.alignmentFocus.length <= 0
            })
        },
        productsNoOutNoComment() {
            return this.products.filter(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                if (!selectionInput) return false
                return (!selectionInput[this.currentAction] || selectionInput[this.currentAction] == 'None') 
                && selectionInput.comments.length <= 0 && selectionInput.outs.length <= 0 && selectionInput.requests.length <= 0 && selectionInput.alignmentOuts.length <= 0
            })
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble', 'SET_ACTIONS', 'SET_FEEDBACKS']),
        ...mapMutations('comments', ['INSERT_OR_UPDATE_COMMENT', 'DELETE_COMMENT']),
        ...mapMutations('requests', ['INSERT_OR_UPDATE_REQUEST']),
        ...mapActions('actions', ['insertOrUpdateActions', 'updateActions', 'updateFeedbacks']),
        async InNoOutNoCommentStyles() {
            if (await this.$refs.quickInDialog.confirm()) {
                if (this.currentSelectionMode == 'Feedback') {
                    this.updateFeedbacks({actions: this.productsNoOutNoComment.map(product => this.getActiveSelectionInput(product).yourSelectionFeedback), newAction: 'In'})
                }
                if (this.currentSelectionMode == 'Alignment') {
                    this.updateActions({actions: this.productsNoOutNoComment.map(product => this.getActiveSelectionInput(product).yourSelectionFeedback), newAction: 'In'})
                }
            }
        },
        async OutNoInStyles() {
            if (await this.$refs.quickOutDialog.confirm()) {
                if (this.currentSelectionMode == 'Feedback') {
                    this.updateFeedbacks({actions: this.productsNoIn.map(product => this.getActiveSelectionInput(product).yourSelectionFeedback), newAction: 'Out'})
                }
                if (this.currentSelectionMode == 'Alignment') {
                    this.updateActions({actions: this.productsNoIn.map(product => this.getActiveSelectionInput(product).yourSelectionFeedback), newAction: 'Out'})
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
                this.updateFeedbacks({actions: [selectionFeedback], newAction})
            }
            if (this.currentSelectionMode == 'Alignment') {
                const selectionAction = selectionInput.selectionAction
                const newAction = selectionAction.action == action ? 'None' : action
                this.updateActions({actions: [selectionAction], newAction})
            }
        },

        // SingalR Handlers
        subscribeSelectionsChangedHandler(message) {
            //
        },
        async selectionPresentationChangedHandler(eventName, selectionIds) {
            if (eventName == 'Begin' 
                && this.currentSelection.your_role != 'Owner'
                && selectionIds.selection_ids.includes(this.currentSelection.id)
            ) {
                await this.$refs.presentationModeDialog.show()
                this.$router.push({name: 'files'})
            }
        },
        commentArrivedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentArrived", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                const selectionProduct = product.selectionInputList.find(x => x.selection.id == selectionId).product
                if (!comment.selection) {
                    delete comment.selection
                }
                this.INSERT_OR_UPDATE_COMMENT({product: selectionProduct, comment})
            }
        },
        commentDeletedHandler(selectionId, comment) {
            if (comment.user_id != this.authUser.id) {
                // console.log("OnCommentDeleted", selectionId, comment)
                const product = this.products.find(x => x.id == comment.product_id)
                const selectionProduct = product.selectionInputList.find(x => x.selection.id == selectionId).product
                this.DELETE_COMMENT({product: selectionProduct, commentId: comment.comment_id})
            }
        },
        requestArrivedHandler(selectionId, request) {
            if (request.author_id != this.authUser.id) {
                // console.log("OnRequestArrived", selectionId, request)
                const product = this.products.find(x => x.id == request.product_id)
                const selectionProduct = product.selectionInputList.find(x => x.selection.id == selectionId).product
                if (!request.selection) {
                    delete request.selection
                }
                this.INSERT_OR_UPDATE_REQUEST({product: selectionProduct, request})
            }
        },
        bulkFeedbackArrivedHandler(selectionId, feedbacks) {
            if (feedbacks[0].user_id != this.authUser.id) {
                this.SET_FEEDBACKS(feedbacks)
            }
        },
        feedbackArrivedHandler(selectionId, feedback) {
            if (feedback.user_id != this.authUser.id) {
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
                connection.invoke("Subscribe", selection.id).catch(function (err) {
                    return console.error(err.toString());
                });
            })

            connection.on('SubscribeSelectionsChanged', this.subscribeSelectionsChangedHandler)  
            connection.on('OnSelectionPresentationChanged',  this.selectionPresentationChangedHandler)

            // Comments
            connection.on("OnCommentArrived", this.commentArrivedHandler)
            connection.on("OnCommentDeleted", this.commentDeletedHandler)

            // Requests
            connection.on("OnRequestArrived", this.requestArrivedHandler)

            // Feedback
            connection.on("OnBulkFeedbackArrived", this.bulkFeedbackArrivedHandler)
            connection.on("OnFeedbackArrived", this.feedbackArrivedHandler)

            // Alignment
            connection.on("OnBulkAlignmentArrived", this.bulkAlignmentArrivedHandler)
            connection.on("OnAlignmentArrived", this.alignmentArrivedHandler)
        },
        disconnectSignalR() {
            const connection = this.$connection

            this.$connection.invoke("UnSubscribeAll")
            connection.off('SubscribeSelectionsChanged', this.subscribeSelectionsChangedHandler)  
            connection.off('OnSelectionPresentationChanged',  this.selectionPresentationChangedHandler)

            // Comments
            connection.off("OnCommentArrived", this.commentArrivedHandler)
            connection.off("OnCommentDeleted", this.commentDeletedHandler)

            // Requests
            connection.off("OnRequestArrived", this.requestArrivedHandler)

            // Feedback
            connection.off("OnBulkFeedbackArrived", this.bulkFeedbackArrivedHandler)
            connection.off("OnFeedbackArrived", this.feedbackArrivedHandler)

            // Alignment
            connection.off("OnBulkAlignmentArrived", this.bulkAlignmentArrivedHandler)
            connection.off("OnAlignmentArrived", this.alignmentArrivedHandler)
        }
    },
    async created() {
        // this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        // this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)

        // LIVE UPDATE
        this.connectToLiveUpdates()
        // Route the user away if the current selection is live and your role is not Owner
        if (this.selection.is_presenting && this.selection.your_role != 'Owner') {
            this.$router.push({name: 'files'})
        }
    },
    destroyed() {
        this.disconnectSignalR()
    }
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
