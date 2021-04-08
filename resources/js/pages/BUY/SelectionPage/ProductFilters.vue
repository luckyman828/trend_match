<template>
    <v-popover trigger="manual" :open="showFilters" :autoHide="false" class="product-filters">
        <slot :activeFiltersCount="activeFiltersCount" :activate="toggleShowFilters" />
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="hideFilters">
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
                <ProductFilterItem v-for="filter in productFilters" :key="filter.key" :filter="filter" />
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductFilterItem from './ProductFilterItem'
export default {
    name: 'buy.ProductFilters',
    components: { ProductFilterItem },
    data: function() {
        return {
            advancedFilterKey: 0,
            showFilters: false,
            showAdvancedFilters: false,
        }
    },
    computed: {
        ...mapGetters('productFilters', {
            productFilters: 'getProductFilters',
            filtersActive: 'getFiltersAreActive',
        }),
        activeFiltersCount() {
            return this.productFilters.reduce((total, filter) => {
                return filter.selected.length > 0 ? total++ : total
            }, 0)
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
        ...mapMutations('productFilters', ['SET_IS_EXACT_MATCH', 'SET_IS_INVERSE_MATCH', 'SET_FILTER_VARIANTS']),
        ...mapActions('productFilters', ['fetchAvailableProductFilters']),
        resetFilters() {
            this.productFilters.map(filter => (filter.selected = []))
            // this.CLEAR_PRODUCT_FILTERS()
            // this.RESET_CUSTOM_FILTERS()
        },
        toggleShowFilters() {
            console.log('toggle show filters')
            this.showFilters = !this.showFilters
        },
        hideFilters() {
            console.log('hide filters')
            // this.showFilters = false
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
.input-wrapper {
    width: 100%;
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
