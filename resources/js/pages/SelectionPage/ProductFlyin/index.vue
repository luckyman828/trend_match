<template>
    <BaseFlyin class="product-single" :show="show" @close="onCloseSingle" :columns=4>
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="`#${product.datasource_id}: ${product.title}`" :next="nextProduct" :prev="prevProduct"
            @close="onCloseSingle" @next="showNextProduct" @prev="showPrevProduct">
                <div class="item-group">
                    <button :class="product[currentAction] != 'Focus' ? 'ghost': 'primary'" 
                    @click="onUpdateAction(product, 'Focus')">
                        <i class="far fa-star"></i>
                    </button>
                    <button :class="product[currentAction] != 'In' ? 'ghost': 'green'" 
                    @click="onUpdateAction(product, 'In')">
                        <i class="far fa-heart"></i>
                        <span>In</span>
                    </button>
                    <button :class="product[currentAction] != 'Out' ? 'ghost': 'red'" 
                    @click="onUpdateAction(product, 'Out')">
                        <i class="far fa-times-circle"></i>
                        <span>out</span>
                    </button>
                </div>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn class="details">
                
                <div class="main-img" @click="cycleImage(true)">
                    <img v-if="product.variants[0] != null" :src="variantImage(product.variants[currentImgIndex])" @error="imgError(product.variants[currentImgIndex])">
                </div>

                <div class="product-variants" v-dragscroll>
                    <div class="variant" v-for="(variant, index) in product.variants" :key="index" @click="currentImgIndex = index" :class="{active: currentImgIndex == index}">
                        <div class="img-wrapper">
                            <img :src="variantImage(variant)" @error="imgError(variant)">
                        </div>
                        <div class="color-wrapper">
                            <div class="circle-img"><img :src="variantImage(variant)" @error="imgError(variant)"></div>
                            <span>{{variant.name}}</span>
                        </div>
                    </div>
                </div>

                <!-- <label>Style number</label>
                <BaseInputField readOnly=true :value="product.datasource_id"/> -->

                <div class="col-3 prices">
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>WHS ({{product.yourPrice.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Wholesale price">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.wholesale_price"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.yourPrice.wholesale_price"/>
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>RRP ({{product.yourPrice.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Recommended retail price">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.recommended_retail_price"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.yourPrice.recommended_retail_price"/>
                    </div>
                    <div>
                        <v-popover :disabled="product.prices.length < 1">
                            <label>Mark up ({{product.yourPrice.currency}}) <i class="far fa-info-circle"></i></label>
                            <template slot="popover">
                                <BaseTooltipList header="Mark up">
                                    <BaseTooltipListItem v-for="(price, index) in product.prices" :key="index"
                                    :label="price.currency" :value="price.mark_up"/>
                                </BaseTooltipList>
                            </template>
                        </v-popover>
                        <BaseInputField readOnly=true :value="product.yourPrice.mark_up"/>
                    </div>
                </div>

                <label>Delivery Date</label>
                <BaseInputField readOnly=true :value="new Date(product.delivery_date).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})"/>

                <div class="col-2 minimum">
                    <div>
                        <label>Order minimum (pcs)</label>
                        <BaseInputField readOnly=true :value="product.quantity"/>
                    </div>
                    <div>
                        <label>Variant minimum (pcs)</label>
                        <BaseInputField readOnly=true :value="product.variant_min_quantity"/>
                    </div>
                </div>

                <label>Composition</label>
                <BaseInputField readOnly=true :value="product.composition"/>
                <label>Description</label>
                <BaseInputField readOnly=true :value="product.description"/>
                <label>Assortments</label>
                <BaseInputField readOnly=true />
                <label>Category</label>
                <BaseInputField readOnly=true :value="product.category"/>

            </BaseFlyinColumn>

            <DistributionSection :product="currentProduct"/>

            <RequestsSection class="comments" :product="product" :selection="currentSelection"/>

            <CommentsSection class="comments" :product="product" :selection="currentSelection"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CommentsSection from './CommentsSection'
import DistributionSection from './DistributionSection'
import RequestsSection from './RequestsSection'
import variantImage from '../../../mixins/variantImage'

export default {
    name: 'productFlyin',
    props: [
        'show',
        'selection',
    ],
    mixins: [
        variantImage
    ],
    components: {
        CommentsSection,
        DistributionSection,
        RequestsSection,
    },
    data: function () { return {
            currentImgIndex: 0,
    }},
    watch: {
        product(newVal, oldVal) {
            if (oldVal && oldVal.id != newVal.id)
                this.currentImgIndex = 0
        },
        show(newVal, oldVal) {
            if (newVal) {
                document.body.addEventListener('keyup', this.hotkeyHandler)
            } else {
                document.body.removeEventListener('keyup', this.hotkeyHandler)
            }
        }
    },
    computed: {
        ...mapGetters('products', ['currentProduct', 'nextProduct', 'prevProduct']),
        ...mapGetters('selections', ['currentSelectionId', 'currentSelection', 'currentSelectionModeAction']),
        product () {
            return this.currentProduct
        },
        currentAction () {
            return this.currentSelectionModeAction
        },
    },
    methods: {
        ...mapActions('products', ['showNextProduct', 'showPrevProduct']),
        onUpdateAction(product, action) {
            this.$emit('updateAction', product, action)
        },
        imgError (variant) {
             variant.error = true
        },
        onCloseSingle() {
            this.currentImgIndex = 0
            // Emit event to parent
            this.$emit('close')
        },
        cycleImage(cycleForward = true) {
            if (cycleForward) {
                if (this.currentImgIndex + 1 == this.product.variants.length) {
                    this.currentImgIndex = 0
                } else {
                    this.currentImgIndex ++
                }
            } else {
                if (this.currentImgIndex == 0) {
                this.currentImgIndex = this.product.variants.length - 1
                } else {
                    this.currentImgIndex --
                }
            }
        },
        hotkeyHandler(event) {
            const key = event.code
            // Only do these if the current target is not the comment box
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {

                if (key == 'Escape')
                    this.onCloseSingle()
                if (key == 'ArrowUp')
                    event.preventDefault(),
                    this.cycleImage(true)
                if (key == 'ArrowDown')
                    event.preventDefault(),
                    this.cycleImage(false)
                if ( true ) {
                    if (key == 'KeyI')
                        this.onUpdateAction(this.product, 'In')
                    if (key == 'KeyO')
                        this.onUpdateAction(this.product, 'Out')
                    if (key == 'KeyF' || key == 'KeyU')
                        this.onUpdateAction(this.product, 'Focus')
                }
            }
        }
    },
    // created() {
    //     document.body.addEventListener('keydown', this.hotkeyHandler)
    // },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.product-single {
    .prices {
        label {
            white-space: nowrap;
        }
    }
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
}
</style>
