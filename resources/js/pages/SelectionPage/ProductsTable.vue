<template>
    <div class="products-table-wrapper">

        <BaseFlexTable class="products-table" :stickyHeader=true>
            <template v-slot:tabs>
                <BaseTableTab :label="`Overview`" :count="productTotals.all" 
                v-model="currentProductFilter"
                modelValue="overview"/>
                <BaseTableTab :label="`In`" :count="productTotals.ins + productTotals.focus" 
                v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                modelValue="ins"/>
                <BaseTableTab :label="`Out`" :count="productTotals.outs" 
                v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                modelValue="outs"/>
                <BaseTableTab :label="`Nds`" :count="productTotals.nds" 
                v-model="currentProductFilter" :disabled="currentSelections.length > 1"
                v-tooltip="currentSelections.length > 1 && 'Only available for single-selection view'"
                modelValue="nds"/>

                <!-- Selection Selector -->
                <MultipleSelectionSelector v-if="currentSelectionMode == 'Alignment' && !selection.is_presenting"/>
                <!-- Selection Selector Ends -->

            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :arrayToSearch="products" :searchKey="['datasource_id','title','category']"
                        ref="searchField"
                        v-model="productsFilteredBySearch" @keyup.enter.native="onViewSearchProduct"/>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Category</span>
                                <span v-if="selectedCategories.length > 0" class="circle primary xs">
                                    <span>{{selectedCategories.length}}</span>
                                </span>
                                <i class="far fa-chevron-down"></i>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons style="width: 200px; padding-top: 8px;" submitOnChange="true" 
                                :options="availableCategories" v-model="selectedCategories"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Delivery</span>
                                <i class="far fa-chevron-down"></i>
                                <span v-if="selectedDeliveryDates.length > 0" class="circle primary xs">
                                    <span>{{selectedDeliveryDates.length}}</span>
                                </span>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons submitOnChange="true" 
                                :options="availableDeliveryDates" v-model="selectedDeliveryDates"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Buyer group</span>
                                <span v-if="selectedBuyerGroups.length > 0" class="circle primary xs">
                                    <span>{{selectedBuyerGroups.length}}</span>
                                </span>
                                <i class="far fa-chevron-down"></i>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons submitOnChange="true" 
                                :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost">
                                <span>Selection Input</span>
                                <span v-if="selectedSelectionIds.length > 0" class="circle primary xs">
                                    <span>{{selectedSelectionIds.length}}</span>
                                </span>
                                <i class="far fa-chevron-down"></i>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons submitOnChange="true" 
                                :options="getAvailableSelections" v-model="selectedSelectionIds"
                                optionNameKey="name" optionValueKey="id"/>
                            </template>
                        </v-popover>

                        <v-popover trigger="click">
                            <button class="ghost" v-tooltip="'Select what type of input is displayed in the table.<br><strong>This does not change the type of input you make.</strong>'">
                                <span>Show input from: {{distributionScope}}</span>
                                <i class="far fa-chevron-down"></i>
                            </button>
                            <template slot="popover">
                                <BaseSelectButtons type="radio" submitOnChange="true" 
                                :options="['Alignment', 'Feedback']" v-model="distributionScope"/>
                            </template>
                        </v-popover>

                        <!-- Temp. disabled until the functionality gets hooked up -->
                        <BaseCheckboxInputField class="small" v-model="unreadOnly">
                            <span>Unread only</span>
                        </BaseCheckboxInputField>

                        <button class="invisible primary" 
                        v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0 || selectedSelectionIds.length > 0 ||unreadOnly"
                        @click="selectedCategories=[]; selectedDeliveryDates=[]; selectedBuyerGroups=[]; selectedSelectionIds=[]; unreadOnly = false">
                            <span>Clear filter</span>
                        </button>

                        <!-- <BaseTabHeaderList>
                            <BaseTabHeader :active="currentTab == 'alignment'" 
                            @click.native="">
                                <span>Alignment</span>
                            </BaseTabHeader>
                            <BaseTabHeader :active="currentTab == 'feedback'" 
                            @click.native="setCurrentTab('feedback')">
                                <span>Feedback</span>
                            </BaseTabHeader>
                        </BaseTabHeaderList> -->

                    </template>
                    <template v-slot:right>
                        <span>{{selectedProducts.length}} selected</span>
                        <span v-if="productsFilteredBySearch.length != productTotals.all">{{productsFilteredBySearch.length}}/{{productTotals.all}} showing</span>
                        <span v-else>{{productTotals.all}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select"><BaseCheckbox :modelValue="true" :value="selectedProducts.length > 0"
                @change="(checked) => checked ? selectedProducts = products : selectedProducts = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="image"></BaseTableHeader>
                <BaseTableHeader class="id" :sortKey="'datasource_id'" :currentSortKey="sortKey"
                @sort="onSort">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey"
                @sort="onSort">Product Name</BaseTableHeader>
                <BaseTableHeader class="delivery" :sortKey="'delivery_date'" :currentSortKey="sortKey"
                @sort="onSort">Delivery</BaseTableHeader>
                <BaseTableHeader class="wholesale-price hide-screen-xs" :sortKey="'wholesale_price'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">WHS</BaseTableHeader>
                <BaseTableHeader class="recommended-retail-price hide-screen-xs" :sortKey="'recommended_retail_price'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">RRP</BaseTableHeader>
                <BaseTableHeader class="mark-up hide-screen-xs" :sortKey="'mark_up'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">MU</BaseTableHeader>
                <BaseTableHeader class="currency hide-screen-xs"></BaseTableHeader>
                <BaseTableHeader class="minimum" :sortKey="['min_order', 'min_variant_order']" :currentSortKey="sortKey"
                v-tooltip="{content: 'Minimum per Variant / Minimum per Order', delay: {show: 300}}"
                @sort="onSort" :descDefault="true">Minimum</BaseTableHeader>
                <BaseTableHeader class="focus"></BaseTableHeader>
                <BaseTableHeader class="ins" :sortKey="['allFocus', 'allIns']" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">In</BaseTableHeader>
                <BaseTableHeader class="outs" :sortKey="'allOuts'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">Out</BaseTableHeader>
                <BaseTableHeader class="nds" :sortKey="'allNds'" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">ND</BaseTableHeader>
                <BaseTableHeader :sortKey="['requests', 'comments']" :currentSortKey="sortKey"
                @sort="onSort" :descDefault="true">Requests</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>

                <RecycleScroller
                    class="products-scroller"
                    :items="productsFilteredBySearch"
                    :item-size="currentSelections.length > 1 ? 247 : 139"
                    page-mode
                    key-field="id"
                    v-slot="{ item, index }"
                >
                    <ProductsTableRow class="product-row flex-table-row"
                    @showContext="onShowContextMenu($event, item)"
                    :selection="selection" :currentAction="currentAction"
                    :product="item" :index="index" v-model="selectedProducts" :selectedProducts="selectedProducts"
                    :distributionTooltipComp="$refs.actionDistributionTooltip" :variantTooltipComp="$refs.variantTooltip"
                    :distributionScope="distributionScope"
                    @onViewSingle="onViewSingle" @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"/>
                    
                </RecycleScroller>

                <!-- <ProductsTableRow class="product-row flex-table-row" v-for="(product, index) in productsFilteredBySearch" :key="product.id"
                    @showContext="onShowContextMenu($event, item)"
                    :selection="selection" :currentAction="currentAction"
                    :product="product" :index="index" v-model="selectedProducts" :selectedProducts="selectedProducts"
                    :tooltipComp="$refs.actionDistributionTooltip"
                    @onViewSingle="onViewSingle" @updateAction="(product, action, selection) => $emit('updateAction', product, action, selection)"/> -->

                <tr v-if="productsFilteredBySearch.length <= 0">
                    <p style="padding: 60px 0 100px; text-align: center; width: 100%;">
                        No products to show. Try changing your filters.</p>
                </tr>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenu"
            :hotkeys="['KeyF', 'KeyI', 'KeyU', 'KeyO', 'KeyV']"
            @keybind-v="onViewSingle(contextProduct)"
        >
            <template v-if="contextProduct">
                <div class="item-group">
  
                    <BaseContextMenuItem 
                    :iconClass="contextProduct[currentAction] == 'In' ? 'fas green fa-heart' : 'far fa-heart'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(contextProduct, 'In', selection)">
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem 
                    :iconClass="contextProduct[currentAction] == 'Out' ? 'fas red fa-times' : 'far fa-times'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(contextProduct, 'Out', selection)">
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem 
                    :iconClass="contextProduct[currentAction] == 'Focus' ? 'fas primary fa-star' : 'far fa-star'"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateAction(contextProduct, 'Focus', selection)">
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>

                </div>
                <div class="item-group">
                    <div class="item" @click="onViewSingle(contextProduct)" v-close-popover>
                        <div class="icon-wrapper">
                            <i class="far fa-eye"></i>
                        </div>
                        <u>V</u>iew
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelection"
            :hotkeys="['KeyF', 'KeyI', 'KeyU', 'KeyO', 'KeyC']"
            @keybind-c="selectedProducts = []"
            @keybind-i="userWriteAccess.actions.hasAccess && onUpdateMultipleActions(selectedProducts, 'In')"
            @keybind-o="userWriteAccess.actions.hasAccess && onUpdateMultipleActions(selectedProducts, 'Out')"
            @keybind-f="userWriteAccess.actions.hasAccess && onUpdateMultipleActions(selectedProducts, 'Focus')"
            @keybind-u="userWriteAccess.actions.hasAccess && onUpdateMultipleActions(selectedProducts, 'Focus')"
        >
            <template v-slot:header>
                <span>Choose action for {{selectedProducts.length}} product{{selectedProducts.length > 1 ? 's' : ''}}</span>
            </template>

            <div class="item-group">
                <div class="item" @click="selectedProducts = []">
                    <div class="icon-wrapper">
                        <i class="far fa-times"></i>
                    </div>
                    <span><u>C</u>lear selection</span>
                </div>
            </div>

            <template v-if="selectedProducts.length > 1">
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-heart"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateMultipleActions(selectedProducts, 'In')">
                        <span><u>I</u>n</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-times"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateMultipleActions(selectedProducts, 'Out')">
                        <span><u>O</u>ut</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-star"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateMultipleActions(selectedProducts, 'Focus')">
                        <span><u>F</u>oc<u>u</u>s</span>
                    </BaseContextMenuItem>
                </div>

                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times"
                    :disabled="!userWriteAccess.actions.hasAccess" 
                    v-tooltip="!userWriteAccess.actions.hasAccess && userWriteAccess.actions.msg"
                    @click="onUpdateMultipleActions(selectedProducts, 'None')">
                        <span>Clear actions</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseTooltip id="action-distribution-tooltip" ref="actionDistributionTooltip"
        @show="showDistributionTooltip">
            <ActionDistributionTooltip :product="tooltipProduct" :type="distributionTooltipType"
            :actionDistributionTooltipTab="actionDistributionTooltipTab"
            @changeTab="tab => actionDistributionTooltipTab = tab"/>
        </BaseTooltip>

        <BaseTooltip id="variant-tooltip" ref="variantTooltip"
        @show="showVariantTooltip">
            <VariantTooltip :variant="tooltipVariant" :selection="selection" :product="tooltipProduct"
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
    },
    data: function() { return {
        sortKey: 'datasource_id',
        selectedProducts: [],
        showContextMenu: false,
        contextProduct: null,
        tooltipProduct: null,
        tooltipVariant: null,
        distributionTooltipType: null,
        actionDistributionTooltipTab: 'feedback',
        distributionScope: this.selection.type == 'Master' ? 'Alignment' : 'Feedback'
    }},
    computed: {
        ...mapGetters('products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 
            'availableBuyerGroups', 'getProductsFilteredBySearch', 'singleVisible', 'getAvailableSelections']),
        ...mapGetters('selections', ['getCurrentSelections', 'getSelectionsAvailableForAlignment', 
            'currentSelectionMode', 'getAuthUserSelectionWriteAccess']),
        ...mapState('products', {stateProducts: 'products'}),
        ...mapGetters('auth', ['authUser']),
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selection)
        },
        currentSelections() {
            return this.getCurrentSelections
        },
        productsFilteredBySearch: {
            get() {
                return this.$store.getters['products/getProductsFilteredBySearch']
            },
            set(value) {
                this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
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
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble','updateSelectedCategories',
        'updateSelectedDeliveryDates', 'setUnreadOnly', 'setCurrentProductFilter',
        'updateSelectedBuyerGroups','setCurrentProduct', 'setAvailableProducts',
        'SET_PRODUCTS_FILTERED_BY_SEARCH', 'SET_SELECTED_SELECTION_IDS']),
        ...mapActions('actions', ['setAction', 'destroyAction', 'setManyActions', 'setManyTaskActions', 'insertOrUpdateActions']),
        ...mapActions('comments', ['setComment', 'destroyComment']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        ...mapActions('products', ['showSelectionProductPDP']),
        showVariantTooltip({variant, product}) {
            this.tooltipVariant = variant
            this.tooltipProduct = product
        },
        showDistributionTooltip({product, type}) {
            this.tooltipProduct = product
            this.distributionTooltipType = type
        },
        onViewSingle(product) {
            // this.SET_CURRENT_PDP_SELECTION(this.selection)
            // this.setCurrentProduct(product)
            // this.setAvailableProducts(this.productsFilteredBySearch) // Save array of available products
            // this.setSingleVisisble(true)
            document.activeElement.blur()
            this.showSelectionProductPDP({product, selection: this.selection})
        },
        onShowContextMenu(mouseEvent, product) {
            let contextMenu = this.$refs.contextMenu
            this.contextProduct = product
            if (this.selectedProducts.length > 0) {
                this.contextProduct = this.selectedProducts[0]
            }
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
        onUpdateAction(product, action, selection) {
            this.$emit('updateAction', product, action, selection)
        },
        onUpdateMultipleActions(products, action) {
            this.insertOrUpdateActions({products, action, selection: this.selection, user: this.authUser})
        },
        onViewSearchProduct() {
            if (this.productsFilteredBySearch.length > 0) {
                this.onViewSingle(this.productsFilteredBySearch[0])
            }
        },
        hotkeyHandler(e) {
            const key = event.code
            if (event.target.type == 'textarea' 
                || event.target.tagName.toUpperCase() == 'INPUT') return // Don't mess with user input

            if (key == 'KeyS' && !this.singleVisible) {
                this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
        }
    },
    created() {
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
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
            tr {
                th, td {
                    &.title {
                        min-width: 220px;
                        max-width: 220px;
                        display: flex;
                        align-items: center;
                        margin-right: auto;
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

    // SMALL SCREENS AND HIGH DPI
    @media screen and (max-width: $screenMd) {

        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            
        }
    }

    .table-top-bar {
        button {
            position: relative;
            .circle {
                position: absolute;
                right: -8px;
                top: -8px;
            }
        }
    }
</style>
