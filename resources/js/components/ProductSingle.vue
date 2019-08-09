<template>
    <div class="product-single">
        <template v-if="Object.keys(product).length != 0">
            <div class="card">
                <div class="controls-wrapper">
                        <span class="square" @click="onCloseSingle()"><i class="fal fa-times"></i></span>
                    <div class="controls">
                        <template v-if="!product.productFinalAction">
                            <td><span class="button green" @click="toggleInOut(product.id, 1, 'N/A')">In  <i class="far fa-heart"></i></span></td>
                            <td><span class="button red" @click="toggleInOut(product.id, 0, 'N/A')">Out  <i class="far fa-times-circle"></i></span></td>
                        </template>
                        <template v-else>
                            <span class="button green" :class="[{ active: product.productFinalAction.action == 1}]" @click="toggleInOut(product.id, 1, product.productFinalAction.action)">
                                In  <i class="far fa-heart"></i>
                                </span>
                            <span class="button red" :class="[{ active: product.productFinalAction.action == 0}]"  @click="toggleInOut(product.id, 0, product.productFinalAction.action)">
                                Out  <i class="far fa-times-circle"></i>
                                </span>
                        </template>
                        <span class="button primary active wide" @click="onNextSingle()" :class="[{ disabled: nextProductID < 0}]">Next product</span>
                    </div>
                </div>
                <div class="grid-2 grid-border-between inner">
                    <div>
                        <h3>{{product.title}}</h3>
                        <div class="grid-2">
                            <div class="image">
                                <img :src="product.image">
                            </div>
                            <div class="description">
                                <strong>Style number</strong>
                                <p>{{product.datasource_id}}</p>
                                <strong>Category</strong>
                                <p>{{product.short_description}}</p>
                                <strong>Minimum production</strong>
                                <p>{{product.quantity}}</p>
                                <strong>WHS (EUR)</strong>
                                <p>{{product.wholesale_price}}</p>
                                <strong>RRP (EUR)</strong>
                                <p>{{product.recommended_retail_price}}</p>
                                <strong>MU</strong>
                                <p>{{product.mark_up}}</p>
                            </div>
                        </div>
                        <strong>Composition</strong>
                        <p>{{product.composition}}</p>

                        <div class="tabs-wrapper">
                            <strong>Distribution</strong>
                            <div class="tab-headers">
                                <span :class="{active: currentTab == 'ins'}" class="tab" @click="setCurrentTab('ins')"><span class="count">{{product.ins.length + product.focus.length}}</span>In</span>
                                <span :class="{active: currentTab == 'outs'}" class="tab" @click="setCurrentTab('outs')"><span class="count">{{product.outs.length}}</span>Out</span>
                                <span :class="{active: currentTab == 'nds'}" class="tab" @click="setCurrentTab('nds')"><span class="count">{{product.nds.length}}</span>Not decided</span>
                            </div>
                            <div class="tab-body">
                                <strong class="tab-title">{{currentTab.substr(0, currentTab.length - 1)}}</strong>
                                <p v-for="user in tabBody" :key="user.id">
                                    <span class="team">{{user.team.title}}</span>
                                    <span class="user">{{user.email}}</span>
                                    <template v-if="user.focus != null">
                                        <span class="focus" v-if="user.focus">Focus <i class="fas fa-star"></i></span>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                    <ProductSingleComments :comments="product.comments" :authUser="authUser" :product="product"/>
                </div>
            </div>
        </template>
        <template v-else>
            
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProductSingleComments from './ProductSingleComments'

export default {
    name: 'productSingle',
    props: [
        'product',
        'authUser',
        'nextProductID',
    ],
    components: {
        ProductSingleComments,
    },
    data: function () { return {
            comment: {
                user_id: '',
                product_id: '',
                comment: '',
                important: false,
                final: false,
                product_final: false,
            },
            user_id: this.authUser.id,
            currentTab: 'ins',
    }},
    computed: {
        tabBody () {
            if(this.currentTab == 'ins') {
                // return this.productActionUsers.focus.push(this.productActionUsers.ins)
                const actions = []
                this.product.focus.forEach(action => {
                    action.focus = true;
                    actions.push(action)
                })
                this.product.ins.forEach(action => {
                    action.focus = false
                    actions.push(action)
                })
                return actions
            }
            else return this.product[this.currentTab]
        },
        // productActionUsers () {
        //     const data = {
        //         nds: this.product.nds,
        //         ins: [],
        //         outs: [],
        //         focus: [],
        //     }
        //     this.product.focus.forEach(action => {
        //         data.focus.push(action.user)
        //     })
        //     this.product.ins.forEach(action => {
        //         data.ins.push(action.user)
        //     })
        //     this.product.outs.forEach(action => {
        //         data.outs.push(action.user)
        //     })
        //     return data
        // }
    },
    watch: {
        product: function (newVal, oldVal) {
            this.comment.product_id = newVal.id
        },
        authUser: function (newVal, oldVal) {
            this.comment.user_id = newVal.id
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment']),
        ...mapActions('entities/comments', ['markAsFinal']),
        onCloseSingle() {
            // Emit event to parent
            this.$emit('closeSingle')
        },
        // onSubmitComment(e) {
        //     e.preventDefault()
        //     this.createComment({comment: this.comment})
        // },
        onNextSingle() {
            this.$emit('nextSingle')
        },
        // onMarkAsFinal(comment) {
        //     console.log('Comment: ' + comment.id)
        //     // comment.product_final = !comment.product_final; // This let's us toggle the comments status
        //     comment.product_final = true; // This always sets the comment as final
        //     console.log(comment.product_final)
        //     this.markAsFinal({comment: comment})
        // },
        toggleInOut(productID, actionType, userAction) {
            console.log("Emitting toggle in/out !")
            console.log(`userAction: ${userAction}, and actionType = ${actionType}`)
            this.$emit('onToggleInOut', productID, actionType, userAction)
        },
        setCurrentTab(filter) {
            this.currentTab = filter
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .product-single {
        position: absolute;
        right: 0;
        top: 0;
        margin: 0;
        width: 65%;
        z-index: 1;
        > .card {
            margin: 0;
            background: white;
            animation: slide-in .3s;
            animation-iteration-count: 1;
            animation-timing-function: ease-out;
            padding: 0;
            .inner {
                padding: 1em;
            }
        }  
        .image {
            img {
                border: solid 1px $light2;
                width: 100%;
            }
        }
        .description {
            p {
                margin-top: -4px;
                margin-bottom: 8px;
            }
        }
    }
    h3 {
        font-size: 18px;
        font-weight: 400;
    }
    @keyframes slide-in {
        0% {transform: translateX(100%);}
        100% {transform: translateX(0);}
    }
    .square {
        background: $light1;
        color: $dark;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        padding: 0;
        height: 32px;
        width: 32px;
        text-align: center;
        line-height: 40px;
        &:hover {
            cursor: pointer;
            background: $light;
        }
        i {
            font-size: 22px;
        }
    }
    .grid-border-between {
        > :first-child {
            position: relative;
            &::after {
                content: "";
                position: absolute;
                // height: calc(100% + 2em);
                height: 100%;
                right: calc(-.5rem - 1px);
                top: 0;
                background: $light2;
                width: 2px;
            }
        }
    }
    .button {
        display: inline-block;
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
    .controls-wrapper {
        display: flex;
        border-bottom: solid 2px $light1;
        padding: 6px 0;
        .square {
            margin-left: 1em;
        }
    }
    .controls {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        padding-right: 1em;
        :last-child {
            margin-right: 0;
            margin-left: 20px;
        }
    }
    .tab-headers {
        display: flex;
    }
    .tab {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% / 3);
        background: white;
        height: 40px;
        text-align: center;
        font-size: 10px;
        font-weight: 500;
        color: $dark2;
        cursor: pointer;
        border-bottom: solid 2px $light2;
        line-height: 1.1;
        &:hover {
            background: $light;
        }
        .count {
            color: $dark;
            font-size: 12px;
            font-weight: 700;
        }
        &.active {
            background: $light1;
            color: $dark;
            border-color: $primary;
            color: $dark1;
            .count {
                color: $dark;
            }
        }
    }
    .tab-body {
        background: $light1;
        padding: 12px 16px;
        .tab-title {
            font-size: 12px;
            text-transform: capitalize;
        }
        p {
            border-bottom: solid 1px $light2;
            padding-bottom: 4px;
            margin-bottom: 12px;
        }
        .team {
            width: 60px;
            display: inline-block;
            text-transform: uppercase;
            font-size: 10px;
            color: $dark2;
        }
        .user {
            font-weight: 500;
        }
        .focus {
            font-size: 10px;
            font-weight: 500;
            color: $dark2;
            float: right;
            display: flex;
            margin-top: 2px;
            i {
                color: $primary;
                margin-left: 4px;
                font-size: 16px;
            }
        }
    }
</style>
