<template>
    <div class="product-single" :class="[{visible: Object.keys(product).length != 0}, {sticky: sticky}]">
        <template v-if="Object.keys(product).length != 0">
            <div class="card">
                <template v-if="!loading">
                    <div class="controls-wrapper">
                            <span class="square true-square light close clickable" @click="onCloseSingle()"><i class="fal fa-times"></i></span>
                        <div class="controls">

                            <template v-if="authUser.role_id >= 2">
                                <span v-if="userPermissionLevel == 2" class="square true-square clickable focus-action" :class="[(product[actionScope] != null) ? (product[actionScope].action == 2) ? 'active light' : 'ghost primary-hover' : 'ghost primary-hover', {'disabled': authUser.role_id == 3}]" @click="toggleInOut(product, 2)">
                                    <i class="far fa-star"></i>
                                </span>
                                <span class="button icon-right" :class="[(product[actionScope] != null) ? (product[actionScope].action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover', {'disabled': authUser.role_id == 3}]" @click="toggleInOut(product, 1)">
                                In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right" :class="[(product[actionScope] != null) ? (product[actionScope].action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover', {'disabled': authUser.role_id == 3}]"  @click="toggleInOut(product, 0)">
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
                                    <img :src="variantImg(product.color_variants[currentImgIndex])" @error="imgError(product.color_variants[currentImgIndex])">
                                </div>
                                <div class="description">
                                    <div>
                                        <strong>Style number</strong>
                                        <span>{{product.datasource_id}}</span>
                                    </div>
                                    <div>
                                        <strong>Category</strong>
                                        <span>{{product.category}}</span>
                                    </div>
                                    <div>
                                        <strong>Minimum production</strong>
                                        <span>{{product.quantity}}</span>
                                    </div>
                                    <div>
                                        <strong>WHS ({{product.userPrices.currency}})</strong>
                                        <TooltipAlt v-if="userPermissionLevel >= 4">
                                            <template v-slot:parent><span>{{product.userPrices.wholesale_price}}</span></template>
                                            <template v-slot:header><span>Wholesale price</span></template>
                                            <template v-slot:body>
                                                <p class="tooltip-row" v-for="(currency, index) in product.prices" :key="index">
                                                    <strong>{{currency.currency}}: </strong>
                                                    <span>{{currency.wholesale_price}}</span>
                                                </p>
                                            </template>
                                        </TooltipAlt>
                                        <span v-else>{{product.userPrices.wholesale_price}}</span>
                                    </div>
                                    <div>
                                        <strong>RRP ({{product.userPrices.currency}})</strong>
                                        <TooltipAlt v-if="userPermissionLevel >= 4">
                                            <template v-slot:parent><span>{{product.userPrices.recommended_retail_price}}</span></template>
                                            <template v-slot:header><span>Recommended retail price</span></template>
                                            <template v-slot:body>
                                                <p class="tooltip-row" v-for="(currency, index) in product.prices" :key="index">
                                                    <strong>{{currency.currency}}: </strong>
                                                    <span>{{currency.recommended_retail_price}}</span>
                                                </p>
                                            </template>
                                        </TooltipAlt>
                                        <span v-else>{{product.userPrices.recommended_retail_price}}</span>
                                    </div>
                                    <div>
                                        <strong>MU</strong>
                                        <!-- <TooltipAlt v-if="userPermissionLevel >= 4">
                                            <template v-slot:parent><span>{{product.userPrices.markup}}</span></template>
                                            <template v-slot:header><span>Mark up</span></template>
                                            <template v-slot:body>
                                                <p class="tooltip-row" v-for="(currency, index) in product.prices" :key="index">
                                                    <strong>{{currency.currency}}: </strong>
                                                    <span>{{currency.markup}}</span>
                                                </p>
                                            </template>
                                        </TooltipAlt> -->
                                        <TooltipAlt2 v-if="userPermissionLevel >= 4" :header="'Mark up'" :array="product.prices" :arrayValueKey="'markup'" :arrayLabelKey="'currency'">
                                            <span>{{product.userPrices.markup}}</span>
                                        </TooltipAlt2>
                                        <span v-else>{{product.userPrices.markup}}</span>
                                    </div>
                                </div>
                            </div>
                            <strong>Composition</strong>
                            <p>{{product.composition}}</p>
                            <strong>Delivery date</strong>
                            <p>{{new Date(product.delivery_date).toLocaleDateString('da-DK', {month: 'long', year: 'numeric'})}}</p>

                            <div class="product-variants">
                                <div class="product-variant" v-for="(variant, index) in product.color_variants" :key="index" @click="currentImgIndex = index" :class="{active: currentImgIndex == index}">
                                    <div class="img-wrapper">
                                        <img :src="variantImg(variant)" @error="imgError(variant)">
                                    </div>
                                    <div class="color-wrapper">
                                        <div class="circle-img"><img :src="variantImg(variant)" @error="imgError(variant)"></div>
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
                                    <template v-if="currentTeamId == 0">
                                        <p v-for="team in tabBody" :key="team.id">
                                            <span class="user">{{team.title}}</span>
                                            <template v-if="team.focus != null">
                                                <span class="focus" v-if="team.focus">Focus <i class="fas fa-star"></i></span>
                                            </template>
                                        </p>
                                    </template>
                                    <template v-else>
                                        <p v-for="user in tabBody" :key="user.id">
                                            <span class="team">{{user.teams[0].title}}</span>
                                            <span class="user">{{user.email}}</span>
                                            <template v-if="user.focus != null">
                                                <span class="focus" v-if="user.focus">Focus <i class="fas fa-star"></i></span>
                                            </template>
                                        </p>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <ProductSingleComments :comments="product.commentsScoped" :authUser="authUser" :product="product"/>
                    </div>
                </template>
                <template v-else>
                    <loader/>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductSingleComments from './ProductSingleComments'
import Loader from './Loader'
import Dropdown from './Dropdown'
import TooltipAlt from './TooltipAlt'
import TooltipAlt2 from './TooltipAlt2'

export default {
    name: 'productSingle',
    props: [
        'product',
        'authUser',
        'nextProductID',
        'prevProductID',
        'sticky',
        'catalogue',
        'loading',
    ],
    components: {
        ProductSingleComments,
        Loader,
        Dropdown,
        TooltipAlt,
        TooltipAlt2,
    },
    data: function () { return {
            user_id: this.authUser.id,
            currentTab: 'ins',
            currentImgIndex: 0,
    }},
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName']),
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
    methods: {
        ...mapActions('entities/comments', ['createComment']),
        ...mapActions('entities/comments', ['markAsFinal']),
        variantImg (variant) {
            if (variant.error != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        imgError (variant) {
             variant.error = true
        },
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
        toggleInOut(product, action) {
            this.$emit('onToggleInOut', product, action)
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
        },
        cycleImageReverse() {
            if (this.currentImgIndex == 0) {
                this.currentImgIndex = this.product.color_variants.length - 1
            } else {
                this.currentImgIndex --
            }
        },
        clickOutsideEvent(event) {
            const thisElement = document.querySelector('.product-single')
            // Check if the clicked element is outside component
            if (!(thisElement == event.target || thisElement.contains(event.target))) {
                if ( !event.target.classList.contains('bind-view-single') )
                    this.onCloseSingle()
            }
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Escape')
                this.onCloseSingle()
            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea') {
                if (key == 'ArrowRight')
                    this.onNextSingle()
                if (key == 'ArrowLeft')
                    this.onPrevSingle()
                if (key == 'ArrowUp')
                    event.preventDefault(),
                    this.cycleImage()
                if (key == 'ArrowDown')
                    event.preventDefault(),
                    this.cycleImageReverse()
                if (this.authUser.role_id >= 2) {
                    if (key == 'KeyI')
                        this.toggleInOut(this.product, 1)
                    if (key == 'KeyO')
                        this.toggleInOut(this.product, 0)
                }
            }
        }
    },
    created() {
        // Listen for clicks outside component
        document.body.addEventListener('click', this.clickOutsideEvent)
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        // Remove click listener
        document.body.removeEventListener('click', this.clickOutsideEvent)
        document.body.removeEventListener('keydown', this.hotkeyHandler)
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
        // &.sticky {
        //     right: 76px;
        //     top: 130px;
        //     position: fixed;
        //     height: calc(100vh - 130px);
        //     > .card {
        //         height: 100%;
        //         overflow: hidden;
        //     }
        // }

        // ALWAYS STICKY
        right: 76px;
        top: 130px;
        position: fixed;
        height: calc(100vh - 130px);
        > .card {
            height: 100%;
            overflow: hidden;
        }
        // ALWAYS STICKY ENDS

        > .card {
            margin: 0;
            background: white;
            animation: slide-in .3s;
            animation-iteration-count: 1;
            animation-timing-function: ease-out;
            padding: 0;
            display: flex;
            flex-direction: column;
            .inner {
                padding: 1em;
                height: 50%;
                flex: 1;
                display: grid;
                grid-template-rows: 100%;
                .comments {
                    display: flex;
                    flex-direction: column;
                }
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
            > div {
                > strong {
                    margin-bottom: -4px;
                    margin-top: 8px;
                    display: block;
                }

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
    .close i {
        font-size: 22px;
    }
    .square {
        i {
            color: $dark2;
        }
        &.active {
            i {
                font-weight: 900;
                color: $primary;
            }
        }
    }
    .card > .grid-2 {
        > :first-child {
            overflow-x: hidden;
            overflow-y: auto;
            height: 77vh;
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
        &:nth-child(1n+2) {
            margin-left: 8px;
        }
    }
    .controls-wrapper {
        display: flex;
        border-bottom: solid 2px $light1;
        padding: 6px 0;
        position: sticky;
        top: 0;
        z-index: 2;
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
            width: 100px;
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
        margin-top: 12px;
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
    p {
        margin: 0;
    }
</style>
