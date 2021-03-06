window.Vue = require('vue')

window.axios = require('axios')
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

import globalVars from '../../global.vars'
Vue.prototype.$globalVars = globalVars

// let csrfToken = document.head.querySelector('meta[name="csrf-token"]')
// if (csrfToken) {
//     window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content
// } else {
//     console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
// }

window.axios.defaults.baseURL = process.env.MIX_API_BASE_URL

window.XLSX = require('xlsx')

window.focusVisible = require('focus-visible')

import { DateTime, Interval, Duration } from 'luxon'
window.DateTime = DateTime
window.Interval = Interval
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
import hoverDirective from './directives/hoverDirective'
Vue.use(hoverDirective)
import showContextmenu from './directives/showContextmenu'
Vue.use(showContextmenu)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
Vue.use(VueVirtualScroller)

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

import vueVimeoPlayer from 'vue-vimeo-player'
Vue.use(vueVimeoPlayer)

import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip, {
    defaultBoundariesElement: 'window',
    defaultOffset: 4,
    defaultDelay: { show: 100, hide: 0 },
    defaultContainer: '#app',
    popover: {
        defaultTrigger: 'hover focus',
        defaultBaseClass: 'base-popover popover',
        defaultOffset: 0,
        defaultContainer: '#app',
    },
})

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
Vue.use(DatePicker)

// Purely for testing
window.scanTest = ean => {
    ean = ean.toString()
    for (let i = 0; i < ean.length; i++) {
        // console.log(ean.substr(i, 1))
        let keyEvent = new KeyboardEvent('keydown', { code: ean[i] })
        document.dispatchEvent(keyEvent)
    }
}

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
try {
    const token = localStorage.getItem('user-token')
    if (token) {
        axios.defaults.headers.common['Authorization'] = token
    }
} catch (e) {}

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
        getPrettyTimestamp(timestamp, style) {
            return DateTime.fromISO(timestamp, { zone: 'UTC' })
                .toLocal()
                .toFormat('HH:mm - dd MMM yyyy')
        },
        getPrettyDuration(duration) {
            const luxonDuration = Duration.fromObject({ minutes: duration })
                .shiftTo('hours', 'minutes')
                .toObject()
            return `${luxonDuration.hours ? `${luxonDuration.hours} hrs ` : ''}${luxonDuration.minutes} min`
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
        async _delay(duration) {
            await new Promise(resolve => setTimeout(() => resolve(), duration))
        },
    },
})

// Translations
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import en from './locales/en'
import da from './locales/da'
import sv from './locales/sv'
import no from './locales/no'
import de from './locales/de'
import nl from './locales/nl'
const localeMessages = { en, da, sv, no, de, nl }

// Create i18n instance
const i18n = new VueI18n({
    locale: navigator.language.split('-')[0], // set locale
    fallbackLocale: {
        'nb-NO': ['no'],
        'nn-NO': ['no'],
        default: 'en',
    },
    messages: localeMessages,
})

// Create a vue root instance
const app = new Vue({
    i18n,
    store,
    router,
    el: '#app',
})
