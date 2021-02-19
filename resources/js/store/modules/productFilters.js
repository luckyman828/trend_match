export default {
    namespaced: true,

    state: {
        filterCategories: [],
        filterDeliveryDates: [],
        filterBrands: [],
        filterBuyerGroups: [],
        filterSelectionIds: [],
        filterProductLabels: [],
        filterTicketLabels: [],
        advancedFilter: null,
        unreadOnly: false,
        hideCompleted: false,
        noImagesOnly: false,
        productActionFilter: 'overview',
        openTicketsOnly: false,
        filterCustomFieldValues: {},
    },

    getters: {
        getFiltersAreActive: (state, getters) => {
            const totalFilterCount =
                getters.getAdvancedFilterCount +
                getters.getCustomValueFilterCount +
                getters.getFilterCategories.length +
                getters.getFilterDeliveryDates.length +
                getters.getFilterBuyerGroups.length +
                getters.getFilterBrands.length +
                getters.getFilterProductLabels.length +
                getters.getFilterTicketLabels.length +
                getters.getFilterSelectionIds.length +
                (getters.unreadOnly ? 1 : 0) +
                (getters.openTicketsOnly ? 1 : 0) +
                (getters.hideCompleted ? 1 : 0) +
                (getters.openTicketsOnly ? 1 : 0) +
                (getters.noImagesOnly ? 1 : 0)
            return totalFilterCount > 0
        },
        getAdvancedFilterCount: (state, getters) => (getters.getAdvancedFilter ? getters.getAdvancedFilter.length : 0),
        getCustomValueFilterCount: (state, getters) => {
            return Object.keys(getters.getAllCustomValueFilters).reduce((acc, curr) => {
                return (acc += getters.getAllCustomValueFilters[curr].length)
            }, 0)
        },
        getFilterCategories: state => state.filterCategories,
        getFilterDeliveryDates: state => state.filterDeliveryDates,
        getFilterBuyerGroups: state => state.filterBuyerGroups,
        getFilterBrands: state => state.filterBrands,
        getFilterSelectionIds: state => state.filterSelectionIds,
        getHasAdvancedFilter: state => !!state.advancedFilter && state.advancedFilter.length > 0,
        getFilterProductLabels: state => state.filterProductLabels,
        getFilterTicketLabels: state => state.filterTicketLabels,
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
        getAllCustomValueFilters: state => {
            return state.filterCustomFieldValues
        },
    },

    actions: {},

    mutations: {
        SET_FILTER_CATEGORIES(state, payload) {
            state.filterCategories = payload
        },
        SET_FILTER_DELIVERY_DATES(state, payload) {
            state.filterDeliveryDates = payload
        },
        SET_FILTER_BUYER_GROUPS(state, payload) {
            state.filterBuyerGroups = payload
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
        SET_OPEN_TICKETS_ONLY(state, payload) {
            state.openTicketsOnly = payload
        },
        SET_PRODUCT_ACTION_FILTER(state, payload) {
            state.productActionFilter = payload
        },
        SET_FILTER_PRODUCT_LABELS(state, labels = []) {
            state.filterProductLabels = labels
        },
        SET_FILTER_TICKET_LABELS(state, labels = []) {
            state.filterTicketLabels = labels
        },
        SET_NO_IMAGES_ONLY(state, boolean) {
            state.noImagesOnly = boolean
        },
        SET_FILTER_BRANDS(state, brands) {
            state.filterBrands = brands
        },
        SET_FILTER_CUSTOM_FIELD_VALUES(state, { field, value }) {
            Vue.set(state.filterCustomFieldValues, field, value)
        },
        RESET_CUSTOM_FILTERS(state) {
            Object.keys(state.filterCustomFieldValues).map(key => {
                state.filterCustomFieldValues[key] = []
            })
        },
        CLEAR_PRODUCT_FILTERS(state) {
            state.filterCategories = []
            state.filterDeliveryDates = []
            state.filterBrands = []
            state.filterBuyerGroups = []
            state.filterSelectionIds = []
            state.filterProductLabels = []
            state.filterTicketLabels = []
            state.advancedFilter = null
            state.unreadOnly = false
            state.hideCompleted = false
            state.noImagesOnly = false
            state.productActionFilter = 'overview'
            state.openTicketsOnly = false
            state.filterCustomFieldValues = {}
        },
    },
}
