<template>
    <div class="catalogue">
        <template v-if="!loadingCollections">
            <progress-bar :loading="loadingCollections" :catalogue="collection" :productTotals="productTotals"/>
            <filters :teams="teams" :teamFilterId="teamFilterId" :categories="categories" :selectedCategoriesCount="selectedCategoryIDs.length" @onSelectTeam="filterByTeam" @onSelectCategory="setSelectedCategory" @onClearFilter="clearSelectedCategories"/>
            <!-- <product-single :product="singleProductToShow" :nextProductID="nextSingleProductID" :loading="loadingProducts" :authUser="authUser" @closeSingle="setSingleProduct" @nextSingle="setNextSingle"/> -->
            <product-tabs :productTotals="productTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
            <!-- <products ref="productsComponent" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="teams" :singleProductToShow="singleProductToShow" :nextSingleProductID="nextSingleProductID" :prevSingleProductID="prevSingleProductID" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsSorted" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct" @closeSingle="setSingleProduct" @nextSingle="setNextSingle" @prevSingle="setPrevSingle"/> -->
            <products ref="productsComponent" :teamFilterId="teamFilterId" :teamUsers="teamUsers" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="teams" :singleProductToShow="singleProductToShow" :nextSingleProductID="nextSingleProductID" :prevSingleProductID="prevSingleProductID" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsSorted" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct" @closeSingle="setSingleProduct" @nextSingle="setNextSingle" @prevSingle="setPrevSingle"/>
            <SelectedController :totalCount="productsSorted.length" :selected="selectedProductIDs" @onSelectedAction="submitSelectedAction"/>
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
import ProgressBar from '../ProgressBar'
import Filters from '../Filters'
import Loader from '../Loader'
import SelectedController from '../SelectedController'
import Comment from '../../store/models/Comment'
import Product from '../../store/models/Product'
// import User from '../../store/models/User'
// import Team from '../../store/models/Team'
import Country from '../../store/models/Country'
import Collection from '../../store/models/Collection'
import ProductFinalAction from '../../store/models/ProductFinalAction';
import CommentVote from '../../store/models/CommentVote';
import Category from '../../store/models/Category';
import UserTeam from '../../store/models/UserTeam';

export default{
    name: 'catalogue',
    store,
    components: {
        Products,
        ProductTabs,
        SelectedController,
        ProgressBar,
        Loader,
        Filters,
    },
    data: function () { return {
        singleProductID: -1,
        currentProductFilter: 'overview',
        selectedProductIDs: [],
        selectedCategoryIDs: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        teamFilterId: '-1',
        catalogueId: '',
    }},
    computed: {
        ...mapGetters('entities/products', ['loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/collections', ['loadingCollections']),
        collectionId () {
            return this.$route.params.catalogueId
        },
        collection() {
            return Collection.find(this.collectionId)
        },
        products () {
            const products = Product.query().with(['actions.user.country', 'actions.user.team']).with(['comments.user.country', 'comments.votes', 'comments.user.team']).with('productFinalAction').all()
            const totalUsers = this.teamUsers
            const userId = this.authUser.id
            const teamFilterId = this.teamFilterId
            const data = []
            products.forEach(product => {
                product.color_variants = JSON.parse(product.color_variants)
                // product.images = []
                product.ins = []
                product.outs = []
                product.focus = []
                product.userAction = 0

                // product.color_variants.forEach(variant => {
                //     product.images.push(variant)
                // })
                // if (product.productFinalAction != null)
                //     product.productFinalAction = {}
                product.nds = JSON.parse(JSON.stringify(totalUsers)) // Copy our users into a new variable
                product.actions.forEach(action => {

                    // Filter actions by the current team filter
                    if ( teamFilterId > 0 ) {
                        // Check if the user has a team
                        if (action.user.team != null) {
                            if (action.user.team.id == teamFilterId) {
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
                    {
                        if (action.action == 0)
                            product.userAction = 1
                        if (action.action == 1)
                            product.userAction = 2
                    }

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

                if (key == 'productFinalAction') {
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
                    return ( (this.actions / (this.actions + this.nds)) * 100 ).toFixed(0)
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
        teamUsers() {
            const teamFilterId = this.teamFilterId
            let totalUsers = []
            if (teamFilterId > 0) {
                this.users.forEach(user => {
                    if(user.team_ids == teamFilterId)
                        totalUsers.push(user)
                })
            } else {
                totalUsers = this.users
            }
            return totalUsers
        },
        actions() {
            return this.$store.getters['entities/actions/all']()
        },
        comments() {
            const comments = Comment.query().with(['votes', 'user.country', 'user.team']).all()
            const teamFilterId = this.teamFilterId
            if (teamFilterId > 0) {
                let commentsToReturn = []
                comments.forEach(comment => {
                    if (comment.user.team_ids == teamFilterId)
                        commentsToReturn.push(comment)
                })
                return commentsToReturn
            } 
            else return comments
        },
        countries() {
            return Country.query().all()
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
            return this.$store.getters.authUser;
        },
        userTeams() {
            return UserTeam.query().with('team').with('user').all()
        },
        users() {
            // Generate users from the userTeam model
            const userTeams = JSON.parse(JSON.stringify(this.userTeams))
            const usersToReturn = []

            let ready = true 

            userTeams.forEach(userTeam => {
                if (userTeam.team == null || userTeam.user == null) {
                    ready = false
                }
            })

            if ( ready ) {
                
                userTeams.forEach(userTeam => {
                    const newUser = userTeam.user
                    newUser.team = userTeam.team
                    usersToReturn.push(newUser)
                })

            }
            return usersToReturn
        },
        teams () {
            const userTeams = JSON.parse(JSON.stringify(this.userTeams))
            // Generate teams from the userTeams model
            let teams = []

            let ready = true 
            userTeams.forEach(userTeam => {
                if (userTeam.team == null || userTeam.user == null) {
                    ready = false
                }
            })

            if ( ready ) {

                userTeams.forEach(userTeam => {
                    // If the team doesnt already exist - create it
                        if (!teams.filter(e => e.id == userTeam.team_id).length > 0) {
                            teams.push(userTeam.team)
                        }
                })
            
            }

            // Manually find the teams and the users belonging to each team.
            // This is only necessary because I cannot make the Vuex ORM realtionship work 
            // If you can make it work, please be my guest
            const users = this.users
            const data = []

            teams.forEach(team => {
                const thisTeam = {
                    id: team.id,
                    title: team.title,
                    users: []
                }
                users.forEach(user => {
                    if (user.team.id == thisTeam.id) {
                        // Find the users role
                        user.role = (user.role_id == 1) ? 'Sales' : (user.role_id == 2) ? 'Sales Rep' : 'Admin'
                        thisTeam.users.push(user)
                    }
                })
                data.push(thisTeam)
            })
            return data
        },
    },
    methods: {
        ...mapActions(['getAuthUser']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/countries', ['fetchCountries']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/commentVotes', ['fetchCommentVotes']),
        ...mapActions('entities/productFinalActions', ['fetchFinalActions']),
        ...mapActions('entities/productFinalActions', ['updateFinalAction']),
        ...mapActions('entities/categories', ['fetchCategories']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        // ...mapActions('entities/actions', ['updateActions']),
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
            const actionType = (method == 'in') ? 1 : 0
            // Submit the selection
            this.selectedProducts.forEach(product => {
                this.updateFinalAction({productToUpdate: product, phase: this.collection.phase, action_code: actionType})
            })
            // Reset the selection
            this.selectedProductIDs = []
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
        filterByTeam(id) {
            this.teamFilterId = id
        },
        async fetchInitialData() {
            // Get catalogue id
            this.catalogueId = this.$route.params.catalogueId
            
            // Get user
            await this.getAuthUser()
            this.teamFilterId = this.authUser.team_ids
        },
    },
    created() {
        this.fetchInitialData()
        // Fetch all our data
        this.fetchCountries()
        this.fetchProducts({collection_id: this.collectionId})
        this.fetchActions({collection_id: this.collectionId})
        this.fetchUsers({collection_id: this.collectionId})
        this.fetchComments({collection_id: this.collectionId})
        this.fetchCollections()
        this.fetchFinalActions({collection_id: this.collectionId})
        this.fetchTeams({collection_id: this.collectionId})
        this.fetchCommentVotes({collection_id: this.collectionId})
        this.fetchCategories()
        this.fetchUserTeams()
    },
    mounted() {

    }
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
</style>
