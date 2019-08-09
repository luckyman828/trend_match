<template>
    <div class="catalogue">
        <template v-if="!loadingCollections">
            <progress-bar :loading="loadingCollections" :catalogue="collection" :productTotals="productTotals"/>
            <filters :categories="categories" :selectedCategoriesCount="selectedCategoryIDs.length" @onSelectCategory="setSelectedCategory"/>
            <!-- <product-single :product="singleProductToShow" :nextProductID="nextSingleProductID" :loading="loadingProducts" :authUser="authUser" @closeSingle="setSingleProduct" @nextSingle="setNextSingle"/> -->
            <product-tabs :productTotals="productTotals" :currentFilter="currentProductFilter" @setProductFilter="setProductFilter"/>
            <products :sortBy="sortBy" :sortAsc="sortAsc" @onSortBy="onSortBy" :teams="teams" :singleProductToShow="singleProductToShow" :nextSingleProductID="nextSingleProductID" :totalProductCount="products.length" :selectedCount="selectedProducts.length" :collection="collection" :products="productsSorted" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct" @closeSingle="setSingleProduct" @nextSingle="setNextSingle"/>
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
import User from '../../store/models/User'
import Team from '../../store/models/Team'
import Country from '../../store/models/Country'
import Collection from '../../store/models/Collection'
import ProductFinalAction from '../../store/models/ProductFinalAction';
import CommentVote from '../../store/models/CommentVote';
import Category from '../../store/models/Category';

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
        sortAsc: true
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
        aaa() {
            return this.selectedCategoryIDs.length
        },
        products () {
            const products = Product.query().with(['actions.user.country', 'actions.user.team']).with(['comments.user.country', 'comments.votes', 'comments.user.team']).with('productFinalAction').all()
            const totalUsers = this.users
            const userId = this.authUser.id
            const data = []
            products.forEach(product => {
                product.color_variants = JSON.parse(product.color_variants)
                product.image = product.color_variants[0].image
                product.ins = []
                product.outs = []
                product.focus = []
                product.userAction = 0
                // if (product.productFinalAction != null)
                //     product.productFinalAction = {}
                product.nds = JSON.parse(JSON.stringify(totalUsers)) // Copy our users into a new variable
                product.actions.forEach(action => {
                    if (action.action == 0)
                        product.outs.push(action.user)
                    if (action.action == 1)
                        product.ins.push(action.user)
                    if (action.action == 2)
                        product.focus.push(action.user)

                    // Find the action this user has taken
                    if (action.user_id == userId)
                    {
                        if (action.action == 0)
                            product.userAction = 1
                        if (action.action == 1)
                            product.userAction = 2
                    }

                    var index = product.nds.findIndex(nd => nd.id == action.user_id)
                        product.nds.splice(index,1)
                })
                data.push(product)
            })
            return data
        },
        // aaaa () {
        //     const products = this.products
        //     const data = {
        //         a: products[0][this.sortBy].length,
        //         b: products[1][this.sortBy].length,
        //         hasNoLength: (!products[0][this.sortBy].length),
        //         isString: typeof this.sortBy,
        //         get test () {
        //             return (this.a == this.b)
        //         }
        //     }
        //     return data
        // },
        productsFilteredByCategory() {
            const products = this.products
            const categoryIDs = this.selectedCategoryIDs
            let productsToReturn = products

            // First filter by category
            if (this.selectedCategoryIDs.length > 0) {
                
                // productsToReturn = []
                // Array.from(this.selectedCategoryIDs).forEach(categoryIndex => {
                //     productsToReturn = productsToReturn.concat(this.categories[categoryIndex].products)
                //     // productsToReturn.push({key: categoryIndex})
                // })
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
            // const categoryIDs = this.selectedCategoryIDs
            let productsToReturn = products

            // First filter by category
            // if (this.selectedCategoryIDs.length > 0) {
                
            //     // productsToReturn = []
            //     // Array.from(this.selectedCategoryIDs).forEach(categoryIndex => {
            //     //     productsToReturn = productsToReturn.concat(this.categories[categoryIndex].products)
            //     //     // productsToReturn.push({key: categoryIndex})
            //     // })
            //     const filteredByCategory = productsToReturn.filter(product => {
            //             return Array.from(this.selectedCategoryIDs).includes(product.category_id)
            //     })
            //     productsToReturn = filteredByCategory


            // }

            // Second filter by in/out
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
        // productsSortedOld() {
        //     const products = this.productsFiltered
        //     let key = this.sortBy
        //     let sortAsc = this.sortAsc
        //     const dataSorted = products.sort((a, b) => {

        //         if (key == 'productFinalAction') {
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
                
        //         else {
        //             // If the keys don't have length - sort by the key
        //             if (!products[0][key].length) {

        //                 if ( a[key] == b[key] ) {
        //                     return 0
        //                 } else if (sortAsc)
        //                     return (a[key] > b[key]) ? 1 : -1
        //                     else return (a[key] < b[key]) ? 1 : -1

                        

        //             // If the keys have lengths - sort by their length
        //             } else {

        //                 if ( a[key].length == b[key].length ) {
        //                     return 0
        //                 } else if (sortAsc)
        //                     return (a[key].length > b[key].length) ? 1 : -1
        //                     else return (a[key].length < b[key].length) ? 1 : -1

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

            if (this.singleProductID != -1) {
                const currentProductIndex = products.findIndex(product => product.id == this.singleProductID)
                // Check that the current single product is not the last product
                if (currentProductIndex + 1 < products.length)
                    return products[currentProductIndex + 1].id
                    else return -1
            }
            else return -1
        },
        users() {
            return User.query().with('country').with('team').all()
        },
        actions() {
            return this.$store.getters['entities/actions/all']()
        },
        comments() {
            return Comment.query().with('user.country|team').with('votes').all()
        },
        countries() {
            return Country.query().all()
        },
        teams() {
            return Team.query().with('users').all()
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
        setProductFilter(filter) {
            this.currentProductFilter = filter
        },
        setSelectedProduct(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selectedProductIDs
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        clearSelectedProducts() {
            this.selectedCategoryIDs = []
        },
        setSelectedCategory(id) {
            const selected = this.selectedCategoryIDs
            const found = selected.findIndex(el => el == id)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(id)
        },
        submitSelectedAction(method) {
            const actionType = (method == 'in') ? 1 : 0
            // Submit the selection
            this.selectedProducts.forEach(product => {
                this.updateFinalAction({productToUpdate: product, phase: this.collection.phase, action_code: actionType})
            })
            // Reset the selection
            this.selectedProductIDs = []
        },
        onSortBy(key, method) {
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }
        }
    },
    created() {
        this.getAuthUser();
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
    }
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
</style>
