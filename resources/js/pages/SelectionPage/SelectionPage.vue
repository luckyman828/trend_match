<template>
    <div class="subfile">
        <PageHeader :file="file"/>
        <div class="quick-actions">
            <p>Quick actions</p>
            <span v-if="productsNoIn.length > 0 && !hideQuickOut" class="button red wide" @click="OutNoInStyles()">'OUT' styles with no IN ({{productsNoIn.length}})</span>
            <span v-if="productsNoOutNoComment.length > 0 && !hideQuickIn" class="button green wide" @click="InNoOutNoCommentStyles()">'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
            <span class="button invisible icon-right red-hover" @click="setHideQuickIn(); setHideQuickOut()">Hide quick actions <i class="far fa-times-circle"></i></span>
        </div>
        <div class="filters">
            <div class="left">
                
            </div>
        </div>

        <ProductsTable ref="productsComponent" :sortKey="sortKey" :sortAsc="sortAsc" :currentProductFilter="currentProductFilter"
        :teams="file.teams" :file="file" :products="productsFiltered"
        @onSort="onSort" @updateProduct="onUpdateProduct"/>

        <ProductFlyin :show="singleVisible"
        @close="setSingleVisisble(false)" @updateProduct="onUpdateProduct"/>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import PageHeader from './PageHeader'
import ProductFlyin from './ProductFlyin'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'selectionPage',
    components: {
        ProductsTable,
        PageHeader,
        ProductFlyin
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        selectedProducts: [],
        sortKey: 'datasource_id',
        sortAsc: true,
        hideQuickOut: false,
        hideQuickIn: false,
    }},
    computed: {
        ...mapGetters('entities/products', ['products', 'productsFiltered', 'singleVisible']),
        ...mapGetters('entities/collections', ['loadingCollections', 'files', 'currentFile']),
        ...mapGetters('entities/teams', ['teams']),
        ...mapGetters('persist', ['currentTeamId', 'teamFilterId', 'currentWorkspaceId', 'userPermissionLevel', 'actionScope', 'viewAdminPermissionLevel', 'currentTeam', 'currentWorkspace', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
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
        ...mapMutations('entities/products', ['updateSelectedCategories', 'updateSelectedDeliveryDates', 'setUnreadOnly', 'setCurrentProductFilter', 'updateSelectedBuyerGroups']),
        ...mapActions('entities/actions', ['fetchActions', 'updateManyActions', 'createManyActions']),
        ...mapActions('persist', ['setTeamFilter']),
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
        onUpdateProduct() {

        },
        submitSelectedAction(method) {
            // Find out whether we should update or delete the products final actions
            const user_id = this.authUser.id
            const actionType = method
            let productsToUpdate = []
            let productsToCreate = []

            this.selectedProducts.forEach(product => {

                if (product.currentAction != null) {
                    // If product has a final action
                    if (product.currentAction.action != actionType) {
                        // If the products final action isnt the same as the one we are trying to set
                        productsToUpdate.push(product)
                    }
                } 
                // If product does not have a final action
                else productsToCreate.push(product)

            })

            // Submit the selection
            if (productsToUpdate.length > 0) {
                if (true) { // if feedback
                    // this.updateManyActions({productIds: productsToUpdate, selection_id: this.currentSelection.id, user_id: user_id, action_code: actionType, is_task_action: null})
                } else {
                    
                }
            }
            if (productsToCreate.length > 0) {
                // if (true) { // If feedback
                //     this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: false})
                // } else this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: true})
            }

            // Reset the selection
            this.clearSelectedProducts()
        },
        massSubmitAction(products, method) {
            // Find out whether we should update or delete the products final actions
            const user_id = this.authUser.id
            const actionType = method
            let productsToUpdate = []
            let productsToCreate = []

            products.forEach(product => {

                if (product.currentAction != null) {
                    // If product has a final action
                    if (product.currentAction.action != actionType) {
                        // If the products final action isnt the same as the one we are trying to set
                        productsToUpdate.push(product.id)
                    }
                } 
                // If product does not have a final action
                else productsToCreate.push(product.id)

            })

            // Submit the selection
            if (productsToUpdate.length > 0) {
                // if (this.currentTask.type == 'feedback') {
                //     this.updateManyActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
                // } else this.updateManyTaskActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
            }
            if (productsToCreate.length > 0) {
                // if (this.currentTask.type == 'feedback') {
                //     this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: false})
                // } else this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: true})
            }

            // Reset the selection
            this.clearSelectedProducts()
        },
        onSort(key, method) {
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

    .filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        > * {
            display: flex;
            &.left > * {
                margin-right: 16px;
            }
            &.right > * {
                margin-left: 16px;
            }
        }
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
    .button.clear {
        margin-left: -16px;
    }
    .checkbutton.checkbox {
        color: $dark;
        border: solid 1px;
        border-color: $light2;
        font-weight: 700;
        .checkmark {
            margin-left: 12px;
            margin-right: -4px;
        }
    }
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
