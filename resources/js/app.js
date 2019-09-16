window.Vue = require('vue');
import store from './store/index';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

Vue.component('app', require('./App.vue').default);

// Global components
Vue.component('TooltipAlt2', require('./components/TooltipAlt2.vue').default);
Vue.component('Toggle', require('./components/Toggle.vue').default);

// Define global filters
Vue.filter( 'truncate', function (value, limit) {
  if (value.length > limit) {
    value = value.substring(0, (limit - 2)) + '..';
  }

  return value

})

// Define global mixins
// Vue.mixin({
//   methods: {
//     groupBy(prop) {
//       return this.reduce(function(groups, item) {
//         const val = item[prop]
//         groups[val] = groups[val] || []
//         groups[val].push(item)
//         return groups
//       }, {})
//     }
//   }
// })

// 1. Define route components.
// These can be imported from other files
// import Collection from './components/screens/Collection'
// import Catalogue from './components/screens/Catalogue'
// import Teams from './components/screens/Teams'
import TeamsLoader from './components/screens/loaders/TeamsLoader'
import FileLoader from './components/screens/loaders/FileLoader'
import FolderLoader from './components/screens/loaders/FolderLoader'

const routes = [
  { path: '/catalogue/:catalogueId', name: 'catalogue', component: FileLoader },
  { path: '/collection', name: 'collection', component: FolderLoader },
  { path: '/teams', name: 'teams', component: TeamsLoader },
  { path: '*', redirect: '/collection'}
]

  const router = new VueRouter({
    routes, // short for `routes: routes`
    // mode: 'history' // remove '#' from urls. To enable this we need some server configuration
    // link here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
  })

  router.beforeEach((to, from, next) => {
    const authUser = window.auth_user
    // Guard paths
    if ( ( to.path == '/teams' && authUser.role_id < 2 ) )
        next('/collection'),
        console.log('acces denied')
    else next()
  })



const app = new Vue({
    store,
    router,
    el: '#app'
});