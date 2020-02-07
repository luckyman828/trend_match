<template>
    <div class="subfile">
        <PageHeader :file="file"/>
        <div class="header">
            <h1>{{file.title}}</h1>
        </div>
        <div class="quick-actions">
            <p>Quick actions</p>
            <span v-if="productsNoIn.length > 0 && !hideQuickOut" class="button red wide" @click="OutNoInStyles()">'OUT' styles with no IN ({{productsNoIn.length}})</span>
            <span v-if="productsNoOutNoComment.length > 0 && !hideQuickIn" class="button green wide" @click="InNoOutNoCommentStyles()">'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
            <span class="button invisible icon-right red-hover" @click="setHideQuickIn(); setHideQuickOut()">Hide quick actions <i class="far fa-times-circle"></i></span>
        </div>
        <div class="filters">
            <div class="left">
                <BaseDropdown class="dropdown-parent left">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                            <span>Category </span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedCategories.length > 0" class="bubble">
                                {{selectedCategories.length}}
                            </span>
                        </div>
                    </template>
                    <template v-slot:header>
                        <span>Filter by category</span>
                    </template>
                    <template v-slot:body>
                        <BaseCheckboxButtons :options="availableCategories" ref="filterSelect" v-model="selectedCategories" @change="$refs.filterSelect.submit()"/>
                    </template>
                </BaseDropdown>
                <BaseDropdown class="dropdown-parent left">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                            <span>Delivery</span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedDeliveryDates.length > 0" class="bubble">
                                {{selectedDeliveryDates.length}}
                            </span>
                        </div>
                    </template>
                    <template v-slot:header>
                        <span>Filter by delivery date</span>
                    </template>
                    <template v-slot:body>
                        <BaseCheckboxButtons :options="availableDeliveryDates" :optionNameKey="'name'" :optionValueKey="'value'" ref="filterDelivery" v-model="selectedDeliveryDates" @change="$refs.filterDelivery.submit()"/>
                    </template>
                </BaseDropdown>
                <BaseDropdown class="dropdown-parent left" v-if="userPermissionLevel == 3">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                            <span>Buyer group </span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedBuyerGroups.length > 0" class="bubble">
                                {{selectedBuyerGroups.length}}
                            </span>
                        </div>
                    </template>
                    <template v-slot:header>
                        <span>Filter by buyer group</span>
                    </template>
                    <template v-slot:body>
                        <BaseCheckboxButtons :options="availableBuyerGroups" ref="filterBuyerGroup" v-model="selectedBuyerGroups" @change="$refs.filterBuyerGroup.submit()"/>
                    </template>
                </BaseDropdown>
                <label class="square checkbutton ghost light-2 checkbox clickable">
                    <span>Show UNREAD only</span>
                    <input type="checkbox" v-model="unreadOnly">
                    <span class="checkmark solid"><i class="fas fa-check"></i></span>
                </label>

                <span v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 || unreadOnly" class="clear button invisible primary" @click="$refs.filterSelect.clear(); selectedCategories=[]; $refs.filterDelivery.clear(); selectedDeliveryDates=[]; if ($refs.filterBuyerGroup) $refs.filterBuyerGroup.clear(); selectedBuyerGroups=[]; unreadOnly = false">Clear filter</span>
            </div>
        </div>
        <ProductTabs :products="productsFiltered" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
        <ProductsTable ref="productsComponent" :sortBy="sortBy" :sortAsc="sortAsc" 
        :teams="file.teams" :file="file" :products="productsFiltered" :authUser="authUser"
        @onSortBy="onSortBy" v-model="selectedProducts" :selectedProducts="selectedProducts"/>
        <SelectedController :totalCount="productsFiltered.length" :selected="selectedProducts" 
        @onSelectedAction="submitSelectedAction" @onClearSelection="selectedProducts = []"/>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
// Import Components
import ProductsTable from './ProductsTable'
import ProductTabs from './ProductTabs'
import PageHeader from './PageHeader'
import SelectedController from './SelectedController'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'selectionPage',
    components: {
        ProductsTable,
        ProductTabs,
        SelectedController,
        PageHeader,
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        selectedProducts: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        hideQuickOut: false,
        hideQuickIn: false,
    }},
    computed: {
        ...mapGetters('entities/products', ['products', 'productsFiltered']),
        ...mapGetters('entities/collections', ['loadingCollections', 'files', 'currentFile']),
        ...mapGetters('entities/teams', ['teams']),
        ...mapGetters('persist', ['currentTeamId', 'teamFilterId', 'currentWorkspaceId', 'userPermissionLevel', 'actionScope', 'viewAdminPermissionLevel', 'currentTeam', 'currentWorkspace', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        currentProductFilter: {
            get () {
                return this.$store.getters['entities/products/currentProductFilter']
            },
            set (value) {
                this.setCurrentProductFilter(value)
            }
        },
        selectedCategories: {
            get () {
                return this.$store.getters['entities/products/selectedCategories']
            },
            set (value) {
                this.updateSelectedCategories(value)
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.getters['entities/products/selectedDeliveryDates']
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
            }
        },
        selectedBuyerGroups: {
            get () {
                return this.$store.getters['entities/products/selectedBuyerGroups']
            },
            set (value) {
                this.updateSelectedBuyerGroups(value)
            }
        },
        unreadOnly: {
            get () {
                return this.$store.getters['entities/products/unreadOnly']
            },
            set (value) {
                this.setUnreadOnly(value)
            }
        },
        file() {
            return this.currentFile
        },
        availableCategories() {
            const products = this.products
            let uniqueCategories = []
            products.forEach(product => {
                if (product.category) {
                    const found = (uniqueCategories.includes(product.category))
                    if (!found)
                        uniqueCategories.push(product.category)
                }
            })
            return uniqueCategories
        },
        availableDeliveryDates() {
            const products = this.products
            let uniqueDeliveryDates = []
            products.forEach(product => {
                if (product.delivery_date) {
                    const found = (uniqueDeliveryDates.find(x => x.value == product.delivery_date))
                    if (!found)
                        uniqueDeliveryDates.push({
                            name: new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'}), 
                            value: product.delivery_date
                            })
                }
            })
            return uniqueDeliveryDates
        },
        availableBuyerGroups() {
            const products = this.products
            let unique = []
            products.forEach(product => {
                if (product.buyer_group) {
                    const found = (unique.includes(product.buyer_group))
                    if (!found)
                        unique.push(product.buyer_group)
                }
            })
            return unique
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
        setProductFilter(filter) {
            this.setCurrentProductFilter(filter)
            this.clearSelectedProducts()
        },
        clearSelectedCategories() {
            this.selectedCategoryIDs = []
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
        onSortBy(key, method) {
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }
            this.sortProducts()
        },
        sortProducts() {
            this.sortArray(this.products, this.sortAsc, this.sortBy)
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
