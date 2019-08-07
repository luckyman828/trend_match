window.Vue = require('vue');
import store from './store/index';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

Vue.component('app', require('./App.vue').default);

// 1. Define route components.
// These can be imported from other files
import Collection from './components/screens/Collection'
import Catalogue from './components/screens/Catalogue'
import Teams from './components/screens/Teams'

const routes = [
  { path: '/catalogue/:catalogueId', name: 'catalogue', component: Catalogue },
  { path: '/collection', component: Collection },
  { path: '/teams', component: Teams },
  { path: '*', redirect: '/collection'}
]

  const router = new VueRouter({
    routes // short for `routes: routes`
  })

const app = new Vue({
    store,
    router,
    el: '#app'
});