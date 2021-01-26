// require('./bootstrap')

window.Vue = require('vue')

window.axios = require('axios')
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// let csrfToken = document.head.querySelector('meta[name="csrf-token"]')
// if (csrfToken) {
//     window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content
// } else {
//     console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
// }

window.axios.defaults.baseURL = process.env.MIX_API_BASE_URL

window.XLSX = require('xlsx')

window.focusVisible = require('focus-visible')

import { DateTime } from 'luxon'
window.DateTime = DateTime
import Duration from 'luxon/src/duration.js'
window.Duration = Duration

import store from './store/index'
import router from './router'

// import VueDragscroll from 'vue-dragscroll'
// Vue.use(VueDragscroll)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import UUID from 'vue-uuid'
Vue.use(UUID)

import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

import dragscrollDirective from './directives/dragscrollDirective'
Vue.use(dragscrollDirective)
import clickOutsideDirective from './directives/clickOutsideDirective'
Vue.use(clickOutsideDirective)
import tooltipTriggerDirective from './directives/tooltipTriggerDirective'
Vue.use(tooltipTriggerDirective)
import horizontalScrollDirective from './directives/horizontalScrollDirective'
Vue.use(horizontalScrollDirective)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
Vue.use(VueVirtualScroller)

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

import vueVimeoPlayer from 'vue-vimeo-player'
Vue.use(vueVimeoPlayer)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip, {
    defaultBoundariesElement: 'window',
    popover: {
        defaultTrigger: 'hover focus',
    },
})

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
Vue.use(DatePicker)

Vue.component('app', require('./App.vue').default)

// Automatically import base components
const requireComponent = require.context(
    // The relative path of the components folder
    './components',
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base component filenames
    /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)

    // Get PascalCase name of component
    const componentName =
        // Gets the file name regardless of folder depth
        fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')

    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    )
})

// Check if the user is logged in
const token = localStorage.getItem('user-token')
if (token) {
    axios.defaults.headers.common['Authorization'] = token
}

// Define global filters
Vue.filter('truncate', function(value, limit) {
    if (value.length > limit) {
        value = value.substring(0, limit - 2) + '..'
    }

    return value
})
Vue.filter('formatDate', function(value) {
    return new Date(value).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})
Vue.filter('getPrettyDate', function(value) {
    return value ? DateTime.fromFormat(value, 'yyyy-MM-dd').toFormat('MMMM yyyy') : ''
})
Vue.filter('thousandSeparated', function(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})
Vue.filter('timestampify', function(value) {
    // Only include hours if we have any
    if (value >= 3600) {
        return new Date(value * 1000).toISOString().substr(11, 8)
    }

    return new Date(value * 1000).toISOString().substr(14, 5)
})
Vue.filter('rounded', function(value, decimalCount) {
    const amountOfDecimals = decimalCount != null ? decimalCount : 0
    return Number(Math.round(value + `e${amountOfDecimals}`) + `e-${amountOfDecimals}`)
})

// Define global mixins
Vue.mixin({
    methods: {
        separateThousands(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        getPrettyDate(date, style) {
            if (!date) return ''
            if (!style) {
                return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMMM yyyy')
            }
            if (style == 'short') {
                return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMM yy')
            }
            if (style == 'medium') {
                return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMM yyyy')
            }
            return DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('MMMM yyyy')
        },
        chunkArray(array, chunk_size) {
            return Array(Math.ceil(array.length / chunk_size))
                .fill()
                .map((_, index) => index * chunk_size)
                .map(begin => array.slice(begin, begin + chunk_size))
        },
        generateVariantName({ colorName, variantName }) {
            const nameComponents = []
            if (colorName) nameComponents.push(colorName)
            if (variantName) nameComponents.push(variantName)
            return nameComponents.join([' - '])
        },
        copyToClipboard(value) {
            let tempInput = document.createElement('input')
            tempInput.value = value
            document.body.appendChild(tempInput)
            tempInput.select()
            document.execCommand('copy')
            document.body.removeChild(tempInput)
        },
        getNextArrayIndex(array, currentIndex, forwards) {
            // Special cases
            // Forwards and last
            if (array.length == currentIndex + 1 && forwards) return 0
            if (currentIndex == 0 && !forwards) return array.length - 1
            return forwards ? currentIndex + 1 : currentIndex - 1
        },
    },
})

const app = new Vue({
    store,
    router,
    el: '#app',
})
