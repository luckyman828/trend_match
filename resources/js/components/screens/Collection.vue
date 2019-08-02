<template>
    <div class="collection">
        <h2 v-if="loadingCollections" :class="{loading: loadingCollections}">loading..</h2>
        <h2 v-if="!loadingCollections">{{collection.title}}</h2>
        <product-filter :productTotals="productTotals" @setProductFilter="setProductFilter" :currentFilter="currentProductFilter"/>
        <product-single :product="singleProductToShow" :nextProductID="nextSingleProductID" :loading="loadingProducts" :authUser="authUser" @closeSingle="setSingleProduct" @nextSingle="setNextSingle"/>
        <products :collection="collection" :products="productsFiltered" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct" @onSelect="setSelectedProduct"/>
        <SelectedController :productTotals="productTotals" :selected="selectedProductIDs" @onSelectedAction="submitSelectedAction"/>
    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import Products from '../Products'
import ProductSingle from '../ProductSingle'
import ProductFilter from '../ProductFilter'
import SelectedController from '../SelectedController'
import Comment from '../../store/models/Comment'
import Product from '../../store/models/Product'
import User from '../../store/models/User'
import Team from '../../store/models/Team'
import Country from '../../store/models/Country'
import Collection from '../../store/models/Collection'
import ProductFinalAction from '../../store/models/ProductFinalAction';
import CommentVote from '../../store/models/CommentVote';

export default{
    name: 'collection',
    store,
    components: {
        Products,
        ProductSingle,
        ProductFilter,
        SelectedController,
    },
    data: function () { return {
        singleProductID: -1,
        currentProductFilter: 'overview',
        selectedProductIDs: [],
    }},
    computed: {
        ...mapGetters('entities/products', ['loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        ...mapGetters('entities/collections', ['loadingCollections']),
        collectionId () {
            return this.$route.params.collectionID
        },
        collection() {
            return Collection.find(this.collectionId)
        },
        products () {
            const products = Product.query().with('actions.user.country').with(['comments.user.country', 'comments.votes']).with('productFinalAction').all()
            const totalUsers = this.users
            const userId = this.authUser.id
            const data = []
            products.forEach(product => {
                product.ins = []
                product.outs = []
                product.focus = []
                product.userAction = 0
                product.nds = JSON.parse(JSON.stringify(totalUsers)) // Copy our users into a new variable
                product.actions.forEach(action => {
                    if (action.action == 0)
                        product.outs.push(action)
                    if (action.action == 1)
                        product.ins.push(action)
                    if (action.action == 2)
                        product.focus.push(action)

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
        productsFiltered() {
            const method = (this.currentProductFilter == 'ins') ? 2 : (this.currentProductFilter == 'outs') ? 1 : 0
            const products = this.products
            if (method > 0) {
                const productsFiltered = products.filter(product => {
                    return product.userAction == method
                })
                return productsFiltered
            } else {
                return products
            }
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
            const data = {
                products: this.products.length,
                ins: 0,
                outs: 0,
                nds: 0,
            }
            this.products.forEach(product => {
                if (product.userAction == 2)
                    data.ins ++
                else if (product.userAction == 1)
                    data.outs ++
                else data.nds ++
            })
            return data
        },
        singleProductToShow() {
            const productToReturn = (this.singleProductID != -1) ? this.products[this.singleProductID] : {}
            return productToReturn
        },
        nextSingleProductID() {
            const nextSingleProductID = ( this.singleProductID < this.products.length -1 ) ? this.singleProductID +1 : -1
            return nextSingleProductID
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
            return Team.query().all()
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
        submitSelectedAction(method) {
            const actionType = (method == 'in') ? 1 : 0
            this.selectedProducts.forEach(product => {
                this.updateFinalAction({productToUpdate: product, phase: this.collection.phase, action_code: actionType})
            })
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
    }
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
</style>
