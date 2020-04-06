<template>
    <div class="subfile">
        <ThePageHeader :title="`${currentFile.name}: 
        ${!currentSelections[0].is_open ? '[Locked]' : ''} ${currentSelections[0].name || 'Untitled Selection'
        }${currentSelections.length > 1 ? ' + '+ Math.abs(currentSelections.length -1) + ' more' : ''}: 
        ${selection.your_role == 'Owner' ? 'Alignment' 
        : selection.your_role == 'Approver' ? 'Approval'
        : selection.your_role == 'Member' ? 'Feedback' 
        : 'Access Denied'}`"/>

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
    computed: {
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible']),
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('selections', ['currentSelection', 'getCurrentSelections', 'currentSelectionMode', 'currentSelectionModeAction']),
        ...mapGetters('auth', ['authUser']),
        selection() {
            return this.currentSelections[0]
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
        ...mapActions('actions', ['insertOrUpdateAction', 'insertOrUpdateActions']),
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
        }
    },
    created() {
        // this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        // this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)
    },
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
