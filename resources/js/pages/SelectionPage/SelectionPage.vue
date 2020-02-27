<template>
    <div class="subfile">
        <ThePageHeader :title="`${selection.name || 'Untitled Selection'}: 
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
            <div class="quick-actions" v-if="productsNoOutNoComment.length > 0 || productsNoIn.length > 0">
                <p>Quick actions</p>
                <button v-if="productsNoOutNoComment.length > 0" class="green-hover md ghost" 
                @click="InNoOutNoCommentStyles()" style="margin-right: 8px;">
                    <span>'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
                </button>
                <button v-if="productsNoIn.length > 0" class="red-hover md ghost" 
                @click="OutNoInStyles()" style="margin-right: 8px;">
                    <span>'OUT' styles with no IN ({{productsNoIn.length}})</span>
                </button>
                <button class="invisible ghost-hover md" @click="setHideQuickIn(); setHideQuickOut()">
                    <span>Hide quick actions</span><i class="far fa-times-circle"></i>
                </button>
            </div>

            <ProductsTable ref="productsComponent" :file="file" :products="productsFiltered" 
            @updateAction="onUpdateAction"/>

            <ProductFlyin :show="singleVisible"
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
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('auth', ['authUser']),
        selection() {
            return this.currentSelection
        },
        file() {
            return this.currentFile
        },
        productsNoIn() {
            if (this.currentSelection.your_role == 'Member') {
                return this.products.filter(product => {
                    return product.your_feedback == 'None' && product.ins.length <= 0 && product.focus.length <= 0
                })
            }
            if (this.currentSelection.your_role == 'Owner') {
                return this.products.filter(product => {
                    return product.your_action == 'None' && product.ins.length <= 0 && product.focus.length <= 0
                })
            }
        },
        productsNoOutNoComment() {
            if (this.currentSelection.your_role == 'Member') {
                return this.products.filter(product => {
                    return product.your_feedback == 'None' && product.comments.length < 1 && product.outs.length < 1 && product.requests.length < 1
                })
            }
            if (this.currentSelection.your_role == 'Owner') {
                return this.products.filter(product => {
                    return product.your_action == 'None' && product.comments.length < 1 && product.outs.length < 1 && product.requests.length < 1
                })
            }
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
        onUpdateAction(product, action) {
            let actionToPost
            if (this.currentSelection.your_role == 'Member') {
                actionToPost = product.your_feedback == action ? 'None' : action
            } else if (this.currentSelection.your_role == 'Owner') {
                actionToPost = product.your_action == action ? 'None' : action
            }
            this.insertOrUpdateAction({product, action: actionToPost, selection: this.selection, user: this.authUser})
        },
        onInsertOrUpdateActions(products, action) {
            this.insertOrUpdateActions({products, action, selection: this.selection, user: this.authUser})
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
