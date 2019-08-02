<template>
    <div class="products card">
        <table>
            <tr class="header-row">
                <th>Select</th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable" @click="onSortBy('title', true)">Product</th>
                <th></th>
                <th :class="{active: this.sortBy == 'focus'}" class="clickable" @click="onSortBy('focus', false)">Focus</th>
                <th :class="{active: this.sortBy == 'ins'}" class="clickable" @click="onSortBy('ins', false)">In</th>
                <th :class="{active: this.sortBy == 'outs'}" class="clickable" @click="onSortBy('outs', false)">Out</th>
                <th :class="{active: this.sortBy == 'nds'}" class="clickable" @click="onSortBy('nds', false)">ND</th>
                <th :class="{active: this.sortBy == 'comments'}" class="clickable" @click="onSortBy('comments', false)">Comments</th>
                <th :class="{active: this.sortBy == 'id'}" class="clickable swipes" @click="onSortBy('id', true)">Id</th>
                <th :class="{active: this.sortBy == 'action'}" class="clickable" @click="onSortBy('action', 2)">Action</th>
                <th></th>
                <th>View</th>
            </tr>
            <template v-if="!loading">
                <tr class="product-row"
                v-for="(product, index) in productsSorted" :key="product.id">
                    <td><input type="checkbox" @change="onSelect(index)"></td>
                    <td class="image"><img :src="product.images"></td>
                    <td class="title"><span>{{product.title}}</span></td>
                    <td @click="setTooltip(product.focus)">{{product.focus.length}}</td>
                    <td @click="setTooltip(product.ins)">{{product.ins.length}}</td>
                    <td @click="setTooltip(product.outs)">{{product.outs.length}}</td>
                    <td @click="setTooltip(product.nds)">{{product.nds.length}}</td>
                    <td>{{product.comments.length}}</td>
                    <td class="">{{product.id}}</td>
                    <template v-if="!loadingFinalActions">
                        <template v-if="!product.productFinalAction">
                            <td><span class="button green" @click="toggleInOut(product.id, 1, 'N/A')">In</span></td>
                            <td><span class="button red" @click="toggleInOut(product.id, 0, 'N/A')">Out</span></td>
                        </template>
                        <template v-else>
                            <td><span class="button green" :class="[{ active: product.productFinalAction.action == 1}]" @click="toggleInOut(product.id, 1, product.productFinalAction.action)">In</span></td>
                            <td><span class="button red" :class="[{ active: product.productFinalAction.action == 0}]"  @click="toggleInOut(product.id, 0, product.productFinalAction.action)">Out</span></td>
                        </template>
                    </template>
                    <template v-else>
                        <td><span><Loader/></span></td>
                        <td><span></span></td>
                    </template>
                    <td><span class="button" @click="onViewSingle(index)">View</span></td>
                </tr>
            </template>
        </table>
        <template v-if="loading">
            <Loader/>
        </template>
        <div class="tool-tip card">
            <p v-for="user in tooltip" :key="user.id">{{user.user.email}}</p>
        </div>
    </div>
</template>

<script>
import Loader from './Loader'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'products',
    props: [
        'products',
        'loading',
        'authUser',
        'collection',
    ],
    components: {
        Loader,
    },
    data: function() { return {
        tooltip: {},
        sortBy: 'id',
        sortAsc: true
    }},
    computed: {
        ...mapGetters('entities/productFinalActions', ['loadingFinalActions']),
        productsSorted() {
            const products = this.products
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const dataSorted = products.sort((a, b) => {

                // If the keys don't have length - sort by the key
                if (!products[0][key].length) {

                    if (sortAsc)
                        return (a[key] > b[key]) ? 1 : -1
                        else return (a[key] < b[key]) ? 1 : -1

                // If the keys have lengths - sort by their length
                } else {

                    if (sortAsc)
                        return (a[key].length > b[key].length) ? 1 : -1
                        else return (a[key].length < b[key].length) ? 1 : -1

                }
            })
            return dataSorted
            // return dataSorted
            // return('Now sorting by: ' + key + ', ' + sortAsc)
            // return key
            // const dataSorted = products.sort((a, b) => {
            //         return (a[key] > b[key]) ? 1 : -1
            // })
            // return dataSorted
            // return products[0][key]
        }
    },
    methods: {
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('entities/productFinalActions', ['updateFinalAction']),
        toggleInOut(productID, actionType, userAction) {
            if (actionType == userAction) {
                // Undo current toggle - delete record
                console.log("Deleting record for user: " + this.authUser.id + " and product: " + productID)
            } else {
                // updateAction({commit}, {user_id, product_id, action_code})
                console.log("Setting actioncode:" + actionType + " for phase: " + this.collection.phase + " and product: " + productID)
                // this.updateAction({user_id: this.authUser.id, productToUpdate: productID, action_code: actionType})
                this.updateFinalAction({phase: this.collection.phase, productToUpdate: productID, action_code: actionType})
            }
        },
        onViewSingle(index) {
            // Emit event to parent
            this.$emit('viewAsSingle', index)
        },
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        setTooltip(data) {
            this.tooltip = data
        },
        onSortBy(key, method) {
            if (key == 'action') {
                
                console.log('Sort by final_action not supported yet. Sorting by id, asc')
                this.sortAsc = true
                this.sortBy = 'id'
                
            } else {
                    
            // Check if the sorting key we are setting is already the key we are sorting by
            // If this is the case, toggle the sorting method (asc|desc)
                if (this.sortBy !== key) {
                    this.sortAsc = method
                    this.sortBy = key
                } else {
                    this.sortAsc = !this.sortAsc
                }

            }

        },
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    th.active {
        color: $dark;
    }
    .clickable {
        cursor: pointer;
    }
    .products {
        padding-top: 0;
    }
    table {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
    }
    tr:hover {
        background: $light1;
    }
    img {
        height: 88px;
        width: 66px;
        object-fit: cover;
        margin: 8px 0 8px 16px;
    }
    i {
        margin-right: 12px;
        font-size: 11px;
        &.fa-arrow-up {
            color: $green;
        }
        &.fa-arrow-down {
            color: $red;
        }
    }
    th:first-child {
        padding-left: 40px;
        text-transform: uppercase;
    }
    tr.header-row {
        background: $light2;
        color: $dark2;
        font-weight: 700;
        font-size: 12px;
        height: 45px;
    }
    tr.product-row {
        border-bottom: solid 1px $light2;
    }
    th {
        &.title {
            width: 50%;
        }
        &.swipes {
            width: 12%;
            text-align: center;
        }
        &.popularity {
            width: 10%;
        }
        &.compare {
            width: 15%;
            text-align: center;
        }
    }
    td {
        &.title {
            font-size: 13px;
            color: $dark;
        }
        &.swipes {
            text-align: center;
            font-size: 13px;
            color: $dark;
        }
        &.popularity {
            font-size: 11px;
            font-weight: 700;
        }
        &.compare {
            text-align: center;
        }
    }
    .show-more {
        width: 100%;
        margin: 16px auto 0;
        text-align: center;
        display: block;
    }
    .loading {
        animation: loading 2s;
        animation-iteration-count: infinite;
    }
    @keyframes loading {
        0% {opacity: 0;}
        50% {opacity: 1;}
        100% {opacity: 0;}
    }
    input[type=checkbox] {
        display: block;
        margin: auto;
        height: 20px;
        width: 25px;
    }
</style>
