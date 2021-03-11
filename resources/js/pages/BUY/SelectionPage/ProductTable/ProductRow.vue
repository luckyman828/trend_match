<template>
    <BaseTableInnerRow
        class="products-table-row flex-list space-lg justify full-w flex-start-v"
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
        <div class="flex-list flex-v">
            <div class="flex-list flex-v min lh-xs">
                <div class="ft-12">{{ product.datasource_id }}</div>
                <div class="ft-14 ft-bd">{{ product.title }}</div>
            </div>
            <BaseImageSizer fit="contain">
                <BaseVariantImage
                    class="main-img"
                    :key="product.id + '-' + variantIndex"
                    :variant="product.variants[variantIndex]"
                    size="sm"
                />
            </BaseImageSizer>
        </div>
        <div class="flex-list flex-v fill space-md">
            <LabelList v-if="labelsEnabled || product.labels.length > 0" :product="product" ref="labelList" />

            <!-- Details -->
            <div class="flex-list space-xl">
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
            <div class="variant-list flex-list space-md">
                <VariantListItem
                    :variant="variant"
                    v-for="variant in product.variants"
                    :key="variant.id"
                    @click.native="product.expanded = !product.expanded"
                />
            </div>
        </div>

        <div class="actions flex-list center-v full-h">
            <BaseButton buttonClass="pill">
                <i class="far fa-comment"></i>
                <template v-slot:count>
                    <div class="circle dark xs">
                        <span>{{ product.comments.length }}</span>
                    </div>
                </template>
            </BaseButton>
            <button class="pill">
                <span>View</span>
            </button>
        </div>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VariantListItem from './VariantListItem'
import LabelList from '../LabelList'

export default {
    name: 'buy.ProductsRow',
    props: ['product', 'selectedProducts', 'selection', 'index'],
    components: {
        VariantListItem,
        LabelList,
    },
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
        ...mapGetters('products', ['currentFocusRowIndex', 'singleVisible']),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', {
            multiSelectionMode: 'getMultiSelectionModeIsActive',
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
            const totalQty = this.selectionInput.quantity
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
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP', 'toggleProductCompleted', 'updateProduct']),
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
    padding: 8px 16px 8px 8px;
    align-items: flex-start;
    height: 215px;
    .expand-button {
        position: absolute;
        left: 8px;
        top: 8px;
    }
    &:focus {
        outline: none;
    }
    .img-sizer {
        width: 108px;
    }
    .main-img {
        border: $borderElSoft;
        border-radius: $borderRadiusEl;
    }
}
</style>
