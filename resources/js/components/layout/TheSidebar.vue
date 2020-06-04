<template>
  <div class="vue-component-sidebar sidebar theme-dark">
    <div class="nav">
        <div class="top-items">
            <router-link to="/files" class="sidebar-item">
              <i class="fas fa-folder"></i><span>Files</span>
            </router-link>
            <router-link v-if="authUserWorkspaceRole == 'Admin'" to="/teams" class="sidebar-item">
              <i class="fas fa-users"></i><span>Teams</span>
            </router-link>
            <router-link to="/users" class="sidebar-item">
              <i class="fas fa-user"></i><span>Users</span>
            </router-link>
            <v-popover placement="right" trigger="click">
                <a class="sidebar-item">
                    <i class="fas fa-building"></i>
                    <span>{{currentWorkspace.title | truncate(12)}}</span>
                </a>
                <BaseSelectButtons slot="popover" type="radio" :options="workspaces" :value="currentWorkspaceIndex"
                optionNameKey="title" optionValueKey="index" :submitOnChange="true"
                @submit="setCurrentWorkspaceIndex($event)" v-close-popover/>
            </v-popover>
      </div>
    </div>
    <div class="bottom-nav">
        <a class="sidebar-item" @click="drawerExpanded = !drawerExpanded" v-tooltip="{content: 'Click for more options', delay: {show: 300}}">
            <i class="fas primary" :class="authUserWorkspaceRole == 'Admin' ? 'fa-crown' : 'fa-user'"></i>
            <span class="user">{{authUser.name}}</span>
        </a>
        <div class="bottom-drawer" :class="{collapsed: !drawerExpanded}">
            <a class="sidebar-item" @click="logout">
                <i class="far fa-sign-out fa-flip-horizontal"></i>
                <span>Sign out</span>
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import SignoutButton from './SignoutButton'

export default {
  name: "sidebar",
  components: {
    SignoutButton,
  },
  data: function () { return {
    drawerExpanded: false,
  }},
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('workspaces', ['workspaces', 'authUserWorkspaceRole', 'currentWorkspace', 'currentWorkspaceIndex']),
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80px;
    width: 100%;
    font-size: 12px;
    color: $fontSoftOnDark;
    padding: 0 8px;
    text-align: center;
    cursor: pointer;
    i {
        font-size: 16px;
        margin-bottom: 8px;
        color: $iconSoftOnDark;
    }
    &:hover, &.router-link-active {
        background: $bgModuleActiveDark;
    }
    &.router-link-active {
      color: $fontModuleActiveOnDark;
      i {
        color: $iconModuleActiveOnDark;
      }
    }
    @media screen and (max-width: $screenSm) {
        flex-direction: row;
        justify-content: flex-start;
        transition: width .2s;
        &:hover {
            width: 160px;
            position: relative;
            z-index: 99;
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            span {
                display: inline;
            }
        }
        i {
            margin-bottom: 0;
            margin-right: 8px;
            width: 36px;
            min-width: 36px;
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

</style>