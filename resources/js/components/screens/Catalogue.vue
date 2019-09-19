<template>
    <div class="catalogue">

        <template v-if="userHasAccess">

            <template v-if="!loadingCollections">
                <catalogueHeader :collection="collection" :teamUsers="teamUsers" :productTotals="productTotals"/>
                <div class="filters">
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
                            <!-- <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span> -->
                        </template>
                        <template v-slot:body>
                            <CheckboxButtons :options="dynamicCategories" ref="filterSelect" v-model="selectedCategories" @change="$refs.filterSelect.submit()"/>
                        </template>
                    </Dropdown>

                    <Dropdown class="dropdown-parent right" ref="countryDropdown">
                        <template v-slot:button="slotProps">
                            <div class="dropdown-button" @click="slotProps.toggle">
                                <img src="/assets/Path5699.svg">
                                <span v-if="currentTeamId > 0">{{teams.find(x => x.id == currentTeamId).title}}</span>
                                <span v-else-if="currentTeamId == 0">Global</span>
                                <span v-else>No team available</span>
                                <i class="far fa-chevron-down"></i>
                            </div>
                        </template>
                        <template v-slot:header="slotProps">
                            <span>Switch team</span>
                        </template>
                        <template v-slot:body>
                            <RadioButtons :options="teamsForFilter" :currentOptionId="currentTeamId" :optionNameKey="'title'" :optionValueKey="'id'" ref="countryRadio" @change="setCurrentTeam($event); $refs.countryDropdown.toggle()"/>
                        </template>
                    </Dropdown>
                </div>
                <product-tabs :productTotals="productTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
                <products ref="productsComponent" :teamFilterId="currentTeamId" :teamUsers="teamUsers" :selectedIds="selectedProductIDs" :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="collection.teams" :singleProductToShow="singleProductToShow" :nextSingleProductID="nextSingleProductID" :prevSingleProductID="prevSingleProductID" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsFiltered" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct" @closeSingle="setSingleProduct" @nextSingle="setNextSingle" @prevSingle="setPrevSingle"/>
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
import UserTeam from '../../store/models/UserTeam';
import AuthUser from '../../store/models/AuthUser';
import TeamProduct from '../../store/models/TeamProduct';
import PhaseProduct from '../../store/models/PhaseProduct';

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
        singleProductID: -1,
        currentProductFilter: 'overview',
        selectedProductIDs: [],
        selectedCategoryIDs: [],
        selectedCategories: [],
        sortBy: 'datasource_id',
        sortAsc: true,
        // teamFilterId: -1,
        // catalogueId: '',
        unsub: '',
        test: '',
        productsTest: [],
    }},
    watch: {
        products: function() {
            this.sortProducts()
        }
    },
    computed: {
        ...mapGetters('entities/products', ['loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/collections', ['loadingCollections', 'files']),
        ...mapGetters('entities/teams', ['teams']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'viewAdminPermissionLevel', 'currentTeam', 'currentWorkspace', 'authUser']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        userHasAccess () {
            let hasAccess = false
            if (this.userPermissionLevel <= 2) {
                this.authUser.teams.forEach(team => {
                    team.teamFiles.forEach(file => {
                        if (file.file_id == this.currentFileId && file.role_level <= this.userPermissionLevel)
                            hasAccess = true
                    })
                    // if (team.teamFiles.find(x => x.file_id == this.currentFileId))
                    //     hasAccess = true
                })
            } 
            else hasAccess = true
            return hasAccess
        },
        teamProducts() {
            return TeamProduct.with('products').all()
        },
        phaseProducts() {
            return PhaseProduct.with('products').all()
        },
        collection() {
            // return Collection.query().with('teams').find(this.currentFileId)
            return this.files.find(x => x.id == this.currentFileId)
        },
        products () {
            const products = Product.query().with(['actions.user.teams']).with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team']).with('productFinalAction')
            .with('teamActions.team').with('phaseActions').all()
            // const totalUsers = this.teamUsers
            // const userId = this.authUser.id
            const teamFilterId = this.currentTeamId
            const data = []
            products.forEach(product => {
                product.color_variants = JSON.parse(product.color_variants)
                product.prices = JSON.parse(product.prices)
                product.ins = []
                product.outs = []
                product.focus = []
                product.nds = []
                product.userAction = product.actions.find(x => x.user_id == this.authUser.id)
                product.commentsScoped = []
                product.teamAction = product.teamActions.find(x => x.team_id == this.currentTeamId)
                product.phaseAction = product.phaseActions.find(x => x.phase_id == 1)

                // Find the correct price
                // Check if the chosen currency exists on the product
                if (product.prices != null) {
                    let workspacePrices = null
                    let teamPrices = null
                    if (this.currentWorkspace.currency != null)
                        workspacePrices = product.prices.find(x => x.currency == this.currentWorkspace.currency)
                    if (this.currentTeam)
                        if (this.currentTeam.currency != null)
                            teamPrices = product.prices.find(x => x.currency == this.currentTeam.currency)

                    if ( this.userPermissionLevel <= 4 ) {
                    // Use team currency for low level members
                        if (teamPrices != null)
                            product.userPrices = teamPrices
                        else if (workspacePrices != null)
                            product.userPrices = workspacePrices
                        else product.userPrices = product.prices[0]
                    } else {
                    // Use workspace currency for high level members
                        if (workspacePrices != null)
                            product.userPrices = workspacePrices
                        else product.userPrices = product.prices[0]
                    }
                }

                const comments = product.comments

                comments.forEach(comment => {
                    comment.teamVotes = [{id: 0, title: 'No team', votes: 0}]
                    comment.votes.forEach(vote => {
                        if (vote.user != null) {
                            if (vote.user.teams.length > 0) {
                                const found = (comment.teamVotes.find(x => x.title == vote.user.teams[0].title))
                                if (!found) {
                                    let voteTeam = vote.user.teams[0]
                                    let teamToPush = {id: voteTeam.id, title: voteTeam.title, votes: 1}
                                    comment.teamVotes.push(teamToPush)
                                } else {
                                    found.votes ++
                                }
        
                            } else {
                                comment.teamVotes[0].votes ++
                            }
                        }
                    })
                })

                // Scope comments to current teamFilter
                let commentsScoped = []

                // If the user is a buyer function, only return global comments
                if (this.userPermissionLevel == this.viewAdminPermissionLevel) {
                    comments.forEach(comment => {
                        if (comment.team_id == 0)
                            product.commentsScoped.push(comment)
                    })
                }
                else if ( teamFilterId > 0 ) {
                    // Loop through the comments
                    comments.forEach(comment => {
                        // Loop through comments users teams
                        let pushComment = false

                        // Check if the comment belongs to one of auth users teams
                        // if (comment.user != null)
                        //     if (comment.user.teams != null)
                        //         if ( comment.user.teams.find(x => x.id == teamFilterId) )
                        //             pushComment = true
                        if (comment.team_id == teamFilterId)
                            pushComment = true


                        // Check if the comment is final or global (not for sales)
                        if (this.userPermissionLevel >= 2) {
                            if (comment.team_final || comment.phase_final || comment.team_id == 0)
                                pushComment = true
                        }

                        if (pushComment)
                            product.commentsScoped.push(comment)
                    })
                }
                else if ( teamFilterId == 0) {
                    product.commentsScoped = comments
                }

                // Filter actions by the current team filter
                // Check if the action has a user
                if ( teamFilterId > 0 && product.actions != null) {
                    product.scope = 'user scope'
                    product.nds = JSON.parse(JSON.stringify(this.teamUsers)) // Copy our users into a new variable
                    product.actions.forEach(action => {
                        if (action.user != null) {
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
                            // Find Not decided
                            let index = product.nds.findIndex(nd => nd.id == action.user_id)
                            if (index > -1) {
                                product.nds.splice(index,1)
                            }
                        }


                    })
                // Filter actions by teams if GLOBAL scope is set (= 0)
                } else if ( teamFilterId == 0 && product.teamActions != null) {
                    product.scope = 'team scope'
                    product.nds = JSON.parse(JSON.stringify(this.collection.teams)) // Copy our users into a new variable
                    product.teamActions.forEach(action => {
                        if (action.team != null) {

                            if (action.action == 0)
                                product.outs.push(action.team)
                            if (action.action == 1)
                                product.ins.push(action.team)
                            if (action.action == 2)
                                product.focus.push(action.team)
                        }
                        // Find Not decided
                        let index = product.nds.findIndex(nd => nd.id == action.team_id)
                        if (index > -1) {
                            product.nds.splice(index,1)
                        }
                    })
                } else {
                    product.scope = 'no scope 360'
                }
                data.push(product)
            })
            return data
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
        // productsSorted() {
        //     const products = this.productsFiltered
        //     let key = this.sortBy
        //     let sortAsc = this.sortAsc
        //     const sortMethod = this.sortMethod
        //     const dataSorted = products.sort((a, b) => {

        //         if (sortMethod == 'action') {
        //             if (a[key] != null) {
        //                 if (b[key] != null) {
        //                     // If A and B has a key
        //                     if (sortAsc)
        //                         return (a[key].action > b[key].action) ? 1 : -1
        //                         else return (a[key].action < b[key].action) ? 1 : -1
        //                 } else {
        //                     // If ONLY A has a key
        //                     if (sortAsc)
        //                         return 1
        //                         else return -1
        //                 }
        //             } else if (b[key] != null) {
        //                 // If ONLY B has a key
        //                 if (sortAsc)
        //                     return -1
        //                     else return 1
        //             } else {
        //                 // Neither A nor B has a key
        //                 return 0
        //             }
        //         }

        //         else if ( sortMethod == 'focus' ) {
        //             // First sort by focus
        //             if ( a[key].length != b[key].length ) {

        //                 if (sortAsc)
        //                     return (a[key].length > b[key].length) ? 1 : -1
        //                     else return (a[key].length < b[key].length) ? 1 : -1

        //             // Then sort by ins
        //             } else if ( a.ins.length == b.ins.length ) {
        //                     return 0 
        //             } else {
        //                 if (sortAsc)
        //                     return (a.ins.length > b.ins.length) ? 1 : -1
        //                     else return (a.ins.length < b.ins.length) ? 1 : -1 
        //             }
        //         }

        //         else if ( sortMethod == 'in' ) {
        //             // First sort by focus
        //             const aInLength = a[key].length + a.focus.length
        //             const bInLength = b[key].length + b.focus.length

        //             if ( aInLength != bInLength ) {

        //                 if (sortAsc)
        //                     return (aInLength > bInLength) ? 1 : -1
        //                     else return (aInLength < bInLength) ? 1 : -1

        //             // Then sort by focus
        //             } else if ( a.focus.length == b.focus.length ) {
        //                     return 0 
        //             } else {
        //                 if (sortAsc)
        //                     return (a.focus.length > b.focus.length) ? 1 : -1
        //                     else return (a.focus.length < b.focus.length) ? 1 : -1 
        //             }
        //         }
                
        //         else {

        //             if ( sortMethod == 'object' ) {

        //                 // Sort by key length
        //                 if ( a[key].length == b[key].length ) {
        //                     return 0
        //                 } else if (sortAsc) {
        //                     return (a[key].length > b[key].length) ? 1 : -1
        //                 }
        //                 else return (a[key].length < b[key].length) ? 1 : -1

        //             }

        //             // If the keys aren't objects, finalActions or strings - sort by the key
        //             else {

        //                 if ( a[key] == b[key] ) {
        //                     return 0
        //                 } else if (sortAsc) {
        //                     return (a[key] > b[key]) ? 1 : -1
        //                 }
        //                 else return (a[key] < b[key]) ? 1 : -1
        //             }

        //         }
        //     })
        //     return dataSorted
        // },
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
        singleProductToShow() {
            const productToReturn = (this.singleProductID != -1) ? this.products.find(product => product.id == this.singleProductID) : {}
            return productToReturn
        },
        nextSingleProductID() {
            // const products = this.productsSorted
            const products = this.productsFiltered

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
            // const products = this.productsSorted
            const products = this.productsFiltered

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
                    thisTeam.users.forEach(user => {
                        const fileUser = this.collection.users.find(x => x.id == user.id)
                        if (fileUser)
                            usersToReturn.push(fileUser)
                    })
                    // usersToReturn = thisTeam.users
            } 
            // else if (this.currentTeamId == 0) {
            //     usersToReturn = this.users
            // } else {
            //     usersToReturn = []
            // }
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
        // authUser() {
        //     // return this.$store.getters.authUser;
        //     return AuthUser.query().with('teams').with('workspaces').first()
        // },
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
        ...mapActions('entities/teamProducts', ['fetchTeamProducts', 'updateManyTeamProducts', 'createManyTeamProducts']),
        ...mapActions('entities/phaseProducts', ['fetchPhaseProducts', 'updateManyPhaseProducts', 'createManyPhaseProducts']),
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
            const actionScope = this.actionScope
            const actionType = (method == 'in') ? 1 : 0
            let productsToUpdate = []
            let productsToCreate = []

            this.selectedProducts.forEach(product => {
                const thisProduct = this.products.find(x => x.id == product)

                if (thisProduct[actionScope] != null) {
                    // If product has a final action
                    if (thisProduct[actionScope].action != actionType) {
                        // If the products final action isnt the same as the one we are trying to set
                        productsToUpdate.push(product)
                    }
                } 
                // If product does not have a final action
                else productsToCreate.push(product)

            })

            // Submit the selection
            if (productsToUpdate.length > 0) {
                if (this.actionScope == 'userAction')
                    this.updateManyActions({productIds: productsToUpdate, user_id: user_id, action_code: actionType})
                if (this.actionScope == 'teamAction')
                    this.updateManyTeamProducts({team_id: this.currentTeamId, product_ids: productsToUpdate, phase_id: 1, action: actionType})
                if (this.actionScope == 'phaseAction')
                    this.updateManyPhaseProducts({product_ids: productsToUpdate, phase_id: 1, action: actionType})
            }
            if (productsToCreate.length > 0) {
                if (this.actionScope == 'userAction')
                    this.createManyActions({productIds: productsToCreate, user_id: user_id, action_code: actionType})
                if (this.actionScope == 'teamAction')
                    this.createManyTeamProducts({team_id: this.currentTeamId, product_ids: productsToCreate, phase_id: 1, action: actionType})
                if (this.actionScope == 'phaseAction')
                    this.createManyPhaseProducts({product_ids: productsToCreate, phase_id: 1, action: actionType})
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

            const products = this.productsFiltered
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const sortMethod = this.sortMethod

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
        async initRequiresWorkspace() {
            if (Collection.all().length <= 0)
                await this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                await this.fetchUsers(this.currentWorkspaceId)
        },
        initRequiresFileId() {
            this.fetchProducts(this.currentFileId)
            this.fetchActions(this.currentFileId)
            this.fetchComments(this.currentFileId)
            this.fetchFinalActions(this.currentFileId)
            this.fetchCommentVotes(this.currentFileId)
            this.fetchCategories(this.currentFileId)
            this.fetchTeamProducts(this.currentFileId)
            this.fetchPhaseProducts(this.currentFileId)
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
    mounted() {
        this.sortProducts
        this.productsTest = this.productsFiltered
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
