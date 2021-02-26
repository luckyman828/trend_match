<template>
    <BaseTableInnerRow
        class="products-table-row"
        tabindex="0"
        ref="row"
        :class="['action-' + selectionInput[currentAction], { 'multi-selection': multiSelectionMode }]"
        @focus.native="onRowFocus"
        @keydown.native="hotkeyHandler($event)"
        @keyup.self.native="keypressHandler($event)"
    >
        <div class="product-details">
            <div
                v-if="displayUnreadBullets && product.hasNewComment"
                class="unread-indicator circle xxs primary"
                v-tooltip.right="'A message needs a reply'"
            />

            <td class="image clickable" @click="onViewSingle">
                <div class="img-wrapper">
                    <!-- <img :key="product.id + '-' + variantIndex" v-if="product.variants.length > 0" :src="variantImage(product.variants[variantIndex], 'sm')"> -->
                    <BaseVariantImage
                        :key="product.id + '-' + variantIndex"
                        :variant="product.variants[variantIndex]"
                        size="sm"
                    />
                </div>
            </td>
            <td class="id clickable" @click="onViewSingle">
                <span>{{ product.datasource_id }}</span>
            </td>
            <td class="title">
                <span class="clickable">
                    <span v-tooltip="product.title" @click="onViewSingle">{{ product.title }}</span>
                    <LabelList v-if="labelsEnabled || product.labels.length > 0" :product="product" ref="labelList" />
                    <div class="variant-list" @click="onViewSingle">
                        <!-- <div class="variant-list-item pill ghost xs" v-for="(variant, index) in product.variants.slice(0,5)" :key="index">
                        <span>{{variant.name || 'Unnamed' | truncate(variantNameTruncateLength(product))}}</span>
                    </div> -->
                        <VariantListItem
                            v-for="(variant, index) in selectionInput.variants.slice(0, 5)"
                            :key="index"
                            :variant="variant"
                            :selectionInput="selectionInput"
                            :selection="selection"
                            :product="product"
                            :distributionScope="distributionScope"
                            v-tooltip-trigger="{
                                tooltipRef: variantTooltipRef,
                                showArg: { variant, product, selectionInput },
                                disabled: multiSelectionMode,
                            }"
                            @mouseenter.native="variantIndex = index"
                            @mouseleave.native="onMouseleaveVariant"
                        />
                        <div class="variant-list-item pill ghost sm" v-if="product.variants.length > 5">
                            <span>+ {{ selectionInput.variants.length - 5 }} more</span>
                        </div>
                    </div>
                </span>
            </td>
            <td
                class="delivery"
                v-tooltip="{
                    content:
                        product.delivery_dates.length > 1 &&
                        product.delivery_dates.map(x => getPrettyDate(x, 'short')).join(', '),
                    trigger: 'hover',
                }"
                :style="product.delivery_dates.length > 1 && 'cursor: pointer;'"
                @click="onViewSingle"
            >
                <span v-if="product.delivery_dates[0]">
                    {{ getPrettyDate(product.delivery_dates[0], 'short') }}
                    <span v-if="product.delivery_dates.length > 1" class="square ghost xs">
                        <span>+{{ +product.delivery_dates.length - 1 }}</span>
                    </span>
                </span>
            </td>

            <!-- Start Prices -->
            <td class="wholesale-price hide-screen-xs">
                <span>{{ product.yourPrice.wholesale_price }}</span>
            </td>
            <td class="recommended-retail-price hide-screen-xs">
                <span>{{ product.yourPrice.recommended_retail_price }}</span>
            </td>
            <td class="mark-up hide-screen-xs">
                <span>{{ product.yourPrice.mark_up }}</span>
            </td>
            <td class="currency hide-screen-xs">
                <span v-if="product.yourPrice.currency != 'Not set'">{{ product.yourPrice.currency }}</span>
            </td>
            <!-- End Prices -->

            <td class="minimum">
                <div
                    class="square ghost xs"
                    v-if="product.min_variant_order != null || product.min_order != null"
                    v-tooltip="
                        `
                    ${
                        showQty
                            ? `<strong>Total QTY /</strong> Minimum`
                            : `<strong>Variant Minimum: </strong> ${product.min_variant_order}`
                    }
                `
                    "
                >
                    <span>
                        <span v-if="showQty"
                            >{{
                                distributionScope == 'Alignment'
                                    ? selectionInput.totalQuantity
                                    : selectionInput.totalFeedbackQuantity
                            }}
                            /</span
                        >
                        <span>{{ product.min_order }}</span>
                    </span>
                    <i class="fa-box" :class="productHasReachedMinimum ? 'fas primary' : 'far'"></i>
                </div>
            </td>

            <!-- Start Distribution -->
            <template v-if="currentSelections.length == 1">
                <td class="focus">
                    <div
                        tabindex="-1"
                        class="square ghost xs tooltip-target"
                        v-tooltip-trigger="{
                            tooltipRef: distributionTooltipRef,
                            showArg: { selectionInput, type: 'Focus' },
                        }"
                    >
                        <span>{{
                            distributionScope == 'Alignment'
                                ? selectionInput.alignmentFocus.length
                                : selectionInput.focus.length
                        }}</span>
                        <i class="far fa-star"></i>
                    </div>
                </td>

                <td class="ins">
                    <div
                        class="tooltip-target square ghost xs"
                        v-tooltip-trigger="{
                            tooltipRef: distributionTooltipRef,
                            showArg: { selectionInput, type: 'In' },
                        }"
                    >
                        <span>{{
                            distributionScope == 'Alignment'
                                ? selectionInput.alignmentIns.length
                                : selectionInput.ins.length
                        }}</span>
                        <i class="far fa-heart"></i>
                    </div>
                </td>

                <td class="outs">
                    <div
                        class="square ghost xs tooltip-target"
                        v-tooltip-trigger="{
                            tooltipRef: distributionTooltipRef,
                            showArg: { selectionInput, type: 'Out' },
                        }"
                    >
                        <span>{{
                            distributionScope == 'Alignment'
                                ? selectionInput.alignmentOuts.length
                                : selectionInput.outs.length
                        }}</span>
                        <i class="far fa-times-circle"></i>
                    </div>
                </td>

                <td class="nds">
                    <div
                        class="tooltip-target square ghost xs"
                        v-tooltip-trigger="{
                            tooltipRef: distributionTooltipRef,
                            showArg: { selectionInput, type: 'None' },
                        }"
                    >
                        <span>{{
                            distributionScope == 'Alignment'
                                ? selectionInput.alignmentNds.length
                                : selectionInput.nds.length
                        }}</span>
                    </div>
                </td>
                <!-- End Distribution -->

                <td class="requests">
                    <button class="requests-button ghost xs" @click="onViewSingle" v-tooltip="'Requests (open)'">
                        <span>{{ selectionInput.requests.length }}</span>
                        <span v-if="selectionInput.hasOpenTicket">
                            ({{
                                selectionInput.requests.filter(x => x.type == 'Ticket' && x.status == 'Open').length
                            }})</span
                        >
                        <i class="far fa-clipboard-check"></i>
                        <div
                            v-if="displayUnreadBullets && product.hasNewComment"
                            class="circle xxs primary new-comment-bullet"
                        ></div>
                    </button>

                    <button class="ghost xs" @click="onViewSingle" v-tooltip="'Comments'">
                        <span>{{ selectionInput.comments.length }}</span
                        ><i class="far fa-comment"></i>
                    </button>
                </td>
            </template>

            <td class="action">
                <!-- Single Selection Input only -->
                <template v-if="!multiSelectionMode">
                    <div class="your-product-qty" v-if="selectionInput[currentQty]">
                        <div class="pill xs ghost">
                            <i class="fas fa-box primary"></i>
                            <span>{{ selectionInput[currentQty] }}</span>
                        </div>
                    </div>
                    <div class="fly-over-wrapper">
                        <div class="fly-over">
                            <div class="gradient"></div>
                            <div class="inner">
                                <BaseButton
                                    class=""
                                    :buttonClass="selectionInput[currentAction] != 'Focus' ? 'ghost' : 'primary'"
                                    :disabled="!userWriteAccess.actions.hasAccess"
                                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                    @click="onUpdateAction('Focus', selectionInput)"
                                >
                                    <i class="far fa-star"></i>
                                </BaseButton>
                                <BaseButton
                                    class=""
                                    :buttonClass="selectionInput[currentAction] != 'In' ? 'ghost' : 'green'"
                                    :disabled="!userWriteAccess.actions.hasAccess"
                                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                    @click="onUpdateAction('In', selectionInput)"
                                >
                                    <i class="far fa-heart"></i>
                                    <span>In</span>
                                </BaseButton>
                                <BaseButton
                                    class=""
                                    :buttonClass="selectionInput[currentAction] != 'Out' ? 'ghost' : 'red'"
                                    :disabled="!userWriteAccess.actions.hasAccess"
                                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                                    @click="onUpdateAction('Out', selectionInput)"
                                >
                                    <i class="far fa-times-circle"></i>
                                    <span>out</span>
                                </BaseButton>
                                <button class="view invisible ghost-hover primary" @click="onViewSingle">
                                    <span>View</span>
                                </button>
                                <button
                                    class="options invisible ghost-hover show-screen-md"
                                    @click="$emit('showContext', $event)"
                                >
                                    <i class="far fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- END Single Selection Input only -->
                <template v-else>
                    <button class="invisible ghost-hover primary" @click="onViewSingle"><span>View</span></button>
                </template>

                <!-- Master actions -->
                <div
                    v-if="
                        !isObserver &&
                            ((ticketsEnabled && product.is_completed) ||
                                (selection.type == 'Master' && ticketsEnabled && currentSelectionMode == 'Alignment'))
                    "
                    class="extra-actions"
                >
                    <BaseButton
                        buttonClass="pill xs ghost"
                        targetAreaPadding="4px 4px"
                        :disabled="!(selection.type == 'Master' && currentSelectionMode == 'Alignment')"
                        @click="onToggleCompleted"
                    >
                        <template v-if="!product.is_completed">
                            <i class="far fa-circle" style="font-weight: 400;"></i>
                            <span>Complete</span>
                        </template>
                        <template v-else>
                            <i class="far fa-check-circle primary"></i>
                            <span>Completed</span>
                        </template>
                    </BaseButton>
                </div>
                <!-- END Master actions -->
            </td>
        </div>

        <MultiSelectionInputRow
            v-if="multiSelectionMode"
            :product="product"
            :focusGroupIndex="focusGroupIndex"
            :currentAction="currentAction"
            :distributionTooltipRef="distributionTooltipRef"
            :distributionScope="distributionScope"
            @updateAction="onUpdateAction"
        />
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Mixins
import variantImage from '../../../mixins/variantImage'
import MultiSelectionInputRow from './MultiSelectionInputRow/index'
import VariantListItem from './VariantListItem'
import LabelList from './LabelList'

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts',
        'selection',
        'currentAction',
        'index',
        'distributionTooltipRef',
        'variantTooltipRef',
        'distributionScope',
    ],
    components: {
        MultiSelectionInputRow,
        VariantListItem,
        LabelList,
    },
    mixins: [variantImage],
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        },
    },
    data: function() {
        return {
            focusGroupIndex: null,
            variantIndex: 0,
        }
    },
    computed: {
        ...mapGetters('selections', [
            'getCurrentSelections',
            'currentSelectionMode',
            'getAuthUserSelectionWriteAccess',
        ]),
        ...mapGetters('products', ['currentFocusRowIndex', 'singleVisible']),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', {
            multiSelectionMode: 'getMultiSelectionModeIsActive',
            showQty: 'getQuantityModeActive',
            currentQty: 'getCurrentSelectionModeQty',
            displayUnreadBullets: 'getDisplayUnreadBullets',
            isObserver: 'getViewingAsObserver',
            selectionRole: 'getCurrentSelectionMode',
        }),
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        labelsEnabled() {
            return this.availableLabels.length > 0
        },
        hasLabelWriteAccess() {
            return this.labelsEnabled && (this.currentFile.editable || this.workspaceRole == 'Admin')
        },
        selectionInput() {
            return this.getActiveSelectionInput(this.product)
        },
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.selection, this.product)
        },
        localSelectedProducts: {
            get() {
                return this.selectedProducts
            },
            set(localSelectedProducts) {
                this.$emit('input', localSelectedProducts)
            },
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        titleTruncateSize() {
            return window.innerWidth < 1260 ? 16 : 24
        },
        ticketsEnabled() {
            return this.selection.settings.ticket_level != 'None'
        },
        hasUnreadComment() {
            if (this.currentSelectionMode == 'Approval') {
                return this.selectionInput.hasUnreadAlignerComment
            }
            if (this.currentSelectionMode == 'Alignment') {
                return this.selectionInput.hasUnreadApproverComment
            }
        },
        productHasReachedMinimum() {
            const totalQty =
                this.distributionScope == 'Alignment'
                    ? this.selectionInput.quantity
                    : this.selectionInput.totalFeedbackQuantity
            return totalQty >= this.product.min_order
        },
    },
    watch: {
        // Watch for changes to the current focus index
        currentFocusRowIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                this.$refs.row.$el.focus()
            }
        },
        // product(newVal, oldVal) {
        //     this.variantIndex = 0
        // }
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP', 'toggleProductCompleted', 'updateProduct']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
        variantNameTruncateLength(product) {
            const amount = product.variants.length
            if (amount > 4) {
                return window.innerWidth > 1260 ? 12 : 6
            } else if (amount > 2) {
                return window.innerWidth > 1260 ? 20 : 15
            }
        },
        onMouseleaveVariant(e) {
            const target = e.relatedTarget
            if (target.id != 'variant-tooltip') {
                this.variantIndex = 0
            } else {
                // If the mouse has entered the variant tooltip add an event listener to that tooltip
                target.addEventListener('mouseleave', this.onMouseleaveVariant)
            }
            if (e.target.id == 'variant-tooltip') {
                // When we leave the tooltip, remove its eventlistener
                e.target.removeEventListener('mouseleave', this.onMouseleaveVariant)
            }
        },
        onUpdateAction(action, selectionInput) {
            this.$emit('updateAction', action, selectionInput)
        },
        onViewSingle() {
            this.showSelectionProductPDP({ product: this.product, selection: this.selection })
        },
        onRowFocus() {
            this.focusGroupIndex = null
            if (this.currentFocusRowIndex != this.index) {
                this.setCurrentFocusRowIndex(this.index)
            }
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
            else if (this.focusGroupIndex == this.currentSelections.length - 1) {
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
                this.$refs.row.$el.focus()
                this.focusGroupIndex = null
            } else {
                this.focusGroupIndex--
            }
        },
        focusNextRow(event) {
            // Get the next row
            event.preventDefault()
            this.setCurrentFocusRowIndex(this.index + 1)
        },
        focusPrevRow(event) {
            if (this.index > 0) {
                // Get the previous row
                event.preventDefault()
                this.setCurrentFocusRowIndex(this.index - 1)
            }
        },
        onToggleCompleted() {
            this.toggleProductCompleted({ selectionId: this.selection.id, product: this.product })
        },
        hotkeyHandler(event) {
            if (this.singleVisible) return
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
                this.focusGroupIndex = event.key - 1
            }
            if (key == 'ArrowLeft') this.focusPrevRow(event)
            if (key == 'ArrowRight') this.focusNextRow(event)
        },
        keypressHandler(event) {
            if (this.singleVisible) return
            const key = event.code
            if (key == 'Enter') {
                document.activeElement.blur()
                // this.$emit('onViewSingle', this.product)
                this.onViewSingle()
            }
            if (key == 'KeyC' && this.selection.type == 'Master' && this.currentSelectionMode == 'Alignment')
                this.onToggleCompleted()
            if (
                this.currentSelections.length <= 1 && // Check that we are not doing multi selection input
                this.userWriteAccess.actions.hasAccess // Check if the user has write access
            ) {
                if (key == 'KeyI') this.onUpdateAction('In', this.selectionInput)
                if (key == 'KeyO') this.onUpdateAction('Out', this.selectionInput)
                if (key == 'KeyF' || key == 'KeyU') this.onUpdateAction('Focus', this.selectionInput)
            }

            // Label hotkeys
            if (this.hasLabelWriteAccess) {
                // Number hotkey
                if (parseInt(event.key)) {
                    const pressedNumber = event.key
                    const label = this.availableLabels[pressedNumber - 1]
                    if (!label) return

                    // Check if the label is already added
                    const existingIndex = this.product.labels.findIndex(x => x == label)
                    if (existingIndex >= 0) {
                        this.product.labels.splice(existingIndex, 1)
                    } else {
                        this.product.labels.push(label)
                    }
                    this.onUpdateProduct()
                }
                // Hashtag
                if (event.key == '#') {
                    // Open labels menu
                    this.$refs.labelList.$refs.popover.show()
                }
            }
        },
        async onUpdateProduct() {
            const product = Object.assign({}, this.product)
            delete product.selectionInputList
            await this.updateProduct(product)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.products-table-row {
    display: block;
    padding: 0;
    .unread-indicator {
        position: absolute;
        left: -20px;
        @media screen and (max-width: $screenSm) {
            left: -16px;
        }
    }
    &:focus {
        // outline: solid 2px $primary;
        // outline-offset: -2px;
        outline: none;
    }
    .img-wrapper {
        border: $borderElSoft;
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
                box-shadow: -8px 0 0px $primary inset;
            }
            &.action-In {
                box-shadow: -8px 0 0px $green inset;
            }
            &.action-Out {
                box-shadow: -8px 0 0px $red inset;
            }
        }
    }
}
td.id,
td.title {
    position: relative;
}
.variant-list {
    position: absolute;
    left: 0;
    bottom: -20px;
    display: flex;
}
.product-details {
    height: 138px;
    padding: 8px;
    padding-left: 2px;
    display: flex;
    align-items: center;
}
.requests-button {
    position: relative;
    &:hover {
        .new-comment-bullet {
            top: -7px;
            right: -5px;
        }
    }
    .new-comment-bullet {
        position: absolute;
        right: -4px;
        top: -6px;
    }
}

// Flyover actions
.gradient {
    display: none;
}
td.action {
    position: relative;
    height: 100%;
    .your-product-qty {
        position: absolute;
        top: 0;
        right: 12px;
        z-index: 2;
    }
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
                    background: $bgModuleHover;
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
                > * {
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
                background: linear-gradient(90deg, transparent, $bgModuleHover);
                pointer-events: none;
            }
        }
    }
}
.extra-actions {
    position: absolute;
    right: 4px;
    bottom: 0px;
}
</style>
