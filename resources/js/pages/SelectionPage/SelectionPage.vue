<template>
    <div class="subfile">
        <ThePageHeader :title="`${selection.title || 'Untitled Selection'}: 
        ${selection.role == 'Owner' ? 'Alignment' 
        : selection.role == 'Approver' ? 'Approval' 
        : 'Feedback'}`"/>

        <!-- <div class="quick-actions">
            <p>Quick actions</p>
            <span v-if="productsNoIn.length > 0 && !hideQuickOut" class="button red wide" @click="OutNoInStyles()">'OUT' styles with no IN ({{productsNoIn.length}})</span>
            <span v-if="productsNoOutNoComment.length > 0 && !hideQuickIn" class="button green wide" @click="InNoOutNoCommentStyles()">'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
            <span class="button invisible icon-right red-hover" @click="setHideQuickIn(); setHideQuickOut()">Hide quick actions <i class="far fa-times-circle"></i></span>
        </div> -->

        <ProductsTable ref="productsComponent" :sortKey="sortKey" :sortAsc="sortAsc"
        :file="file" :products="productsFiltered"
        @onSort="onSort" @updateAction="onUpdateAction"/>

        <ProductFlyin :show="singleVisible"
        @close="setSingleVisisble(false)" @updateAction="onUpdateAction"/>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import ThePageHeader from '../../components/layout/ThePageHeader'
import ProductFlyin from './ProductFlyin'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'selectionPage',
    components: {
        ProductsTable,
        ThePageHeader,
        ProductFlyin
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        sortKey: 'datasource_id',
        sortAsc: true,
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
            const products = this.products
            let productMatches = []
            products.forEach(product => {
                if (product.ins.length <= 0 && product.focus.length <= 0) {
                    productMatches.push(product)
                }
            })
            return productMatches
        },
        productsNoOutNoComment() {
            const products = this.products
            let productMatches = []
            products.forEach(product => {
                if (product.comments.length < 1 && product.outs.length < 1 && product.requests.length < 1) {
                    productMatches.push(product)
                }
            })
            return productMatches
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
        onSort(method, key) {
            if (this.sortKey !== key) {
                this.sortAsc = method
                this.sortKey = key
            } else {
                this.sortAsc = !this.sortAsc
            }
            this.sortProducts()
        },
        sortProducts() {
            this.sortArray(this.products, this.sortAsc, this.sortKey)
        }
    },
    created() {
        // this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        // this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)
        // Initially sort the products
        this.sortProducts()
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
