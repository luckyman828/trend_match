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
            :hideContextButton="true"
            :hideTopBar="true"
            :focusIndex="currentFocusRowIndex"
            @show-contextmenu="onShowContextMenu"
        >
            <template v-slot:overTable>
                <div class="flex-list justify full-w">
                    <div class="left">
                        <BaseSegmentedControl
                            activeClass="white"
                            sizeClass="sm"
                            theme="light"
                            v-model="productActionFilter"
                            :options="[
                                { label: 'Overview', count: allProducts.length, value: 'overview' },
                                {
                                    label: 'Purchase',
                                    count: allProducts.filter(product => ['In', 'Focus'].includes(product.yourAction))
                                        .length,
                                    value: 'ins',
                                },
                            ]"
                        />
                    </div>
                    <BudgetCounter :selection="selection" />
                    <div class="right flex-list">
                        <button class="invisible primary" v-if="filtersActive" @click="resetFilters">
                            <span>Clear filter</span>
                        </button>
                        <ProductFilters v-slot="slotProps">
                            <button class="col-primary sm pill" @click="slotProps.activate()">
                                <span>Filter</span>
                                <i class="fas fa-filter"></i>
                            </button>
                        </ProductFilters>
                        <ProductSort :currentSortKey="sortKey" @sort="onSort" v-slot="slotProps">
                            <button class="col-primary sm pill" @click="slotProps.activate()">
                                <span>Sort by: {{ sortKey }}</span>
                                <i class="fas fa-angle-down"></i>
                            </button>
                        </ProductSort>
                    </div>
                </div>
            </template>

            <template v-slot:row="rowProps">
                <ProductsTableRow
                    v-if="productsFilteredBySearch.length > 0"
                    ref="row"
                    class="product-row flex-table-row"
                    :product="rowProps.item"
                    :index="rowProps.index"
                    :rowComponent="rowProps.rowComponent"
                    :selection="selection"
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
                        hotkey="KeyI"
                        @click="onUpdateAction('In', contextSelectionInput)"
                    >
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        :iconClass="contextSelectionInput[currentAction] == 'Out' ? 'fas red fa-times' : 'far fa-times'"
                        :disabled="!userWriteAccess.actions.hasAccess"
                        :disabledTooltip="userWriteAccess.actions.msg"
                        hotkey="KeyO"
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
                        :hotkey="['KeyF', 'KeyU']"
                        @click="onUpdateAction('Focus', contextSelectionInput)"
                    >
                        <span><u>F</u>oc<u>u</u>s</span>
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

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-file-export" hotkey="KeyE">
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
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ProductsTableRow from './ProductsTableRow/index'
import BudgetCounter from './BudgetCounter'
import sortArray from '../../../mixins/sortArray'

import ProductFilters from './ProductFilters'
import ProductSort from './ProductSort'

export default {
    name: 'productsTable',
    props: ['products', 'file', 'selection', 'currentAction'],
    mixins: [sortArray],
    components: {
        ProductsTableRow,
        ProductFilters,
        ProductSort,
        BudgetCounter,
    },
    data: function() {
        return {
            sortKey: 'sequence',
            showContextMenu: false,
            contextProduct: null,
            insTabValue: 'ins',
        }
    },
    computed: {
        ...mapGetters('products', ['currentFocusRowIndex', 'getProductsFilteredBySearch', 'singleVisible']),
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
        ...mapGetters('products', { allProducts: 'products' }),
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
        ...mapMutations('productFilters', ['SET_PRODUCT_ACTION_FILTER', 'SET_FILTER_SELECTION_IDS']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
        ...mapMutations('productFilters', ['CLEAR_PRODUCT_FILTERS']),
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
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT' || this.singleVisible) return // Don't mess with user input

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
        > span {
            margin-right: 8px;
            &:first-child {
                margin-left: 8px;
            }
        }
        .fa-chevron-down {
            display: none;
        }
    }
}
</style>
