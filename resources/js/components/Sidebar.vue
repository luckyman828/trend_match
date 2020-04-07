<template>
  <div class="vue-component-sidebar sidebar">
    <div class="nav">
        <div class="top-items">
            <router-link to="/files" class="link"><i class="fas fa-folder"></i> Files</router-link>
            <router-link v-if="authUserWorkspaceRole == 'Admin'" to="/teams" class="link"><i class="fas fa-users"></i> Teams</router-link>
            <router-link to="/users" class="link"><i class="fas fa-user"></i> Users</router-link>
      </div>
      <div class="bottom-items" v-if="authUser && currentWorkspace">
        <Dropdown class="dropdown-parent left middle" ref="workspaceDropdown" v-if="authUser.workspaces.length > 1">
            <template v-slot:button="slotProps">
              <div class="link" @click="slotProps.toggle">
                  <i class="fas fa-building"></i>
                  <span>{{currentWorkspace.title | truncate(12)}}</span>
              </div>
            </template>
            <template v-slot:header="slotProps">
                <span>Switch workspace</span>
            </template>
            <template v-slot:body>
                <RadioButtons :options="authUser.workspaces" :currentOptionId="currentWorkspace.id" :optionNameKey="'name'" :optionValueKey="'id'" @change="setCurrentWorkspace({workspace_id: $event, user_id: authUser.id}); $refs.workspaceDropdown.toggle()"/>
            </template>
        </Dropdown>
      </div>
    </div>
    <div class="bottom-drawer" @click="drawerExpanded = !drawerExpanded" :class="{collapsed: !drawerExpanded}">
        <div class="header">
            <div class="hide-screen-sm">
                <strong class="user">{{authUser.name}}</strong>
                <p class="role">{{authUserWorkspaceRole}}</p>
            </div>
            <div class="show-screen-sm flex-center">
                <i class="fas primary" :class="authUserWorkspaceRole == 'Admin' ? 'fa-crown' : 'fa-user'"></i>
                <span class="user">{{authUser.name}}</span>
            </div>
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
import RadioButtons from './RadioButtons'
import Role from '../store/models/Role'

export default {
  name: "sidebar",
  components: {
    SignoutButton,
    RadioButtons,
  },
  data: function () { return {
    drawerExpanded: false,
  }},
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('workspaces', ['workspaces', 'authUserWorkspaceRole', 'currentWorkspace', 'currentWorkspaceIndex']),
  },
  methods: {
    ...mapActions('workspaces', ['setCurrentWorkspaceIndex']),
  }
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.sidebar {
  margin: 0;
  padding: 0;
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: space-between;

  .nav {
    justify-content: space-between;
    flex-direction: column;
    > * {
      width: 100%;
    }
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
    padding-left: 20px;
    text-decoration: none;
    cursor: pointer;
    width: 100%;
    &.router-link-active {
      background-color: #f9f9f9;
      color: #1b1c1d;
      box-shadow: 5px 0 0px 0 $primary inset;
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
        font-size: 16px;
        margin-right: 8px;
        width: 20px;
        text-align: center;
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
      padding-left: 20px;
      cursor: pointer;
      i {
        font-size: 16px;
      }
      &:hover {
        background: $light;
      }
    }
    .user {
      // font-size: 12px;
      line-height: 1.3;
      text-align: center;
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
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: $dark2;
        i {
            margin-bottom: 8px;
        }
    }
    
  }
  .dropdown-parent .dropdown {
    color: $primary;
  }
  // SMALL SCREENS AND HIGH DPI
    @media screen and (max-width: $screenSmall) {
      .header {
        padding: 16px 4px;
        font-size: 12px;
      }
        .link {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 16px 0;
            font-size: 12px;
            i {
                margin: 0;
                margin-bottom: 8px;
            }
            @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
            only screen and (-o-min-device-pixel-ratio: 13/10),
            only screen and (min-resolution: 120dpi)
            {
                font-size: 12px;
                i {
                    font-size: 16px;
                }
            }
        }
    }
}

</style>