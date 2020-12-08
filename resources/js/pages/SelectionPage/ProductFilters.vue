<template>
    <v-popover trigger="manual" :open="showFilters" :autoHide="false" class="product-filters">
        <button class="ghost trigger" @click="toggleShowFilters">
            <i class="far fa-filter"></i>
            <span>Filters</span>
            <div class="circle primary xs" v-if="activeFiltersCount > 0">
                {{ activeFiltersCount }}
            </div>
        </button>
        <BaseContextMenu slot="popover" :inline="true" v-click-outside="hideFilters">
            <div class="item-group">
                <v-popover trigger="click" :disabled="availableCategories.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-filter"
                        :disabled="availableCategories.length <= 0"
                        disabledTooltip="No categories available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Category</span>
                        <span v-if="selectedCategories.length > 0" class="filter-counter circle primary xs">
                            <span>{{ selectedCategories.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            style="width: 200px; padding-top: 8px;"
                            submitOnChange="true"
                            :options="availableCategories"
                            v-model="selectedCategories"
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
                        <span v-if="selectedDeliveryDates.length > 0" class="filter-counter circle primary xs">
                            <span>{{ selectedDeliveryDates.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :displayFunction="getPrettyDate"
                            :options="availableDeliveryDates"
                            v-model="selectedDeliveryDates"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group">
                <v-popover trigger="click" :disabled="availableBuyerGroups.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-box"
                        :disabled="availableBuyerGroups.length <= 0"
                        disabledTooltip="No buyer groups available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Buyer group</span>
                        <span v-if="selectedBuyerGroups.length > 0" class="filter-counter circle primary xs">
                            <span>{{ selectedBuyerGroups.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="availableBuyerGroups"
                            v-model="selectedBuyerGroups"
                        />
                    </template>
                </v-popover>
            </div>

            <CustomProductDataFilter v-for="field in customFields" :key="field" :field="field" />

            <!-- <div class="item-group" v-for="(field, index) in customFields" :key="index">
                <v-popover trigger="click" :disabled="availableCustomFieldValues[index].length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-box"
                        :disabled="availableCustomFieldValues[index].length <= 0"
                        disabledTooltip="No buyer groups available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>{{ field }}</span>
                        <span v-if="selectedCustomFieldValues[0].length > 0" class="filter-counter circle primary xs">
                            <span>{{ selectedCustomFieldValues[0].length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="availableCustomFieldValues[index]"
                            v-model="selectedCustomFieldValues[0]"
                        />
                    </template>
                </v-popover>
            </div> -->

            <div class="item-group" v-if="$route.name == 'selection'">
                <v-popover trigger="click" :disabled="availableBuyerGroups.length <= 0" placement="right">
                    <BaseContextMenuItem
                        iconClass="far fa-tag"
                        :disabled="availableBuyerGroups.length <= 0"
                        disabledTooltip="No ticket labels available"
                        @click="showAdvancedFilters = false"
                    >
                        <span>Ticket label</span>
                        <span v-if="selectedTicketLabels.length > 0" class="filter-counter circle primary xs">
                            <span>{{ selectedTicketLabels.length }}</span>
                        </span>
                    </BaseContextMenuItem>
                    <template slot="popover">
                        <BaseSelectButtons
                            submitOnChange="true"
                            :options="ticketLabels"
                            v-model="selectedTicketLabels"
                        />
                    </template>
                </v-popover>
            </div>

            <div class="item-group" v-if="$route.name == 'selection'">
                <v-popover
                    trigger="click"
                    placement="right"
                    popoverInnerClass="tooltip-inner popover-inner"
                    :open="showAdvancedFilters"
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
                    selectedCategories.length > 0 ||
                        selectedDeliveryDates.length > 0 ||
                        selectedBuyerGroups.length > 0 ||
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
    props: ['distributionScope'],
    data: function() {
        return {
            advancedFilterKey: 0,
            showFilters: false,
            showAdvancedFilters: false,
        }
    },
    computed: {
        ...mapGetters('requests', {
            availableTicketLabels: 'getAvailableRequestLabels',
        }),
        ...mapGetters('workspaces', {
            customFields: 'getCustomProductFields',
        }),
        ticketLabels() {
            return ['no label'].concat(this.availableTicketLabels)
        },
        ...mapGetters('products', [
            'availableCategories',
            'availableDeliveryDates',
            'availableBuyerGroups',
            'getHasAdvancedFilter',
            'getAdvancedFilter',
            'getSelectedTicketLabels',
        ]),
        selectedCategories: {
            get() {
                return this.$store.getters['products/selectedCategories']
            },
            set(value) {
                this.updateSelectedCategories(value)
            },
        },
        selectedDeliveryDates: {
            get() {
                return this.$store.getters['products/selectedDeliveryDates']
            },
            set(value) {
                this.updateSelectedDeliveryDates(value)
            },
        },
        selectedBuyerGroups: {
            get() {
                return this.$store.getters['products/selectedBuyerGroups']
            },
            set(value) {
                this.updateSelectedBuyerGroups(value)
            },
        },
        selectedTicketLabels: {
            get() {
                return this.$store.getters['products/getSelectedTicketLabels']
            },
            set(value) {
                this.SET_SELECTED_TICKET_LABELS(value)
            },
        },
        selectedTicketLabels: {
            get() {
                return this.$store.getters['products/getSelectedTicketLabels']
            },
            set(value) {
                this.SET_SELECTED_TICKET_LABELS(value)
            },
        },
        activeFiltersCount() {
            const advancedFilterCount = this.getAdvancedFilter ? this.getAdvancedFilter.length : 0
            return (
                this.selectedBuyerGroups.length +
                this.selectedCategories.length +
                this.selectedDeliveryDates.length +
                this.selectedTicketLabels.length +
                advancedFilterCount
            )
        },
    },
    methods: {
        ...mapMutations('products', [
            'updateSelectedCategories',
            'updateSelectedDeliveryDates',
            'updateSelectedBuyerGroups',
            'SET_SELECTED_TICKET_LABELS',
            'SET_ADVANCED_FILTER',
        ]),
        resetFilters() {
            this.selectedCategories = []
            this.selectedDeliveryDates = []
            this.selectedBuyerGroups = []
            this.SET_SELECTED_TICKET_LABELS([])
            this.advancedFilterKey++
            this.SET_ADVANCED_FILTER()
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
