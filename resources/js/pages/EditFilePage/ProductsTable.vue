<template>
    <div class="products-table-wrapper">
        <BaseFlexTable class="products-table">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :arrayToSearch="products" :searchKey="['datasource_id','title','category']"
                        v-model="productsFilteredBySearch"/>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Category </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedCategories.length > 0" class="bubble">
                                        {{selectedCategories.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:body>
                                <BaseSelectButtons header="Filter by category" submitOnChange="true" 
                                :options="availableCategories" v-model="selectedCategories"/>
                            </template>
                        </BaseDropdown>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Delivery</span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedDeliveryDates.length > 0" class="bubble">
                                        {{selectedDeliveryDates.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:body>
                                <BaseSelectButtons header="Filter by delivery date" submitOnChange="true" 
                                :options="availableDeliveryDates" :optionNameKey="'name'" 
                                :optionValueKey="'value'" v-model="selectedDeliveryDates"/>
                            </template>
                        </BaseDropdown>

                        <BaseDropdown class="dropdown-parent left">
                            <template v-slot:button="slotProps">
                                <div class="dropdown-button dropdown-parent item-filter-button" @click="slotProps.toggle">
                                    <span>Buyer group </span>
                                    <i class="far fa-chevron-down"></i>
                                    <span v-if="selectedBuyerGroups.length > 0" class="bubble">
                                        {{selectedBuyerGroups.length}}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:header>
                                <span>Filter by buyer group</span>
                            </template>
                            <template v-slot:body>
                                <BaseCheckboxButtons :options="availableBuyerGroups" ref="filterBuyerGroup" v-model="selectedBuyerGroups" @change="$refs.filterBuyerGroup.submit()"/>
                                <BaseSelectButtons header="Filter by buyer group" submitOnChange="true" 
                                :options="availableBuyerGroups" v-model="selectedBuyerGroups"/>
                            </template>
                        </BaseDropdown>

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
                <BaseTableHeader class="select"><BaseCheckbox
                @change="(checked) => checked ? selectedProducts = products : selectedProducts = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="image"></BaseTableHeader>
                <BaseTableHeader class="id" :sortKey="'datasource_id'" :currentSortKey="sortKey" :sortAsc="sortAsc" 
                @sort="(sortAsc, sortKey) => $emit('onSort', sortAsc, sortKey)">ID</BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc"
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
                    @onViewSingle="onViewSingle"/>
                </RecycleScroller>

                <tr v-if="products.length <= 0">
                    <p style="padding: 60px 0 100px; text-align: center; width: 100%;">
                        No products to show. Try changing your filters.</p>
                </tr>
            </template>
        </BaseFlexTable>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductsTableRow from './ProductsTableRow'

export default {
    name: 'editProductsTable',
    props: [
        'products',
        'sortAsc',
        'sortKey',
        'file',
    ],
    components: {
        ProductsTableRow,
    },
    data: function() { return {
        selectedProducts: [],
        productsFilteredBySearch: this.products
    }},
    computed: {
        ...mapGetters('entities/products', ['productTotals', 'availableCategories', 'availableDeliveryDates', 'availableBuyerGroups']),
        ...mapGetters('persist', ['currentWorkspaceId', 'authUser']),
        selectedCategories: {
            get () {
                return this.$store.getters['entities/products/selectedCategories']
            },
            set (value) {
                this.updateSelectedCategories(value)
            }
        },
        selectedDeliveryDates: {
            get () {
                return this.$store.getters['entities/products/selectedDeliveryDates']
            },
            set (value) {
                this.updateSelectedDeliveryDates(value)
            }
        },
        selectedBuyerGroups: {
            get () {
                return this.$store.getters['entities/products/selectedBuyerGroups']
            },
            set (value) {
                this.updateSelectedBuyerGroups(value)
            }
        },
    },
    methods: {
        ...mapActions('entities/products', ['setCurrentProductId', 'setAvailableProductIds']),
        ...mapMutations('entities/products', ['setSingleVisisble','updateSelectedCategories', 'updateSelectedDeliveryDates', 'updateSelectedBuyerGroups']),
        productImg(variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        onViewSingle(product) {
            this.setCurrentProductId(product.id)
            this.setAvailableProductIds(this.products.map(x => x.id)) // Save array of available products
            this.setSingleVisisble(true)
        },
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .products-table-wrapper {
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
