<template>
  <div class="vue-component-sidebar sidebar">
    <div class="nav">
      <div class="top-items">
        <router-link to="/collection" class="link"><i class="fas fa-signal-alt-3"></i> Collection</router-link>
        <!-- <router-link to="/catalogue">Catalogue</router-link> -->
        <!-- <router-link class="stick-to-bottom" to="/teams"><i class="fas fa-users"></i> Teams</router-link> -->

        <!-- Admin routes -->
        <template v-if="authUser != null">
          <template v-if="authUser.role_id >= 2">
            <router-link to="/teams" class="link"><i class="fas fa-users"></i> Teams</router-link>
          </template>
        </template>
      </div>
      <!-- <div class="bottom-items">
        <signout-button class="link"/>
      </div> -->
    </div>
    <div class="bottom-drawer" @click="drawerExpanded = !drawerExpanded" :class="{collapsed: !drawerExpanded}">
      <div class="header">
        <template v-if="!loadingUser">
          <strong class="user">{{authUser.name}}</strong>
          <p class="role">{{authUser.role.title}}</p>
        </template>
        <template v-else>
          <strong class="user">Fetching user</strong>
          <p class="role">Fethcing role</p>
        </template>
      </div>
      <div class="drawer">
        <signout-button class="link"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SignoutButton from './SignoutButton'
import AuthUser from '../store/models/AuthUser'
import Role from '../store/models/Role'

export default {
  name: "sidebar",
  components: {
    SignoutButton
  },
  data: function () { return {
    drawerExpanded: false,
  }},
  computed: {
    authUser() {
        return AuthUser.query().with('role').first()
    },
    roles() {
        return Role.query().all()
    },
    loadingUser () {
      let loading = false
      if (this.authUser == null) {
        loading = true
      } else {
        if (this.authUser.role == null)
          loading = true
      }
      return loading
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar {
  margin: 0;
  padding: 0;
  width: $sidebarWidth;
  height: calc(100% - 70px);
  background-color: white;
  position: fixed;
  left: 0;
  top: $navbarHeight;
  display: flex;
  flex-direction: column;
  z-index: 99;
  justify-content: space-between;

  .nav {
    justify-content: space-between;
    flex-direction: column;
    > * {
      width: 100%;
    }
  }

  @media screen and (max-width: 700px) {
    width: 100%;
    height: auto;
    position: relative;
  }

  @media screen and (max-width: 400px) {
    text-align: center;
    float: none;
  }
  .stick-to-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 200px;
  }
  .link {
    display: block;
    color: #a8a8a8;
    padding: 16px;
    text-decoration: none;
    border-left: solid 5px white;
    cursor: pointer;
    &.router-link-active {
      background-color: #f9f9f9;
      color: #1b1c1d;
      border-left: 5px solid #4facfe;
      i {
        color: $primary;
      }
    }
    &:hover {
      background: $light1;
      &:not(.router-link-active) {
        border-color: $light1;
      }
    }
    i {
      margin-right: 8px;
    }

    @media screen and (max-width: 700px) {
      float: left;
    }
  }
  .bottom-drawer {
    &.collapsed {
      .drawer {
        max-height: 0 !important;
      }
    } 
    .header {
      padding: 16px;
      cursor: pointer;
      &:hover {
        background: $light;
      }
    }
    .user {
      font-size: 14px;
      font-weight: 500;
    }
    .role {
      margin: auto;
      font-size: 14px;
      color: $dark2;
    }
    .drawer {
      background: $light1;
      box-shadow: -2px 0 6px rgba(0,0,0,.30);
      height: 200px;
      max-height: 200px;
      transition: .3s;
      .link {
        border-left: none;
        &:hover {
          background: white;
        }
      }
    }
    
  }
}
</style>