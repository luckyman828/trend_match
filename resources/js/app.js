window.Vue = require('vue');

import store from './store/index';

Vue.component('app', require('./App.vue').default);

const app = new Vue({
    store,
    el: '#app'
});