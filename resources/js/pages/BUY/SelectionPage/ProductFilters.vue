<template>
    <v-popover trigger="manual" :open="showFilters" :autoHide="false" class="product-filters">
        <slot :activeFiltersCount="activeFiltersCount" :activate="toggleShowFilters" />
        <!-- <button class="ghost trigger">
            <i class="far fa-filter"></i>
            <span>Filters</span>
            <div class="circle primary xs" v-if="activeFiltersCount > 0">
                {{ activeFiltersCount }}
            </div>
        </button> -->
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="hideFilters">
            <div class="item-group">
                <div class="item-wrapper">
                    <BaseCheckboxInputField v-model="exactMatch">
                        <span>Exact match</span>
                    </BaseCheckboxInputField>
                </div>
                <div class="item-wrapper">
                    <BaseCheckboxInputField v-model="inverseMatch">
                        <span>Invert match</span>
                    </BaseCheckboxInputField>
                </div>
            </div>
            <div class="item-group">
                <v-popover trigger="click" :disabled="availableCategories.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-filter"
                        :disabled="availableCategories.length <= 0"
                        disabledTooltip="No categories available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Category</span>
                        <span v-if="filterCategories.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterCategories.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            style="width: 200px; padding-top: 8px;"
                            submitOnChange="true"
                            :options="availableCategories"
                            v-model="filterCategories"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group">
                <v-popover trigger="click" :disabled="availableDeliveryDates.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-calendar-week"
                        :disabled="availableDeliveryDates.length <= 0"
                        disabledTooltip="No delivery dates available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Delivery</span>
                        <span v-if="filterDeliveryDates.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterDeliveryDates.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :displayFunction="getPrettyDate"
                            :options="availableDeliveryDates"
                            v-model="filterDeliveryDates"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group">
                <v-popover trigger="click" :disabled="availableBrands.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-building"
                        :disabled="availableBrands.length <= 0"
                        disabledTooltip="No brands available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Brand</span>
                        <span v-if="filterBrands.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterBrands.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons submitOnChange="true" :options="availableBrands" v-model="filterBrands" />
                    </template>
                </v-popover>
            </div>

            <div class="item-group" v-if="availableBuyerGroups.length > 0">
                <v-popover trigger="click" :disabled="availableBuyerGroups.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-box"
                        :disabled="availableBuyerGroups.length <= 0"
                        disabledTooltip="No buyer groups available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Buyer group</span>
                        <span v-if="filterBuyerGroups.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterBuyerGroups.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="availableBuyerGroups"
                            v-model="filterBuyerGroups"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group" v-if="availableProductLabels.length > 0 || filterableProductLabels.length > 0">
                <v-popover trigger="click" :disabled="filterableProductLabels.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-tag"
                        :disabled="filterableProductLabels.length <= 0"
                        disabledTooltip="No product labels available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Product label</span>
                        <span v-if="filterProductLabels.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterProductLabels.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="productLabels"
                            v-model="filterProductLabels"
                            optionValueKey="value"
                            optionNameKey="name"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group" v-if="availableProductLabels.length > 0 || filterableVariantLabels.length > 0">
                <v-popover trigger="click" :disabled="filterableVariantLabels.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-tag"
                        :disabled="filterableVariantLabels.length <= 0"
                        disabledTooltip="No variant labels available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Variant label</span>
                        <span v-if="filterVariantLabels.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterVariantLabels.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="productLabels"
                            v-model="filterVariantLabels"
                            optionValueKey="value"
                            optionNameKey="name"
                        />
                    </template>
                </v-popover>
            </div>

            <CustomProductDataFilter v-for="(field, index) in customFields" :key="index" :field="field" />

            <div class="item-group" v-if="$route.name == 'selection' && (filterableTicketLabels > 0 || ticketsEnabled)">
                <v-popover trigger="click" :disabled="filterableTicketLabels.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-tag"
                        :disabled="filterableTicketLabels.length <= 0"
                        disabledTooltip="No ticket labels available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Ticket label</span>
                        <span v-if="filterTicketLabels.length > 0" class="filter-counter circle primary xs">
                            <span>{{ filterTicketLabels.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons submitOnChange="true" :options="ticketLabels" v-model="filterTicketLabels" />
                    </template>
                </v-popover>
            </div>

            <div class="item-group" v-if="$route.name == 'selection'">
                <v-popover
                    trigger="click"
                    placement="right"
                    popoverInnerClass="tooltip-inner popover-inner"
                    :open="showAdvancedFilters"
                    :boundariesElement="$root.$el.querySelector('#main')"
                    :autoHide="false"
                >
                    <BaseContextMenuItem iconClass="far fa-sliders-v" @click="showAdvancedFilters = true">
                        <span>Advanced Filters</span>
                        <div v-if="getHasAdvancedFilter" class="filter-counter circle primary xs">
                            <span>{{ getAdvancedFilter.length }}</span>
                        </div>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <ConditionalFilters
                            v-if="showAdvancedFilters"
                            :distributionScope="distributionScope"
                            :key="advancedFilterKey"
                            @close="showAdvancedFilters = false"
                        />
                    </template>
                </v-popover>
            </div>

            <div
                class="item-group"
                v-if="
                    filterCategories.length > 0 ||
                        filterDeliveryDates.length > 0 ||
                        filterBuyerGroups.length > 0 ||
                        getHasAdvancedFilter
                "
            >
                <BaseContextMenuItem
                    iconClass="far fa-times"
                    color="danger"
                    @click="
                        resetFilters()
                        showFilters = false
                        showAdvancedFilters = false
                    "
                >
                    <span>Clear filters</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
    </v-popover>
</template>

<script>
import ConditionalFilters from './ConditionalFilters'
import CustomProductDataFilter from './CustomProductDataFilter'
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'productFilters',
    components: {
        ConditionalFilters,
        CustomProductDataFilter,
    },
    props: ['distributionScope', 'ticketsEnabled'],
    data: function() {
        return {
            advancedFilterKey: 0,
            showFilters: false,
            showAdvancedFilters: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
            availableProductLabels: 'getAvailableProductLabels',
        }),
        ticketLabels() {
            return ['no label'].concat(this.filterableTicketLabels)
        },
        productLabels() {
            return ['no label'].concat(this.availableProductLabels).map((label, index) => {
                return { name: `${index} - ${label}`, value: label }
            })
        },
        ...mapGetters('products', ['products']),
        ...mapGetters('productFilters', [
            'availableCategories',
            'availableDeliveryDates',
            'availableBuyerGroups',
            'availableBrands',
            'getHasAdvancedFilter',
            'getAdvancedFilter',
            'getFilterTicketLabels',
            'getAllCustomValueFilters',
            'getAdvancedFilterCount',
            'getCustomValueFilterCount',
        ]),
        exactMatch: {
            get() {
                return this.$store.getters['productFilters/getIsExactMatch']
            },
            set(value) {
                this.SET_IS_EXACT_MATCH(value)
            },
        },
        inverseMatch: {
            get() {
                return this.$store.getters['productFilters/getIsInverseMatch']
            },
            set(value) {
                this.SET_IS_INVERSE_MATCH(value)
            },
        },
        filterCategories: {
            get() {
                return this.$store.getters['productFilters/getFilterCategories']
            },
            set(value) {
                this.SET_FILTER_CATEGORIES(value)
            },
        },
        filterDeliveryDates: {
            get() {
                return this.$store.getters['productFilters/getFilterDeliveryDates']
            },
            set(value) {
                this.SET_FILTER_DELIVERY_DATES(value)
            },
        },
        filterBuyerGroups: {
            get() {
                return this.$store.getters['productFilters/getFilterBuyerGroups']
            },
            set(value) {
                this.SET_FILTER_BUYER_GROUPS(value)
            },
        },
        filterBrands: {
            get() {
                return this.$store.getters['productFilters/getFilterBrands']
            },
            set(value) {
                this.SET_FILTER_BRANDS(value)
            },
        },
        filterProductLabels: {
            get() {
                return this.$store.getters['productFilters/getFilterProductLabels']
            },
            set(value) {
                this.SET_FILTER_PRODUCT_LABELS(value)
            },
        },
        filterVariantLabels: {
            get() {
                return this.$store.getters['productFilters/getFilterVariantLabels']
            },
            set(value) {
                this.SET_FILTER_VARIANT_LABELS(value)
            },
        },
        filterTicketLabels: {
            get() {
                return this.$store.getters['productFilters/getFilterTicketLabels']
            },
            set(value) {
                this.SET_FILTER_TICKET_LABELS(value)
            },
        },
        activeFiltersCount() {
            return (
                this.filterBuyerGroups.length +
                this.filterCategories.length +
                this.filterDeliveryDates.length +
                this.filterBrands.length +
                this.filterProductLabels.length +
                this.filterTicketLabels.length +
                this.getCustomValueFilterCount +
                this.getAdvancedFilterCount
            )
        },
        filterableTicketLabels() {
            const labels = []
            this.products.map(product => {
                product.requests.map(request => {
                    request.labels.map(label => {
                        const alreadyAdded = labels.includes(label)
                        if (!alreadyAdded) labels.push(label)
                    })
                })
            })
            return labels
        },
        filterableProductLabels() {
            const labels = []
            this.products.map(product => {
                if (!product.labels) return
                product.labels.map(label => {
                    const alreadyAdded = labels.includes(label)
                    if (!alreadyAdded) labels.push(label)
                })
            })
            return labels
        },
        filterableVariantLabels() {
            const labels = []
            this.products.map(product =>
                product.variants.map(variant => {
                    if (!variant.labels) return
                    variant.labels.map(label => {
                        const alreadyAdded = labels.includes(label)
                        if (!alreadyAdded) labels.push(label)
                    })
                })
            )
            return labels
        },
    },
    methods: {
        ...mapMutations('productFilters', [
            'SET_FILTER_CATEGORIES',
            'SET_FILTER_DELIVERY_DATES',
            'SET_FILTER_BUYER_GROUPS',
            'SET_FILTER_PRODUCT_LABELS',
            'SET_FILTER_VARIANT_LABELS',
            'SET_FILTER_TICKET_LABELS',
            'SET_FILTER_BRANDS',
            'SET_IS_EXACT_MATCH',
            'SET_IS_INVERSE_MATCH',
            'SET_ADVANCED_FILTER',
            'RESET_CUSTOM_FILTERS',
            'CLEAR_PRODUCT_FILTERS',
        ]),
        resetFilters() {
            this.CLEAR_PRODUCT_FILTERS()
            this.RESET_CUSTOM_FILTERS()
        },
        toggleShowFilters() {
            this.showFilters = !this.showFilters
        },
        hideFilters() {
            this.showFilters = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.filter-counter {
    margin-left: auto;
}
button.trigger {
    position: relative;
    .circle {
        margin-top: -24px;
        margin-right: -12px;
        margin-left: 4px;
        z-index: 1;
    }
}
</style>
