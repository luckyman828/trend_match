<template>
    <div class="products card">
        <product-totals :totalProductCount="totalProductCount" :selectedCount="selectedCount" :products="products"/>
        <product-single :product="singleProductToShow" :nextProductID="nextSingleProductID" :authUser="authUser" @closeSingle="onCloseSingle" @nextSingle="onNextSingle" @onToggleInOut="toggleInOut"/>
        <table :class="{disabled: singleProductToShow.id != null}">
            <tr class="header-row">
                <th class="select">Select <i class="fas fa-chevron-down"></i></th>
                <th class="clickable id" :class="{active: this.sortBy == 'id'}" @click="onSortBy('id', true)">
                    Id <i class="fas" :class="[(this.sortBy == 'id' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th></th>
                <th :class="{active: this.sortBy == 'title'}" class="clickable title" @click="onSortBy('title', true)">
                   Product <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'focus'}" class="clickable" @click="onSortBy('focus', false)">
                    Focus <i class="fas" :class="[(this.sortBy == 'focus' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'ins'}" class="clickable" @click="onSortBy('ins', false)">
                    In <i class="fas" :class="[(this.sortBy == 'ins' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'outs'}" class="clickable" @click="onSortBy('outs', false)">
                    Out <i class="fas" :class="[(this.sortBy == 'outs' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'nds'}" class="clickable" @click="onSortBy('nds', false)">
                    ND <i class="fas" :class="[(this.sortBy == 'nds' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'comments'}" class="clickable" @click="onSortBy('comments', false)">
                    Comments <i class="fas" :class="[(this.sortBy == 'comments' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'action'}" class="clickable" @click="onSortBy('action', 2)">Action</th>
                <th></th>
                <th>View</th>
            </tr>
            <template v-if="!loading">
                <tr class="product-row"
                v-for="(product, index) in productsSorted" :key="product.id"
                :class="[ (product.productFinalAction != null) ? (product.productFinalAction.action == 1) ? 'in' : 'out' : '' ]">
                    <td class="select">
                        <label class="checkbox">
                            <input type="checkbox" @change="onSelect(index)" />
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="id clickable" @click="onViewSingle(index)">{{product.id}}</td>
                    <td class="image clickable" @click="onViewSingle(index)"><img :src="product.images"></td>
                    <td class="title clickable" @click="onViewSingle(index)"><span>{{product.title}}</span></td>
                    <td @click="setTooltip(product.focus)"><span class="square"><i class="far fa-star"></i>{{product.focus.length}}</span></td>
                    <td @click="setTooltip(product.ins)"><span class="square"><i class="far fa-heart"></i>{{product.ins.length}}</span></td>
                    <td @click="setTooltip(product.outs)"><span class="square"><i class="far fa-times-circle"></i>{{product.outs.length}}</span></td>
                    <td @click="setTooltip(product.nds)"><span class="square"><i class="far fa-question-circle"></i>{{product.nds.length}}</span></td>
                    <td><span class="square"><i class="far fa-comment"></i>{{product.comments.length}}</span></td>
                    <template v-if="!loadingFinalActions">
                        <template v-if="!product.productFinalAction">
                            <td><span class="button green" @click="toggleInOut(product.id, 1, 'N/A')">In</span></td>
                            <td><span class="button red" @click="toggleInOut(product.id, 0, 'N/A')">Out</span></td>
                        </template>
                        <template v-else>
                            <td><span class="button green" :class="[{ active: product.productFinalAction.action == 1}]" @click="toggleInOut(product.id, 1, product.productFinalAction.action)">
                                In  <i class="far fa-heart"></i>
                                </span></td>
                            <td><span class="button red" :class="[{ active: product.productFinalAction.action == 0}]"  @click="toggleInOut(product.id, 0, product.productFinalAction.action)">
                                Out  <i class="far fa-times-circle"></i>
                                </span></td>
                        </template>
                    </template>
                    <template v-else>
                        <td><span><Loader/></span></td>
                        <td><span></span></td>
                    </template>
                    <td><span class="view-single" @click="onViewSingle(index)">View</span></td>
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
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'

export default {
    name: 'products',
    props: [
        'products',
        'loading',
        'authUser',
        'collection',
        'selectedCount',
        'totalProductCount',
        'singleProductToShow',
        'nextSingleProductID',
        'authUser',
    ],
    components: {
        Loader,
        ProductTotals,
        ProductSingle,
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
        onCloseSingle() {
            this.$emit('closeSingle', -1)
        },
        onNextSingle() {
            this.$emit('nextSingle')
        },
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .products {
        margin-top: 0;
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
        &.disabled {
            opacity: .5;
        }
    }
    tr:hover {
        background: $light;
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
    tr.header-row {
        background: white;
        font-weight: 700;
        font-size: 12px;
        height: 45px;
        border-bottom: solid 2px $light1;
    }
    tr.product-row {
        border-bottom: solid 1px $light1;
        &.in > :first-child {
            box-shadow: 4px 0 $green inset
        }
        &.out > :first-child {
            box-shadow: 4px 0 $red inset
        }
    }
    th {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: $dark2;
        &:first-child {
            padding-left: 16px;
            width: 80px;
        }
        &.id {
            width: 75px;
        }
        &.title {
            width: 240px;
        }
        i {
            color: $light2;
            margin: 0;
            margin-left: 4px;
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
        &.active {
            i {
                color: $primary
            }
        }
    }
    td {
        &.select {
            padding-left: 20px;
        }
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
    .checkbox {
      display: block;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-bottom: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      &:hover {
          background: $light;
      }
    }

    .checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      content: "";
      display: inline-block;
      vertical-align: text-top;
      width: 24px;
      height: 24px;
      background: white;
      border: 1px solid #dfdfdf;
    }

    .checkbox input:checked ~ .checkmark {
      background: linear-gradient(#3b86ff, #3b86ff) no-repeat;
      background-position: center;
      background-size: 16px 16px;
    }

    .checkmark::after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox input:checked ~ .checkmark:after {
      display: block;
    }
    .square {
        background: $light1;
        color: $dark;
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        i {
            color: $dark2;
            margin-right: 16px;
            font-size: 16px;
        }
    }
    .button {
        width: 86px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        border-radius: 4px;
        padding: 0;
        line-height: 28px;
        position: relative;
        font-weight: 700;
        padding-right: 22px;
        color: $dark2;
        border-color: $light2;
        i {
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 5px;
            margin: 0;
        }
        &.active {
            i {
                font-weight: 900;
            }
        }
    }
    .view-single {
        font-size: 12px;
        font-weight: 700;
        padding: 0 12px;
        margin-right: 40px;
        cursor: pointer;
    }
</style>
