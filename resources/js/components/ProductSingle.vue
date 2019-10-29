<template>
    <div class="product-single">
        <div class="inner">
            <template v-if="!loading && product != null">
                <div class="header">
                    <div class="left">
                        <span class="square true-square light close clickable" @click="onCloseSingle()"><i class="fal fa-times"></i></span>
                        <h3>{{product.title}}</h3>
                    </div>
                    <div class="right controls">
                        <!-- <template v-if="currentTaskPermissions.actions && userPermissionLevel != 3">
                            <span v-if="currentTaskPermissions.focus && currentTask.type != 'approval'" class="square true-square clickable focus-action" :class="[(product.currentAction != null) ? (product.currentAction.action == 2) ? 'active light' : 'ghost primary-hover' : 'ghost primary-hover']" @click="toggleInOut(product, 2)">
                                <i class="far fa-star"></i>
                            </span>
                            <span class="button icon-right" :class="[(product.currentAction != null) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover']" @click="toggleInOut(product, 1)">
                            In  <i class="far fa-heart"></i>
                            </span>
                            <span class="button icon-right" :class="[(product.currentAction != null) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover']"  @click="toggleInOut(product, 0)">
                            Out  <i class="far fa-times-circle"></i>
                            </span>
                        </template>
                        <template v-else-if="userPermissionLevel == 3">
                            <template v-if="product.currentAction">
                                <span class="button icon-right disabled" :class="[(product.currentAction) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover']" @click="toggleInOut(product, 1)">
                                In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right disabled" :class="[(product.currentAction != null) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover']"  @click="toggleInOut(product, 0)">
                                Out  <i class="far fa-times-circle"></i>
                                </span>
                            </template>
                            <template v-else>
                            <span class="button icon-right" :class="[(product.currentAction != null) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover']" @click="toggleInOut(product, 1)">
                                In  <i class="far fa-heart"></i>
                            </span>
                            <span class="button ghost icon-right disabled">
                                Out  <i class="far fa-times-circle"></i>
                            </span>
                            </template>
                        </template> -->

                        <span v-if="currentTaskPermissions.focus && currentTask.type != 'approval' && currentTask.type != 'decision'" class="square light-2 true-square clickable focus-action" :class="[(product.currentAction) ? (product.currentAction.action == 2) ? 'active light' : 'ghost primary-hover' : 'ghost primary-hover']" @click="toggleInOut(product, 2)"  ref="focusButton">
                            <i class="far fa-star"></i>
                            </span>


                            <template v-if="product.outInFilter">
                                <TooltipAlt2 :body="'Out by ' + product.outInFilter.user.name + ' in ' + product.outInFilter.task.title">
                                    <span class="button icon-right ghost disabled" ref="inButton">
                                        In  <i class="far fa-heart"></i>
                                    </span>
                                    <span class="button icon-right active red disabled" ref="outButton">
                                        Out  <i class="far fa-times-circle"></i>
                                    </span>
                                </TooltipAlt2>
                            </template>
                            <template v-else-if="currentTask.type == 'approval' && product.requests.length < 1">
                                <span class="button icon-right active green disabled" ref="inButton">
                                    In  <i class="far fa-heart"></i>
                                </span>
                                <span class="button icon-right ghost disabled" ref="outButton">
                                    Out  <i class="far fa-times-circle"></i>
                                </span>
                            </template>
                            <template v-else>
                                <template v-if="userPermissionLevel != 3">
                                    
                                    <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id == 3 : false}]" @click="toggleInOut(product, 1)" ref="inButton">
                                    In  <i class="far fa-heart"></i>
                                    </span>
                                    <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id == 3 : false}]"  @click="toggleInOut(product, 0)" ref="outButton">
                                    Out  <i class="far fa-times-circle"></i>
                                    </span>

                                </template>
                                <template v-else>
                                    <span class="button icon-right" :class="[(product.currentAction) ? (product.currentAction.action != 0) ? 'active green' : 'ghost green-hover' : 'ghost green-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id != 3 : false}]" @click="toggleInOut(product, 1)" ref="inButton">
                                    In  <i class="far fa-heart"></i>
                                    </span>
                                    <span class="button icon-right disabled" :class="[(product.currentAction) ? (product.currentAction.action == 0) ? 'active red' : 'ghost red-hover' : 'ghost red-hover', {disabled: (product.currentAction) ? product.currentAction.user.role_id != 3 : false}]" ref="outButton">
                                    Out  <i class="far fa-times-circle"></i>
                                    </span>
                                </template>

                            </template>
                        

                        <span class="button primary active wide" @click="onPrevSingle()" :class="[{ disabled: prevProductId == null}]">Previous style</span>
                        <span class="button primary active wide" @click="onNextSingle()" :class="[{ disabled: nextProductId == null}]">Next style</span>
                    </div>
                </div>
                <div class="grid-2 grid-border-between body">
                    <div class="details">
                        <div class="grid-2">
                            <div class="image" @click="cycleImage()">
                                <img :src="variantImg(product.color_variants[currentImgIndex])" @error="imgError(product.color_variants[currentImgIndex])">
                            </div>
                            <div class="description">
                                <div class="stat">
                                    <p><strong>Style number</strong></p>
                                    <p><span>{{product.datasource_id}}</span></p>
                                </div>
                                <div class="stat">
                                    <p><strong>Category</strong></p>
                                    <span>{{product.category}}</span>
                                </div>
                                <div class="stat">
                                    <strong>Minimum production</strong>
                                    <span>{{product.quantity}}</span>
                                </div>

                                <TooltipAlt2 v-if="userPermissionLevel >= 4" :header="'Wholesale price'" :array="product.prices" :arrayValueKey="'wholesale_price'" :arrayLabelKey="'currency'">
                                    <div class="stat">
                                        <p><strong>WHS ({{product.userPrices.currency}})</strong></p>
                                        <p>{{product.userPrices.wholesale_price}} <i class="far fa-info-circle"></i></p>
                                    </div>
                                </TooltipAlt2>
                                <template v-else>
                                    <div class="stat">
                                        <p><strong>WHS ({{product.userPrices.currency}})</strong></p>
                                        <p>{{product.userPrices.wholesale_price}}</p>
                                    </div>
                                </template>

                                <TooltipAlt2 v-if="userPermissionLevel >= 4" :header="'Recommended retail price'" :array="product.prices" :arrayValueKey="'recommended_retail_price'" :arrayLabelKey="'currency'">
                                    <div class="stat">
                                        <p><strong>RRP ({{product.userPrices.currency}})</strong></p>
                                        <p>{{product.userPrices.recommended_retail_price}} <i class="far fa-info-circle"></i></p>
                                    </div>
                                </TooltipAlt2>
                                <template v-else>
                                    <div class="stat">
                                        <p><strong>RRP ({{product.userPrices.currency}})</strong></p>
                                        <p>{{product.userPrices.recommended_retail_price}}</p>
                                    </div>
                                </template>

                                <TooltipAlt2 v-if="userPermissionLevel >= 4" :header="'Mark up'" :array="product.prices" :arrayValueKey="'markup'" :arrayLabelKey="'currency'">
                                    <div class="stat">
                                        <p><strong>MU</strong></p>
                                        <p>{{product.userPrices.markup}} <i class="far fa-info-circle"></i></p>
                                    </div>
                                </TooltipAlt2>
                                <template v-else>
                                    <div class="stat">
                                        <p><strong>MU</strong></p>
                                        <p>{{product.userPrices.markup}}</p>
                                    </div>
                                </template>

                            </div>
                        </div>

                        <div class="stat">
                            <p><strong>Composition</strong></p>
                            <p>{{product.composition}}</p>
                        </div>
                        <div class="stat">
                            <p><strong>Delivery date</strong></p>
                            <p>{{new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}}</p>
                        </div>
                        <div class="stat" v-if="product.assortments">
                            <p><strong>Assortments</strong></p>
                            <p v-for="(assortment, index) in product.assortments" :key="index">
                                <span>{{assortment.assortment_name}}</span>
                            </p>
                        </div>

                        <div class="product-variants" v-dragscroll>
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
                                <p v-for="(row, index) in tabBody" :key="index">
                                    <span class="team">{{(row.task) ? row.task.title : row.title}}</span>
                                    <span class="user" v-if="userPermissionLevel > 1">{{(row.name) ? row.name : (row.user) ? row.user.name : row.title}}</span>
                                    <template v-if="row.focus != null">
                                        <span class="focus" v-if="row.focus">Focus <i class="fas fa-star"></i></span>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                    <ProductSingleComments :comments="product.commentsScoped" :requests="product.requests" :authUser="authUser" :product="product"/>
                </div>
            </template>
            <template v-else>
                <loader/>
            </template>
        </div>
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
        'authUser',
        'sticky',
        'visible',
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
            currentTab: 'ins',
            currentImgIndex: 0,
    }},
    watch: {
        product(newVal, oldVal) {
            if (newVal.id != oldVal.id) {
                // New product
                this.currentImgIndex = 0
            }
        },
    },
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'actionScope', 'currentTaskPermissions', 'currentTask']),
        ...mapGetters('entities/products', ['currentProduct', 'nextProductId', 'prevProductId']),
        product () {
            return this.currentProduct
        },
        tabBody () {
            if(this.currentTab == 'ins') {
                // return this.productActionUsers.focus.push(this.productActionUsers.ins)
                const actions = []
                this.product.focus.forEach(action => {
                    const actionCopy = JSON.parse(JSON.stringify(action))
                    actionCopy.focus = true;
                    actions.push( actionCopy )
                })
                this.product.ins.forEach(action => {
                    const actionCopy = JSON.parse(JSON.stringify(action))
                    actionCopy.focus = false
                    actions.push( actionCopy )
                })
                return actions
            }
            else return this.product[this.currentTab]
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsFinal']),
        ...mapActions('entities/products', ['showNextProduct', 'showPrevProduct']),
        variantImg (variant) {
            if (!variant.error && variant.blob_id != null)
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
            if (this.nextProductId != null) {
                this.showNextProduct()
            }
        },
        onPrevSingle() {
            if (this.prevProductId != null) {
                this.showPrevProduct()
            }
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
        hotkeyHandler(event) {
            const key = event.code
            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && this.visible) {
                const inAvailable = this.$refs.inButton ? !this.$refs.inButton.classList.contains('disabled') : false
                const outAvailable = this.$refs.outButton ? !this.$refs.outButton.classList.contains('disabled') : false
                const focusAvailable = this.$refs.focusButton ? !this.$refs.focusButton.classList.contains('disabled') : false

                if (key == 'Escape')
                    this.onCloseSingle()
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
                if ( this.currentTaskPermissions.actions ) {
                    if (key == 'KeyI' && inAvailable)
                        this.toggleInOut(this.product, 1)
                    if (key == 'KeyO' && outAvailable)
                        this.toggleInOut(this.product, 0)
                    if (key == 'KeyF' && focusAvailable)
                        this.toggleInOut(this.product, 2)
                }
            }
        }
    },
    created() {
        document.body.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .product-single {
        height: 100%;
        > .inner {
            height: 100%;
            width: 100%;
            background: $light;
            display: flex;
            flex-direction: column;
            .body {
                padding: 1em;
                height: 50%;
                flex: 1;
                display: grid;
                grid-template-rows: 100%;
                .comments {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
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
            .stat {
                > :first-child {
                    margin-bottom: -4px;
                    margin-top: 8px;
                    display: block;
                }
            }
        }
        .details {
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
    h3 {
        font-size: 16px;
        font-weight: 400;
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
            height: 100%;
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
    .header {
        display: flex;
        border-bottom: solid 2px $light1;
        padding: 6px 20px;
        position: sticky;
        top: 0;
        z-index: 2;
        background: white;
        height: 72px;
        align-items: center;
        > * {
            flex: 1;
            display: flex;
            align-items: center;
        }
        .close {
            margin-right: 24px;
        }
    }
    .controls {
        display: flex;
        justify-content: flex-end;
        width: 100%;
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
    .details {
        padding-right: 1px;
    }
</style>
