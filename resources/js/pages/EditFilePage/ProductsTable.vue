<template>
    <div class="products-table-wrapper">
        <BaseFlexTable class="products-table" stickyHeader="true">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :arrayToSearch="products" :searchKey="['datasource_id','title','category']"
                        v-model="productsFilteredBySearch"/>

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
                                :options="availableDeliveryDates" :optionNameKey="'name'" 
                                :optionValueKey="'value'" v-model="selectedDeliveryDates"/>
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
                        @click="selectedCategories=[]; selectedDeliveryDates=[]; selectedBuyerGroups=[]"><span>Clear filter</span></button>

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
                @sort="(sortAsc, sortKey) => $emit('onSort', sortAsc, sortKey)">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey"
                @sort="(sortAsc, sortKey) => $emit('onSort', sortAsc, sortKey)">Product Name</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>

                <RecycleScroller
                    class="products-scroller"
                    :items="productsFilteredBySearch"
                    :item-size="78"
                    page-mode
                    key-field="id"
                    v-slot="{ item, index }"
                >
                    <ProductsTableRow class="product-row flex-table-row"
                    :product="item" :index="index" v-model="selectedProducts" :selectedProducts="selectedProducts"
                    @onViewSingle="onViewSingle" @showContextMenu="showContext"/>
                </RecycleScroller>

                <tr v-if="productsFilteredBySearch.length <= 0">
                    <p style="padding: 60px 0 100px; text-align: center; width: 100%;">
                        No products to show. Try changing your filters.</p>
                </tr>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenu" v-slot>
            <div class="item-group">
                <div class="item" @click="onViewSingle(contextItem)">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <span><u>V</u>iew / Edit</span>
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click.stop="onNewProduct()">
                    <div class="icon-wrapper"><i class="far fa-plus"></i></div>
                    <span><u>A</u>dd New Product</span>
                </div>
            </div>
            <div class="item-group">
                <div class="item">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <span><u>D</u>elete Product</span>
                </div>
            </div>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductsTableRow from './ProductsTableRow'

export default {
    name: 'editProductsTable',
    props: [
        'products',
        'sortKey',
        'file',
    ],
    components: {
        ProductsTableRow,
    },
    data: function() { return {
        selectedProducts: [],
        productsFilteredBySearch: this.products,
        contextItem: null,
    }},
    computed: {
        ...mapGetters('products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 'availableBuyerGroups']),
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
    },
    methods: {
        ...mapActions('products', ['setCurrentProduct', 'setAvailableProducts', 'instantiateNewProduct']),
        ...mapMutations('products', ['setSingleVisisble','updateSelectedCategories', 'updateSelectedDeliveryDates', 'updateSelectedBuyerGroups']),
        onViewSingle(product) {
            this.setCurrentProduct(product)
            this.setAvailableProducts(this.products) // Save array of available products
            this.setSingleVisisble(true)
        },
        showContext(mouseEvent, product) {
            const contextMenu = this.$refs.contextMenu
            this.contextItem = product;
            contextMenu.show(mouseEvent)
        },
        async onNewProduct() {
            const newProduct = await this.instantiateNewProduct()
            this.setCurrentProduct(newProduct)
            this.setSingleVisisble(true)
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
                > * {
                    &.title {
                        min-width: 248px;
                        max-width: 248px;
                        display: flex;
                        align-items: center;
                        margin-right: 32px;
                        flex: 1;
                    }
                    &.id {
                        min-width: 80px;
                        max-width: 80px;
                        margin-left: 16px
                    }
                    &.image {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.focus, &.in, &.out, &.nd {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.requests {
                        margin-left: 32px;
                        .button {
                            padding: 0 4px;
                        }
                    }
                    &.image {
                        min-width: 48px;
                        max-width: 48px;
                    }
                    &.action {
                        flex: 1;
                        min-width: 232px;
                        margin-left: 32px;
                    }
                }
            }
        }
    }

    // SMALL SCREENS AND HIGH DPI
    @media screen and (max-width: $screenSmall) {

        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            
        }
    }
</style>
