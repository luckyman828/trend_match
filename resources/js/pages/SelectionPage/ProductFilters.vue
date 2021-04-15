<template>
    <v-popover trigger="manual" :open="showFilters" :autoHide="false" class="product-filters" :handleResize="false">
        <button class="ghost trigger" @click="toggleShowFilters">
            <i class="far fa-filter"></i>
            <span>Filters</span>
            <div class="circle primary xs" v-if="activeFiltersCount > 0">
                {{ activeFiltersCount }}
            </div>
        </button>
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="hideFilters">
            <div class="item-group">
                <ProductFilterItem
                    v-for="filter in productFilters.filter(x => !x.isCustom)"
                    :key="filter.key"
                    :filter="filter"
                />
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    v-if="customFields.length > 0"
                    hotkey="KeyC"
                    iconClass="far fa-magic"
                    :hasSubmenu="true"
                >
                    <span>Custom properties</span>
                    <template v-slot:submenu>
                        <div class="item-group">
                            <ProductFilterItem
                                v-for="filter in productFilters.filter(x => x.isCustom)"
                                :key="filter.key"
                                :filter="filter"
                            />
                        </div>
                    </template>
                </BaseContextMenuItem>
            </div>

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

            <div class="item-group" v-if="filtersActive">
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

            <div class="item-group">
                <div class="item-wrapper">
                    <BaseCheckboxInputField v-model="exactMatch" class="sm">
                        <span>Exact match</span>
                    </BaseCheckboxInputField>
                </div>
                <div class="item-wrapper">
                    <BaseCheckboxInputField v-model="inverseMatch" class="sm">
                        <span>Invert match</span>
                    </BaseCheckboxInputField>
                </div>
                <div class="item-wrapper">
                    <BaseCheckboxInputField v-model="filterVariants" class="sm">
                        <span>Filter variants</span>
                    </BaseCheckboxInputField>
                </div>
            </div>
        </BaseContextMenu>
    </v-popover>
</template>

<script>
import ConditionalFilters from './ConditionalFilters'
import ProductFilterItem from '../BUY/SelectionPage/ProductFilterItem'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'productFilters',
    components: {
        ConditionalFilters,
        ProductFilterItem,
    },
    props: ['distributionScope'],
    data: function() {
        return {
            advancedFilterKey: 0,
            showFilters: false,
            showAdvancedFilters: false,
        }
    },
    computed: {
        ...mapGetters('productFilters', {
            productFilters: 'getCurrentAppProductFilters',
            filtersActive: 'getFiltersAreActive',
            activeFiltersCount: 'getActiveFilterCount',
        }),
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
            availableProductLabels: 'getAvailableProductLabels',
        }),
        ...mapGetters('products', ['products']),
        ...mapGetters('productFilters', ['getHasAdvancedFilter', 'getAdvancedFilter', 'getAdvancedFilterCount']),
        ticketLabels() {
            return ['no label'].concat(this.filterableTicketLabels)
        },
        filterTicketLabels: {
            get() {
                return this.$store.getters['productFilters/getFilterTicketLabels']
            },
            set(value) {
                this.SET_FILTER_TICKET_LABELS(value)
            },
        },
        ticketsEnabled() {
            return this.filterableTicketLabels.length > 0
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
        exactMatch: {
            get() {
                return this.$store.getters['productFilters/getIsExactMatch']
            },
            set(value) {
                this.SET_IS_EXACT_MATCH(value)
            },
        },
        filterVariants: {
            get() {
                return this.$store.getters['productFilters/getFilterVariants']
            },
            set(value) {
                this.SET_FILTER_VARIANTS(value)
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
    },
    methods: {
        ...mapMutations('productFilters', [
            'SET_FILTER_TICKET_LABELS',
            'SET_ADVANCED_FILTER',
            'CLEAR_PRODUCT_FILTERS',
            'SET_IS_INVERSE_MATCH',
            'SET_FILTER_VARIANTS',
            'SET_IS_EXACT_MATCH',
        ]),
        ...mapActions('productFilters', ['fetchAvailableProductFilters']),
        resetFilters() {
            this.advancedFilterKey++
            this.SET_ADVANCED_FILTER()
            this.CLEAR_PRODUCT_FILTERS()
            this.$emit('clear')
        },
        toggleShowFilters() {
            this.showFilters = !this.showFilters
        },
        hideFilters(e) {
            if (e && (e.target.classList.contains('popover') || !!e.target.closest('.popover'))) return
            this.showAdvancedFilters = false
            this.showFilters = false
        },
    },
    created() {
        if (!this.productFilters || this.productFilters.length <= 0) {
            this.fetchAvailableProductFilters()
        }
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
