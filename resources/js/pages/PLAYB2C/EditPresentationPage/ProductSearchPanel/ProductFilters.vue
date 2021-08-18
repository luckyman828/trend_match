<template>
    <v-popover trigger="manual" :open="showFilters" :autoHide="false" class="product-filters" :handleResize="false">
        <slot :activeFilterCount="activeFiltersCount" :toggle="toggleShowFilters" />
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="hideFilters">
            <div class="item-group">
                <ProductFilterItem
                    v-for="filter in productFilters.filter(x => !x.isCustom)"
                    :key="filter.key"
                    :filter="filter"
                />
            </div>
            <div class="item-group" v-if="customFields.length > 0">
                <BaseContextMenuItem hotkey="KeyC" iconClass="far fa-magic" :hasSubmenu="true">
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

            <div class="item-group" v-if="filtersActive">
                <BaseContextMenuItem
                    iconClass="far fa-times"
                    color="danger"
                    @click="
                        resetFilters()
                        showFilters = false
                    "
                >
                    <span>Clear filters</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
    </v-popover>
</template>

<script>
import ProductFilterItem from './ProductFilterItem'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'productFilters',
    components: {
        ProductFilterItem,
    },
    data: function() {
        return {
            showFilters: false,
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
        }),
        ...mapGetters('products', ['products']),
    },
    methods: {
        ...mapMutations('productFilters', ['CLEAR_PRODUCT_FILTERS']),
        ...mapActions('productFilters', ['fetchAvailableProductFilters']),
        resetFilters() {
            this.CLEAR_PRODUCT_FILTERS()
            this.$emit('clear')
        },
        toggleShowFilters() {
            this.showFilters = !this.showFilters
        },
        hideFilters(e) {
            if (e && (e.target.classList.contains('popover') || !!e.target.closest('.popover'))) return
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
