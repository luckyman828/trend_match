<template>
    <div class="catalogue">

        <template v-if="true">

            <template v-if="!loadingCollections">
                <catalogueHeader :collection="collection"/>
                <div class="quick-actions" v-if="currentTask.type == 'alignment' && currentTask.isActive && !currentTask.completed.find(x => x.file_id == currentFile.id) && !(hideQuickIn && hideQuickOut) && ( (productsNoIn.length > 0 && !hideQuickOut) || (productsNoOutNoComment.length > 0 && !hideQuickIn) )">
                    <p>Quick actions</p>
                    <span v-if="productsNoIn.length > 0 && !hideQuickOut" class="button red wide" @click="OutNoInStyles()">'OUT' styles with no IN ({{productsNoIn.length}})</span>
                    <span v-if="productsNoOutNoComment.length > 0 && !hideQuickIn" class="button green wide" @click="InNoOutNoCommentStyles()">'IN' styles with no OUT & no Comments ({{productsNoOutNoComment.length}})</span>
                    <span class="button invisible icon-right red-hover" @click="setHideQuickIn(); setHideQuickOut()">Hide quick actions <i class="far fa-times-circle"></i></span>
                </div>
                <div class="filters">
                    <div class="left">
                        <Dropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Category </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedCategories.length > 0" class="bubble">
                                        {{selectedCategories.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Filter by category</span>
                            </template>
                            <template v-slot:body>
                                <CheckboxButtons :options="dynamicCategories" ref="filterSelect" v-model="selectedCategories" @change="$refs.filterSelect.submit()"/>
                            </template>
                        </Dropdown>
                        <Dropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Delivery</span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedDeliveryDates.length > 0" class="bubble">
                                        {{selectedDeliveryDates.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Filter by delivery date</span>
                            </template>
                            <template v-slot:body>
                                <CheckboxButtons :options="dynamicDeliveryDates" :optionNameKey="'name'" :optionValueKey="'value'" ref="filterDelivery" v-model="selectedDeliveryDates" @change="$refs.filterDelivery.submit()"/>
                            </template>
                        </Dropdown>
                        <Dropdown class="dropdown-parent left" v-if="currentTask.type == 'approval' && userPermissionLevel == 3">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Buyer group </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedBuyerGroups.length > 0" class="bubble">
                                        {{selectedBuyerGroups.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Filter by buyer group</span>
                            </template>
                            <template v-slot:body>
                                <CheckboxButtons :options="dynamicBuyerGroups" ref="filterBuyerGroup" v-model="selectedBuyerGroups" @change="$refs.filterBuyerGroup.submit()"/>
                            </template>
                        </Dropdown>
                        <label v-if="currentTask.type == 'approval'" class="square checkbutton ghost light-2 checkbox clickable">
                            <span>Show UNREAD only</span>
                            <input type="checkbox" v-model="unreadOnly">
                            <span class="checkmark solid"><i class="fas fa-check"></i></span>
                        </label>

                        <span v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 || unreadOnly" class="clear button invisible primary" @click="$refs.filterSelect.clear(); selectedCategories=[]; $refs.filterDelivery.clear(); selectedDeliveryDates=[]; if ($refs.filterBuyerGroup) $refs.filterBuyerGroup.clear(); selectedBuyerGroups=[]; unreadOnly = false">Clear filter</span>
                    </div>

                    <div class="right">
                        <Dropdown class="dropdown-parent right" ref="taskDropdown">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button" @click="slotProps.toggle">
                                    <span v-if="currentTask">{{currentTask.title}}</span>
                                    <span v-else>No task</span>
                                    <i class="far fa-chevron-down"></i>
                                </div>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Switch task</span>
                            </template>
                            <template v-slot:body>
                                <RadioButtons :options="userTasks" :currentOptionId="currentTask.id" :optionNameKey="'title'" :optionValueKey="'id'" @change="setCurrentTaskId($event); $refs.taskDropdown.toggle()"/>
                            </template>
                        </Dropdown>

                        <!-- <Dropdown class="dropdown-parent right" ref="countryDropdown">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button" @click="slotProps.toggle">
                                    <img src="/assets/Path5699.svg">
                                    <span v-if="teamFilterId > 0">{{teams.find(x => x.id == teamFilterId).title}}</span>
                                    <span v-else-if="teamFilterId == 0">Global</span>
                                    <span v-else>No team available</span>
                                    <i class="far fa-chevron-down"></i>
                                </div>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Switch team</span>
                            </template>
                            <template v-slot:body>
                                <RadioButtons :options="teamsForFilter" :currentOptionId="teamFilterId" :optionNameKey="'title'" :optionValueKey="'id'" @change="setTeamFilter($event); $refs.countryDropdown.toggle()"/>
                            </template>
                        </Dropdown> -->
                    </div>
                </div>
                <productTabs :productTotals="productsScopedFilteredTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
                <products ref="productsComponent" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="collection.teams" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsScopedFiltered" :loading="loadingProducts" :authUser="authUser" @onSelect="setSelectedProduct"/>
                <SelectedController :totalCount="productsScopedFiltered.length" :selected="selectedProductIDs" @onSelectedAction="submitSelectedAction" @onClearSelection="clearSelectedProducts"/>
            </template>
            <template v-if="loadingCollections">
                <Loader/>
            </template>

        </template>
        <template v-else>
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 50vh">
                <p>You don't have access to this file</p>
                <router-link to="/collection" class="button dark wide">Go to collections</router-link>
            </div>
        </template>

    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import Products from '../Products'
import ProductTabs from '../ProductTabs'
import CatalogueHeader from '../CatalogueHeader'
import Loader from '../Loader'
import SelectedController from '../SelectedController'
import CheckboxButtons from '../input/CheckboxButtons'
import RadioButtons from '../RadioButtons'
import Dropdown from '../Dropdown'

import Comment from '../../store/models/Comment'
import Product from '../../store/models/Product'
import User from '../../store/models/User'
import Team from '../../store/models/Team'
import Collection from '../../store/models/Collection'
import ProductFinalAction from '../../store/models/ProductFinalAction';
import CommentVote from '../../store/models/CommentVote';
import Category from '../../store/models/Category';
import Task from '../../store/models/Task';
import UserTeam from '../../store/models/UserTeam';
import AuthUser from '../../store/models/AuthUser';
import TeamProduct from '../../store/models/TeamProduct';
import PhaseProduct from '../../store/models/PhaseProduct';
import TaskTeam from '../../store/models/TaskTeam'
import FileTask from '../../store/models/FileTask'
import TaskParent from '../../store/models/TaskParent'

export default{
    name: 'catalogue',
    store,
    components: {
        Products,
        ProductTabs,
        SelectedController,
        Loader,
        CatalogueHeader,
        CheckboxButtons,
        Dropdown,
        RadioButtons,
    },
    data: function () { return {
        // currentProductFilter: 'overview',
        selectedProductIDs: [],
        // selectedCategoryIDs: [],
        // selectedCategories: [],
        // selectedDeliveryDates: [],
        sortBy: 'datasource_id',
        // sortBy: 'ins',
        sortAsc: true,
        unsub: '',
        test: '',
        hideQuickOut: false,
        hideQuickIn: false,
        // unreadOnly: false,
    }},
    watch: {
        products: function(newValue, oldValue) {
            // CODE to make sure the products stay sorted in the same way
            // Save the old order of the products
            console.log('Products recalculated')
            if (newValue.length == oldValue.length) {
                let index = 0
                oldValue.forEach(product => {
                    const newIndex = newValue.find(x => x.id == product.id)
                    if (newIndex) {
                        newIndex.sortIndex = index
                    }
                    product.sortIndex = index
                    index++
                })
                // Sort the products in the same was as they were before
                this.sortProducts('sortIndex')
            }
        },
        tasks: function(newValue, oldValue) {
            console.log('Tasks recalculated')
        },
        userTasks: function(newValue, oldValue) {
            console.log('User Tasks recalculated')
        },
        currentTask: function(newValue, oldValue) {
            console.log('current task changed!')
            if (newValue.id != oldValue.id) {
                // If we have a new task set the default filter
                this.setDefaultFilter()

                // Reset sort to default
                this.sortBy = 'datasource_id'
                this.sortAsc = true
                this.sortProducts()
            }
        }
    },
    computed: {
        ...mapGetters('entities/products', ['loadingProducts', 'productsScoped', 'productsScopedFilteredByCategory', 'productsScopedFiltered', 'productsScopedFilteredTotals', 'productsRaw']),
        ...mapState('entities/products', ['selectedCategories', 'selectedDeliveryDates']),
        ...mapGetters('entities/products', {allProducts: 'products'}),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/collections', ['loadingCollections', 'files', 'currentFile']),
        ...mapGetters('entities/teams', ['teams']),
        ...mapGetters('entities/tasks', ['userTasks', 'tasks']),
        ...mapGetters('persist', ['currentTeamId', 'currentTask', 'teamFilterId', 'currentWorkspaceId', 'userPermissionLevel', 'actionScope', 'viewAdminPermissionLevel', 'currentTeam', 'currentWorkspace', 'authUser', 'currentTask']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        currentProductFilter: {
            get () {
                return this.$store.state.entities.products.currentProductFilter
            },
            set (value) {
                this.setCurrentProductFilter(value)
                // Reset the products page limit
                this.$refs.productsComponent.resetPageLimit()
            }
        },
        selectedCategories: {
            get () {
                return this.$store.state.entities.products.selectedCategories
            },
            set (value) {
                this.updateSelectedCategories(value)
                // Reset the products page limit
                this.$refs.productsComponent.resetPageLimit()
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.state.entities.products.selectedDeliveryDates
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
                // Reset the products page limit
                this.$refs.productsComponent.resetPageLimit()
            }
        },
        selectedBuyerGroups: {
            get () {
                return this.$store.state.entities.products.selectedBuyerGroups
            },
            set (value) {
                this.updateSelectedBuyerGroups(value)
                // Reset the products page limit
                this.$refs.productsComponent.resetPageLimit()
            }
        },
        unreadOnly: {
            get () {
                return this.$store.state.entities.products.unreadOnly
            },
            set (value) {
                this.setUnreadOnly(value)
            }
        },
        products() {
            return this.productsScoped
        },
        collection() {
            return this.currentFile
        },
        sortMethod () {
            let key = this.sortBy
            let sortMethod
            if (!this.loadingProducts) {
                if (key == 'action') {
                    sortMethod = 'action'
                }
                else if (key == 'focus') {
                    sortMethod = 'focus'
                }
                else if (key == 'ins') {
                    sortMethod = 'ins'
                }
                else {
                    if ( typeof this.products[0][key] == 'object' ) {
                        sortMethod = 'object'
                    }
                    else {
                        sortMethod = 'key'
                    }
                }
            }
            return sortMethod
        },
        selectedProducts() {
            const products = this.productsScopedFiltered
            const selectedProducts = []
            this.selectedProductIDs.forEach(index => {
                selectedProducts.push(products[index].id)
            })
            return selectedProducts
        },
        dynamicCategories() {
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
        dynamicDeliveryDates() {
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
        dynamicBuyerGroups() {
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
        // teamsForFilter() {
        //     if (this.userPermissionLevel >= 3) {
        //         const teamsToReturn = JSON.parse(JSON.stringify(this.teams))
        //         teamsToReturn.unshift({title: 'Global', id: 0})
        //         return teamsToReturn
        //     }
        //     else return this.teams
        // },
        productsNoIn() {
            const products = this.productsScopedFiltered
            let productMatches = []
            products.forEach(product => {
                if (product.ins.length <= 0 && product.focus.length <= 0) {
                    productMatches.push(product)
                }
            })
            return productMatches
        },
        productsNoOutNoComment() {
            const products = this.productsScopedFiltered
            let productMatches = []
            products.forEach(product => {
                if (product.commentsScoped.length < 1 && product.outs.length < 1 && product.requests.length < 1) {
                    productMatches.push(product)
                }
            })
            return productMatches
        },
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapMutations('entities/products', ['updateSelectedCategories', 'updateSelectedDeliveryDates', 'setUnreadOnly', 'setCurrentProductFilter', 'updateSelectedBuyerGroups']),
        ...mapActions('entities/actions', ['fetchActions', 'updateManyActions', 'updateManyTaskActions', 'createManyActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setTeamFilter', 'setCurrentTaskId']),
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
            this.$cookies.set(`quick_out_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        setHideQuickIn() {
            this.hideQuickIn = true
            this.$cookies.set(`quick_in_${this.currentFile.id}_${this.currentTask.id}`, true, Infinity)
        },
        setProductFilter(filter) {
            this.setCurrentProductFilter(filter)
            this.clearSelectedProducts()
            // Reset the products page limit
            this.$refs.productsComponent.resetPageLimit()
        },
        setSelectedProduct(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selectedProductIDs
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        clearSelectedProducts() {
            this.selectedProductIDs = []
            this.$refs.productsComponent.resetSelected()
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
                const thisProduct = this.products.find(x => x.id == product)

                if (thisProduct.currentAction != null) {
                    // If product has a final action
                    if (thisProduct.currentAction.action != actionType) {
                        // If the products final action isnt the same as the one we are trying to set
                        productsToUpdate.push(product)
                    }
                } 
                // If product does not have a final action
                else productsToCreate.push(product)

            })

            // Submit the selection
            if (productsToUpdate.length > 0) {
                if (this.currentTask.type == 'feedback') {
                    this.updateManyActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
                } else this.updateManyTaskActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
            }
            if (productsToCreate.length > 0) {
                if (this.currentTask.type == 'feedback') {
                    this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: false})
                } else this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: true})
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
                if (this.currentTask.type == 'feedback') {
                    this.updateManyActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
                } else this.updateManyTaskActions({productIds: productsToUpdate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: null})
            }
            if (productsToCreate.length > 0) {
                if (this.currentTask.type == 'feedback') {
                    this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: false})
                } else this.createManyActions({productIds: productsToCreate, task_id: this.currentTask.id, user_id: user_id, action_code: actionType, is_task_action: true})
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
        sortProducts(keyOverwrite) {
            console.log('sorting products')

            const products = this.productsScopedFiltered
            // let key = this.sortBy
            let key = (keyOverwrite) ? keyOverwrite : this.sortBy
            let sortAsc = (keyOverwrite) ? true : this.sortAsc
            const sortMethod = (keyOverwrite) ? 'custom' : this.sortMethod
            const currentTaskType = this.currentTask.type
            let dataSorted = []

            if (products.length > 0) {

                // Always sort the products by datasource_id first before sorting with the chosen method, to make sure the products are always sorted in the same manner
                products.sort((a, b) => {
                    if ( a.datasource_id == b.datasource_id ) {
                        return 0
                    } else if (sortAsc) {
                        return (a.datasource_id > b.datasource_id) ? 1 : -1
                    }
                    else return (a.datasource_id < b.datasource_id) ? 1 : -1
                })

                dataSorted = products.sort((a, b) => {

                    if (sortMethod == 'action') {
                        key = 'currentAction'
                        if (currentTaskType == 'approval') {
                            // First sort by has request
                            if (a.requests.length > 0 && !a.currentAction) {
                                if (b.requests.length > 0 && !b.currentAction) {
                                    return 0
                                } else {
                                    // If only A has requests
                                    if (sortAsc)
                                        return 1
                                        else return -1
                                }
                            } else if (b.requests.length > 0 && !b.currentAction) {
                                // If only B has an inherited action
                                if (sortAsc)
                                    return -1
                                    else return 1
                            }
                            // Then sort by current action
                            else if (a[key] != null) {
                                if (b[key] != null) {
                                    // If A and B has a key
                                    if (sortAsc)
                                        return (a[key].action > b[key].action) ? 1 : -1
                                        else return (a[key].action < b[key].action) ? 1 : -1
                                } else {
                                    // If ONLY A has a key
                                    if (sortAsc)
                                        return 1
                                        else return -1
                                }
                            } else if (b[key] != null) {
                                // If ONLY B has a key
                                if (sortAsc)
                                    return -1
                                    else return 1
                            }
                            else return 0

                        }
                        else if (currentTaskType == 'decision') {
                            // Sort by current action
                            if (a[key] != null) {
                                if (b[key] != null) {
                                    // If A and B has a key
                                    if (sortAsc)
                                        return (a[key].action > b[key].action) ? 1 : -1
                                        else return (a[key].action < b[key].action) ? 1 : -1
                                } else {
                                    // If ONLY A has a key
                                    if (sortAsc)
                                        return 1
                                        else return -1
                                }
                            } else if (b[key] != null) {
                                // If ONLY B has a key
                                if (sortAsc)
                                    return -1
                                    else return 1
                            }
                            // Sort by out in filter
                            else if (a.outInFilter) {
                                if (b.outInFilter) {
                                    return 0
                                } else {
                                    // If only A has requests
                                    if (sortAsc)
                                        return 1
                                        else return -1
                                }
                            } else if (b.outInFilter) {
                                // If only B has an inherited action
                                if (sortAsc)
                                    return -1
                                    else return 1
                            }
                            else return 0

                        }
                        else {

                            if (a[key] != null) {
                                if (b[key] != null) {
                                    // If A and B has a key
                                    if (sortAsc)
                                        return (a[key].action > b[key].action) ? 1 : -1
                                        else return (a[key].action < b[key].action) ? 1 : -1
                                } else {
                                    // If ONLY A has a key
                                    if (sortAsc)
                                        return 1
                                        else return -1
                                }
                            } else if (b[key] != null) {
                                // If ONLY B has a key
                                if (sortAsc)
                                    return -1
                                    else return 1
                            } else {
                                // Neither A nor B has a key
                                return 0
                            }

                        }
                    }

                    else if ( sortMethod == 'focus' ) {
                        // First sort by focus
                        if ( a[key].length != b[key].length ) {

                            if (sortAsc)
                                return (a[key].length > b[key].length) ? 1 : -1
                                else return (a[key].length < b[key].length) ? 1 : -1

                        // Then sort by ins
                        } else if ( a.ins.length == b.ins.length ) {
                                return 0 
                        } else {
                            if (sortAsc)
                                return (a.ins.length > b.ins.length) ? 1 : -1
                                else return (a.ins.length < b.ins.length) ? 1 : -1 
                        }
                    }

                    else if ( sortMethod == 'in' ) {
                        // First sort by focus
                        const aInLength = a[key].length + a.focus.length
                        const bInLength = b[key].length + b.focus.length

                        if ( aInLength != bInLength ) {

                            if (sortAsc)
                                return (aInLength > bInLength) ? 1 : -1
                                else return (aInLength < bInLength) ? 1 : -1

                        // Then sort by focus
                        } else if ( a.focus.length == b.focus.length ) {
                                return 0 
                        } else {
                            if (sortAsc)
                                return (a.focus.length > b.focus.length) ? 1 : -1
                                else return (a.focus.length < b.focus.length) ? 1 : -1 
                        }
                    }
                    
                    else {

                        if ( sortMethod == 'object' ) {

                            if (currentTaskType == 'decision' && key == 'commentsScoped')
                                key = 'commentsInherited'

                            // Sort by key length (arrays)
                            if ( a[key].length == b[key].length ) {
                                return 0
                            } else if (sortAsc) {
                                return (a[key].length > b[key].length) ? 1 : -1
                            }
                            else return (a[key].length < b[key].length) ? 1 : -1

                        }

                        // If the keys aren't objects, finalActions or strings - sort by the key
                        else {

                            if ( a[key] == b[key] ) {
                                return 0
                            } else if (sortAsc) {
                                return (a[key] > b[key]) ? 1 : -1
                            }
                            else return (a[key] < b[key]) ? 1 : -1
                        }

                    }
                })
            }
            return dataSorted
        },
        setDefaultFilter() {
            // Set the starting product filter
            if (this.currentTask.completed.find(x => x.file_id == this.currentFile.id)) {
                this.setProductFilter('ins')
            } else if (this.currentTask.type == 'approval') {
                this.setProductFilter('nds')
            } else {
                this.setProductFilter('overview')
            }
        }
    },
    created() {
        this.hideQuickOut = this.$cookies.get(`quick_out_${this.currentFile.id}_${this.currentTask.id}`)
        this.hideQuickIn = this.$cookies.get(`quick_in_${this.currentFile.id}_${this.currentTask.id}`)
        // Initially sort the products
        // this.sortProducts()
    },
    async mounted() {
        this.setDefaultFilter()
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
