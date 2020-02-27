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
            <div class="quick-actions">
                <p>Quick actions</p>
                <span v-if="productsNoIn.length > 0 && !hideQuickOut" class="button red wide" @click="OutNoInStyles()">'OUT' styles with no IN ({{productsNoIn.length}})</span>
                <span v-if="productsNoOutNoComment.length > 0 && !hideQuickIn" class="button green wide" @click="InNoOutNoCommentStyles()">'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
                <span class="button invisible icon-right red-hover" @click="setHideQuickIn(); setHideQuickOut()">Hide quick actions <i class="far fa-times-circle"></i></span>
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
        selection() {
            return this.currentSelection
        },
        file() {
            return this.currentFile
        },
        productsNoIn() {
            // const products = this.products
            // let productMatches = []
            // products.forEach(product => {
            //     if (!product.currentAction && product.ins.length <= 0 && product.focus.length <= 0) {
            //         productMatches.push(product)
            //     }
            // })
            // return productMatches

            return this.products.filter(product => {
                return !product.currentAction && product.ins.length <= 0 && product.focus.length <= 0
            })
        },
        productsNoOutNoComment() {
            // const products = this.products
            // let productMatches = []
            // products.forEach(product => {
            //     if (!product.currentAction && product.comments.length < 1 && product.outs.length < 1 && product.requests.length < 1) {
            //         productMatches.push(product)
            //     }
            // })
            // return productMatches

            return this.products.filter(product => {
                return !product.currentAction && product.comments.length < 1 && product.outs.length < 1 && product.requests.length < 1
            })
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble']),
        ...mapActions('actions', ['updateAction']),
        InNoOutNoCommentStyles() {
            this.setHideQuickIn()
            this.massSubmitAction(this.productsNoOutNoComment, 1)
        },
        OutNoInStyles() {
            this.setHideQuickOut()
            this.massSubmitAction(this.productsNoIn, 0)
        },
        setHideQuickOut() {
            this.hideQuickOut = true
            // this.$cookies.set(`quick_out_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        setHideQuickIn() {
            this.hideQuickIn = true
            // this.$cookies.set(`quick_in_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        onUpdateAction(product, actionCode) {
            // Instantiate an action object
            const actionToPost = {
                action: actionCode,
                product_id: product.id,
                user_id: this.authUser.id,
                selection_id: this.currentSelection.id,
                selection: this.currentSelection,
                user: this.authUser,
            }
            // Post comment to store
            // Check if we are doing are doing feedback or alignment
            this.updateAction({product, action: actionToPost, isFeedback: this.isFeedback})
        },
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
