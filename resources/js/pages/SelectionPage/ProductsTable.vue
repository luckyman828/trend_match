<template>
    <div class="products-table-wrapper" ref="table" @focusout="onBlur">
        <BaseTable
            ref="tableComp"
            :stickyHeader="true"
            :items="products"
            :itemsTotalCount="allProducts.length"
            itemKey="id"
            :itemSize="currentSelections.length > 1 ? 247 : 139"
            :selected.sync="selectedProducts"
            :contextItem.sync="contextProduct"
            :searchKey="['datasource_id', 'title', 'category', 'eans']"
            :searchResult.sync="productsFilteredBySearch"
            :hideContextButton="true"
            :focusIndex="currentFocusRowIndex"
            @show-contextmenu="onShowContextMenu"
            @search-enter="onViewSingle(productsFilteredBySearch[0])"
        >
            <template v-slot:tabs>
                <div class="tabs-inner">
                    <BaseTableTab
                        :label="`Overview`"
                        :count="allProducts.length"
                        v-model="productActionFilter"
                        modelValue="overview"
                    />
                    <BaseTableTab
                        :label="`In`"
                        :count="
                            allProducts.filter(product =>
                                ['In', 'Focus'].includes(product.getActiveSelectionInput[currentAction])
                            ).length
                        "
                        v-model="productActionFilter"
                        :disabled="currentSelections.length > 1"
                        v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                        :modelValue="insTabValue"
                    />
                    <BaseTableTab
                        :label="`Out`"
                        :count="
                            allProducts.filter(product => product.getActiveSelectionInput[currentAction] == 'Out')
                                .length
                        "
                        v-model="productActionFilter"
                        :disabled="currentSelections.length > 1"
                        v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                        modelValue="outs"
                    />
                    <BaseTableTab
                        :label="`Nds`"
                        :count="
                            allProducts.filter(product => product.getActiveSelectionInput[currentAction] == 'None')
                                .length
                        "
                        v-model="productActionFilter"
                        :disabled="currentSelections.length > 1"
                        v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                        modelValue="nds"
                    />
                    <BaseTableTab
                        v-if="selection && selection.settings && selection.settings.ticket_level != 'None'"
                        :label="`Tickets`"
                        :count="
                            !hideCompleted
                                ? allProducts.filter(x => x.hasTicket).length
                                : allProducts.filter(x => x.hasTicket && !x.is_completed).length
                        "
                        v-model="productActionFilter"
                        :disabled="currentSelections.length > 1"
                        v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                        modelValue="tickets"
                    />
                </div>

                <!-- Selection Selector -->
                <MultipleSelectionSelector v-if="currentSelectionMode == 'Alignment' && !selection.is_presenting" />
                <!-- Selection Selector Ends -->
            </template>
            <template v-slot:topBarLeft>
                <ProductFilters :distributionScope="distributionScope" />
                <ProductSort :currentSortKey="sortKey" @sort="onSort" />

                <!-- Temp. disabled until the functionality gets hooked up -->
                <BaseCheckboxInputField
                    class="small"
                    v-model="unreadOnly"
                    v-if="currentSelectionMode != 'Feedback' && selection.type == 'Master'"
                >
                    <span>Unread only</span>
                </BaseCheckboxInputField>

                <BaseCheckboxInputField
                    class="small"
                    v-if="['ins', 'focus'].includes(productActionFilter)"
                    :value="insTabValue == 'focus'"
                    @check="onToggleFocusOnly"
                >
                    <span>Focus only</span>
                </BaseCheckboxInputField>

                <BaseCheckboxInputField class="small" v-if="productActionFilter == 'tickets'" v-model="hideCompleted">
                    <span>Hide completed</span>
                </BaseCheckboxInputField>

                <BaseCheckboxInputField class="small" v-if="productActionFilter == 'tickets'" v-model="openTicketsOnly">
                    <span>Open tickets only</span>
                </BaseCheckboxInputField>

                <button class="invisible primary" v-if="filtersActive" @click="resetFilters">
                    <span>Clear filter</span>
                </button>
            </template>

            <template v-slot:topBarRight>
                <v-popover trigger="click">
                    <button class="ghost filter-button">
                        <span>Selection Input</span>
                        <span v-if="filterSelectionIds.length > 0" class="circle primary xs">
                            <span>{{ filterSelectionIds.length }}</span>
                        </span>
                        <i class="far fa-chevron-down"></i>
                    </button>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="getSelectionsAvailableForInputFiltering"
                            v-model="filterSelectionIds"
                            optionNameKey="name"
                            optionValueKey="id"
                        />
                    </template>
                </v-popover>

                <v-popover trigger="click">
                    <button
                        class="ghost filter-button"
                        v-tooltip="
                            'Select what type of input is displayed in the table.<br><strong>This does not change the type of input you make.</strong>'
                        "
                    >
                        <span>Show input from: {{ distributionScope }}</span>
                        <i class="far fa-chevron-down"></i>
                    </button>
                    <template slot="popover">
                        <BaseSelectButtons
                            type="radio"
                            submitOnChange="true"
                            :options="['Alignment', 'Feedback']"
                            v-model="distributionScope"
                        />
                    </template>
                </v-popover>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="image" />
                <BaseTableHeader
                    class="id"
                    :sortKey="'datasource_id'"
                    :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort"
                    >ID</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey" defaultTo="sequence" @sort="onSort"
                    >Product Name</BaseTableHeader
                >
                <BaseTableHeader
                    class="delivery"
                    :sortKey="'delivery_date'"
                    :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort"
                    >Delivery</BaseTableHeader
                >
                <BaseTableHeader
                    class="wholesale-price hide-screen-xs"
                    :sortKey="'wholesale_price'"
                    :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort"
                    :descDefault="true"
                    >WHS</BaseTableHeader
                >
                <BaseTableHeader
                    class="recommended-retail-price hide-screen-xs"
                    :sortKey="'recommended_retail_price'"
                    :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort"
                    :descDefault="true"
                    >RRP</BaseTableHeader
                >
                <BaseTableHeader
                    class="mark-up hide-screen-xs"
                    :sortKey="'mark_up'"
                    :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort"
                    :descDefault="true"
                    >MU</BaseTableHeader
                >
                <BaseTableHeader class="currency hide-screen-xs" />
                <BaseTableHeader
                    class="minimum"
                    :sortKey="['min_order', 'min_variant_order']"
                    :currentSortKey="sortKey"
                    v-tooltip="{ content: 'Minimum per Variant / Minimum per Order', delay: { show: 300 } }"
                    defaultTo="sequence"
                    @sort="onSort"
                    :descDefault="true"
                    >Minimum</BaseTableHeader
                >
                <!-- Single Selection Only -->
                <template v-if="getCurrentSelections.length == 1">
                    <BaseTableHeader
                        class="focus"
                        :sortKey="
                            distributionScope == 'Alignment' ? ['alignmentFocus', 'alignmentIns'] : ['focus', 'ins']
                        "
                        :currentSortKey="sortKey"
                        defaultTo="sequence"
                        @sort="onSort"
                        :descDefault="true"
                        >Focus</BaseTableHeader
                    >
                    <BaseTableHeader
                        class="ins"
                        :sortKey="
                            distributionScope == 'Alignment' ? ['alignmentIns', 'alignmentFocus'] : ['ins', 'focus']
                        "
                        :currentSortKey="sortKey"
                        defaultTo="sequence"
                        @sort="onSort"
                        :descDefault="true"
                        >In</BaseTableHeader
                    >
                    <BaseTableHeader
                        class="outs"
                        :sortKey="distributionScope == 'Alignment' ? 'alignmentOuts' : 'outs'"
                        :currentSortKey="sortKey"
                        defaultTo="sequence"
                        @sort="onSort"
                        :descDefault="true"
                        >Out</BaseTableHeader
                    >
                    <BaseTableHeader
                        class="nds"
                        :sortKey="distributionScope == 'Alignment' ? 'alignmentNds' : 'nds'"
                        :currentSortKey="sortKey"
                        defaultTo="sequence"
                        @sort="onSort"
                        :descDefault="true"
                        >ND</BaseTableHeader
                    >
                    <BaseTableHeader
                        :sortKey="['requests', 'comments']"
                        :currentSortKey="sortKey"
                        defaultTo="sequence"
                        @sort="onSort"
                        :descDefault="true"
                        >Requests</BaseTableHeader
                    >
                </template>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:row="rowProps">
                <ProductsTableRow
                    v-if="productsFilteredBySearch.length > 0"
                    ref="row"
                    class="product-row flex-table-row"
                    :product="rowProps.item"
                    :index="rowProps.index"
                    :selection="selection"
                    :currentAction="currentAction"
                    :distributionTooltipRef="$refs.actionDistributionTooltip"
                    :variantTooltipRef="$refs.variantTooltip"
                    :labelPopoverRef="$refs.labelPopover"
                    :distributionScope="distributionScope"
                    :rowComponent="rowProps.rowComponent"
                    @onViewSingle="onViewSingle"
                    @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"
                />

                <tr v-else>
                    <p style="padding: 60px 0 100px; text-align: center; width: 100%;">
                        No products to show. Try changing your filters.
                    </p>
                </tr>
            </template>
        </BaseTable>

        <BaseContextMenu ref="contextMenu">
            <template v-if="contextSelectionInput">
                <div class="item-group">
                    <BaseContextMenuItem
                        :iconClass="
                            contextSelectionInput[currentAction] == 'In' ? 'fas green fa-heart' : 'far fa-heart'
                        "
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction('In', contextSelectionInput)"
                    >
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        :iconClass="contextSelectionInput[currentAction] == 'Out' ? 'fas red fa-times' : 'far fa-times'"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction('Out', contextSelectionInput)"
                    >
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        :iconClass="
                            contextSelectionInput[currentAction] == 'Focus' ? 'fas primary fa-star' : 'far fa-star'
                        "
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        @click="onUpdateAction('Focus', contextSelectionInput)"
                    >
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group" v-if="completeAvailable">
                    <BaseContextMenuItem
                        :iconClass="!contextProduct.is_completed ? 'far fa-check-circle' : 'far fa-times-circle'"
                        hotkey="KeyC"
                        @click="onToggleProductsCompleted([contextProduct])"
                        v-close-popover
                    >
                        <span v-if="!contextProduct.is_completed"><u>C</u>omplete</span>
                        <span v-else>Undo <u>c</u>omplete</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-eye"
                        hotkey="KeyV"
                        @click="onViewSingle(contextProduct)"
                        v-close-popover
                    >
                        <u>V</u>iew
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelection">
            <template v-slot:header>
                <span
                    >Choose action for {{ selectedProducts.length }} product{{
                        selectedProducts.length > 1 ? 's' : ''
                    }}</span
                >
            </template>

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="selectedProducts = []">
                    <span><u>C</u>lear selection</span>
                </BaseContextMenuItem>
            </div>

            <template v-if="selectedProducts.length > 1">
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-heart"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        hotkey="KeyI"
                        @click="onUpdateMultipleActions(selectedProducts, 'In')"
                    >
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        iconClass="far fa-times"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        hotkey="KeyO"
                        @click="onUpdateMultipleActions(selectedProducts, 'Out')"
                    >
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        iconClass="far fa-star"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        :hotkey="['KeyF', 'KeyU']"
                        @click="onUpdateMultipleActions(selectedProducts, 'Focus')"
                    >
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>
                </div>

                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-times"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        hotkey="KeyC"
                        @click="onUpdateMultipleActions(selectedProducts, 'None')"
                    >
                        <span>Clear actions</span>
                    </BaseContextMenuItem>
                </div>
            </template>

            <div class="item-group" v-if="completeAvailable">
                <BaseContextMenuItem
                    iconClass="far fa-check-circle"
                    hotkey="KeyC"
                    @click="onSetProductsCompleted(selectedProducts, true)"
                    v-close-popover
                >
                    <span><u>C</u>omplete products</span>
                </BaseContextMenuItem>
                <BaseContextMenuItem
                    iconClass="far fa-times-circle"
                    hotkey="KeyN"
                    @click="onSetProductsCompleted(selectedProducts, false)"
                    v-close-popover
                >
                    <span>U<u>n</u>do complete products</span>
                </BaseContextMenuItem>
            </div>

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-file-export" hotkey="KeyE" :hasSubmenu="true">
                    <template>
                        <span><u>E</u>xport selected</span>
                    </template>

                    <template v-slot:submenu>
                        <div class="item-group">
                            <BaseContextMenuItem iconClass="far fa-file-pdf" hotkey="KeyP" @click="onExportToPdf">
                                <span><u>P</u>DF</span>
                            </BaseContextMenuItem>

                            <BaseContextMenuItem iconClass="far fa-file-csv" hotkey="KeyC" @click="onExportToCsv">
                                <span><u>C</u>SV</span>
                            </BaseContextMenuItem>
                        </div>
                    </template>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BasePopover id="action-distribution-tooltip" ref="actionDistributionTooltip" @show="showDistributionTooltip">
            <ActionDistributionTooltip
                :selectionInput="tooltipSelectionInput"
                :type="distributionTooltipType"
                :actionDistributionTooltipTab="actionDistributionTooltipTab"
                @changeTab="tab => (actionDistributionTooltipTab = tab)"
            />
        </BasePopover>

        <BasePopover id="variant-tooltip" ref="variantTooltip" @show="showVariantTooltip">
            <VariantTooltip
                :variant="tooltipVariant"
                :selection="selection"
                :product="tooltipProduct"
                :selectionInput="tooltipSelectionInput"
                :actionDistributionTooltipTab="actionDistributionTooltipTab"
                @changeTab="tab => (actionDistributionTooltipTab = tab)"
            />
        </BasePopover>

        <BasePopover ref="labelPopover" @show="showLabelPopover">
            <LabelPopover :labelInput="popoverLabelInput" :product="popoverProduct" />
        </BasePopover>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ProductsTableRow from './ProductsTableRow/index'
import MultipleSelectionSelector from './MultipleSelectionSelector'
import ActionDistributionTooltip from './ActionDistributionTooltip'
import sortArray from '../../mixins/sortArray'
import VariantTooltip from './VariantTooltip'
import LabelPopover from './LabelPopover/'

import ProductFilters from './ProductFilters'
import ProductSort from './ProductSort'

export default {
    name: 'productsTable',
    props: ['products', 'file', 'selection', 'currentAction'],
    mixins: [sortArray],
    components: {
        ProductsTableRow,
        MultipleSelectionSelector,
        ActionDistributionTooltip,
        VariantTooltip,
        LabelPopover,
        ProductFilters,
        ProductSort,
    },
    data: function() {
        return {
            sortKey: 'sequence',
            showContextMenu: false,
            contextProduct: null,
            tooltipSelectionInput: null,
            tooltipVariant: null,
            tooltipProduct: null,
            distributionTooltipType: null,
            actionDistributionTooltipTab: 'Feedback',
            // showAdvancedFilters: false,
            insTabValue: 'ins',

            popoverLabelInput: null,
            popoverProduct: null,
            // showFilters: false,
        }
    },
    computed: {
        ...mapGetters('products', [
            'currentFocusRowIndex',
            'getProductsFilteredBySearch',
            'singleVisible',
            'getProductsFiltered',
        ]),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('productFilters', {
            filtersActive: 'getFiltersAreActive',
        }),
        ...mapGetters('selections', [
            'getCurrentSelections',
            'getSelectionsAvailableForAlignment',
            'currentSelectionMode',
            'getAuthUserSelectionWriteAccess',
            'getSelectionsAvailableForInputFiltering',
        ]),
        ...mapGetters('selectionProducts', { allProducts: 'getProducts' }),
        ...mapGetters('auth', ['authUser']),
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.selection)
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        contextSelectionInput() {
            if (!this.contextProduct) return
            return this.getActiveSelectionInput(this.contextProduct)
        },
        // products() {
        //     return this.allProducts.length == this.productsFilteredBySearch.length
        //         ? this.getProductsFiltered
        //         : this.productsFilteredBySearch
        // },
        selectedProducts: {
            get() {
                return this.$store.getters['products/getSelectedProducts']
            },
            set(products) {
                this.SET_SELECTED_PRODUCTS(products)
            },
        },
        productsFilteredBySearch: {
            get() {
                return this.$store.getters['products/getProductsFilteredBySearch']
            },
            set(value) {
                this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
            },
        },
        distributionScope: {
            get() {
                return this.$store.getters['selectionProducts/getDistributionScope']
            },
            set(value) {
                this.SET_DISTRIBUTION_SCOPE(value)
            },
        },
        productActionFilter: {
            get() {
                return this.$store.getters['productFilters/getProductActionFilter']
            },
            set(value) {
                this.SET_PRODUCT_ACTION_FILTER(value)
            },
        },
        filterSelectionIds: {
            get() {
                return this.$store.getters['productFilters/getFilterSelectionIds']
            },
            set(value) {
                this.SET_FILTER_SELECTION_IDS(value)
            },
        },
        unreadOnly: {
            get() {
                return this.$store.getters['productFilters/unreadOnly']
            },
            set(value) {
                this.SET_UNREAD_ONLY(value)
            },
        },
        hideCompleted: {
            get() {
                return this.$store.getters['productFilters/hideCompleted']
            },
            set(value) {
                this.SET_HIDE_COMPLETED(value)
            },
        },
        openTicketsOnly: {
            get() {
                return this.$store.getters['productFilters/openTicketsOnly']
            },
            set(value) {
                this.SET_OPEN_TICKETS_ONLY(value)
            },
        },
        totalProductCount() {
            if (['ins', 'focus'].includes(this.productActionFilter)) {
                return this.allProducts.filter(product =>
                    ['In', 'Focus'].includes(this.getActiveSelectionInput(product)[this.currentAction])
                ).length
            }
            if (this.productActionFilter == 'outs') {
                return this.allProducts.filter(
                    product => this.getActiveSelectionInput(product)[this.currentAction] == 'Out'
                ).length
            }
            if (this.productActionFilter == 'nds') {
                return this.allProducts.filter(
                    product => this.getActiveSelectionInput(product)[this.currentAction] == 'None'
                ).length
            }
            return this.allProducts.length
        },
        tooltipBoundariesEl() {
            return document.getElementById('main')
        },
        ticketsEnabled() {
            return this.selection.settings.ticket_level != 'None'
        },
        completeAvailable() {
            return this.selection.type == 'Master' && this.ticketsEnabled && this.currentSelectionMode == 'Alignment'
        },
    },
    methods: {
        ...mapMutations('products', [
            'setSingleVisisble',
            'setCurrentProduct',
            'setAvailableProducts',
            'SET_PRODUCTS_FILTERED_BY_SEARCH',
            'SET_SELECTED_PRODUCTS',
            'SET_SHOW_PDF_MODAL',
            'SET_SHOW_CSV_MODAL',
        ]),
        ...mapMutations('productFilters', [
            'SET_UNREAD_ONLY',
            'SET_PRODUCT_ACTION_FILTER',
            'SET_FILTER_SELECTION_IDS',
            'SET_HIDE_COMPLETED',
            'SET_OPEN_TICKETS_ONLY',
        ]),
        ...mapMutations('selectionProducts', ['SET_DISTRIBUTION_SCOPE']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        ...mapActions('products', ['showSelectionProductPDP', 'toggleProductCompleted', 'setProductsCompleted']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
        ...mapMutations('productFilters', ['CLEAR_PRODUCT_FILTERS']),
        onToggleProductsCompleted(products) {
            products.map(product => {
                this.toggleProductCompleted({ selectionId: this.selection.id, product })
            })
        },
        onSetProductsCompleted(products, shouldBeCompleted) {
            this.setProductsCompleted({ selectionId: this.selection.id, products, shouldBeCompleted })
        },
        onExportToCsv() {
            this.SET_SHOW_CSV_MODAL(true)
        },
        onExportToPdf() {
            this.SET_SHOW_PDF_MODAL(true)
        },
        resetFilters() {
            this.CLEAR_PRODUCT_FILTERS()
        },
        onToggleFocusOnly(focusOnly) {
            if (this.productActionFilter == 'ins' && focusOnly) this.productActionFilter = 'focus'
            if (this.productActionFilter == 'focus' && !focusOnly) this.productActionFilter = 'ins'
            this.insTabValue = focusOnly ? 'focus' : 'ins'
        },
        showVariantTooltip({ variant, product, selectionInput }) {
            this.tooltipVariant = variant
            this.tooltipProduct = product
            this.tooltipSelectionInput = selectionInput
        },
        showLabelPopover({ labelInput, product }) {
            this.popoverLabelInput = labelInput
            this.popoverProduct = product
        },
        showDistributionTooltip({ selectionInput, type }) {
            this.tooltipSelectionInput = selectionInput
            this.distributionTooltipType = type
        },
        onViewSingle(product) {
            document.activeElement.blur()
            this.showSelectionProductPDP({ product, selection: this.selection })
        },
        onShowContextMenu(mouseEvent) {
            let contextMenu = this.$refs.contextMenu
            if (this.selectedProducts.length > 1) {
                contextMenu = this.$refs.contextMenuSelection
            }
            contextMenu.show(mouseEvent)
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            // Sort the products in our state to make sure the sort happens everywhere in the dashboard
            this.sortArray(this.products, sortAsc, sortKey)
        },
        onUpdateAction(action, selectionInput) {
            this.$emit('updateAction', action, selectionInput)
        },
        onUpdateMultipleActions(products, newAction) {
            // Filter out products that have already been completed
            const productsToUpdate = products.filter(x => !x.is_completed)

            if (this.currentSelectionMode == 'Feedback') {
                const actions = productsToUpdate.map(product => {
                    const selectionInput = this.getActiveSelectionInput(product)
                    return selectionInput.yourSelectionFeedback
                })
                this.updateFeedbacks({ actions, newAction })
            }
            if (this.currentSelectionMode == 'Alignment') {
                const actions = productsToUpdate.map(product => {
                    const selectionInput = this.getActiveSelectionInput(product)
                    return selectionInput.selectionAction
                })
                this.updateActions({ actions, newAction })
            }
        },
        onViewSearchProduct() {
            if (this.productsFilteredBySearch.length > 0) {
                this.onViewSingle(this.productsFilteredBySearch[0])
            }
        },
        onBlur(e) {
            if (!this.$refs.table.contains(e.relatedTarget)) {
                this.setCurrentFocusRowIndex(null)
            }
        },
        hotkeyHandler(e) {
            const key = e.code
            if (
                !e.target ||
                !e.target.tagName ||
                e.target.type == 'textarea' ||
                e.target.tagName.toUpperCase() == 'INPUT' ||
                this.singleVisible
            )
                return // Don't mess with user input

            if (key == 'KeyS') {
                this.$refs.tableComp.focusSearch()
                // this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
            if (key == 'Tab' && !e.shiftKey) {
                if (this.currentFocusRowIndex == null) {
                    e.preventDefault()
                    this.setCurrentFocusRowIndex(0)
                }
            }
        },
    },
    created() {
        document.addEventListener('keydown', this.hotkeyHandler)
        // Preset distribution scope
        this.distributionScope = this.selection.type == 'Master' ? 'Alignment' : 'Feedback'
        this.actionDistributionTooltipTab = this.distributionScope
        this.onSort(true, 'sequence')
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
        // Reset all filters
        this.resetFilters()
        this.SET_PRODUCT_ACTION_FILTER('overview')
        this.selectedProducts = []
    },
}
</script>

<style lang="scss">
// RECYCLE SCROLLER
.products-table-wrapper {
    .vue-recycle-scroller__item-wrapper {
        overflow: visible;
    }
}
</style>

<style scoped lang="scss">
@import '~@/_variables.scss';
.products-table-wrapper {
    ::v-deep {
        tr:not(.table-top-bar) > * {
            flex: 0 1 auto;
        }
        .table-row {
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
        }
        tr {
            th,
            td {
                &.action {
                    flex: 1;
                }
                &.title {
                    min-width: 140px;
                    max-width: 140px;
                    display: flex;
                    align-items: center;
                    margin-right: auto;
                    padding-right: 20px;
                    span {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: block;
                        overflow: hidden;
                    }
                    @media screen and (max-width: $screenXs) {
                        min-width: 100px;
                        max-width: 100px;
                    }
                }
                &.id {
                    min-width: 80px;
                    max-width: 80px;
                    margin-left: 16px;
                }
                &.image {
                    min-width: 100px;
                    max-width: 100px;
                    height: 100%;
                }
                &.delivery {
                    min-width: 96px;
                    max-width: 96px;
                    margin-right: auto;
                }
                &.wholesale-price,
                &.recommended-retail-price {
                    min-width: 64px;
                    max-width: 64px;
                }
                &.currency {
                    min-width: 38px;
                    max-width: 38px;
                }
                &.mark-up {
                    min-width: 36px;
                    max-width: 36px;
                }
                &.currency {
                    margin-right: auto;
                }
                &.minimum {
                    min-width: 104px;
                    max-width: 104px;
                    margin-right: auto;
                }
                &.focus,
                &.ins,
                &.outs,
                &.nds {
                    min-width: 48px;
                    max-width: 48px;
                }
                &.focus {
                    min-width: 64px;
                    max-width: 64px;
                }
                &.outs {
                    min-width: 52px;
                    max-width: 52px;
                }
                &.nds {
                    margin-right: auto;
                }
                &.requests {
                    // margin-left: 32px;
                    .button {
                        padding: 0 4px;
                    }
                }
            }
            &.id {
                min-width: 80px;
                max-width: 80px;
                margin-left: 16px;
            }
            &.image {
                min-width: 100px;
                max-width: 100px;
                height: 100%;
            }
            &.delivery {
                min-width: 80px;
                max-width: 80px;
                margin-right: auto;
            }
            &.wholesale-price,
            &.recommended-retail-price {
                min-width: 64px;
                max-width: 64px;
            }
            &.currency {
                min-width: 38px;
                max-width: 38px;
            }
            &.mark-up {
                min-width: 36px;
                max-width: 36px;
            }
            &.currency {
                margin-right: auto;
            }
            &.minimum {
                min-width: 104px;
                max-width: 104px;
                margin-right: auto;
            }
            &.focus,
            &.ins,
            &.outs,
            &.nds {
                min-width: 48px;
                max-width: 48px;
            }
            &.outs {
                min-width: 52px;
                max-width: 52px;
            }
            &.nds {
                margin-right: auto;
            }
            &.requests {
                // margin-left: 32px;
                .button {
                    padding: 0 4px;
                }
            }
            &.action {
                flex: 0 1 auto;
                margin-left: auto;
                @media screen and (min-width: $screenMd+1) {
                    min-width: 232px;
                    max-width: 232px;
                }
                // min-width: 40px;
                // max-width: 40px;
                // margin-left: 32px;
            }
        }
        td {
            // &.id, &.title, &.delivery, &.wholesale-price, &.recommended-retail-price, &.mark-up, &.minimum {
            //     padding-bottom: 20px;
            // }
            &:not(.image):not(.select):not(.action):not(.id) {
                padding-bottom: 28px;
            }
        }
    }
}
.product-row {
    &.action-2 {
        box-shadow: 4px 0 $primary inset;
    }
    &.action-1 {
        box-shadow: 4px 0 $green inset;
    }
    &.action-0 {
        box-shadow: 4px 0 $red inset;
    }
}

.selection-selector {
    display: flex;
    margin-left: auto;
    > *:not(:first-child) {
        margin-left: 8px;
    }
}

.tabs-inner {
    width: calc(100% - 200px);
    display: flex;
}

.table-top-bar {
    button {
        position: relative;
        .circle {
            margin-top: -24px;
            margin-right: -12px;
            margin-left: 4px;
            z-index: 1;
        }
    }
}
.filter-button {
    @media screen and (max-width: $screenMd) {
        // > span {
        //     margin-right: 8px;
        //     &:first-child {
        //         margin-left: 8px;
        //     }
        // }
        .fa-chevron-down {
            display: none;
        }
    }
}
</style>
