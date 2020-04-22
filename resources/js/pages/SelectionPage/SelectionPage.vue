<template>
    <div class="subfile">
        <ThePageHeader :title="`${currentFile.name}: 
        ${!currentSelection.is_open ? '[Locked]' : ''} ${currentSelection.name || 'Untitled Selection'
        }${currentSelections.length > 1 ? ' + '+ Math.abs(currentSelections.length -1) + ' more' : ''}: 
        ${currentSelectionMode || 'Access Denied'}`"/>

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
    watch: {
        currentSelections: function(newVal, oldVal) {
            console.log('new current selections')
            console.log(newVal)
        }
    },
    computed: {
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible']),
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
                return (!product[this.currentAction] || product[this.currentAction] == 'None') 
                && product.ins.length <= 0 && product.focus.length <= 0 && product.alignmentIns.length <= 0 && product.alignmentFocus.length <= 0
            })
        },
        productsNoOutNoComment() {
            return this.products.filter(product => {
                return (!product[this.currentAction] || product[this.currentAction] == 'None') 
                && product.comments.length <= 0 && product.outs.length <= 0 && product.requests.length <= 0 && product.alignmentOuts.length <= 0
            })
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble']),
        ...mapMutations('comments', ['INSERT_OR_UPDATE_COMMENT', 'DELETE_COMMENT']),
        ...mapMutations('requests', ['INSERT_OR_UPDATE_REQUEST']),
        ...mapActions('actions', ['insertOrUpdateAction', 'insertOrUpdateActions']),
        ...mapMutations('actions', ['INSERT_OR_UPDATE_ACTIONS']),
        InNoOutNoCommentStyles() {
            this.onInsertOrUpdateActions(this.productsNoOutNoComment, 'In')
        },
        OutNoInStyles() {
            this.onInsertOrUpdateActions(this.productsNoIn, 'Out')
        },
        setHideQuickOut() {
            this.hideQuickOut = true
            // this.$cookies.set(`quick_out_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        setHideQuickIn() {
            this.hideQuickIn = true
            // this.$cookies.set(`quick_in_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        onUpdateAction(product, action, selection) {
            const actionToPost = product[this.currentAction] == action ? 'None' : action
            this.insertOrUpdateAction({product, action: actionToPost, selection, user: this.authUser})
        },
        onInsertOrUpdateActions(products, action, selection) {
            this.insertOrUpdateActions({products, action, selection, user: this.authUser})
        },

        async connectToLiveUpdates() {
            // Connect to SignalR
            this.$connection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(`${process.env.MIX_API_BASE_URL.substr(0,process.env.MIX_API_BASE_URL.length-3)}/live-update`)
            .configureLogging(signalR.LogLevel.Information)
            .build()
            const connection = this.$connection
            await connection.start().catch(err => {
                console.log(err)
            })

            const authUser = this.authUser
            
            // Authenticate our connection
            connection.invoke("Authenticate", this.getAuthUserToken).catch(function (err) {
                return console.error(err.toString())
            })

            // Subscribe to our selections
            this.currentSelections.forEach(selection => {
                connection.invoke("Subscribe", selection.id).catch(function (err) {
                    return console.error(err.toString());
                });
            })

            connection.on('AuthenticatedSuccess', message => {
                // console.log('authenticated!')
                // console.log(message)
            })
            connection.on('SubscribeSelectionsChanged', message => {
                // console.log('authenticated!')
                // console.log(message)
            })
                        

            // Comments
            connection.on("OnCommentArrived", (selectionId, comment) => {
                if (comment.user_id != authUser.id) {
                    // console.log("OnCommentArrived", selectionId, comment)
                    const product = this.products.find(x => x.id == comment.product_id)
                    const selectionProduct = product.selectionInputArray.find(x => x.selection.id == selectionId).product
                    if (!comment.selection) {
                        delete comment.selection
                    }
                    this.INSERT_OR_UPDATE_COMMENT({product: selectionProduct, comment})
                }
            })
            connection.on("OnCommentDeleted", (selectionId, comment) => {
                if (comment.user_id != authUser.id) {
                    // console.log("OnCommentDeleted", selectionId, comment)
                    const product = this.products.find(x => x.id == comment.product_id)
                    const selectionProduct = product.selectionInputArray.find(x => x.selection.id == selectionId).product
                    this.DELETE_COMMENT({product: selectionProduct, commentId: comment.comment_id})
                }
            })

            // Requests
            connection.on("OnRequestArrived", (selectionId, request) => {
                if (request.author_id != authUser.id) {
                    // console.log("OnRequestArrived", selectionId, request)
                    const product = this.products.find(x => x.id == request.product_id)
                    const selectionProduct = product.selectionInputArray.find(x => x.selection.id == selectionId).product
                    if (!request.selection) {
                        delete request.selection
                    }
                    this.INSERT_OR_UPDATE_REQUEST({product: selectionProduct, request})
                }
            })

            // Feedback
            connection.on("OnBulkFeedbackArrived", (selectionId, feedbacks) => {
                if (feedbacks[0].user_id != authUser.id) {
                    // console.log("OnBulkFeedbackArrived", selectionId, feedbacks)
                    feedbacks.forEach(action => {
                        const product = this.products.find(x => x.id == action.product_id)
                        const selectionProduct = product.selectionInputArray.find(x => x.selection.id == selectionId).product
                        const actionSelection = this.selections.find(x => x.id == action.selection_id)
    
                        const productActions = [{product: selectionProduct, action: action.action}]
                        this.INSERT_OR_UPDATE_ACTIONS({ productActions, selection: actionSelection, user: alignments[0].user, type: 'Feedback' })
                    })
                }
            })

            // Alignment
            connection.on("OnBulkAlignmentArrived", (selectionId, alignments) => {
                if (alignments[0].user_id != authUser.id) {
                    // console.log("OnBulkAlignmentArrived", selectionId, alignments)
                    alignments.forEach(action => {
                        const product = this.products.find(x => x.id == action.product_id)
                        const selectionProduct = product.selectionInputArray.find(x => x.selection.id == selectionId).product
                        const actionSelection = this.selections.find(x => x.id == action.selection_id)
    
                        const productActions = [{product: selectionProduct, action: action.action}]
                        this.INSERT_OR_UPDATE_ACTIONS({ productActions, selection: actionSelection, user: alignments[0].user, type: 'Alignment' , currentSelectionId: selectionId})
                    })
                }
            })

        }
    },
    created() {
        // this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        // this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)

        // LIVE UPDATE
        this.connectToLiveUpdates()
    },
    destroyed() {
        this.$connection.invoke("UnSubscribeAll")
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    .quick-actions {
        border-bottom: solid 2px $light2;
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
