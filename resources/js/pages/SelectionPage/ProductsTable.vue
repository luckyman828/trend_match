<template>
    <div class="products-table-wrapper" ref="table" @focusout="onBlur">

        <BaseTable ref="tableComp"
            :stickyHeader="true"
            :items="products"
            :itemsTotalCount="stateProducts.length"
            itemKey="id"
            :itemSize="currentSelections.length > 1 ? 247 : 139"
            :selected.sync="selectedProducts"
            :contextItem.sync="contextProduct"
            :searchKey="['datasource_id','title','category','eans']"
            :searchResult.sync="productsFilteredBySearch"
            :hideContextButton="true"
            :focusIndex="currentFocusRowIndex"
            @show-contextmenu="onShowContextMenu"
            @search-enter="onViewSingle(productsFilteredBySearch[0])"
        >
            <template v-slot:tabs>
                <div class="tabs-inner">
                    <BaseTableTab :label="`Overview`" :count="stateProducts.length" 
                    v-model="currentProductFilter"
                    modelValue="overview"/>
                    <BaseTableTab :label="`In`" :count="stateProducts.filter(x => ['In', 'Focus'].includes(getActiveSelectionInput(x)[currentAction])).length" 
                    v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                    v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                    :modelValue="insTabValue"/>
                    <!-- <BaseTableTab :label="`In`" :count="stateProducts.filter(x => insTabValue == 'ins' ? getActiveSelectionInput(x)[currentAction] == 'In' : getActiveSelectionInput(x)[currentAction] == 'Focus').length"
                    v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                    v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                    :modelValue="insTabValue" :toggle="'Focus only'" @toggle="onToggleFocusOnly"/> -->
                    <BaseTableTab :label="`Out`" :count="stateProducts.filter(x => getActiveSelectionInput(x)[currentAction] == 'Out').length" 
                    v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                    v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                    modelValue="outs"/>
                    <BaseTableTab :label="`Nds`" :count="stateProducts.filter(x => getActiveSelectionInput(x)[currentAction] == 'None').length" 
                    v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                    v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                    modelValue="nds"/>
                    <BaseTableTab v-if="selection.type == 'Master' && approvalEnabled" :label="`Tickets`" 
                    :count="!hideCompleted ? stateProducts.filter(x => x.hasTicket).length : stateProducts.filter(x => x.hasTicket && !x.is_completed).length" 
                    v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                    v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                    modelValue="tickets"/>
                </div>

                <!-- Selection Selector -->
                <MultipleSelectionSelector v-if="currentSelectionMode == 'Alignment' && !selection.is_presenting"/>
                <!-- Selection Selector Ends -->

            </template>
            <template v-slot:topBarLeft>
                <v-popover 
                    trigger="manual" 
                    :open="showFilters"
                    :autoHide="false"
                >
                    <button class="ghost"
                    @click="toggleShowFilters">
                        <i class="far fa-filter"></i>
                        <span>Filters</span>
                        <div class="circle primary xs" v-if="activeFiltersCount > 0">
                            {{activeFiltersCount}}
                        </div>
                    </button>
                    <BaseContextMenu slot="popover" :inline="true" 
                        v-click-outside="hideFilters"
                    >

                        <div class="item-group">
                            <v-popover trigger="click" :disabled="availableCategories.length <= 0"
                                placement="right"
                            >
                                <BaseContextMenuItem
                                    iconClass="far fa-filter"
                                    :disabled="availableCategories.length <= 0"
                                    disabledTooltip="No categories available"
                                    @click="showAdvancedFilters = false"
                                >
                                    <span>Category</span>
                                    <span v-if="selectedCategories.length > 0" 
                                        class="filter-counter circle primary xs">
                                        <span>{{selectedCategories.length}}</span>
                                    </span>
                                </BaseContextMenuItem>
                                <template slot="popover">
                                    <BaseSelectButtons style="width: 200px; padding-top: 8px;" submitOnChange="true" 
                                    :options="availableCategories" v-model="selectedCategories"/>
                                </template>
                            </v-popover>
                        </div>

                        <div class="item-group">
                            <v-popover trigger="click" :disabled="availableDeliveryDates.length <= 0"
                                placement="right"
                            >
                                <BaseContextMenuItem 
                                    iconClass="far fa-calendar-week"
                                    :disabled="availableDeliveryDates.length <= 0"
                                    disabledTooltip="No delivery dates available"
                                    @click="showAdvancedFilters = false"
                                >
                                    <span>Delivery</span>
                                    <span v-if="selectedDeliveryDates.length > 0" class="filter-counter circle primary xs">
                                        <span>{{selectedDeliveryDates.length}}</span>
                                    </span>
                                </BaseContextMenuItem>
                                <template slot="popover">
                                    <BaseSelectButtons submitOnChange="true" :displayFunction="prettifyDate"
                                    :options="availableDeliveryDates" v-model="selectedDeliveryDates"/>
                                </template>
                            </v-popover>
                        </div>

                        <div class="item-group">
                            <v-popover trigger="click" :disabled="availableBuyerGroups.length <= 0"
                                placement="right"
                            >
                                <BaseContextMenuItem
                                    iconClass="far fa-box"
                                    :disabled="availableBuyerGroups.length <= 0"
                                    disabledTooltip="No buyer groups available"
                                    @click="showAdvancedFilters = false"
                                >
                                    <span>Buyer group</span>
                                    <span v-if="selectedBuyerGroups.length > 0" class="filter-counter circle primary xs">
                                        <span>{{selectedBuyerGroups.length}}</span>
                                    </span>
                                </BaseContextMenuItem>
                                <template slot="popover">
                                    <BaseSelectButtons submitOnChange="true"
                                    :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                                </template>
                            </v-popover>
                        </div>

                        <div class="item-group">
                            <v-popover trigger="click" 
                                placement="right"
                                popoverInnerClass="tooltip-inner popover-inner"
                                :open="showAdvancedFilters"
                                :autoHide="false
                            ">
                                <BaseContextMenuItem 
                                    iconClass="far fa-sliders-v"
                                    @click="showAdvancedFilters = true"
                                >
                                    <span>Advanced Filters</span>
                                    <div v-if="getHasAdvancedFilter" class="filter-counter circle primary xs">
                                        <span>{{getAdvancedFilter.length}}</span>
                                    </div>
                                </BaseContextMenuItem>
                                <template slot="popover">
                                    <ConditionalFilters :distributionScope="distributionScope"
                                    :key="advancedFilterKey"
                                    @close="showAdvancedFilters = false"/>
                                </template>
                            </v-popover>
                        </div>

                        <div class="item-group" v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 
                            || selectedSelectionIds.length > 0 ||unreadOnly || getHasAdvancedFilter"
                        >
                            <BaseContextMenuItem
                                iconClass="far fa-times"
                                color="danger"
                                @click="resetFilters(); showFilters = false; showAdvancedFilters = false"
                            >
                                <span>Clear filters</span>
                            </BaseContextMenuItem>
                        </div>

                    </BaseContextMenu>
                </v-popover>

                <!-- Temp. disabled until the functionality gets hooked up -->
                <BaseCheckboxInputField class="small" v-model="unreadOnly" v-if="currentSelectionMode != 'Feedback' && selection.type == 'Master'">
                    <span>Unread only</span>
                </BaseCheckboxInputField>

                <BaseCheckboxInputField class="small" v-if="['ins', 'focus'].includes(currentProductFilter)"
                :value="insTabValue == 'focus'"
                @check="onToggleFocusOnly">
                    <span>Focus only</span>
                </BaseCheckboxInputField>

                <BaseCheckboxInputField class="small" v-if="currentProductFilter == 'tickets'"
                v-model="hideCompleted">
                    <span>Hide completed</span>
                </BaseCheckboxInputField>

                <button class="invisible primary" 
                v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 || selectedSelectionIds.length > 0 ||unreadOnly
                || getHasAdvancedFilter"
                @click="resetFilters">
                    <span>Clear filter</span>
                </button>

            </template>

            <template v-slot:topBarRight>
                <v-popover trigger="click">
                    <button class="ghost filter-button">
                        <span>Selection Input</span>
                        <span v-if="selectedSelectionIds.length > 0" class="circle primary xs">
                            <span>{{selectedSelectionIds.length}}</span>
                        </span>
                        <i class="far fa-chevron-down"></i>
                    </button>
                    <template slot="popover">
                        <BaseSelectButtons submitOnChange="true" 
                        :options="getSelectionsAvailableForInputFiltering" v-model="selectedSelectionIds"
                        optionNameKey="name" optionValueKey="id"/>
                    </template>
                </v-popover>

                <v-popover trigger="click">
                    <button class="ghost filter-button" v-tooltip="'Select what type of input is displayed in the table.<br><strong>This does not change the type of input you make.</strong>'">
                        <span>Show input from: {{distributionScope}}</span>
                        <i class="far fa-chevron-down"></i>
                    </button>
                    <template slot="popover">
                        <BaseSelectButtons type="radio" submitOnChange="true" 
                        :options="['Alignment', 'Feedback']" v-model="distributionScope"/>
                    </template>
                </v-popover>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="image"/>
                <BaseTableHeader class="id" :sortKey="'datasource_id'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">Product Name</BaseTableHeader>
                <BaseTableHeader class="delivery" :sortKey="'delivery_date'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">Delivery</BaseTableHeader>
                <BaseTableHeader class="wholesale-price hide-screen-xs" :sortKey="'wholesale_price'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">WHS</BaseTableHeader>
                <BaseTableHeader class="recommended-retail-price hide-screen-xs" :sortKey="'recommended_retail_price'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">RRP</BaseTableHeader>
                <BaseTableHeader class="mark-up hide-screen-xs" :sortKey="'mark_up'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">MU</BaseTableHeader>
                <BaseTableHeader class="currency hide-screen-xs"/>
                <BaseTableHeader class="minimum" :sortKey="['min_order', 'min_variant_order']" :currentSortKey="sortKey"
                v-tooltip="{content: 'Minimum per Variant / Minimum per Order', delay: {show: 300}}"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">Minimum</BaseTableHeader>
                <!-- Single Selection Only -->
                <template v-if="getCurrentSelections.length == 1">
                    <BaseTableHeader class="focus"/>
                    <BaseTableHeader class="ins" :sortKey="distributionScope == 'Alignment' ? ['alignmentFocus', 'alignmentIns'] : ['focus', 'ins']" :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort" :descDefault="true">In</BaseTableHeader>
                    <BaseTableHeader class="outs" :sortKey="distributionScope == 'Alignment' ? 'alignmentOuts' : 'outs'" :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort" :descDefault="true">Out</BaseTableHeader>
                    <BaseTableHeader class="nds" :sortKey="distributionScope == 'Alignment' ? 'alignmentNds' : 'nds'" :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort" :descDefault="true">ND</BaseTableHeader>
                    <BaseTableHeader :sortKey="['requests', 'comments']" :currentSortKey="sortKey"
                    defaultTo="sequence"
                    @sort="onSort" :descDefault="true">Requests</BaseTableHeader>
                </template>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:row="rowProps">

                <ProductsTableRow v-if="productsFilteredBySearch.length > 0"
                ref="row"
                class="product-row flex-table-row"
                :product="rowProps.item" :index="rowProps.index"
                :selection="selection"
                :currentAction="currentAction"
                :distributionTooltipComp="$refs.actionDistributionTooltip" :variantTooltipComp="$refs.variantTooltip"
                :distributionScope="distributionScope"
                :rowComponent="rowProps.rowComponent"
                @onViewSingle="onViewSingle" 
                @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"/>
                    
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
                    :iconClass="contextSelectionInput[currentAction] == 'In' ? 'fas green fa-heart' : 'far fa-heart'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    hotkey="KeyI"
                    @click="onUpdateAction('In', contextSelectionInput)">
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem 
                    :iconClass="contextSelectionInput[currentAction] == 'Out' ? 'fas red fa-times' : 'far fa-times'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    hotkey="KeyO"
                    @click="onUpdateAction('Out', contextSelectionInput)">
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem 
                    :iconClass="contextSelectionInput[currentAction] == 'Focus' ? 'fas primary fa-star' : 'far fa-star'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    :hotkey="['KeyF', 'KeyU']"
                    @click="onUpdateAction('Focus', contextSelectionInput)">
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>

                </div>
                <div class="item-group">
                    <BaseContextMenuItem 
                        :iconClass="!contextProduct.is_completed ? 'far fa-check-circle' : 'far fa-times-circle'"
                        hotkey="KeyC"
                        @click="onToggleProductsCompleted([contextProduct])" v-close-popover
                    >
                        <span v-if="!contextProduct.is_completed"><u>C</u>omplete</span>
                        <span v-else>Undo <u>c</u>omplete</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-eye"
                    hotkey="KeyV"
                    @click="onViewSingle(contextProduct)" v-close-popover>
                        <u>V</u>iew
                    </BaseContextMenuItem>
                </div>

            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelection">
            <template v-slot:header>
                <span>Choose action for {{selectedProducts.length}} product{{selectedProducts.length > 1 ? 's' : ''}}</span>
            </template>

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times"
                hotkey="KeyC"
                @click="selectedProducts = []">
                    <span><u>C</u>lear selection</span>
                </BaseContextMenuItem>



            </div>

            <template v-if="selectedProducts.length > 1">
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-heart"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    hotkey="KeyI"
                    @click="onUpdateMultipleActions(selectedProducts, 'In')">
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-times"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    hotkey="KeyO"
                    @click="onUpdateMultipleActions(selectedProducts, 'Out')">
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-star"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    :hotkey="['KeyF', 'KeyU']"
                    @click="onUpdateMultipleActions(selectedProducts, 'Focus')">
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>
                </div>

                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    :disabledTooltip="userWriteAccess.actions.msg"
                    hotkey="KeyC"
                    @click="onUpdateMultipleActions(selectedProducts, 'None')">
                        <span>Clear actions</span>
                    </BaseContextMenuItem>
                </div>
            </template>

            <div class="item-group">
                <BaseContextMenuItem 
                    iconClass="far fa-check-circle"
                    hotkey="KeyC"
                    @click="onSetProductsCompleted(selectedProducts, true)" v-close-popover
                >
                    <span><u>C</u>omplete products</span>
                </BaseContextMenuItem>
                <BaseContextMenuItem 
                    iconClass="far fa-times-circle"
                    hotkey="KeyN"
                    @click="onSetProductsCompleted(selectedProducts, false)" v-close-popover
                >
                    <span>U<u>n</u>do complete products</span>
                </BaseContextMenuItem>
            </div>

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-file-export"
                    hotkey="KeyE"
                >
                    <template>
                        <span><u>E</u>xport selected</span>
                    </template>

                    <template v-slot:submenu>
                        <div class="item-group">
                            <BaseContextMenuItem iconClass="far fa-file-pdf"
                            hotkey="KeyP"
                            @click="onExportToPdf">
                                <span><u>P</u>DF</span>
                            </BaseContextMenuItem>

                            <BaseContextMenuItem iconClass="far fa-file-csv"
                            hotkey="KeyC"
                            @click="onExportToCsv">
                                <span><u>C</u>SV</span>
                            </BaseContextMenuItem>
                        </div>
                    </template>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseTooltip id="action-distribution-tooltip" ref="actionDistributionTooltip"
            @show="showDistributionTooltip">
            <ActionDistributionTooltip :selectionInput="tooltipSelectionInput" :type="distributionTooltipType"
            :actionDistributionTooltipTab="actionDistributionTooltipTab"
            @changeTab="tab => actionDistributionTooltipTab = tab"/>
        </BaseTooltip>

        <BaseTooltip id="variant-tooltip" ref="variantTooltip"
        @show="showVariantTooltip">
            <VariantTooltip :variant="tooltipVariant" :selection="selection" :product="tooltipProduct" :selectionInput="tooltipSelectionInput"
            :actionDistributionTooltipTab="actionDistributionTooltipTab"
            @changeTab="tab => actionDistributionTooltipTab = tab"/>
        </BaseTooltip>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ProductsTableRow from './ProductsTableRow/index'
import MultipleSelectionSelector from './MultipleSelectionSelector'
import ActionDistributionTooltip from './ActionDistributionTooltip'
import sortArray from '../../mixins/sortArray'
import VariantTooltip from './VariantTooltip'
import ConditionalFilters from './ConditionalFilters'

export default {
    name: 'productsTable',
    props: [
        'products',
        'file',
        'selection',
        'currentAction',
    ],
    mixins: [
        sortArray
    ],
    components: {
        ProductsTableRow,
        MultipleSelectionSelector,
        ActionDistributionTooltip,
        VariantTooltip,
        ConditionalFilters,
    },
    data: function() { return {
        sortKey: 'sequence',
        showContextMenu: false,
        contextProduct: null,
        tooltipSelectionInput: null,
        tooltipVariant: null,
        tooltipProduct: null,
        distributionTooltipType: null,
        actionDistributionTooltipTab: 'Feedback',
        showAdvancedFilters: false,
        insTabValue: 'ins',
        advancedFilterKey: 0,
        showFilters: false,
    }},
    computed: {
        ...mapGetters('files', {
            approvalEnabled: 'getApprovalEnabled'
        }),
        ...mapGetters('products', ['availableCategories', 'availableDeliveryDates', 'currentFocusRowIndex',
            'availableBuyerGroups', 'getProductsFilteredBySearch', 'singleVisible', 'getActiveSelectionInput', 'getHasAdvancedFilter', 'getAdvancedFilter']),
        ...mapGetters('selections', ['getCurrentSelections', 'getSelectionsAvailableForAlignment', 
            'currentSelectionMode', 'getAuthUserSelectionWriteAccess', 'getSelectionsAvailableForInputFiltering']),
        ...mapState('products', {stateProducts: 'products'}),
        ...mapGetters('auth', ['authUser']),
        userWriteAccess () {
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
            }
        },
        productsFilteredBySearch: {
            get() {
                return this.$store.getters['products/getProductsFilteredBySearch']
            },
            set(value) {
                this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
            }
        },
        distributionScope: {
            get() {
                return this.$store.getters['products/getDistributionScope']
            },
            set(value) {
                this.SET_DISTRIBUTION_SCOPE(value)
            }
        },
        currentProductFilter: {
            get () {
                return this.$store.getters['products/currentProductFilter']
            },
            set (value) {
                this.setCurrentProductFilter(value)
            }
        },
        selectedCategories: {
            get () {
                return this.$store.getters['products/selectedCategories']
            },
            set (value) {
                this.updateSelectedCategories(value)
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.getters['products/selectedDeliveryDates']
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
            }
        },
        selectedBuyerGroups: {
            get () {
                return this.$store.getters['products/selectedBuyerGroups']
            },
            set (value) {
                this.updateSelectedBuyerGroups(value)
            }
        },
        selectedSelectionIds: {
            get () {
                return this.$store.getters['products/getSelectedSelectionIds']
            },
            set (value) {
                this.SET_SELECTED_SELECTION_IDS(value)
            }
        },
        unreadOnly: {
            get () {
                return this.$store.getters['products/unreadOnly']
            },
            set (value) {
                this.setUnreadOnly(value)
            }
        },
        hideCompleted: {
            get () {
                return this.$store.getters['products/hideCompleted']
            },
            set (value) {
                this.SET_HIDE_COMPLETED(value)
            }
        },
        totalProductCount() {
            if (['ins', 'focus'].includes(this.currentProductFilter)) {
                return this.stateProducts.filter(product => ['In', 'Focus'].includes(this.getActiveSelectionInput(product)[this.currentAction])).length
            }
            if (this.currentProductFilter == 'outs') {
                return this.stateProducts.filter(product => this.getActiveSelectionInput(product)[this.currentAction] == 'Out').length
            }
            if (this.currentProductFilter == 'nds') {
                return this.stateProducts.filter(product => this.getActiveSelectionInput(product)[this.currentAction] == 'None').length
            }
            return this.stateProducts.length
        },
        tooltipBoundariesEl() {
            return document.getElementById('main')
        },
        activeFiltersCount() {
            const advancedFilterCount = this.getAdvancedFilter ? this.getAdvancedFilter.length : 0
            return this.selectedBuyerGroups.length 
                + this.selectedCategories.length 
                + this.selectedDeliveryDates.length
                + advancedFilterCount
        }
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble','updateSelectedCategories',
        'updateSelectedDeliveryDates', 'setUnreadOnly', 'setCurrentProductFilter',
        'updateSelectedBuyerGroups','setCurrentProduct', 'setAvailableProducts',
        'SET_PRODUCTS_FILTERED_BY_SEARCH', 'SET_SELECTED_SELECTION_IDS', 'SET_ADVANCED_FILTER', 'SET_DISTRIBUTION_SCOPE',
        'SET_SELECTED_PRODUCTS', 'SET_SHOW_PDF_MODAL', 'SET_SHOW_CSV_MODAL', 'SET_HIDE_COMPLETED']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        ...mapActions('products', ['showSelectionProductPDP', 'toggleProductCompleted', 'setProductsCompleted']),
        ...mapMutations('products', ['setCurrentFocusRowIndex']),
        toggleShowFilters() {
            this.showFilters = !this.showFilters
        },
        hideFilters() {
            this.showFilters = false
        },
        onToggleProductsCompleted(products) {
            products.map(product => {
                this.toggleProductCompleted({selectionId: this.selection.id, product})
            })
        },
        onSetProductsCompleted(products, shouldBeCompleted) {
            this.setProductsCompleted({selectionId: this.selection.id, products, shouldBeCompleted})
        },
        onExportToCsv() {
            this.SET_SHOW_CSV_MODAL(true)
        },
        onExportToPdf() {
            this.SET_SHOW_PDF_MODAL(true)
        },
        resetFilters() {
            this.selectedCategories = []
            this.selectedDeliveryDates = []
            this.selectedBuyerGroups = []
            this.selectedSelectionIds = []
            this.unreadOnly = false
            this.advancedFilterKey++
            this.SET_ADVANCED_FILTER()
        },
        onToggleFocusOnly(focusOnly) {
            if (this.currentProductFilter == 'ins' && focusOnly) this.currentProductFilter = 'focus'
            if (this.currentProductFilter == 'focus' && !focusOnly) this.currentProductFilter = 'ins'
            this.insTabValue = focusOnly ? 'focus' : 'ins'
        },
        showVariantTooltip({variant, product, selectionInput}) {
            this.tooltipVariant = variant
            this.tooltipProduct = product
            this.tooltipSelectionInput = selectionInput
        },
        showDistributionTooltip({selectionInput, type}) {
            this.tooltipSelectionInput = selectionInput
            this.distributionTooltipType = type
        },
        onViewSingle(product) {
            document.activeElement.blur()
            this.showSelectionProductPDP({product, selection: this.selection})
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
            this.sortArray(this.stateProducts, sortAsc, sortKey)
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
                this.updateFeedbacks({actions, newAction})
            }
            if (this.currentSelectionMode == 'Alignment') {
                const actions = productsToUpdate.map(product => {
                    const selectionInput = this.getActiveSelectionInput(product)
                    return selectionInput.selectionAction
                })
                this.updateActions({actions, newAction})
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
            if (e.target.type == 'textarea' 
                || e.target.tagName.toUpperCase() == 'INPUT'
                || this.singleVisible) return // Don't mess with user input

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
        }
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
        this.setCurrentProductFilter('overview')
    }
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
            th, td {
                &.action {
                    flex: 1;
                }
                &.title {
                    min-width: 160px;
                    max-width: 160px;
                    display: flex;
                    align-items: center;
                    margin-right: auto;
                    padding-right: 20px;
                    span {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: block;
                        overflow: hidden
                    }
                    @media screen and (max-width: $screenXs) {
                        min-width: 160px;
                        max-width: 160px;
                    }
                }
                &.id {
                    min-width: 80px;
                    max-width: 80px;
                    margin-left: 16px
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
                &.wholesale-price, &.recommended-retail-price {
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
                &.focus, &.ins, &.outs, &.nds {
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
            }
            &.id {
                min-width: 80px;
                max-width: 80px;
                margin-left: 16px
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
            &.wholesale-price, &.recommended-retail-price {
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
            &.focus, &.ins, &.outs, &.nds {
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
        box-shadow: 4px 0 $primary inset
    }
    &.action-1 {
        box-shadow: 4px 0 $green inset
    }
    &.action-0 {
        box-shadow: 4px 0 $red inset
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
.filter-counter {
    margin-left: auto;
}
</style>
