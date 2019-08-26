<template>
    <div class="catalogue">
        <template v-if="!loadingCollections">
            <catalogueHeader :collection="collection" :startDate="startDate" :endDate="endDate" :productTotals="productTotals"/>
            <div class="filters">
                <DropdownCheckbox :buttonText="'categories'" :title="'Filter by category'" :options="categories" class="dropdown-parent left" v-model="selectedCategoryIDs">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button item-filter-button" @click="slotProps.toggle">
                            <span>Category</span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedCategoryIDs.length > 0" class="bubble">
                                {{selectedCategoryIDs.length}}
                            </span>
                        </div>
                        <span v-if="selectedCategoryIDs.length > 0" class="clear button invisible primary" @click="slotProps.clear(); selectedCategoryIDs=[]">Clear filter</span>
                    </template>
                </DropdownCheckbox>
                <DropdownRadio :options="teams" :currentOptionId="currentTeamId" :defaultOption="{id: 0, title: 'GLOBAL'}" class="dropdown-parent right" @submit="setCurrentTeam">
                    <template v-slot:button="slotProps">
                        <div class="dropdown-button" @click="slotProps.toggle">
                            <img src="/assets/Path5699.svg">
                            <span>{{slotProps.currentOption.title}}</span>
                            <i class="far fa-chevron-down"></i>
                        </div>
                    </template>
                </DropdownRadio>
            </div>
            <product-tabs :productTotals="productTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
            <products ref="productsComponent" :teamFilterId="currentTeamId" :teamUsers="teamUsers" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="teams" :singleProductToShow="singleProductToShow" :nextSingleProductID="nextSingleProductID" :prevSingleProductID="prevSingleProductID" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsSorted" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct" @closeSingle="setSingleProduct" @nextSingle="setNextSingle" @prevSingle="setPrevSingle"/>
            <SelectedController :totalCount="productsSorted.length" :selected="selectedProductIDs" @onSelectedAction="submitSelectedAction" @onClearSelection="clearSelectedProducts"/>
        </template>
        <template v-if="loadingCollections">
            <Loader/>
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
import DropdownRadio from '../DropdownRadio'
import DropdownCheckbox from '../DropdownCheckbox'
import Comment from '../../store/models/Comment'
import Product from '../../store/models/Product'
import User from '../../store/models/User'
import Team from '../../store/models/Team'
import Collection from '../../store/models/Collection'
import ProductFinalAction from '../../store/models/ProductFinalAction';
import CommentVote from '../../store/models/CommentVote';
import Category from '../../store/models/Category';
import UserTeam from '../../store/models/UserTeam';
import AuthUser from '../../store/models/AuthUser';

export default{
    name: 'catalogue',
    store,
    components: {
        Products,
        ProductTabs,
        SelectedController,
        Loader,
        DropdownCheckbox,
        DropdownRadio,
        CatalogueHeader
    },
    data: function () { return {
        singleProductID: -1,
        currentProductFilter: 'overview',
        selectedProductIDs: [],
        selectedCategoryIDs: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        // teamFilterId: -1,
        catalogueId: '',
        unsub: '',
    }},
    computed: {
        ...mapGetters('entities/products', ['loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/collections', ['loadingCollections']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId']),
        // currentFileId () {
        //     return this.$route.params.catalogueId
        // },
        collection() {
            return Collection.find(this.currentFileId)
        },
        startDate () {
            if (this.collection.start_time != null) {
                const date = this.collection.start_time
                const dateEnd = date.indexOf(" ")
                const newDate = date.substr(0, dateEnd)
                return newDate.replace('-', '/')
            }
            return 'Unset'
        },
        endDate () {
            if (this.collection.end_time != null) {
                const date = this.collection.end_time
                const dateEnd = date.indexOf(" ")
                const newDate = date.substr(0, dateEnd)
                return newDate.replace('-', '/')
            }
            return 'Unset'
        },
        products () {
            const products = Product.query().with(['actions.user.teams']).with(['comments.votes', 'comments.user.teams']).with('productFinalAction').all()
            const totalUsers = this.teamUsers
            const userId = this.authUser.id
            const teamFilterId = this.currentTeamId
            const data = []
            products.forEach(product => {
                product.color_variants = JSON.parse(product.color_variants)
                product.ins = []
                product.outs = []
                product.focus = []
                product.userAction = null
                product.commentsScoped = []

                // Scope comments to current teamFilter
                const comments = product.comments
                if ( teamFilterId > 0 ) {
                    let commentsScoped = []
                    // Loop through the comments
                    comments.forEach(comment => {
                        // Loop through comments users teams
                        let pushComment = false

                        // Check if the comment belongs to one of auth users teams
                        if ( comment.user.teams.find(x => x.id == teamFilterId) )
                            pushComment = true

                        // Check if the comment is final
                        if (comment.final || comment.product_final)
                            pushComment = true

                        if (pushComment)
                            product.commentsScoped.push(comment)
                    })
                }
                else if ( teamFilterId == 0) {
                    product.commentsScoped = comments
                }

                product.nds = JSON.parse(JSON.stringify(totalUsers)) // Copy our users into a new variable
                product.actions.forEach(action => {

                    // Filter actions by the current team filter
                    // Check if the action has a user
                    if ( teamFilterId > 0 && action.user != null ) {
                        // Check if the user has a team
                        if (action.user.teams[0] != null) {
                            // Find the users team
                            if ( action.user.teams.findIndex(x => x.id == teamFilterId) > -1 ) {
                            // if (action.user.teams[0].id == teamFilterId) {
                                if (action.action == 0)
                                    product.outs.push(action.user)
                                if (action.action == 1)
                                    product.ins.push(action.user)
                                if (action.action == 2)
                                    product.focus.push(action.user)
                            }
                        }
                    // Dont filter by team, id no current team is set
                    } else {
                        if (action.action == 0)
                            product.outs.push(action.user)
                        if (action.action == 1)
                            product.ins.push(action.user)
                        if (action.action == 2)
                            product.focus.push(action.user)
                    }

                    // Find the action this user has taken
                    if (action.user_id == userId)
                        product.userAction = action

                    let index = product.nds.findIndex(nd => nd.id == action.user_id)
                    if (index > -1) {
                        product.nds.splice(index,1)
                    }
                })
                data.push(product)
            })
            return data
        },

        productsFilteredByCategory() {
            const products = this.products
            const categoryIDs = this.selectedCategoryIDs
            let productsToReturn = products

            // First filter by category
            if (this.selectedCategoryIDs.length > 0) {
                
                const filteredByCategory = productsToReturn.filter(product => {
                        return Array.from(this.selectedCategoryIDs).includes(product.category_id)
                })
                productsToReturn = filteredByCategory
            }

            return productsToReturn
        },
        productsFiltered() {
            const method = (this.currentProductFilter == 'ins') ? 1 : (this.currentProductFilter == 'outs') ? 0 : (this.currentProductFilter == 'nds') ? 2 : -1
            const products = this.productsFilteredByCategory
            let productsToReturn = products

            // filter by in/out
            if (method > -1) {
                const filteredByAction = productsToReturn.filter(product => {
                    if (method != 2) {
                        if (product.productFinalAction != null)
                        return product.productFinalAction.action == method
                    } else {
                        return product.productFinalAction == null
                    }
                })
                productsToReturn = filteredByAction
            }

            
            return productsToReturn
        },
        productsSorted() {
            const products = this.productsFiltered
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const dataSorted = products.sort((a, b) => {

                if (key == 'productFinalAction' || 'userAction') {
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

                else if (key == 'focus') {
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

                else if (key == 'ins') {
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

                    if ( typeof products[0][key] == 'object' ) {

                        // Sort by key length
                        if ( a[key].length == b[key].length ) {
                            return 0
                        } else if (sortAsc)
                            return (a[key].length > b[key].length) ? 1 : -1
                            else return (a[key].length < b[key].length) ? 1 : -1

                    }

                    // If the keys aren't objects, finalActions or strings - sort by the key
                    else {

                        if ( a[key] == b[key] ) {
                            return 0
                        } else if (sortAsc)
                            return (a[key] > b[key]) ? 1 : -1
                            else return (a[key] < b[key]) ? 1 : -1
                    }

                }
            })
            return dataSorted
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
            const products = this.productsFilteredByCategory

            const data = {
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
                    products: products.length,
                    ins: 0,
                    outs: 0,
                    nds: 0,
                }
            }
            products.forEach(product => {
                    data.ins += product.ins.length
                    data.outs += product.outs.length
                    data.nds += product.nds.length

                if (product.productFinalAction != null) {
                    if (product.productFinalAction.action == 1)
                        data.final.ins ++
                    else if (product.productFinalAction.action == 0)
                        data.final.outs ++
                }
                else data.final.nds ++
            })
            return data
        },
        singleProductToShow() {
            const productToReturn = (this.singleProductID != -1) ? this.products.find(product => product.id == this.singleProductID) : {}
            return productToReturn
        },
        nextSingleProductID() {
            const products = this.productsSorted

            // Check if we have a single product
            if (this.singleProductID != -1) {
                const currentProductIndex = products.findIndex(product => product.id == this.singleProductID)
                // Check that the current single product is not the last product
                if (currentProductIndex + 1 < products.length)
                    return products[currentProductIndex + 1].id
                    else return -1
            }
            else return -1
        },
        prevSingleProductID() {
            const products = this.productsSorted

            // Check if we have a single product
            if (this.singleProductID != -1) {
                const currentProductIndex = products.findIndex(product => product.id == this.singleProductID)
                // Check that the current single product is not the first product
                if (currentProductIndex != 0)
                    return products[currentProductIndex - 1].id
                    else return -1
            }
            else return -1
        },
        teamUsers () {
            let usersToReturn = []
            if (this.currentTeamId > 0) {
                const thisTeam = this.teams.find(team => team.id == this.currentTeamId)
                if (thisTeam)
                    usersToReturn = thisTeam.users
            } else if (this.currentTeamId == 0) {
                usersToReturn = this.users
            } else {
                usersToReturn = []
            }
            return usersToReturn
        },
        actions() {
            return this.$store.getters['entities/actions/all']()
        },
        comments() {
            const comments = Comment.query().with(['votes', 'user.teams']).all()
            const teamFilterId = this.currentTeamId
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
        finalActions() {
            return ProductFinalAction.query().all()
        },
        commentVotes() {
            return CommentVote.query().with('comment').all()
        },
        authUser() {
            // return this.$store.getters.authUser;
            return AuthUser.query().with('teams').with('workspaces').first()
        },
        users () {
            return User.query().with('teams').all()
        },
        teams () {
            // Manually find the teams and the users belonging to each team.
            // This is only necessary because I cannot make the Vuex ORM realtionship work 
            // If you can make it work, please be my guest
            const teams = Team.query().with('users').all()
            const users = this.users
            // Loop through the users and sort them between the teams
            users.forEach(user => {
                // First check that the user has a team and that the team has an id
                if (user.teams[0] != null) {
                    if ('id' in user.teams[0]) {
                        // If we have a team with an id
                        // Set the users role
                        user.role = (user.role_id == 1) ? 'Sales' : (user.role_id == 2) ? 'Sales Rep' : 'Admin'
                        user.teams.forEach(userTeam => {
                            // Loop through each of the users teams and add the user
                            // Find the corresponding team
                            const foundTeam = teams.find(team => team.id == userTeam.id)
                            foundTeam.users.push(user)
                        })
                    }
                }
            })
            return teams
        },
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions', 'updateManyActions', 'createManyActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('entities/productFinalActions', ['fetchFinalActions', 'updateFinalAction', 'deleteFinalAction', 'createManyFinalAction', 'updateManyFinalAction']),
        ...mapActions('entities/categories', ['fetchCategories']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        ...mapActions('persist', ['setCurrentTeam', 'setCurrentFileId']),
        setSingleProduct(index) {
            this.singleProductID = index
        },
        closeSingleProduct() {
            this.singleProductID = -1
        },
        setNextSingle() {
            this.singleProductID = this.nextSingleProductID
        },
        setPrevSingle() {
            this.singleProductID = this.prevSingleProductID
        },
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
            const actionType = (method == 'in') ? 1 : 0
            let productsToUpdate = []
            let productsToCreate = []

            this.selectedProducts.forEach(product => {
                const thisProduct = this.products.find(x => x.id == product)

                if (this.authUser.role_id >= 3) {
                    if (thisProduct.productFinalAction != null) {
                        // If product has a final action
                        if (thisProduct.productFinalAction.action != actionType) {
                            // If the products final action isnt the same as the one we are trying to set
                            productsToUpdate.push(product)
                        }
                    } 
                    // If product does not have a final action
                    else productsToCreate.push(product)
                }
                else if (this.authUser.role_id >= 2) {
                    if (thisProduct.userAction != null) {
                        // If product has a final action
                        if (thisProduct.userAction.action != actionType) {
                            // If the products final action isnt the same as the one we are trying to set
                            productsToUpdate.push(product)
                        }
                    } 
                    // If product does not have a final action
                    else productsToCreate.push(product)
                }

            })

            // Submit the selection
            if (productsToUpdate.length > 0) {
                if (this.authUser.role_id >= 3)
                    this.updateManyFinalAction({productIds: productsToUpdate, phase: phase, action_code: actionType})
                else if (this.authUser.role_id >= 2)
                    this.updateManyActions({productIds: productsToUpdate, user_id: user_id, action_code: actionType})
            }
            if (productsToCreate.length > 0) {
                if (this.authUser.role_id >= 3)
                    this.createManyFinalAction({productIds: productsToCreate, phase: phase, action_code: actionType})
                else if (this.authUser.role_id >= 2)
                    this.createManyActions({productIds: productsToCreate, user_id: user_id, action_code: actionType})
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
        },
        initRequiresWorkspace() {
            if (Collection.all().length <= 0)
                    this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                this.fetchUsers(this.currentWorkspaceId)
        },
        initRequiresFileId() {
            this.fetchProducts(this.currentFileId)
            this.fetchActions(this.currentFileId)
            this.fetchComments(this.currentFileId)
            this.fetchFinalActions(this.currentFileId)
            this.fetchCommentVotes(this.currentFileId)
            this.fetchCategories(this.currentFileId)
        }
    },
    created() {
        // Save a reference to the currently loaded file in the store, so we know if we need to refetch the products
        const routeFileId = this.$route.params.catalogueId
        if (this.currentFileId != routeFileId)
            this.setCurrentFileId(routeFileId),
            this.initRequiresFileId()

        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
    },
    destroyed() {
        this.unsub()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .filters {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
</style>
