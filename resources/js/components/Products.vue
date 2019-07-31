<template>
    <div class="products card">
        <table>
            <tr class="header-row">
                <th>Select</th>
                <th>Product</th>
                <th></th>
                <th>Focus</th>
                <th>In</th>
                <th>Out</th>
                <th>ND</th>
                <th>Comments</th>
                <th class="swipes">Id</th>
                <th>Action</th>
                <th></th>
                <th>View</th>
            </tr>
            <template v-if="!loading">
                <tr class="product-row"
                v-for="(product, index) in products" :key="product.id">
                    <td><input type="checkbox" @change="onSelect(index)"></td>
                    <td class="image"><img :src="product.images"></td>
                    <td class="title"><span>{{product.title}}</span></td>
                    <td @click="setTooltip(product.focus)">{{product.focus.length}}</td>
                    <td @click="setTooltip(product.ins)">{{product.ins.length}}</td>
                    <td @click="setTooltip(product.outs)">{{product.outs.length}}</td>
                    <td @click="setTooltip(product.nds)">{{product.nds.length}}</td>
                    <td>{{product.comments.length}}</td>
                    <td class="">{{product.id}}</td>
                    <td><span class="button green" :class="[{ active: product.userAction == 2}]" @click="toggleInOut(product.id, 1, product.userAction)">In</span></td>
                    <td><span class="button red" :class="[{ active: product.userAction == 1}]"  @click="toggleInOut(product.id, 0, product.userAction)">Out</span></td>
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
    ],
    components: {
        Loader,
    },
    data: function() { return {
        tooltip: {}
    }},
    methods: {
        ...mapActions('entities/actions', ['updateAction']),
        toggleInOut(productID, actionType, userAction) {
            if (actionType == userAction - 1) {
                // Undo current toggle - delete record
                console.log("Deleting record for user: " + this.authUser.id + " and product: " + productID)
            } else {
                // updateAction({commit}, {user_id, product_id, action_code})
                console.log("Setting actioncode:" + actionType + " for user: " + this.authUser.id + " and product: " + productID)
                this.updateAction({user_id: this.authUser.id, productToUpdate: productID, action_code: actionType})
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
        }
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

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
