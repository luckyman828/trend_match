<template>
    <div class="test-page" v-if="productsStatic">
        <h1>Welcome to the Test page</h1>
        <p>Products: {{productsStatic.length}}</p>
        <input type="number" v-model.number="currentTaskId">
        <!-- <div class="products-wrapper">
            <h3>Products Static</h3>
            <p v-for="product in productsStatic.slice(0,5)" :key="product.id">
                <span>{{product.title}}, Ins: {{product.ins.length}}, Outs: {{product.outs.length}}</span>
                <span class="add" 
                @click="insertAction(product.id, currentTaskId , 1, 0)"
                >
                (+ Add action)</span>
            </p>
        </div> -->
        <h3>Random item {{new Date}}</h3>
        <h3>Test components</h3>
        <TestComponent :item="testArr[0]"/>
        <TestComponent :item="testArr[1]"/>
        <h3>Test components v-for</h3>
        <div v-for="item in testArr" :key="item.id">
            <h4>{{item.name}} | id: {{item.id}} | date: {{new Date}}</h4>
            <TestComponent :item="item"/>
        </div>
        <h3>Test Arr 1</h3>
        <div class="test">
            <p>{{testArr[0].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[0].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[1].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[1].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[2].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[2].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[3].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[3].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[4].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[4].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[5].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[5].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr[6].name}} | {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == testArr[6].id).name = 'Amazing new animal!'">Set animal</button></p>
        </div>
        <h3>Test Arr 2</h3>
        <div class="test">
            <p>{{testArr2[0].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[0].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[1].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[1].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[2].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[2].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[3].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[3].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[4].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[4].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[5].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[5].id).name = 'Amazing new animal!'">Set animal</button></p>
            <p>{{testArr2[6].name}} | {{new Date}}<button class="primary" 
            @click="testArr2.find(x => x.id == testArr2[6].id).name = 'Amazing new animal!'">Set animal</button></p>
        </div>

        <h3>V-for</h3>
        <!-- <div class="test">
            <p v-for="item in testArr" :key="item.id">
                {{item.name}} | 
                {{new Date}}<button class="primary" 
            @click="testArr.find(x => x.id == item.id).name = 'Amazing new animal!'">Set animal</button></p>
        </div> -->
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
import TestComponent from '../TestComponent'
export default {
    name: 'test',
    components: {
        TestComponent
    },
    data: function () { return {
        currentFileId: null,
        currentTaskId: 2,
        testArr: [
            {id: 1, name: 'hest'},
            {id: 2, name: 'flamingo'},
            {id: 3, name: 'elefant'},
            {id: 4, name: 'zebra'},
            {id: 5, name: 'donkey'},
            {id: 6, name: 'mule'},
            {id: 7, name: 'cow'},
        ],
        testArr2: [
            {id: 1, name: 'hest'},
            {id: 2, name: 'flamingo'},
            {id: 3, name: 'elefant'},
            {id: 4, name: 'zebra'},
            {id: 5, name: 'donkey'},
            {id: 6, name: 'mule'},
            {id: 7, name: 'cow'},
        ],
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