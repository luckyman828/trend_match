window.Vue = require('vue');
import store from './store/index';
import VueRouter from 'vue-router';

Vue.use(VueRouter)

Vue.component('app', require('./App.vue').default);

// Define global variable
// Vue.mixin({
//   data: function() {
//     return {
//       permissionLevel_write_final_actions: 3,
//       permissionLevel_see_teams: 3,
//     }
//   }
// })

// 1. Define route components.
// These can be imported from other files
import Collection from './components/screens/Collection'
import Catalogue from './components/screens/Catalogue'
import Teams from './components/screens/Teams'
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
    routes // short for `routes: routes`
  })

  router.beforeEach((to, from, next) => {
    const authUser = window.auth_user
    // Guard paths
    if ( ( to.path == '/teams' && authUser.role_id < 2 ) || ( to.name == 'catalogue' && authUser.assigned_room_id == null) )
        next('/collection')
    else next()
  })



const app = new Vue({
    store,
    router,
    el: '#app'
});