<template>
    <div class="test-page" v-if="productsStatic">
        <h1>Welcome to the Test page</h1>
        <p>Products: {{productsStatic.length}}</p>
        <input type="number" v-model.number="currentTaskId">
        <div class="products-wrapper">
            <h3>Products Static</h3>
            <p v-for="product in productsStatic.slice(0,5)" :key="product.id">
                <span>{{product.title}}, Ins: {{product.ins.length}}, Outs: {{product.outs.length}}</span>
                <span class="add" 
                @click="insertAction(product.id, currentTaskId , 1, 0)"
                >
                (+ Add action)</span>
            </p>
        </div>
        <!-- <div class="products-wrapper">
            <h3>Products Test</h3>
            <p v-for="product in productsTest.slice(0,5)" :key="product.id">
                <span>{{product.title}}, actions: {{product.actions.length}}</span>
                <span>, actions(this task): {{product.actions.filter(x => x.task_id === currentTaskId).length}}</span>
                <span class="add" 
                @click="updateAction({productToUpdate: product.id, task_id: currentTaskId, user_id: $uuid.v4(), action_code: 1, is_task_action: 0})">
                (+ Add action)</span>
            </p>
        </div> -->
        <!-- <div class="products-wrapper">
            <h3>Products</h3>
            <p v-for="product in products.slice(0,5)" :key="product.id">
                <span>{{product.title}}, actions: {{product.actions.length}}</span>
                <span>, actions(this task): {{product.actions.filter(x => x.task_id == currentTaskId).length}}</span>
                <span class="add" 
                @click="setAction({productToUpdate: product.id, task_id: currentTaskId, user_id: $uuid.v4(), action_code: 1, is_task_action: 0})">
                (+ Add action)</span>
            </p>
        </div>
        <div class="products-wrapper">
            <h3>Products V2</h3>
            <p v-for="product in productsV2.slice(0,5)" :key="product.id">
                <span>{{product.title}}, actions: {{product.actions.length}}</span>
                <span>, actions(this task): {{product.actions.filter(x => x.task_id == currentTaskId).length}}</span>
                <span class="add" 
                @click="setAction({productToUpdate: product.id, task_id: currentTaskId, user_id: $uuid.v4(), action_code: 1, is_task_action: 0})">
                (+ Add action)</span>
            </p>
        </div> -->
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import Product from '../../store/models/Product'
import Action from '../../store/models/Action'
export default {
    name: 'test',
    data: function () { return {
        currentFileId: null,
        currentTaskId: 2,
        productsStatic: []
    }},
    computed: {
        ...mapGetters('persist', ['authUser']),
        ...mapGetters('entities/products', ['actionsCreated', 'productsTest']),
        // products() {
        //     console.log('products queried. Task id: ' + this.currentTaskId)
        //     const taskId = this.currentTaskId
        //     const products = Product.query()
        //         .with('actions', (query) => {
        //             console.log(query.task_id)
        //             query.where('task_id', taskId)
        //         })
        //         .get()
        //     return products
        // },
        productsAlt() {
            // console.log('Products alt recalculating!')
            const products = Product.query()
                .with('actions')
                .get()

            // products.forEach(product => {
            //     // Test that the JSON objects are valid JSON
            //     const storeProduct = Product.find(product.id)
            //     console.log(this.actionsCreated)

            //     // console.log(product.isNew)
            //     if (product.isNew || product.actionsUpdated || this.actionsCreated) {
            //         console.log('Recalc Actions for product: ' + product.id)
            //         console.log(product.actions.length)
            //         product.actionLength = product.actions.length
            //         // product.actionsUpdated = false
            //         storeProduct.actionsUpdated = false
            //     }

            //     storeProduct.isNew = false
            // })
            return products
        }
    },
    watch: {
    },
    methods: {
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('entities/actions', ['fetchActions', 'updateAction']),
        // ...mapMutations('entities/actions', ['setAction']),
        async insertAction(product, task_id, action_code, is_task_action) {
            const action = await Action.insert({
                data: {
                    action: action_code,
                    product_id: product,
                    user_id: this.authUser.id,
                    task_id: task_id,
                    is_task_action: is_task_action,
                },
            })
            console.log(action)
            console.log(action.actions[0])
        }
    },
    async created() {
        this.currentFileId = this.$route.params.fileId
        await (
            this.fetchActions(this.currentFileId),
            this.fetchProducts(this.currentFileId)
        )
        this.productsStatic = Product.query().with('actions').get()
    }
}
</script>

<style scoped lang="scss">

    .add {
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }

</style>