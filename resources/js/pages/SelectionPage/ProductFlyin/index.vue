<template>
    <BaseFlyin class="product-single" :show="show" @close="onCloseSingle" :columns=3>
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="product.title" :next="nextProductId" :prev="prevProductId"
            @close="onCloseSingle" @next="showNextProduct" @prev="showPrevProduct">
                <div class="item-group">
                    <button class="primary" :class="{'ghost': !product.currentAction || product.currentAction.action != 2}" 
                    @click="onUpdateAction(product, 2)">
                        <i class="far fa-star"></i>
                    </button>
                    <button class="primary" :class="{'ghost': !product.currentAction || product.currentAction.action != 1}" 
                    @click="onUpdateAction(product, 1)">
                        <i class="far fa-heart"></i>
                        <span>In</span>
                    </button>
                    <button class="primary" :class="{'ghost': !product.currentAction || product.currentAction.action != 0}" 
                    @click="onUpdateAction(product, 0)">
                        <i class="far fa-times"></i>
                        <span>out</span>
                    </button>
                </div>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn class="details">
                
                <div class="img-wrapper" @click="cycleImage()">
                    <img v-if="product.color_variants[0] != null" :src="variantImg(product.color_variants[currentImgIndex])" @error="imgError(product.color_variants[currentImgIndex])">
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

                <label>Style number</label>
                <BaseInputField readOnly=true :value="product.datasource_id"/>

                <div class="grid-3">
                    <label>WHS ({{product.userPrices.currency}})</label>
                    <v-popover>
                        <label>WHS ({{product.userPrices.wholesale_price}}) <i class="far fa-info-circle"></i></label>
                        <BaseTooltipList slot="popover" :header="'Wholesale price'" :array="product.prices" :arrayValueKey="'wholesale_price'" :arrayLabelKey="'currency'"/>
                    </v-popover>
                    <BaseInputField readOnly=true :value="product.userPrices.wholesale_price"/>
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

                    <div class="stat">
                        <p><strong>WHS ({{product.userPrices.currency}})</strong></p>
                        <v-popover :disabled="userPermissionLevel < 4">
                            <p class="tooltip-target">{{product.userPrices.wholesale_price}} <i class="far fa-info-circle"></i></p>
                            <BaseTooltipList slot="popover" :header="'Wholesale price'" :array="product.prices" :arrayValueKey="'wholesale_price'" :arrayLabelKey="'currency'"/>
                        </v-popover>
                    </div>

                    <div class="stat">
                        <p><strong>RRP ({{product.userPrices.currency}})</strong></p>
                        <v-popover :disabled="userPermissionLevel < 4">
                            <p class="tooltip-target">{{product.userPrices.recommended_retail_price}} <i class="far fa-info-circle"></i></p>
                            <BaseTooltipList slot="popover" :header="'Recommended retail price'" :array="product.prices" :arrayValueKey="'recommended_retail_price'" :arrayLabelKey="'currency'"/>
                        </v-popover>
                    </div>

                    <div class="stat">
                        <p><strong>MU</strong></p>
                        <v-popover :disabled="userPermissionLevel < 4">
                            <p class="tooltip-target">{{product.userPrices.markup}} <i class="far fa-info-circle"></i></p>
                            <BaseTooltipList slot="popover" :header="'Mark up'" :array="product.prices" :arrayValueKey="'markup'" :arrayLabelKey="'currency'"/>
                        </v-popover>
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
                <div class="stat">
                    <p><strong>Description</strong></p>
                    <p>{{product.sale_description}}</p>
                </div>
                <div class="stat" v-if="product.assortments">
                    <p><strong>Assortments</strong></p>
                    <p v-for="(assortment, index) in product.assortments" :key="index">
                        <span>{{assortment.assortment_name}}</span>
                    </p>
                </div>

            </BaseFlyinColumn>

            <BaseFlyinColumn>
                <template v-slot:header>
                    <span>i am a header</span>
                </template>
                <template v-slot>
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
                                <span class="user" v-if="userPermissionLevel > 1">{{(row.name) ? row.name : (row.user) ? row.user.name : row.title}}</span>
                                <template v-if="row.focus != null">
                                    <span class="focus" v-if="row.focus">Focus <i class="fas fa-star"></i></span>
                                </template>
                            </p>
                        </div>
                    </div>
                </template>
            </BaseFlyinColumn>
            <CommentsSection :product="product" :selection="currentSelection"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CommentsSection from './CommentsSection'

export default {
    name: 'productFlyin',
    props: [
        'show',
    ],
    components: {
        CommentsSection,
    },
    data: function () { return {
            currentTab: 'ins',
            currentImgIndex: 0,
    }},
    watch: {
        product(newVal, oldVal) {
            if (oldVal && oldVal.id != newVal.id)
                this.currentImgIndex = 0
        },
    },
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'actionScope']),
        ...mapGetters('entities/products', ['currentProduct', 'nextProductId', 'prevProductId']),
        ...mapGetters('entities/selections', ['currentSelectionId', 'currentSelection']),
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
        onUpdateAction(product, actionCode) {
            this.$emit('updateAction', product, actionCode)
        },
        variantImg (variant) {
            if (!variant.error && variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else if (variant.image) return variant.image
            else return `/images/placeholder.JPG`
        },
        imgError (variant) {
             variant.error = true
        },
        onCloseSingle() {
            this.currentImgIndex = 0
            // Emit event to parent
            this.$emit('close')
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
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                const inAvailable = this.$refs.inButton ? !this.$refs.inButton.classList.contains('disabled') : false
                const outAvailable = this.$refs.outButton ? !this.$refs.outButton.classList.contains('disabled') : false
                const focusAvailable = this.$refs.focusButton ? !this.$refs.focusButton.classList.contains('disabled') : false

                if (key == 'Escape')
                    this.onCloseSingle()
                if (key == 'ArrowUp')
                    event.preventDefault(),
                    this.cycleImage()
                if (key == 'ArrowDown')
                    event.preventDefault(),
                    this.cycleImageReverse()
                if ( true ) {
                    if (key == 'KeyI' && inAvailable)
                        this.onUpdateAction(this.product, 1)
                    if (key == 'KeyO' && outAvailable)
                        this.onUpdateAction(this.product, 0)
                    if (key == 'KeyF' && focusAvailable)
                        this.onUpdateAction(this.product, 2)
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
        .details {
            background: $bgContent;
            .img-wrapper {
                cursor: pointer;
                width: 216px;
                height: 286px;
                overflow: hidden;
                border-radius: 4px;
                border: solid 2px $divider;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }
            }
            .description {
                .stat {
                    > :first-child {
                        margin-bottom: -4px;
                        margin-top: 8px;
                        display: block;
                    }
                    .v-popover {
                        display: inline-block;
                    }
                }
            }
            .details {
                overflow-x: hidden;
                overflow-y: auto;
            }

        }
    }
    h3 {
        font-size: 16px;
        font-weight: 400;
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
        flex: 1;
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
                margin-top: -2px;
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
                height: 100%;
                object-fit: contain;
                object-position: center;
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
    .focus + .impact {
        margin-right: 8px;
    }
    .impact {
        display: inline-flex;
        align-items: center;
        float: right;
        // margin-right: 8px;
        font-size: 10px;
        font-weight: 500;
        color: $dark2;
        margin-top: 2px;
        .circle {
            margin-bottom: 2px;
            margin-left: 4px;
        }
        &.impact-1 {
            .circle {
                background: $red;
            }
        }
        &.impact-2 {
            .circle {
                background: $orange;
            }
        }
        &.impact-3 {
            .circle {
                background: $green;
            }
        }
    }
</style>
