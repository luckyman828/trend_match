import Vue from 'vue'
import getPrettyDate from '../../helpers/getPrettyDate'
import getUniqueObjectValuesByKey from '../../helpers/getUniqueObjectValuesByKey'

export default {
    namespaced: true,

    state: {
        productFilters: [],
        filterVariants: false,
        isExactMatch: false,
        isInverseMatch: false,
        advancedFilter: null,
        unreadOnly: false,
        hideCompleted: false,
        noImagesOnly: false,
        filterTicketLabels: [],
        filterSelectionIds: [],
        productActionFilter: 'overview',
        buyView: 'all',
        openTicketsOnly: false,
        filterCustomFieldValues: {},
    },

    getters: {
        getProductFilters: (state, getters) => state.productFilters,
        getCurrentAppProductFilters: (state, getters, rootState, rootGetters) => {
            const currentApp = rootGetters['kollektApps/getCurrentApp']
            return state.productFilters.filter(filter => filter.apps.includes(currentApp.name))
        },
        getFiltersAreActive: (state, getters) => {
            return getters.getActiveFilterCount > 0
        },
        getActiveFilterCount: (state, getters) => {
            const totalFilterCount =
                getters.getAdvancedFilterCount +
                getters.getFilterSelectionIds.length +
                getters.getFilterTicketLabels.length +
                (getters.unreadOnly ? 1 : 0) +
                (getters.openTicketsOnly ? 1 : 0) +
                (getters.hideCompleted ? 1 : 0) +
                (getters.openTicketsOnly ? 1 : 0) +
                (getters.noImagesOnly ? 1 : 0) +
                getters.getProductFilters.reduce((total, filter) => {
                    return (total += filter.selected.length)
                }, 0)
            return totalFilterCount
        },
        getFilterVariants: state => state.filterVariants,
        getIsExactMatch: state => state.isExactMatch,
        getIsInverseMatch: state => state.isInverseMatch,
        getFilterTicketLabels: state => state.filterTicketLabels,
        getAdvancedFilterCount: (state, getters) => (getters.getAdvancedFilter ? getters.getAdvancedFilter.length : 0),
        getCustomValueFilterCount: (state, getters) => {
            return Object.keys(getters.getAllCustomValueFilters).reduce((acc, curr) => {
                return (acc += getters.getAllCustomValueFilters[curr].length)
            }, 0)
        },
        getFilterSelectionIds: state => state.filterSelectionIds,
        getHasAdvancedFilter: state => !!state.advancedFilter && state.advancedFilter.length > 0,
        getAdvancedFilter: state => state.advancedFilter,
        unreadOnly: state => state.unreadOnly,
        openTicketsOnly: state => state.openTicketsOnly,
        hideCompleted: state => state.hideCompleted,
        noImagesOnly: state => state.noImagesOnly,
        getProductActionFilter: state => state.productActionFilter,
        availableCategories(state, getters, rootState, rootGetters) {
            const products = rootGetters['products/getProducts']
            let uniqueCategories = []
            products.forEach(product => {
                if (product.category) {
                    const theCategory = product.category.toLowerCase()
                    const found = uniqueCategories.includes(theCategory)
                    if (!found) uniqueCategories.push(theCategory)
                }
            })
            return uniqueCategories
        },
        availableDeliveryDates(state, getters, rootState, rootGetters) {
            const products = rootGetters['products/getProducts']
            let uniqueDeliveryDates = []
            products.forEach(product => {
                product.delivery_dates.map(date => {
                    const found = uniqueDeliveryDates.find(x => x == date)
                    if (!found) {
                        uniqueDeliveryDates.push(date)
                    }
                })
            })
            return uniqueDeliveryDates.sort()
        },
        availableBrands(state, getters, rootState, rootGetters) {
            const products = rootGetters['products/getProducts']
            let unique = []
            products.forEach(product => {
                if (product.brand) {
                    const theBrand = product.brand.toLowerCase()
                    const found = unique.includes(theBrand)
                    if (!found) unique.push(theBrand)
                }
            })
            return unique
        },
        availableBuyerGroups(state, getters, rootState, rootGetters) {
            const products = rootGetters['products/getProducts']
            let unique = []
            products.forEach(product => {
                if (product.buying_group) {
                    const theBuyingGroup = product.buying_group.toLowerCase()
                    const found = unique.includes(theBuyingGroup)
                    if (!found) unique.push(theBuyingGroup)
                }
            })
            return unique
        },
        getFilterCustomFieldValues: state => key => {
            if (!state.filterCustomFieldValues[key]) {
                Vue.set(state.filterCustomFieldValues, key, [])
            }
            return state.filterCustomFieldValues[key]
        },
        getAllCustomValueFilters: state => state.filterCustomFieldValues,
        getBuyView: state => state.buyView,
    },

    actions: {
        async fetchAvailableProductFilters({ rootGetters, dispatch, commit }) {
            const filters = []
            // Fake an API response
            const response = [
                {
                    key: 'category',
                    displayName: 'Category',
                    icon: 'far fa-filter',
                    type: 'array',
                    scope: 'product',
                    apps: ['select', 'buy'],
                },
                {
                    key: 'delivery_dates',
                    displayName: 'Delivery',
                    icon: 'far fa-calendar-week',
                    type: 'array',
                    scope: 'product',
                    optionNameKey: 'name',
                    optionValueKey: 'value',
                    apps: ['select', 'buy'],
                },
                {
                    key: 'brand',
                    displayName: 'Brand',
                    icon: 'far fa-building',
                    type: 'array',
                    scope: 'product',
                    apps: ['select', 'buy'],
                },
                {
                    key: 'buying_group',
                    displayName: 'Buyer group',
                    icon: 'far fa-box',
                    type: 'array',
                    scope: 'product',
                    apps: ['select', 'buy'],
                },
                {
                    key: 'labels',
                    displayName: 'Product label',
                    icon: 'far fa-tag',
                    type: 'array',
                    scope: 'product',
                    apps: ['select', 'buy'],
                },
                {
                    key: 'variants.labels',
                    displayName: 'Variant label',
                    icon: 'far fa-tag',
                    type: 'array',
                    scope: 'variant',
                    apps: ['buy'],
                },
            ]
            filters.push(...response)

            // Get custom field filters
            const customFields = rootGetters['workspaces/getCustomProductFields']
            const customFieldFilters = customFields.map(field => {
                const keyBase = field.belong_to == 'Variant' ? 'variants.' : ''
                return {
                    key: `${keyBase}extra_data.${field.name}`,
                    displayName: field.display_name,
                    icon: 'far fa-magic',
                    type: field.type.toLowerCase(),
                    scope: field.belong_to.toLowerCase(),
                    isCustom: true,
                    apps: ['select', 'buy'],
                }
            })
            filters.push(...customFieldFilters)

            await dispatch('initFilters', filters)
            commit('SET_PRODUCT_FILTERS', filters)
        },
        initFilters({ rootGetters }, filters) {
            filters.map(filter => {
                Vue.set(filter, 'selected', [])

                Object.defineProperty(filter, 'options', {
                    get: function() {
                        const products = rootGetters['products/getAllProducts']
                        let options = products.reduce((options, product) => {
                            const productOptions = getUniqueObjectValuesByKey(product, filter.key)

                            // Test if the options are already added
                            const productOptionsFiltered = productOptions.filter(
                                option => option != null && !options.includes(option)
                            )
                            return [...options, ...productOptionsFiltered]
                        }, [])

                        const unsetText = 'N/A - Not set'

                        // Pretty format delivery dates
                        if (filter.key.search('delivery') >= 0) {
                            options = options.map(option => {
                                return {
                                    name: getPrettyDate(option),
                                    value: option,
                                }
                            })
                            return [{ name: unsetText, value: unsetText }, ...options]
                        }
                        return [unsetText, ...options]
                    },
                })
            })
        },
    },

    mutations: {
        SET_PRODUCT_FILTERS(state, payload) {
            state.productFilters = payload
        },
        SET_FILTER_VARIANTS(state, payload) {
            state.filterVariants = payload
        },
        SET_IS_EXACT_MATCH(state, payload) {
            state.isExactMatch = payload
        },
        SET_IS_INVERSE_MATCH(state, payload) {
            state.isInverseMatch = payload
        },
        SET_FILTER_SELECTION_IDS(state, payload) {
            state.filterSelectionIds = payload
        },
        SET_ADVANCED_FILTER(state, payload) {
            state.advancedFilter = payload
        },
        SET_UNREAD_ONLY(state, payload) {
            state.unreadOnly = payload
        },
        SET_HIDE_COMPLETED(state, payload) {
            state.hideCompleted = payload
        },
        SET_FILTER_TICKET_LABELS(state, labels = []) {
            state.filterTicketLabels = labels
        },
        SET_OPEN_TICKETS_ONLY(state, payload) {
            state.openTicketsOnly = payload
        },
        SET_PRODUCT_ACTION_FILTER(state, payload) {
            state.productActionFilter = payload
        },
        SET_NO_IMAGES_ONLY(state, boolean) {
            state.noImagesOnly = boolean
        },
        SET_BUY_VIEW(state, buyView) {
            state.buyView = buyView
        },
        CLEAR_PRODUCT_FILTERS(state) {
            state.isInverseMatch = false
            state.isExactMatch = false
            state.filterVariants = false
            state.advancedFilter = null
            state.unreadOnly = false
            state.filterTicketLabels = []
            state.hideCompleted = false
            state.noImagesOnly = false
            state.productActionFilter = 'overview'
            state.openTicketsOnly = false
            state.productFilters.map(filter => (filter.selected = []))
        },
    },
}
