<template>
    <div class="products-table-wrapper">

        <BaseTable :stickyHeader="true"
            contentStatus="success"
            :items="products"
            :itemsTotalCount="stateProducts.length"
            itemKey="id"
            :itemSize="139"
            :selected.sync="selectedProducts"
            :contextItem.sync="contextItem"
            :searchKey="['datasource_id','title','category']"
            :searchResult.sync="productsFilteredBySearch"
            :isDraggable="editOrderModeActive"
            :itemsReOrdered.sync="localProducts"
            :hideContextButton="editOrderModeActive"
            @change-order="true"
            @show-contextmenu="showContext"
            @search-enter="onViewSingle(productsFilteredBySearch[0])"
        >
            <template v-slot:topBarLeft>
                
                <template v-if="!editOrderModeActive">
                    <v-popover trigger="click">
                        <button class="ghost">
                            <span>Category </span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedCategories.length > 0" class="circle primary xs">
                                <span>{{selectedCategories.length}}</span>
                            </span>
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
                            <span>Buyer group </span>
                            <i class="far fa-chevron-down"></i>
                            <span v-if="selectedBuyerGroups.length > 0" class="circle primary xs">
                                <span>{{selectedBuyerGroups.length}}</span>
                            </span>
                        </button>
                        <template slot="popover">
                            <BaseSelectButtons submitOnChange="true" 
                            :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                        </template>
                    </v-popover>

                    <button class="invisible primary" v-if="selectedCategories.length > 0 || selectedDeliveryDates.length > 0 || selectedBuyerGroups.length > 0"
                    @click="onClearFilters"><span>Clear filter</span></button>

                    <BaseButton buttonClass="primary"
                    @click="onSaveOrder">
                        <span>Save current product order</span>
                    </BaseButton>

                    <BaseButton buttonClass="primary ghost"
                    @click="onEnterOrderMode(true)">
                        <span>Manually edit product order</span>
                    </BaseButton>

                </template>

                <!-- EDIT ORDER MODE ACTIVE -->
                <template v-else>
                    <BaseButton buttonClass="ghost primary"
                    @click="onEnterOrderMode(false)">
                        <span>Cancel changes</span>
                    </BaseButton>

                    <BaseButton buttonClass="primary"
                    @click="onSaveOrder(); onEnterOrderMode(false)">
                        <span>Done editing order</span>
                    </BaseButton>

                    <p>Editing may be slow in big files</p>
                </template>


            </template>

            <template v-slot:header>
                <BaseTableHeader class="image"></BaseTableHeader>
                <BaseTableHeader class="id" :sortKey="'datasource_id'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">Product Name</BaseTableHeader>
                <BaseTableHeader class="delivery" :sortKey="'delivery_date'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort">Delivery</BaseTableHeader>
                <BaseTableHeader class="wholesale-price" :sortKey="'wholesale_price'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">WHS</BaseTableHeader>
                <BaseTableHeader class="recommended-retail-price" :sortKey="'recommended_retail_price'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">RRP</BaseTableHeader>
                <BaseTableHeader class="mark-up" :sortKey="'mark_up'" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">MU</BaseTableHeader>
                <BaseTableHeader class="currency hide-screen-xs"></BaseTableHeader>
                <BaseTableHeader class="minimum" :sortKey="['min_order', 'min_variant_order']" :currentSortKey="sortKey"
                defaultTo="sequence"
                @sort="onSort" :descDefault="true">Min. Variant/Order</BaseTableHeader>
                <BaseTableHeader class="action"/>
            </template>
            <template v-slot:row="rowProps">
                <ProductsTableRow
                :product="rowProps.item" :index="rowProps.index"
                :editOrderModeActive="editOrderModeActive"
                @view-single-product="onViewSingle"/>
            </template>
        </BaseTable>

        <BaseContextMenu ref="contextMenu">
            <div class="item-group" v-if="selectedProducts.length > 0">
                <BaseContextMenuItem iconClass="far fa-times"
                hokey="KeyC"
                @click="selectedProducts = []">
                    <span><u>C</u>lear Selection</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-pen" 
                hotkey="KeyV"
                @click="onViewSingle(contextItem)">
                    <span><u>V</u>iew / Edit</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-plus" 
                hotkey="KeyA"
                @click="onNewProduct()">
                    <span><u>A</u>dd New Product</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" 
                hotkey="KeyD"
                @click="onDeleteProducts([contextItem])">
                    <span><u>D</u>elete Product</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelected">
            <template v-slot:header>
                <span>Choose action for {{selectedProducts.length}} products</span>
            </template>

            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" 
                hotkey="KeyC"
                @click="selectedProducts = []">
                    <span><u>C</u>lear Selection</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" 
                hotkey="KeyD"
                @click="onDeleteProducts(selectedProducts)">
                    <span><u>D</u>elete Products</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import ProductsTableRow from './ProductsTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'editProductsTable',
    props: [
        // 'products',
        'sortKey',
        'file',
    ],
    components: {
        ProductsTableRow,
    },
    mixins: [
        sortArray
    ],
    data: function() { return {
        selectedProducts: [],
        // productsFilteredBySearch: this.products,
        contextItem: null,
        editOrderModeActive: false,
        localProducts: [],
    }},
    computed: {
        ...mapGetters('products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 'availableBuyerGroups', 'getProductsFilteredBySearch']),
        ...mapGetters('products', {
            products: 'productsFiltered',
        }),
        ...mapState('products', {stateProducts: 'products'}),
        productsFilteredBySearch: {
            get() {
                return this.$store.getters['products/getProductsFilteredBySearch']
            },
            set(value) {
                this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
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
        // localProducts: {
        //     get() {return this.products},
        //     set(products) {
        //         this.SET_PRODUCTS(products)
        //     }
        // }
    },
    methods: {
        ...mapActions('products', ['setCurrentProduct', 'instantiateNewProduct', 'deleteProducts', 'updateManyProducts']),
        ...mapMutations('products', ['setSingleVisisble','updateSelectedCategories', 'SET_PRODUCTS',
        'updateSelectedDeliveryDates', 'updateSelectedBuyerGroups', 'SET_PRODUCTS_FILTERED_BY_SEARCH', 'SET_AVAILABLE_PRODUCTS']),
        onViewSingle(product) {
            this.setCurrentProduct(product)
            this.SET_AVAILABLE_PRODUCTS(this.productsFilteredBySearch) // Save array of available products
            this.setSingleVisisble(true)
            document.activeElement.blur()
        },
        showContext(mouseEvent) {
            let contextMenu = this.$refs.contextMenu
            if (this.selectedProducts.length > 1) {
                contextMenu = this.$refs.contextMenuSelected
            }
            contextMenu.show(mouseEvent)
        },
        async onNewProduct() {
            const newProduct = await this.instantiateNewProduct()
            this.setCurrentProduct(newProduct)
            this.setSingleVisisble(true)
        },
        async onDeleteProducts(products) {
            await this.deleteProducts({file: this.file, products})
            this.selectedProducts = []
        },
        onSort(sortAsc, sortKey) {
            this.$emit('onSort', sortAsc, sortKey)
        },
        onClearFilters() {
            this.selectedCategories = []
            this.selectedDeliveryDates = []
            this.selectedBuyerGroups = []
        },
        onEnterOrderMode(shouldBeActive) {
            this.editOrderModeActive = shouldBeActive 
            if (shouldBeActive) {
                this.onClearFilters()
            } else {
                this.onSort(true, 'sequence')
            }
        },
        onSaveOrder() {
            const products = this.products
            const productsReOrdered = this.editOrderModeActive ? this.localProducts : this.products
            productsReOrdered.map((reOrdered, index) => {
                // Find the corresponding product
                const product = this.products.find(x => x.id == reOrdered.id)
                product.sequence =  index+1
            })
            this.updateManyProducts({ file: this.file, products })
            // Resort
            this.onSort(true, 'sequence')
        },
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .products-table-wrapper {
        button {
            position: relative;
            .circle {
                position: absolute;
                right: -8px;
                top: -8px;
                margin: 0;
            }
        }
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
                    &.action {
                        min-width: 92px;
                        max-width: 92px;
                        flex: 0 1 auto;
                        margin-left: auto;
                    }
                }
                td {
                    &:not(.image):not(.select):not(.action):not(.id):not(.context-button) {
                        padding-bottom: 24px;
                    }
                }
            }
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
</style>
