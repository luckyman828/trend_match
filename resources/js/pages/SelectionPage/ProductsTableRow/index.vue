<template>
    <tr class="products-table-row" tabindex="0" @focus="onRowFocus" :class="'action-'+product[currentAction]"
    @keydown="hotkeyHandler($event)" @keyup.self="keypressHandler($event)" ref="row" @contextmenu.prevent="$emit('showContext', $event)">

        <div class="product-details">
            <span v-if="product.newComment" class="circle tiny primary"></span>
            
            <td class="select" 
            @click.self="$refs.selectCheckbox.check()">
                <BaseCheckbox ref="selectCheckbox" :value="product" :modelValue="localSelectedProducts" v-model="localSelectedProducts"/>
            </td>
            <td class="image clickable" @click="onViewSingle">
                <div class="img-wrapper">
                    <img :key="product.id" v-if="product.variants[0] != null" :src="variantImage(product.variants[0])">
                    <!-- <img v-if="product.variants[0] != null" :src="variantImage(product.variants[0])"> -->
                </div>
            </td>
            <td class="id clickable" @click="onViewSingle">
                <span>{{product.datasource_id}}</span>
                <div class="variant-list">
                    <div class="variant-list-item pill ghost xs" v-for="(variant, index) in product.variants" :key="index">
                        <span>{{variant.name || 'Unnamed'}}</span>
                    </div>
                </div>
            </td>
            <td class="title"><span class="clickable" @click="onViewSingle">
                <span v-tooltip="!!product.title && product.title.length > 24 && product.title">{{product.title | truncate(24)}}</span>
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
            <td class="wholesale-price hide-screen-sm">
                <span>{{product.yourPrice.wholesale_price}} {{product.yourPrice.currency}}</span>
            </td>
            <td class="recommended-retail-price hide-screen-sm">
                <span>{{product.yourPrice.recommended_retail_price}} {{product.yourPrice.currency}}</span>
            </td>
            <td class="mark-up hide-screen-sm">
                <span>{{product.yourPrice.mark_up}}</span>
            </td>
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
            <v-popover class="focus" :disabled="product.focus.length <= 0 && product.alignmentFocus.length <= 0">
                <td class="focus tooltip-target">
                    <div tabindex="-1" class="square ghost xs"><span>{{product.alignmentFocus.length +product.focus.length}}</span><i class="far fa-star"></i></div>
                </td>
                <template slot="popover">
                    <BaseTooltipList header="Focus Alignment" v-if="product.alignmentFocus.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.alignmentFocus" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                    <BaseTooltipList header="Focus Feedback" v-if="product.focus.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.focus" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                </template>
            </v-popover>
            <v-popover class="ins" :disabled="product.ins.length <= 0 && product.alignmentIns.length <= 0">
                <td class="ins tooltip-target">
                    <div class="square ghost xs"><span>{{product.allIns}}</span><i class="far fa-heart"></i></div>
                </td>
                <template slot="popover">
                    <BaseTooltipList header="Ins Alignment" v-if="product.alignmentIns.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.alignmentIns" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                    <BaseTooltipList header="Ins Feedback" v-if="product.ins.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.ins" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                </template>
            </v-popover>
            <v-popover class="outs" :disabled="product.outs.length <= 0 && product.alignmentOuts.length <= 0">
                <td class="outs tooltip-target">
                    <div class="square ghost xs"><span>{{product.alignmentOuts.length + product.outs.length}}</span><i class="far fa-times-circle"></i></div>
                </td>
                <template slot="popover">
                    <BaseTooltipList header="Outs Alignment" v-if="product.alignmentOuts.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.alignmentOuts" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                    <BaseTooltipList header="Outs Feedback" v-if="product.outs.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.outs" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                </template>
            </v-popover>
            <v-popover class="nds" :disabled="product.nds.length <= 0 && product.alignmentNds <= 0">
                <td class="nds tooltip-target">
                    <div class="square ghost xs"><span>{{product.alignmentNds.length+ product.nds.length}}</span></div>
                </td>
                <template slot="popover">
                    <BaseTooltipList header="ND Alignment" v-if="product.alignmentNds.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.alignmentNds" :key="index"
                        :label="action.selection.name"/>
                    </BaseTooltipList>
                    <BaseTooltipList header="ND Feedback" v-if="product.nds.length > 0">
                        <BaseTooltipListItem v-for="(action, index) in product.nds" :key="index"
                        :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                    </BaseTooltipList>
                </template>
            </v-popover>
            <!-- End Distribution -->

            <td class="requests">
                <div class="square ghost xs" @click="onViewSingle">
                    <span>{{product.comments.length}}</span><i class="far fa-comment"></i>
                </div>
                <div class="requests-button square ghost xs" @click="onViewSingle">
                    <span>{{product.requests.length}}</span><i class="far fa-clipboard-check"></i>
                    <i v-if="product.hasAuthUserRequest" class="own-request fas fa-user-circle"></i>
                </div>
            </td>
            <td class="action">
                <!-- Single Selection Input only -->
                <template v-if="currentSelections.length <= 1">
                    <button class="invisible ghost-hover show-screen-xs" @click="$emit('showContext', $event)"><i class="far fa-ellipsis-h"></i></button>
                    <BaseButton class="hide-screen-xs" :buttonClass="product[currentAction] != 'Focus' ? 'ghost': 'primary'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(product, 'Focus', selection)">
                        <i class="far fa-star"></i>
                    </BaseButton>
                    <BaseButton class="hide-screen-xs"  :buttonClass="product[currentAction] != 'In' ? 'ghost': 'green'" 
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(product, 'In', selection)">
                        <i class="far fa-heart"></i>
                        <span>In</span>
                    </BaseButton>
                    <BaseButton class="hide-screen-xs"  :buttonClass="product[currentAction] != 'Out' ? 'ghost': 'red'" 
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(product, 'Out', selection)">
                        <i class="far fa-times-circle"></i>
                        <span>out</span>
                    </BaseButton>
                </template>
                <!-- End Single Selection Input only -->
                <button class="invisible ghost-hover primary hide-screen-xs" 
                @click="onViewSingle"><span>View</span></button>
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

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts',
        'selection',
        'currentAction',
        'index',
    ],
    components: {
        MultiSelectionInputRow
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
    }},
    computed: {
        ...mapGetters('selections', ['getCurrentSelections', 'currentSelectionMode', 'getAuthUserSelectionWriteAccess']),
        ...mapGetters('products', ['currentFocusRowIndex']),
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
    },
    watch: {
        // Watch for changes to the current focus index 
        currentFocusRowIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                this.$refs.row.focus()
            }
        }
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
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
            height: 60px;
            width: 48px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        @media screen and (max-width: $screenXs) {
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
    td.id {
        position: relative;
    }
    .variant-list {
        position: absolute;
        left: 0;
        bottom: -6px;
    }
    .variant-list-item:not(:first-child) {
        margin-left: 4px;
    }
    .product-details {
        height: 76px;
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
</style>