<template>
    <div class="products-table-wrapper" ref="table" @focusout="onBlur">
        <BaseTable
            ref="tableComp"
            :stickyHeader="true"
            :items="products"
            :itemsTotalCount="allProducts.length"
            itemKey="id"
            subItemsArrayKey="variants"
            subItemKey="id"
            :itemSize="null"
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
                            v-model="purchaseOnly"
                            :options="[
                                { label: 'Overview', count: allProducts.length, value: false },
                                {
                                    label: 'Purchase',
                                    count: allProducts.filter(product =>
                                        ['In', 'Focus'].includes(product.selectionAlignment.action)
                                    ).length,
                                    value: true,
                                },
                            ]"
                        />
                    </div>
                    <BudgetCounter :selection="selection" />
                    <div class="right flex-list">
                        <button class="invisible primary sm pill" v-if="filtersActive" @click="resetFilters">
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
                <ProductRow
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
            <template v-slot:subRow="rowProps">
                <VariantRow :variant="rowProps.item" />
            </template>
        </BaseTable>

        <BaseContextMenu ref="contextMenu">
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
import ProductRow from './ProductRow'
import VariantRow from './VariantRow'
import BudgetCounter from '../BudgetCounter'
import sortArray from '../../../../mixins/sortArray'
import ProductFilters from '../ProductFilters'
import ProductSort from '../ProductSort'

export default {
    name: 'buy.ProductTable',
    props: ['products', 'file', 'selection', 'currentAction'],
    mixins: [sortArray],
    components: {
        ProductRow,
        ProductFilters,
        ProductSort,
        BudgetCounter,
        VariantRow,
    },
    data: function() {
        return {
            sortKey: 'sequence',
            showContextMenu: false,
            contextProduct: null,
        }
    },
    computed: {
        ...mapGetters('products', ['currentFocusRowIndex', 'getProductsFilteredBySearch', 'singleVisible']),
        ...mapGetters('productFilters', {
            filtersActive: 'getFiltersAreActive',
        }),
        ...mapGetters('products', { allProducts: 'getProducts' }),
        ...mapGetters('auth', ['authUser']),
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
        purchaseOnly: {
            get() {
                return this.$store.getters['productFilters/getPurchaseOnly']
            },
            set(value) {
                this.SET_PURCHASE_ONLY(value)
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
        ...mapMutations('productFilters', ['SET_PURCHASE_ONLY', 'SET_FILTER_SELECTION_IDS']),
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
        .base-table {
            .body {
                border: none;
                background: transparent;
                box-shadow: none;
            }
            .rounded-top {
                display: none;
            }
            tr {
                padding: 0;
                background: none;
                &:hover {
                    background: none !important;
                }
            }
            .row-wrapper {
                background: white;
                border-radius: $borderRadiusModule;
                box-shadow: $shadowModule;
                border: $borderModule;
            }
        }
    }
}
</style>
