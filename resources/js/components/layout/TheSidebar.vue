<template>
  <div class="vue-component-sidebar sidebar theme-dark">
    <div class="nav">
        <div class="top-items">
            <!-- <TheNavbarLogo class="sidebar-item"/> -->
            <div class="sidebar-item logo inactive">
              <img class="hide-screen-sm" src="/images/kollekt_logo_small.svg" />
              <img class="show-screen-sm" style="height: 100%; width: 52px; margin-left: -8px" src="/images/kollekt_logo_00_1024x1024.svg" />
            </div>

            <div class="sidebar-item">
              <router-link to="/files" class="inner" 
              v-tooltip.right="displayTooltips && 'Files'">
                <i class="fas fa-folder"></i><span>Files</span>
              </router-link>
            </div>

            <div class="sidebar-item">
              <router-link v-if="authUserWorkspaceRole == 'Admin'" to="/teams" class="inner"
              v-tooltip.right="displayTooltips && 'Teams'">
                <i class="fas fa-users"></i><span>Teams</span>
              </router-link>
            </div>
            <div class="sidebar-item">
              <router-link to="/users" class="inner"
              v-tooltip.right="displayTooltips && 'Users'">
                <i class="fas fa-user"></i><span>Users</span>
              </router-link>
            </div>
            <v-popover placement="right" trigger="click"
            v-tooltip.right="displayTooltips && 'Change workspace'">
                <div class="sidebar-item">
                  <a class="inner">
                      <i class="fas fa-building"></i>
                      <span>{{currentWorkspace.title | truncate(12)}}</span>
                  </a>
                </div>
                <BaseSelectButtons slot="popover" type="radio" :options="workspaces" :value="currentWorkspaceIndex"
                optionNameKey="title" optionValueKey="index" :submitOnChange="true"
                @submit="setCurrentWorkspaceIndex($event)" v-close-popover/>
            </v-popover>
      </div>
    </div>
    <div class="bottom-nav">
        <div class="sidebar-item">
          <a class="inner" @click="drawerExpanded = !drawerExpanded" v-tooltip.right="'Click for more options'">
              <i class="fas primary" :class="authUserWorkspaceRole == 'Admin' ? 'fa-crown' : 'fa-user'"></i>
              <span class="user">{{authUser.name}}</span>
          </a>
        </div>
        <div class="bottom-drawer" :class="{collapsed: !drawerExpanded}">
          <div class="sidebar-item">
            <a class="inner" @click="logout">
                <i class="far fa-sign-out fa-flip-horizontal"></i>
                <span>Sign out</span>
            </a>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TheNavbarLogo from './TheNavbarLogo'

import SignoutButton from './SignoutButton'

export default {
  name: "sidebar",
  components: {
    SignoutButton,
    TheNavbarLogo,
  },
  data: function () { return {
    drawerExpanded: false,
  }},
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('workspaces', ['workspaces', 'authUserWorkspaceRole', 'currentWorkspace', 'currentWorkspaceIndex']),
    displayTooltips () {
      return window.innerWidth <= 1400
    }
  },
  methods: {
     ...mapActions('auth', ['logout']),
    ...mapActions('workspaces', ['setCurrentWorkspaceIndex']),
  }
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.sidebar {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: $bgModuleDark;
}
.sidebar-item {
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    .inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: $fontSoftOnDark;
      text-align: center;
      width: 60px;
      min-height: 60px;
      padding: 8px 0;
      border-radius: 4px;
      cursor: pointer;
      &.router-link-active {
        color: $font;
        i {
          color: $primary;
        }
      }
      &.inactive {
        cursor: default;
      }
      &:not(.inactive):hover, &.router-link-active {
          background: white;
          color: $font;
      }
    }
    &.logo {
      height: 60px;
    }
    i {
        font-size: 16px;
        margin-bottom: 8px;
        color: $iconSoftOnDark;
    }
    @media screen and (max-width: $screenSm) {
        flex-direction: row;
        justify-content: flex-start;
        // &:not(.inactive):hover {
        //     width: 160px;
        //     position: relative;
        //     z-index: 99;
        //     box-shadow: 0 3px 6px rgba(0,0,0,.2);
        //     span {
        //         display: inline;
        //     }
        // }
        i {
            // margin-bottom: 0;
            // margin-right: 8px;
            // width: 36px;
            // min-width: 36px;
        }
        span {
            display: none;
        }
    }
}
.bottom-drawer {
    transition: .2s;
    position: relative;
    overflow: hidden;
    height: 80px;
    &.collapsed {
        height: 0;
    }
}
.v-popover .trigger:hover i {
  color: $iconSoftOnDark;
}

</style>