<template>
    <BaseTableInnerRow
        class="products-table-row flex-list space-lg justify fill flex-start-v"
        :class="{ expanded: product.expanded }"
        tabindex="0"
        ref="row"
        @focus.native="onRowFocus"
        @keydown.native="hotkeyHandler($event)"
        @keyup.self.native="keypressHandler($event)"
    >
        <button class="expand-button circle sm" @click="product.expanded = !product.expanded">
            <i class="fas" :class="product.expanded ? 'fa-angle-down' : 'fa-angle-up'"></i>
        </button>
        <div class="flex-list flex-v image-col">
            <div class="flex-list flex-v min lh-xs">
                <div class="ft-12">{{ product.datasource_id }}</div>
                <div class="ft-14 ft-bd name" v-tooltip="product.title">{{ product.title }}</div>
            </div>
            <BaseImageSizer fit="contain">
                <BaseVariantImage
                    v-if="hasImage || !product.variants || product.variants.length <= 0"
                    class="main-img hover-shadow clickable"
                    :key="product.id + '-' + mainImageVariantIndex"
                    :variant="product.variants[mainImageVariantIndex]"
                    size="sm"
                    @click.native="onViewSingle"
                />
                <div
                    v-else
                    class="color main-img hover-shadow clickable"
                    :style="imageBackground"
                    @click="onViewSingle"
                ></div>
            </BaseImageSizer>
        </div>
        <div class="flex-list flex-v fill space-sm details-section">
            <LabelList v-if="labelsEnabled || product.labels.length > 0" :product="product" ref="labelList" />

            <!-- Details -->
            <div class="flex-list space-xl details">
                <div class="flex-list price-list space-md">
                    <BaseValueDisplay label="WHS">
                        <span>{{ product.wholesale_price }} {{ product.currency }}</span>
                    </BaseValueDisplay>
                    <BaseValueDisplay label="RRP">
                        <span>{{ product.recommended_retail_price }} {{ product.currency }}</span>
                    </BaseValueDisplay>
                    <BaseValueDisplay label="Mark Up">
                        <span>{{ product.mark_up }}</span>
                    </BaseValueDisplay>
                </div>
                <div class="flex-list delivery-list space-md">
                    <BaseValueDisplay
                        :label="`Delivery ${index + 1}`"
                        v-for="(delivery, index) in product.delivery_dates"
                        :key="index"
                    >
                        <span style="text-transform: uppercase;">{{ getPrettyDate(delivery, 'medium') }}</span>
                    </BaseValueDisplay>
                </div>
            </div>
            <!-- End Details -->

            <div class="delivery-selector">
                <BaseSegmentedControl
                    activeClass="white"
                    sizeClass="sm"
                    theme="light"
                    v-model="product.currentDeliveryDate"
                    countKey="count"
                    :options="
                        product.deliveries.map(delivery => ({
                            label: getPrettyDate(delivery.delivery_date, 'medium'),
                            value: delivery.delivery_date,
                            count: delivery.quantity,
                        }))
                    "
                />
            </div>

            <div class="variant-list flex-list space-md" v-dragscroll>
                <VariantListItem
                    :variant="variant"
                    v-for="variant in product.variantsFiltered"
                    :key="variant.id"
                    @click.native="product.expanded = !product.expanded"
                />
            </div>
        </div>

        <div class="actions flex-list center-v full-h">
            <div class="quantity pill no-bg sm">
                <span>{{ product.quantity }}</span>
                <i class="far fa-box"></i>
            </div>
            <BaseButton
                v-if="selection.type != 'Summed' && buyView != 'purchase'"
                buttonClass="circle"
                :disabled="product.quantity > 0"
                disabledTooltip="Product has quantity"
                @click="onToggleAction"
            >
                <i class="fa-heart" :class="product.selectionAlignment.action == 'In' ? 'fas primary' : 'far'"></i>
            </BaseButton>
            <BaseButton buttonClass="pill" @click="onViewSingle">
                <i class="far fa-comment"></i>
                <template v-if="product.comments.length > 0" v-slot:count>
                    <div class="circle dark xs">
                        <span>{{ product.comments.length }}</span>
                    </div>
                </template>
            </BaseButton>
            <button class="pill" @click="onViewSingle">
                <span>View</span>
            </button>
        </div>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VariantListItem from './VariantListItem'
import LabelList from '../LabelList'
import { getVariantBackgroundStyle } from '../../../../helpers/dkcIntegration'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'buy.ProductsRow',
    props: ['product', 'selectedProducts', 'selection', 'index'],
    components: {
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
            expanded: false,
        }
    },
    computed: {
        ...mapGetters('selections', [
            'getCurrentSelections',
            'currentSelectionMode',
            'getAuthUserSelectionWriteAccess',
        ]),
        ...mapGetters('productFilters', {
            buyView: 'getBuyView',
        }),
        ...mapGetters('products', ['currentFocusRowIndex', 'singleVisible']),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', {
            multiSelectionMode: 'getMultiSelectionModeIsActive',
            currentQty: 'getCurrentSelectionModeQty',
            displayUnreadBullets: 'getDisplayUnreadBullets',
            isObserver: 'getViewingAsObserver',
            selectionRole: 'getCurrentSelectionMode',
            writeAccess: 'getCurrentSelectionWriteAccess',
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
        selectionInput() {
            return this.getActiveSelectionInput(this.product)
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
            const totalQty = this.selectionInput.quantity
            return totalQty >= this.product.min_order
        },
        imageBackground() {
            return getVariantBackgroundStyle(this.product.variants[this.variantIndex])
        },
        hasImage() {
            const url = this.variantImage(this.product.variants[this.mainImageVariantIndex])
            return url != '/images/placeholder.JPG'
        },
        productQty() {
            return this.product.quantity
        },
        mainImageVariantIndex() {
            // if (this.product.variants.length <= 1) return 0
            // const firstVariant = this.product.variants[0]
            // if (firstVariant.pictures.length > 0 && firstVariant.pictures[0].url) return 0
            return this.product.variants.findIndex(variant => variant.pictures.length > 0 && !!variant.pictures[0].url)
        },
    },
    watch: {
        // Watch for changes to the current focus index
        currentFocusRowIndex: function(newVal, oldVal) {
            if (newVal == this.index) {
                this.$refs.row.$el.focus()
            }
        },
        productQty() {
            this.product.variants.sort((a, b) => b.quantity - a.quantity)
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP', 'toggleProductCompleted', 'updateProduct']),
        ...mapActions('actions', ['updateAlignments']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
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
        onToggleAction() {
            const alignment = this.product.selectionAlignment
            alignment.action = alignment.action == 'In' ? 'None' : 'In'
            this.updateAlignments([alignment])
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

            // Label hotkeys
            if (this.writeAccess.labels) {
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
    created() {
        this.product.variants.sort((a, b) => b.quantity - a.quantity)

        // Preset the current product delivery date.
        // Pick the delivery with the highest quantity
        this.product.currentDeliveryDate = this.product.deliveries.reduce(
            (top, curr) => (curr.quantity > top.quantity ? curr : top),
            this.product.deliveries[0]
        ).delivery_date
    },
}
</script>

<style scoped lang="scss">
.products-table-row {
    padding: 8px 16px 8px 8px;
    align-items: flex-start;
    height: 215px;
    overflow: hidden;
    width: auto;
    .expand-button {
        position: absolute;
        left: 8px;
        top: 8px;
    }
    &:focus {
        outline: none;
    }
    .image-col {
        width: 108px;
        flex-shrink: 0;
        overflow: hidden;
        .name {
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .main-img {
        border: $borderElSoft;
        border-radius: $borderRadiusEl;
    }
    .details-section {
        overflow: hidden;
    }
    .variant-list {
        overflow-x: auto;
        padding-bottom: 16px;
        padding-top: 4px;
    }
    .quantity {
        position: absolute;
        right: 0;
        top: 8px;
    }
}
</style>
