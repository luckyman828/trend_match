<template>
    <div class="catalogue">

        <template v-if="true">

            <template v-if="!loadingCollections">
                <catalogueHeader :collection="collection"/>
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
                                <span v-if="selectedCategories.length > 0" class="clear button invisible primary" @click="$refs.filterSelect.clear(); selectedCategories=[]">Clear filter</span>
                            </template>
                            <template v-slot:header="slotProps">
                                <span>Filter by category</span>
                            </template>
                            <template v-slot:body>
                                <CheckboxButtons :options="dynamicCategories" ref="filterSelect" v-model="selectedCategories" @change="$refs.filterSelect.submit()"/>
                            </template>
                        </Dropdown>
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
                <product-tabs :productTotals="productTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
                <products ref="productsComponent" :teamUsers="teamUsers" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="collection.teams" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsFiltered" :loading="loadingProducts" :authUser="authUser" @onSelect="setSelectedProduct"/>
                <SelectedController :totalCount="productsFiltered.length" :selected="selectedProductIDs" @onSelectedAction="submitSelectedAction" @onClearSelection="clearSelectedProducts"/>
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
import { mapActions, mapGetters } from 'vuex'
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
        currentProductFilter: 'overview',
        selectedProductIDs: [],
        selectedCategoryIDs: [],
        selectedCategories: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        unsub: '',
        test: '',
    }},
    watch: {
        products: function(newValue, oldValue) {
            // CODE to make sure the products stay sorted in the same way
            // Save the old order of the products
            console.log('Products recalculated')
            console.log(newValue)
            // if (newValue.length == oldValue.length) {
                // let index = 0
                // oldValue.forEach(product => {
                //     const newIndex = newValue.find(x => x.id == product.id)
                //     if (newIndex) {
                //         newIndex.sortIndex = index
                //     }
                //     product.sortIndex = index
                //     index++
                // })
                // // Sort the products in the same was as they were before
                // this.sortProducts('sortIndex')
            // }
        },
        tasks: function(newValue, oldValue) {
            console.log('Tasks recalculated')
        },
        userTasks: function(newValue, oldValue) {
            console.log('User Tasks recalculated')
        }
    },
    computed: {
        // ...mapGetters('entities/products', ['loadingProducts', {allProducts: 'products'}, 'productsScopedByInheritance']),
        ...mapGetters('entities/products', ['loadingProducts', 'productsScopedByInheritance']),
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
        products() {
            if (this.currentTask.inherit_from_id) {
                if (this.currentTask.type == 'approval' || this.currentTask.approvalParent) {
                    return this.productsScopedByInheritance.filter(x => x.requests.length > 0)
                } else {
                    return this.productsScopedByInheritance
                }
            } else {
                return this.allProducts
            }
        },
        teamProducts() {
            return TeamProduct.with('products').all()
        },
        phaseProducts() {
            return PhaseProduct.with('products').all()
        },
        collection() {
            return this.currentFile
        },
        productsFilteredByCategory() {
            const products = this.products
            const categories = this.selectedCategories
            let productsToReturn = products

            // First filter by category
            if (categories.length > 0) {
                
                const filteredByCategory = productsToReturn.filter(product => {
                        return Array.from(categories).includes(product.category)
                })
                productsToReturn = filteredByCategory
            }

            return productsToReturn
        },
        productsFiltered() {
            const method = this.currentProductFilter
            const products = this.productsFilteredByCategory
            let productsToReturn = products

            // filter by in/out
            if ( ['ins', 'outs', 'nds'].includes(method) ) {
                const filteredByAction = productsToReturn.filter(product => {
                    if (method == 'ins') {
                        if (product[this.actionScope] != null)
                            return product[this.actionScope].action >= 1
                    } else if (method == 'outs') {
                        if (product[this.actionScope] != null)
                            return product[this.actionScope].action == 0
                    } else if (method == 'nds') {
                        return product[this.actionScope] == null
                    }
                })
                productsToReturn = filteredByAction
            }

            
            return productsToReturn
        },
        sortMethod () {
            let key = this.sortBy
            let sortMethod
            if (!this.loadingProducts) {
                if (['userAction', 'teamAction', 'phaseAction', 'productFinalAction', 'userAction'].includes(key) ) {
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
            const products = this.products
            const selectedProducts = []
            this.selectedProductIDs.forEach(index => {
                selectedProducts.push(products[index].id)
            })
            return selectedProducts
        },
        productTotals() {
            const products = this.products
            const data = {
                // Product actions for the currect task dividided by the total amount of products times the length og NDs
                get actions () {
                    return this.ins + this.outs
                },
                get progress () {
                    let progress = 100
                    if (this.actions != null || this.nds != null)
                        progress = parseInt( ( (this.actions / (this.actions + this.nds)) * 100 ).toFixed(0) )
                    return progress
                },
                ins: 0,
                outs: 0,
                nds: 0,
                final: {
                    get products () { return products.length },
                    ins: 0,
                    outs: 0,
                    nds: 0,
                }
            }
            products.forEach(product => {
                    data.ins += product.ins.length
                    data.outs += product.outs.length
                    data.nds += product.nds.length

                if (product[this.actionScope] != null) {
                    if (product[this.actionScope].action >= 1)
                        data.final.ins ++
                    else if (product[this.actionScope].action == 0)
                        data.final.outs ++
                }
                else data.final.nds ++
            })
            return data
        },
        teamUsers () {
            let usersToReturn = []
            if (this.teamFilterId > 0) {
                const thisTeam = this.teams.find(team => team.id == this.teamFilterId)
                if (thisTeam)
                    thisTeam.users.forEach(user => {
                        const fileUser = this.collection.users.find(x => x.id == user.id)
                        if (fileUser)
                            usersToReturn.push(fileUser)
                    })
            } 
            return usersToReturn
        },
        actions() {
            return this.$store.getters['entities/actions/all']()
        },
        comments() {
            const comments = Comment.query().with(['votes', 'user.teams']).all()
            const teamFilterId = this.teamFilterId
            if (teamFilterId > 0) {
                let commentsToReturn = []
                comments.forEach(comment => {
                    if (comment.user.teams[0].id == teamFilterId)
                        commentsToReturn.push(comment)
                })
                return commentsToReturn
            } 
            else return comments
        },
        categories() {
            return Category.query().with('products').all()
        },
        dynamicCategories() {
            const products = this.products
            let uniqueCategories = []
            products.forEach(product => {
                const found = (uniqueCategories.includes(product.category))
                if (!found)
                    uniqueCategories.push(product.category)
            })
            return uniqueCategories
        },
        finalActions() {
            return ProductFinalAction.query().all()
        },
        commentVotes() {
            return CommentVote.query().with('comment').all()
        },
        users () {
            return User.query().with('teams').all()
        },
        teams () {
            return this.$store.getters['entities/teams/teams']
        },
        teamsForFilter() {
            if (this.userPermissionLevel >= 3) {
                const teamsToReturn = JSON.parse(JSON.stringify(this.teams))
                teamsToReturn.unshift({title: 'Global', id: 0})
                return teamsToReturn
            }
            else return this.teams
        },
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions', 'updateManyActions', 'updateManyTaskActions', 'createManyActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('persist', ['setTeamFilter', 'setCurrentTaskId']),
        setProductFilter(filter) {
            this.currentProductFilter = filter
            this.clearSelectedProducts()
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
        setSelectedCategory(id) {
            const selected = this.selectedCategoryIDs
            const found = selected.findIndex(el => el == id)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(id)
        },
        clearSelectedCategories() {
            this.selectedCategoryIDs = []
        },
        submitSelectedAction(method) {
            // Find out whether we should update or delete the products final actions
            const phase = this.collection.phase
            const user_id = this.authUser.id
            const actionScope = this.actionScope
            const actionType = method
            let productsToUpdate = []
            let productsToCreate = []

            this.selectedProducts.forEach(product => {
                const thisProduct = this.products.find(x => x.id == product)

                if (thisProduct.currentAction != null) {
                    console.log('There is an action!')
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

            const products = this.productsFiltered
            // let key = this.sortBy
            let key = (keyOverwrite) ? keyOverwrite : this.sortBy
            let sortAsc = (keyOverwrite) ? true : this.sortAsc
            const sortMethod = (keyOverwrite) ? 'custom' : this.sortMethod

            // Always sort the products by datasource_id first before sorting with the chosen method, to make sure the products are always sorted in the same manner
            products.sort((a, b) => {
                if ( a.datasource_id == b.datasource_id ) {
                    return 0
                } else if (sortAsc) {
                    return (a.datasource_id > b.datasource_id) ? 1 : -1
                }
                else return (a.datasource_id < b.datasource_id) ? 1 : -1
            })

            const dataSorted = products.sort((a, b) => {

                if (sortMethod == 'action') {
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

                        // Sort by key length
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
            return dataSorted
        },
    },
    mounted() {
        this.sortProducts
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
                margin-right: 8px;
            }
            &.right > * {
                margin-left: 8px;
            }
        }
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
</style>
