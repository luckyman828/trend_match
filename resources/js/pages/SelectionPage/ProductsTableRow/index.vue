<template>
    <tr class="products-table-row" tabindex="0" @focus="onRowFocus" :class="['action-'+product[currentAction], {'multi-selection': currentSelections.length > 1}]"
    @keydown="hotkeyHandler($event)" @keyup.self="keypressHandler($event)" ref="row" @contextmenu.prevent="$emit('showContext', $event)"
    @click.ctrl="$refs.selectCheckbox.check()">

        <div class="product-details">
            <span v-if="product.newComment" class="circle tiny primary"></span>
            
            <td class="select" 
            @click.self="$refs.selectCheckbox.check()">
                <BaseCheckbox ref="selectCheckbox" :value="product" :modelValue="localSelectedProducts" v-model="localSelectedProducts"/>
            </td>
            <td class="image clickable" @click="onViewSingle">
                <div class="img-wrapper">
                    <img :key="product.id" v-if="product.variants.length > 0" :src="variantImage(product.variants[variantIndex])">
                </div>
            </td>
            <td class="id clickable" @click="onViewSingle">
                <span>{{product.datasource_id}}</span>
            </td>
            <td class="title"><span class="clickable" @click="onViewSingle">
                <span v-tooltip="!!product.title && product.title.length > titleTruncateSize && product.title">{{product.title | truncate(titleTruncateSize)}}</span>
                <div class="variant-list">
                    <!-- <div class="variant-list-item pill ghost xs" v-for="(variant, index) in product.variants.slice(0,5)" :key="index">
                        <span>{{variant.name || 'Unnamed' | truncate(variantNameTruncateLength(product))}}</span>
                    </div> -->
                    <VariantListItem v-for="(variant, index) in product.variants.slice(0,5)" :key="index" 
                    :variant="variant" :product="product" :selection="selection"
                    v-tooltip-trigger="{tooltipComp: variantTooltipComp, showArg: {variant, product}, disabled: multiSelectionMode}"
                    @mouseenter.native="variantIndex = index"/>
                    <div class="variant-list-item pill ghost xs" v-if="product.variants.length > 5">
                        <span>+ {{product.variants.length - 5}} more</span>
                    </div>
                </div>
            </span></td>
            <td class="delivery">
                <span>{{
                    new Date(product.delivery_date).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                    })
                }}</span>
            </td>

            <!-- Start Prices -->
            <td class="wholesale-price hide-screen-xs">
                <span>{{product.yourPrice.wholesale_price}}</span>
            </td>
            <td class="recommended-retail-price hide-screen-xs">
                <span>{{product.yourPrice.recommended_retail_price}}</span>
            </td>
            <td class="mark-up hide-screen-xs">
                <span>{{product.yourPrice.mark_up}}</span>
            </td>
            <td class="currency hide-screen-xs"><span>{{product.yourPrice.currency}}</span></td>
            <!-- End Prices -->

            <td class="minimum">
                <div class="square ghost xs">
                    <span>
                        <template v-if="product.min_variant_order">
                        <span>{{product.min_variant_order}}/</span>
                        </template>
                        <span>{{product.min_order}}</span>
                    </span>
                    <i class="far fa-box"></i>
                </div>
            </td>
            
            <!-- Start Distribution -->
            <td class="focus">
                <div tabindex="-1" class="square ghost xs tooltip-target" 
                v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {product, type: 'Focus'}}">
                    <span>{{product.alignmentFocus.length +product.focus.length}}</span>
                    <i class="far fa-star"></i>
                </div>
            </td>

            <td class="ins">
                <div class="tooltip-target square ghost xs"
                v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {product, type: 'In'}}">
                    <span>{{product.allIns}}</span>
                    <i class="far fa-heart"></i>
                </div>
            </td>

            <td class="outs">
                <div class="square ghost xs tooltip-target"
                v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {product, type: 'Out'}}">
                    <span>{{product.alignmentOuts.length + product.outs.length}}</span>
                    <i class="far fa-times-circle"></i>
                </div>
            </td>

            <td class="nds">
                <div class="tooltip-target square ghost xs"
                v-tooltip-trigger="{tooltipComp: distributionTooltipComp, showArg: {product, type: 'None'}}">
                    <span>{{product.alignmentNds.length+ product.nds.length}}</span>
                </div>
            </td>
            <!-- End Distribution -->

            <td class="requests">
                <button class="ghost xs" @click="onViewSingle">
                    <span>{{product.comments.length}}</span><i class="far fa-comment"></i>
                </button>
                <button class="requests-button ghost xs" @click="onViewSingle">
                    <span>{{product.requests.length}}</span><i class="far fa-clipboard-check"></i>
                    <i v-if="product.hasAuthUserRequest" class="own-request fas fa-user-circle"></i>
                </button>
            </td>
            
            <td class="action">
                <!-- Single Selection Input only -->
                <template v-if="currentSelections.length <= 1">
                    <div class="fly-over-wrapper">
                        <div class="fly-over">
                            <div class="gradient"></div>
                            <div class="inner">
                                <BaseButton class="" :buttonClass="product[currentAction] != 'Focus' ? 'ghost': 'primary'"
                                :disabled="!userWriteAccess.actions.hasAccess" 
                                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                @click="onUpdateAction(product, 'Focus', selection)">
                                    <i class="far fa-star"></i>
                                </BaseButton>
                                <BaseButton class=""  :buttonClass="product[currentAction] != 'In' ? 'ghost': 'green'" 
                                :disabled="!userWriteAccess.actions.hasAccess" 
                                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                @click="onUpdateAction(product, 'In', selection)">
                                    <i class="far fa-heart"></i>
                                    <span>In</span>
                                </BaseButton>
                                <BaseButton class=""  :buttonClass="product[currentAction] != 'Out' ? 'ghost': 'red'" 
                                :disabled="!userWriteAccess.actions.hasAccess" 
                                v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                @click="onUpdateAction(product, 'Out', selection)">
                                    <i class="far fa-times-circle"></i>
                                    <span>out</span>
                                </BaseButton>
                                <button class="view invisible ghost-hover primary" 
                                @click="onViewSingle"><span>View</span></button>
                                <button class="options invisible ghost-hover show-screen-md" @click="$emit('showContext', $event)"><i class="far fa-ellipsis-h"></i></button>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- END Single Selection Input only -->
                <template v-else>
                    <button class="invisible ghost-hover primary" 
                    @click="onViewSingle"><span>View</span></button>
                </template>
            </td>
        </div>

        <MultiSelectionInputRow v-if="currentSelections.length > 1"
        :product="product" :focusGroupIndex="focusGroupIndex" :currentAction="currentAction"
        @updateAction="onUpdateAction"/>

    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Mixins
import variantImage from '../../../mixins/variantImage'
import MultiSelectionInputRow from './MultiSelectionInputRow/index'
import VariantListItem from './VariantListItem'

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts',
        'selection',
        'currentAction',
        'index',
        'distributionTooltipComp',
        'variantTooltipComp',
    ],
    components: {
        MultiSelectionInputRow,
        VariantListItem,
    },
    mixins: [
        variantImage,
    ],
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        }
    },
    data: function() { return {
        focusGroupIndex: null,
        variantIndex: 0,
    }},
    computed: {
        ...mapGetters('selections', ['getCurrentSelections', 'currentSelectionMode', 'getAuthUserSelectionWriteAccess']),
        ...mapGetters('products', ['currentFocusRowIndex']),
        ...mapGetters('selections', {
            multiSelectionMode: 'getMultiSelectionModeIsActive',
        }),
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selection)
        },
        localSelectedProducts: {
            get() { return this.selectedProducts },
            set(localSelectedProducts) {this.$emit('input', localSelectedProducts)}
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        titleTruncateSize () {
            return window.innerWidth < 1260 ? 16 : 24
        }
    },
    watch: {
        // Watch for changes to the current focus index 
        currentFocusRowIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                this.$refs.row.focus()
            }
        },
        product(newVal, oldVal) {
            this.variantIndex = 0
        }
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
        variantNameTruncateLength(product) {
            const amount = product.variants.length
            if (amount > 4) {
                return window.innerWidth > 1260 ? 12 : 6
            }
            else if (amount > 2) {
                return window.innerWidth > 1260 ? 20 : 15
            }
        },
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
        },
        onViewSingle() {
            this.showSelectionProductPDP({product: this.product, selection: this.selection})
        },
        onRowFocus() {
            this.focusGroupIndex = null
        },
        focusNext(event) {
            if (this.currentSelections.length <= 1) {
                this.focusNextRow(event)
                return
            }
            event.preventDefault()
            // If the current focus is a row
            if (this.focusGroupIndex == null) {
                // Focus the first group
                this.focusGroupIndex = 0
            }
            // If the focused group is the last group
            else if (this.focusGroupIndex == this.currentSelections.length-1) {
                this.focusNextRow(event)
            } else {
                this.focusGroupIndex++
            }
        },
        focusPrev(event) {
            if (this.currentSelections.length <= 1) {
                this.focusPrevRow(event)
                return
            }
            event.preventDefault()
            // If the current focus is a row
            if (this.focusGroupIndex == null) {
                // Focus the last group of the last row
                // this.focusGroupIndex = this.currentSelections.length-1
                this.focusPrevRow(event)
            }
            // If the current focus is the first group
            else if (this.focusGroupIndex == 0) {
                // Focus the current row
                this.$refs.row.focus()
                this.focusGroupIndex = null
            } else {
                this.focusGroupIndex--
            }
        },
        focusNextRow(event) {
            // Get the next row
            event.preventDefault()
            this.setCurrentFocusRowIndex(this.index+1)
        },
        focusPrevRow(event) {
            // Get the previous row
            event.preventDefault()
            this.setCurrentFocusRowIndex(this.index-1)
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Tab') {
                if (event.shiftKey) {
                    this.focusPrev(event)
                } else {
                    this.focusNext(event)
                }
            }
            // Check if the key pressed is a number
            if (isFinite(event.key)) {
                // Focus the seleciton input group corresponding to the pressed number
                this.focusGroupIndex = event.key-1
            }
            if (key == 'ArrowLeft')
                this.focusPrevRow(event)
            if (key == 'ArrowRight')
                this.focusNextRow(event)
        },
        keypressHandler(event) {
            const key = event.code
            if (key == 'Enter') {
                document.activeElement.blur()
                // this.$emit('onViewSingle', this.product)
                this.onViewSingle()
            }
            if (this.currentSelections.length <= 1 // Check that we are not doing multi selection input
            && this.userWriteAccess.actions.hasAccess // Check if the user has write access
            ) {
                if (key == 'KeyI')
                    this.onUpdateAction(this.product, 'In', this.selection)
                if (key == 'KeyO')
                    this.onUpdateAction(this.product, 'Out', this.selection)
                if (key == 'KeyF' || key == 'KeyU')
                    this.onUpdateAction(this.product, 'Focus', this.selection)
            }
        }
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    .products-table-row {
        display: block;
        padding: 0;
        .circle.tiny {
            margin-left: 8px;
        }
        .img-wrapper {
            border: solid 1px $light2;
            height: 100%;
            width: 100%;
            // width: 48px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        @media screen and (max-width: $screenMd) {
            &:not(.multi-selection) {
                &.action-Focus {
                    box-shadow: -6px 0 0px $primary inset;
                }
                &.action-In {
                    box-shadow: -6px 0 0px $green inset;
                }
                &.action-Out {
                    box-shadow: -6px 0 0px $red inset;
                }
            }
        }
    }
    td.id, td.title {
        position: relative;
    }
    .variant-list {
        position: absolute;
        left: 0;
        bottom: -12px;
        display: flex;
    }
    .product-details {
        height: 138px;
        padding: 8px;
        display: flex;
        align-items: center;
    }
    .requests-button {
        position: relative;
        .own-request {
            position: absolute;
            right: -10px;
            bottom: -8px;
            color:  $primary;
            border-radius: 20px;
            font-size: 16px;
            &::before {
                background: white;
                border-radius: 20px;
            }
        }
    }

    // Flyover actions
    .gradient {
        display: none;
    }
    @media screen and (max-width: $screenMd) {
        td.action {
            position: relative;
            height: 100%;
            .fly-over-wrapper {
                overflow: hidden;
                width: 36px;
                height: 100%;
                position: relative;
                &:hover {
                    overflow: visible;
                    .fly-over .inner {
                        background: $bgContentAlt;
                    }
                    button.options {
                        display: none;
                    }
                }
            }
            .fly-over {
                height: 100%;
                position: absolute;
                right: 0;
                padding-right: 4px;
                .inner {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding-left: 20px;
                    >* {
                        margin-left: 4px;
                    }
                }
                .gradient {
                    display: block;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: -40px;
                    width: 40px;
                    background: linear-gradient(90deg, transparent, #f3f3f3);
                    pointer-events: none;
                }
            }
        }
    }
</style>