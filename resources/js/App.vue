<template>
    <section>
        <Sidebar/>
        <div class="main">
            <div class="container">
                <div class="grid-2">
                    <h2>Welcome</h2>
                </div>
                <product-single :product="singleProduct" :loading="loadingProducts" :authUser="authUser"/>
                <products :products="products" :loading="loadingProducts" :authUser="authUser" @viewAsSingle="setSingleProduct"/>
                    
                <!-- <transition name="fade">
                    <router-view></router-view>
                </transition> -->
            </div>
        </div>
    </section>
</template>

<script>
import store from './store'
import { mapActions, mapGetters } from 'vuex'
import Sidebar from './components/Sidebar'
import Products from './components/Products'
import ProductSingle from './components/ProductSingle'
import Comment from './store/models/Comment'
import Product from './store/models/Product'
import User from './store/models/User'
import Country from './store/models/Country'

export default{
    name: 'app',
    store,
    components: {
        Sidebar,
        Products,
        ProductSingle,
    },
    data: function () { return {
        collectionId: '8762838c-ffe2-4124-b659-6092f92c64a8',
        singleProduct: {},
    }},
    computed: {
        ...mapGetters('entities/products', ['loadingProducts']),
        ...mapGetters('entities/actions', ['loadingActions']),
        ...mapGetters('entities/comments', ['loadingComments']),
        productsSmart () {
            return Product.query().with('actions.user').all()
        },
        products () {
            const products = this.$store.getters['entities/products/all']()
            const allActions = this.actions
            const totalUsers = this.users.length
            const userId = this.authUser.id
            const data = []
            products.forEach(product => {
                product.actions = 0
                product.ins = 0
                product.outs = 0
                product.focus = 0
                product.comments = []
                product.userAction = 0

                allActions.forEach(action => {
                    if (action.product_id == product.id)
                    {
                        product.actions ++
                        if (action.action == 0)
                            product.outs ++
                        if (action.action == 1)
                            product.ins ++
                        if (action.action == 2)
                            product.focus ++

                        if (action.user_id == userId)
                        {
                            if (action.action == 0)
                                product.userAction = 1
                            if (action.action == 1)
                                product.userAction = 2
                        }

                    }
                })
                product.nds = totalUsers - product.actions

                this.comments.forEach(comment => {
                    if (comment.product_id == product.id)
                        product.comments.push(comment)
                })

                data.push(product)
            })
            return data
        },
        actions() {
            return this.$store.getters['entities/actions/all']()
        },
        users() {
            return User.query().with('country').all()
        },
        comments() {
            return Comment.query().with('user.country').all()
        },
        countries() {
            return Country.query().all()
        },
        authUser() {
            return this.$store.getters.authUser;
        },
    },
    methods: {
        ...mapActions(['getAuthUser']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/comments', ['fetchComments']),
        ...mapActions('entities/countries', ['fetchCountries']),
        setSingleProduct(product) {
            this.singleProduct = product
        }
    },
    created() {
        this.getAuthUser();
        this.fetchCountries()
        this.fetchProducts({collection_id: this.collectionId})
        this.fetchActions({collection_id: this.collectionId})
        this.fetchUsers({collection_id: this.collectionId})
        this.fetchComments({collection_id: this.collectionId})
    }
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
    html, body, #app {
        color: $dark;
        font-family: 'Source Sans Pro', sans-serif;
    }
    .main-wrapper {
        padding-left: $sidebarWidth;
    }
    .main {
        background: $light;
        min-height: 100vh;
        padding: 30px 0;
    }
    .container {
        max-width: 1170px;
    }
    h1 {
        margin-bottom: 30px;
    }
    .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1rem;
    }
    .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 1rem;
    }
    .card {
        padding: 1em;
        border-radius: 6px;
        margin: 30px 0;
        border: none;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
    }
    .pill {
        background: $light1;
        height: 20px;
        font-size: 13px;
        border-radius: 20px;
        width: 85px;
        height: 25px;
        display: inline-block;
        line-height: 25px;
        text-align: center;
        &.positive {
            background: $secondaryLight;
        }
    }
    .tabs {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        .tab {
            display: inline-block;
            font-size: 18px;
            opacity: .5;
            padding: 10px 25px;
            border-bottom: solid 3px transparent;
            margin-bottom: 8px;
            &.active {
                opacity: 1;
                border-color: $primary;
            }
            &:not(.active):hover {
                border-color: rgba($primary, .5);
                cursor: pointer;
            }
        }
    }
    .vdp-datepicker {
        display: grid;
        justify-items: end;
        &.disabled {
            pointer-events: none;
            opacity: .5;
        }
        > div::after {
            content: "";
            font-size: 11px;
            color: $dark2;
            display: block;
            position: absolute;
            z-index: 1;
            right: 12px;
            height: 32px;
            top: 0;
            line-height: 32px;
            font-weight: 900;
            font-family: "Font Awesome 5 Pro"
        }
        input {
            border: solid 1px $light2;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,.1);
            padding-left: 12px;
            height: 32px;
            width: 150px;
            font-size: 14px;
            cursor: pointer;
        }
    }
</style>
