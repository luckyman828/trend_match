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
                
                <div class="main-img" @click="cycleImage()">
                    <img v-if="product.color_variants[0] != null" :src="variantImg(product.color_variants[currentImgIndex])" @error="imgError(product.color_variants[currentImgIndex])">
                </div>

                <div class="product-variants" v-dragscroll>
                    <div class="variant" v-for="(variant, index) in product.color_variants" :key="index" @click="currentImgIndex = index" :class="{active: currentImgIndex == index}">
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

                <div class="col-3 prices">
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>WHS ({{product.userPrices.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Wholesale price">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.wholesale_price"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.userPrices.wholesale_price"/>
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>RRP ({{product.userPrices.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Recommended retail price">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.recommended_retail_price"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.userPrices.recommended_retail_price"/>
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>Mark up ({{product.userPrices.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Mark up">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.markup"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.userPrices.markup"/>
                    </div>
                </div>

                <label>Composition</label>
                <BaseInputField readOnly=true :value="product.composition"/>
                <label>Description</label>
                <BaseInputField readOnly=true :value="product.description"/>
                <label>Delivery Date</label>
                <BaseInputField readOnly=true :value="new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})"/>
                <label>Assortments</label>
                <BaseInputField readOnly=true />
                <label>Minimum production (Units)</label>
                <BaseInputField readOnly=true :value="product.quantity"/>
                <label>Category</label>
                <BaseInputField readOnly=true :value="product.category"/>

            </BaseFlyinColumn>

            <BaseFlyinColumn class="distribution">
                <template v-slot:header>
                    <div class="tab-headers">
                        <span :class="{active: currentTab == 'ins'}" class="tab" 
                        @click="setCurrentTab('ins')">
                            IN
                            <span class="count">{{product.ins.length + product.focus.length}}</span>
                        </span>
                        <span :class="{active: currentTab == 'outs'}" class="tab" 
                        @click="setCurrentTab('outs')">
                            OUT
                            <span class="count">{{product.outs.length}}</span>
                        </span>
                        <span :class="{active: currentTab == 'nds'}" class="tab" 
                        @click="setCurrentTab('nds')">
                            ND
                            <span class="count">{{product.nds.length}}</span>
                        </span>
                    </div>
                </template>
                <template v-slot>
                    <div class="tab-body">
                        <strong class="tab-title">{{currentTab.substr(0, currentTab.length - 1)}}</strong>
                        <p v-for="(row, index) in tabBody" :key="index">
                            <span class="user" v-if="userPermissionLevel > 1">{{(row.name) ? row.name : (row.user) ? row.user.name : row.title}}</span>
                            <template v-if="row.focus != null">
                                <span class="focus" v-if="row.focus">Focus <i class="fas fa-star"></i></span>
                            </template>
                        </p>
                    </div>
                </template>
            </BaseFlyinColumn>
            <CommentsSection class="comments" :product="product" :selection="currentSelection"/>
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
        ::v-deep {
            .body > *:not(:last-child)
            {
                margin-bottom: 16px;
            }
            .main-img {
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
            .product-variants {
                margin-top: 12px;
                white-space: nowrap;
                overflow-x: auto;
                margin-bottom: 8px;
                .variant {
                    width: 80px;
                    display: inline-block;
                    cursor: pointer;
                    &:not(:last-child) {
                        margin-right: 16px;
                    }
                    .img-wrapper {
                        height: 108px;
                        width: 80px;
                        border-radius: 4px;
                        border: solid 2px $divider;
                        overflow: hidden;
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            object-position: center;
                        }
                    }
                    .color-wrapper {
                        overflow: hidden;
                        margin-right: 4px;
                        margin-top: 8px;
                        display: flex;
                        align-items: center;
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
                            margin-right: 4px;
                            img {
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                position: absolute;
                            }
                        }
                    }
                    &.active {
                        .img-wrapper {
                            border-color: $primary;
                        }
                    }
                }
            }
        }
    }
    .distribution {
        background: $bgContentAlt;
        .tab-headers {
            display: flex;
            height: 100%;
        }
        .tab {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            background: $bgContentAlt;
            height: 100%;
            text-align: center;
            font-weight: 700;
            color: $dark2;
            cursor: pointer;
            border-radius: 4px 4px 0 0;
            &:not(:last-child) {
                margin-right: 4px;
            }
            &:hover {
                color: $primary;
            }
            .count {
                color: $font;
                font-size: 12px;
                font-weight: 500;
                margin-left: 8px;
            }
            &.active {
                background: white;
                color: $primary;
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
    }
    .comments {
        background: $bg;
    }
}
</style>
