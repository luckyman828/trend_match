<template>
    <div class="vue-component-sidebar sidebar theme-dark">
        <div class="nav">
            <div class="top-items">
                <div class="sidebar-item logo inactive">
                    <img class="hide-screen-sm" src="/images/kollekt_logo_small.svg" />
                    <img
                        class="show-screen-sm"
                        style="height: 100%; width: 52px; margin-left: -8px"
                        src="/images/kollekt_logo_00_1024x1024.svg"
                    />
                </div>

                <div class="sidebar-item">
                    <router-link :to="{ name: 'buy.files' }" class="inner" v-tooltip.right="displayTooltips && 'Files'">
                        <i class="fas fa-folder"></i><span>Files</span>
                    </router-link>
                </div>

                <div class="sidebar-item">
                    <router-link :to="{ name: 'buy.users' }" class="inner" v-tooltip.right="displayTooltips && 'Users'">
                        <i class="fas fa-user"></i><span>Users</span>
                    </router-link>
                </div>
                <v-popover placement="right" trigger="click" v-tooltip.right="displayTooltips && 'Change workspace'">
                    <div class="sidebar-item">
                        <a class="inner">
                            <i class="fas fa-building"></i>
                            <span>{{ currentWorkspace.title | truncate(12) }}</span>
                        </a>
                    </div>
                    <BaseSelectButtons
                        :search="workspaces.length > 5"
                        :focusSearchOnMount="workspaces.length > 5"
                        slot="popover"
                        type="radio"
                        :options="workspaces"
                        :value="currentWorkspaceIndex"
                        optionNameKey="title"
                        optionValueKey="index"
                        :submitOnChange="true"
                        @submit="setCurrentWorkspaceIndex($event)"
                        v-close-popover
                    />
                </v-popover>
            </div>
        </div>
        <div class="bottom-nav">
            <div class="sidebar-item">
                <div
                    class="inner"
                    @click="
                        SHOW_CHANGELOG(true)
                        onReadChangelog()
                    "
                    v-tooltip.right="displayTooltips && `What's new`"
                >
                    <i class="fas fa-gift"></i>
                    <span>What's new</span>
                    <div class="unread-circle circle xxs red" v-if="changelogUnread" />
                </div>
            </div>
            <div class="sidebar-item" v-if="getRealWorkspaceRole == 'Owner' || getIsSystemAdmin">
                <router-link
                    :to="{ name: 'settings' }"
                    class="inner"
                    v-tooltip.right="displayTooltips && `Workspace settings`"
                >
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </router-link>
            </div>
            <div
                class="sidebar-item"
                @click="drawerExpanded = !drawerExpanded"
                v-tooltip.right="'Click for more options'"
            >
                <div class="circle auth-user-icon">
                    <div class="user">
                        {{
                            authUser.name
                                .split(' ')
                                .map(x => x.slice(0, 1))
                                .join('')
                        }}
                    </div>
                    <div class="bg"></div>
                    <div class="circle xs dark">
                        <i class="fas white" :class="authUserWorkspaceRole == 'Admin' ? 'fa-crown' : 'fa-user'"></i>
                    </div>
                </div>
            </div>
            <div class="bottom-drawer" :class="[{ collapsed: !drawerExpanded }, { 'system-admin': getIsSystemAdmin }]">
                <div class="sidebar-item" v-if="getIsSystemAdmin">
                    <router-link
                        :to="{ name: 'systemAdmin' }"
                        class="inner"
                        v-tooltip.right="displayTooltips && `System Admin`"
                    >
                        <i class="fas fa-user-secret"></i>
                        <span>System Admin</span>
                    </router-link>
                </div>
                <div class="sidebar-item">
                    <a class="inner" @click="logout" v-tooltip.right="displayTooltips && 'Log out'">
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

import SignoutButton from '../../components/layout/SignoutButton'

export default {
    name: 'buy.TheSidebar',
    components: {
        SignoutButton,
    },
    data: function() {
        return {
            drawerExpanded: false,
            changelogReadDate: null,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser', 'getIsSystemAdmin']),
        ...mapGetters('workspaces', [
            'workspaces',
            'authUserWorkspaceRole',
            'currentWorkspace',
            'currentWorkspaceIndex',
            'getRealWorkspaceRole',
        ]),
        ...mapGetters('changelog', ['getLatestChangelogUpdateDate']),
        displayTooltips() {
            return window.innerWidth <= 1400
        },
        changelogUnread() {
            const changelogReadDate = this.changelogReadDate
            const changelogUpdateDate = this.getLatestChangelogUpdateDate
            return changelogReadDate < changelogUpdateDate
        },
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapActions('workspaces', ['setCurrentWorkspaceIndex']),
        ...mapMutations('changelog', ['SHOW_CHANGELOG']),
        onReadChangelog() {
            this.changelogReadDate = new Date()
            localStorage.setItem('changelogReadDate', new Date())
        },
    },
    created() {
        this.changelogReadDate = new Date(localStorage.getItem('changelogReadDate'))
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.sidebar {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: $bgDark;
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
        position: relative;
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
        border-radius: $borderRadiusLg;
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
        &:not(.inactive):hover,
        &.router-link-active {
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
    .unread-circle {
        position: absolute;
        top: 2px;
        right: 16px;
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
        .unread-circle {
            position: absolute;
            top: 12px;
            right: 4px;
        }
    }
    &:hover {
        .auth-user-icon .bg::after {
            opacity: 1;
        }
    }
    .auth-user-icon {
        cursor: pointer;
        border: none;
        position: relative;
        background: transparent;
        @keyframes spin {
            100% {
                transform: rotate(360deg), translate(-59%, -60%);
            }
        }
        &:hover {
            .bg::after {
                animation: spin linear forwards 1s infinite;
            }
        }
        .user {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: white;
            position: relative;
        }
        .bg {
            overflow: hidden;
            border-radius: 50px;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            background: transparent radial-gradient(closest-side at 3% 0%, #2a46ffa3 0%, #ffb0395e 100%) 0% 0% no-repeat
                padding-box;
            mix-blend-mode: screen;
            &::after {
                content: '';
                display: block;
                background: transparent radial-gradient(closest-side at 44% 53%, #2a46ff 54%, #ffb0395e 100%) 16% 0%
                    no-repeat padding-box;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-59%, -60%);
                height: 46px;
                width: 46px;
                /* opacity: .5; */
                z-index: 0;
                mix-blend-mode: overlay;
                opacity: 0.6;
            }
        }
        .circle {
            position: absolute;
            right: 0;
            bottom: 0;
            transform: translate(35%, 35%);
            i {
                margin: 0;
                font-size: 10px;
            }
        }
    }
}
.bottom-drawer {
    transition: 0.2s;
    position: relative;
    overflow: hidden;
    height: 80px;
    &.system-admin {
        height: 160px;
    }
    &.collapsed {
        height: 0;
    }
}
.v-popover .trigger:hover i {
    color: $iconSoftOnDark;
}
</style>
