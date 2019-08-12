<template>
    <div class="product-single" :class="[{visible: Object.keys(product).length != 0}, {sticky: sticky}]">
        <template v-if="Object.keys(product).length != 0">
            <div class="card">
                <div class="controls-wrapper">
                        <span class="square" @click="onCloseSingle()"><i class="fal fa-times"></i></span>
                    <div class="controls">
                        <template v-if="!product.productFinalAction">
                            <span class="button green" @click="toggleInOut(product.id, 1, 'N/A')">In  <i class="far fa-heart"></i></span>
                            <span class="button red" @click="toggleInOut(product.id, 0, 'N/A')">Out  <i class="far fa-times-circle"></i></span>
                        </template>
                        <template v-else>
                            <span class="button green" :class="[{ active: product.productFinalAction.action == 1}]" @click="toggleInOut(product.id, 1, product.productFinalAction.action)">
                                In  <i class="far fa-heart"></i>
                                </span>
                            <span class="button red" :class="[{ active: product.productFinalAction.action == 0}]"  @click="toggleInOut(product.id, 0, product.productFinalAction.action)">
                                Out  <i class="far fa-times-circle"></i>
                                </span>
                        </template>
                        <span class="button primary active wide" @click="onPrevSingle()" :class="[{ disabled: prevProductID < 0}]">Previous style</span>
                        <span class="button primary active wide" @click="onNextSingle()" :class="[{ disabled: nextProductID < 0}]">Next style</span>
                    </div>
                </div>
                <div class="grid-2 grid-border-between inner">
                    <div>
                        <h3>{{product.title}}</h3>
                        <div class="grid-2">
                            <div class="image" @click="cycleImage()">
                                <img :src="product.color_variants[currentImgIndex].image">
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

                        <div class="product-variants">
                            <div class="product-variant" v-for="(variant, index) in product.color_variants" :key="index" @click="currentImgIndex = index" :class="{active: currentImgIndex == index}">
                                <div class="img-wrapper">
                                    <img :src="variant.image">
                                </div>
                                <div class="color-wrapper">
                                    <div class="circle-img"><img :src="variant.image"></div>
                                    <span>{{variant.color}}</span>
                                </div>
                            </div>
                        </div>

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
        'prevProductID',
        'sticky',
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
            currentImgIndex: 0,
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
            this.currentImgIndex = 0
            // Emit event to parent
            this.$emit('closeSingle')
        },
        onNextSingle() {
            this.currentImgIndex = 0
            this.$emit('nextSingle')
        },
        onPrevSingle() {
            this.currentImgIndex = 0
            this.$emit('prevSingle')
        },
        toggleInOut(productID, actionType, userAction) {
            console.log("Emitting toggle in/out !")
            console.log(`userAction: ${userAction}, and actionType = ${actionType}`)
            this.$emit('onToggleInOut', productID, actionType, userAction)
        },
        setCurrentTab(filter) {
            this.currentTab = filter
        },
        cycleImage() {
            if (this.currentImgIndex + 1 == this.product.color_variants.length) {
                this.currentImgIndex = 0
            } else {
                this.currentImgIndex ++
            }
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
        max-width: 60vw;
        z-index: 1;
        &.visible {
            width: 100%;
        }
        &.sticky {
            right: 76px;
            top: 130px;
            position: fixed;
            height: calc(100vh - 160px);
            > .card {
                height: 100%;
                overflow-y: scroll;
            }
        }
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
            cursor: pointer;
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
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
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
    .grid-2 {
        grid-template-columns: repeat( auto-fit, minmax(33.33%, 1fr) );
    }
    .product-variants {
        white-space: nowrap;
        overflow-x: auto;
    }
    .product-variant {
        width: 85px;
        display: inline-block;
        cursor: pointer;
        &:not(:last-child) {
            margin-right: 12px;
        }
        .color-wrapper {
            overflow: hidden;
            margin-right: 5px;
            span {
                font-size: 10px;
                font-weight: 500;
                color: $dark2;
            }
            .circle-img {
                width: 12px;
                height: 12px;
                border-radius: 6px;
                border: solid 1px $light1;
                position: relative;
                overflow: hidden;
                display: inline-block;
                img {
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    position: absolute;
                }
            }
        }
        .img-wrapper {
            padding-top: 100%;
            width: 100%;
            height: 0;
            position: relative;
            overflow: hidden;
            display: inline-block;
            margin-right: 4px;
            border-radius: 4px;
            border: solid 1px $light1;
            overflow: hidden;
            img {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        &.active {
            .img-wrapper {
                border-color: $dark05;
            }
            .color-wrapper {
                span {
                    color: $dark;
                }
            }
        }
    }
    .tabs-wrapper {
        margin-bottom: 60px;
    }
</style>
