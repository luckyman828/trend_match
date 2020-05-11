<template>
    <BaseFlyin class="product-single" :show="show" @close="onCloseSingle" :columns=4>
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :next="nextProduct" :prev="prevProduct"
            @close="onCloseSingle" @next="showNextProduct" @prev="showPrevProduct">
                <template v-slot:left>
                    <div class="item-group product-title-wrapper">
                        <h3>{{`#${product.datasource_id}: ${product.title}`}}</h3>
                        <span class="product-count">Product 
                            {{availableProducts.findIndex(x => x.id == product.id)+1}} 
                            of 
                            {{availableProducts.length}}</span>
                    </div>
                </template>
                <template v-slot:right>
                    <div class="item-group">
                        <SelectionPresenterModeButton :selection="currentSelection" @toggle="onTogglePresenterMode"/>
                    </div>
                    <div class="item-group">
                        <SelectionSelector ref="selectionSelector" v-if="currentSelectionMode == 'Alignment' && !currentSelection.is_presenting"/>
                    </div>
                    <div class="item-group">
                        <BaseButton :buttonClass="product[currentAction] != 'Focus' ? 'ghost': 'primary'"
                        :disabled="!userWriteAccess.actions.hasAccess" 
                        v-tooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction(product, 'Focus', currentSelection)">
                            <i class="far fa-star"></i>
                        </BaseButton>
                        <BaseButton :buttonClass="product[currentAction] != 'In' ? 'ghost': 'green'"
                        :disabled="!userWriteAccess.actions.hasAccess" 
                        v-tooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction(product, 'In', currentSelection)">
                            <i class="far fa-heart"></i>
                            <span>In</span>
                        </BaseButton>
                        <BaseButton :buttonClass="product[currentAction] != 'Out' ? 'ghost': 'red'"
                        :disabled="!userWriteAccess.actions.hasAccess" 
                        v-tooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction(product, 'Out', currentSelection)">
                            <i class="far fa-times-circle"></i>
                            <span>out</span>
                        </BaseButton>
                    </div>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot v-if="show">
            <BaseFlyinColumn class="details">
                
                <div class="main-img" @click="cycleImage(true)">
                    <img v-if="product.variants[0] != null" :src="variantImage(product.variants[currentImgIndex])" @error="imgError(product.variants[currentImgIndex])">
                    <button class="white controls" v-tooltip="'View large images'"
                    @click="showLightbox = true">
                        <i class="far fa-search-plus"></i>
                    </button>
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
                            <label>Mark up <i class="far fa-info-circle"></i></label>
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
                        <label>Order min. (pcs)</label>
                        <BaseInputField readOnly=true :value="product.quantity"/>
                    </div>
                    <div>
                        <label>Variant min. (pcs)</label>
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

            <RequestsSection class="comments" ref="requestsSection"
            :product="product" :selection="currentSelection" :requests="product.requests"
            @activateCommentWrite="$refs.commentsSection.activateWrite()"/>

            <CommentsSection class="comments" ref="commentsSection"
            :product="product" :selection="currentSelection"
            @activateRequestWrite="$refs.requestsSection.activateWrite()"
            @hotkeyEnter="hotkeyEnterHandler"/>

            <ImageLightbox v-if="showLightbox" :defaultIndex="currentImgIndex" :images="product.variants.map(x => variantImage(x))"
            @hide="showLightbox = false"/>

            <PresenterQueueFlyin :product="product" v-if="currentSelection.is_presenting && show"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CommentsSection from './CommentsSection'
import DistributionSection from './DistributionSection'
import RequestsSection from './RequestsSection'
import SelectionSelector from './SelectionSelector'
import PresenterQueueFlyin from './PresenterQueueFlyin/'
import variantImage from '../../../mixins/variantImage'
import ImageLightbox from '../../../components/ImageLightbox'
import SelectionPresenterModeButton from '../../../components/SelectionPresenterModeButton'

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
        SelectionSelector,
        ImageLightbox,
        SelectionPresenterModeButton,
        PresenterQueueFlyin,
    },
    data: function () { return {
            currentImgIndex: 0,
            showLightbox: false,
            lastBroadcastProductId: null,
    }},
    watch: {
        product(newVal, oldVal) {
            if (oldVal && oldVal.id != newVal.id) {
                this.currentImgIndex = 0

                // Broadcast the product when the product changes
                if (this.broadcastActive && this.lastBroadcastProductId != newVal.id) {
                    this.onBroadcastProduct(newVal)
                }
            }
        },
        show(newVal, oldVal) {
            if (newVal) {
                // Broadcast the product if we have not yet broadcast a product or we have just opened the same product as shown before
                if (this.broadcastActive && (!this.lastBroadcastProductId || this.lastBroadcastProductId == this.product.id)) {
                    this.onBroadcastProduct(this.product)
                }
                document.activeElement.blur()
                document.body.addEventListener('keyup', this.hotkeyHandler)
                document.body.addEventListener('keydown', this.keydownHandler)
            } else {
                document.body.removeEventListener('keyup', this.hotkeyHandler)
                document.body.removeEventListener('keydown', this.keydownHandler)
            }
        }
    },
    computed: {
        ...mapGetters('products', ['currentProduct', 'nextProduct', 'prevProduct', 'availableProducts']),
        ...mapGetters('selections', ['getCurrentPDPSelection', 'getSelectionCurrentMode', 'getSelectionModeAction', 'getAuthUserSelectionWriteAccess']),
        product () {
            return this.currentProduct
        },
        broadcastActive () {return this.currentSelection.is_presenting},
        currentSelection () { return this.getCurrentPDPSelection },
        currentSelectionMode () { return this.getSelectionCurrentMode(this.currentSelection) },
        currentSelectionModeAction () { return this.getSelectionModeAction(this.currentSelectionMode) },
        currentAction () {
            return this.currentSelectionModeAction
        },
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.currentSelection)
        },
    },
    methods: {
        ...mapActions('products', ['showNextProduct', 'showPrevProduct']),
        ...mapActions('presenterQueue', ['broadcastProduct']),
        onTogglePresenterMode(gotActivated) {
            console.log('toggle presenter mode!', gotActivated)
            if (gotActivated) {
                this.onBroadcastProduct(this.product)
            }
        },
        onBroadcastProduct(product) {
            this.lastBroadcastProductId = product.id
            this.broadcastProduct(product)
        },
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
        },
        imgError (variant) {
             variant.error = true
        },
        onCloseSingle() {
            if (!this.selection.is_presenting || confirm('You are about to close the Product Flyin.\n\nYour presentation will still continue.\n\nPress any product to access your queue again.\n\nPress "Okay" to continue.')) {
                this.currentImgIndex = 0
                // Emit event to parent
                this.$emit('close')
            }
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
                if (this.userWriteAccess.actions.hasAccess) {
                    if (key == 'KeyI')
                        this.onUpdateAction(this.product, 'In', this.currentSelection)
                    if (key == 'KeyO')
                        this.onUpdateAction(this.product, 'Out', this.currentSelection)
                    if (key == 'KeyF' || key == 'KeyU')
                        this.onUpdateAction(this.product, 'Focus', this.currentSelection)
                }
            }
        },
        hotkeyEnterHandler(e) {
            // If the current mode is Alignment, focus the request field. Else focus comment
            if (this.currentSelectionMode == 'Alignment') {
                this.$refs.requestsSection.activateWrite()
            } else {
                this.$refs.commentsSection.activateWrite()
            }
        },
        keydownHandler(e) {
            const key = event.code
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT' && this.show) {
                if (key == 'ArrowUp')
                    e.preventDefault(),
                    this.cycleImage(true)
                if (key == 'ArrowDown')
                    e.preventDefault(),
                    this.cycleImage(false)
            }
        }
    },
    destroyed() {
        document.body.removeEventListener('keyup', this.hotkeyHandler)
        document.body.removeEventListener('keydown', this.keydownHandler)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';


::v-deep {
    &.product-single {
        > .flyin {
            min-width: 0;
            width: calc(100vw - 242px);
            > .body {
                grid-template-columns: 26% 26% 24% 24% !important;
            }
            .flyin-header {
                > .left {
                    max-width: 380px;
                }
            }
        }
    }
}

.product-title-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    .product-count {
        font-size: 12px;
        line-height: 1;
    }
}

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
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }
                .controls {
                    position: absolute;
                    right: 4px;
                    top: 4px;
                    opacity: 0;
                }
                &:hover {
                    .controls {
                        opacity: 1;
                    }
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
