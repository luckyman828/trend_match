<template>
    <div class="vue-component-sidebar sidebar theme-dark">
        <div class="nav">
            <template v-if="type != 'min'">
                <div class="top-items flex-list flex-v space-lg">
                    <TheSidebarAppLogo />

                    <v-popover
                        placement="right"
                        trigger="click"
                        @apply-show="workspaces.length > 5 && $nextTick(() => $refs.workspaceSelect.focusSearch())"
                    >
                        <SidebarItem :label="currentWorkspace.title" iconClass="fas fa-building" />
                        <BaseSelectButtons
                            ref="workspaceSelect"
                            :search="workspaces.length > 5"
                            :focusSearchOnMount="workspaces.length > 5"
                            slot="popover"
                            type="radio"
                            :options="workspaces"
                            :value="currentWorkspaceId"
                            optionValueKey="id"
                            optionNameKey="title"
                            :submitOnChange="true"
                            @submit="SET_CURRENT_WORKSPACE_ID($event)"
                            v-close-popover
                        />
                    </v-popover>

                    <slot name="top" />
                </div>
            </template>
        </div>
        <div class="bottom-nav flex-list flex-v space-lg">
            <template v-if="type != 'min'">
                <slot name="bottom" />
                <SidebarItem
                    class="changelog-item"
                    label="News"
                    iconClass="fas fa-gift"
                    @click.native="
                        SHOW_CHANGELOG(true)
                        onReadChangelog()
                    "
                >
                    <div class="unread-circle circle xxs red" v-if="changelogUnread" />
                </SidebarItem>

                <SidebarItem
                    v-if="getRealWorkspaceRole == 'Owner' || getIsSystemAdmin"
                    label="Settings"
                    iconClass="fas fa-cog"
                    :to="{ name: 'workspaceSettings', params: { workspaceId: currentWorkspaceId } }"
                />
            </template>

            <SidebarItem @click.native="drawerExpanded = !drawerExpanded" v-tooltip.right="'Click for more options'">
                <AuthUserIcon />
            </SidebarItem>

            <div
                class="bottom-drawer flex-list flex-v space-lg"
                :class="[{ collapsed: !drawerExpanded }, { 'system-admin': getIsSystemAdmin }]"
            >
                <SidebarItem
                    v-if="getIsSystemAdmin"
                    label="System Admin"
                    :to="{ name: 'systemAdmin' }"
                    iconClass="fas fa-user-secret"
                />
                <SidebarItem label="Sign out" iconClass="far fa-sign-out fa-flip-horizontal" @click.native="logout" />
            </div>
        </div>
        <TheChangelogModal v-if="getShowChangelog" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SidebarItem from './SidebarItem'

import SignoutButton from './SignoutButton'
import TheSidebarAppLogo from './TheSidebarAppLogo'
import AuthUserIcon from '../AuthUserIcon'

export default {
    name: 'TheSidebar',
    components: {
        SignoutButton,
        TheSidebarAppLogo,
        AuthUserIcon,
        SidebarItem,
        TheChangelogModal: () => import('./TheChangelogModal/'),
    },
    props: ['type'],
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
            'getRealWorkspaceRole',
        ]),
        ...mapGetters('workspaces', {
            currentWorkspaceId: 'getCurrentWorkspaceId',
        }),
        ...mapGetters('changelog', ['getLatestChangelogUpdateDate', 'getShowChangelog']),
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
        ...mapMutations('workspaces', ['SET_CURRENT_WORKSPACE_ID']),
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
    padding: 8px 8px 0;
    height: 100%;
}

.sidebar-item {
    .unread-circle {
        position: absolute;
        top: 2px;
        right: 16px;
    }
    @media screen and (max-width: $screenSm) {
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
}
.bottom-drawer {
    transition: 0.2s;
    position: relative;
    overflow: hidden;
    height: 60px;
    &.system-admin {
        height: 120px;
    }
    &.collapsed {
        height: 0;
    }
}
</style>
