<template>
    <div class="vue-component-sidebar sidebar theme-dark">
        <div class="nav">
            <div class="top-items flex-list flex-v space-lg">
                <TheSidebarSpaceLogo />

                <v-popover placement="right" trigger="click">
                    <SidebarItem :label="currentWorkspace.title" iconClass="fas fa-building" />
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
                        @submit="SET_CURRENT_WORKSPACE_INDEX($event)"
                        v-close-popover
                    />
                </v-popover>

                <slot name="top" />
            </div>
        </div>
        <div class="bottom-nav flex-list flex-v space-lg">
            <slot name="bottom" />
            <SidebarItem
                class="changelog-item"
                label="News"
                iconClass="fas fa-gift"
                @click="
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
                :to="{ name: 'workspaceSettings' }"
            />

            <SidebarItem @click.native="drawerExpanded = !drawerExpanded" v-tooltip.right="'Click for more options'">
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
            </SidebarItem>

            <div
                class="bottom-drawer flex-list flex-v space-lg"
                :class="[{ collapsed: !drawerExpanded }, { 'system-admin': getIsSystemAdmin }]"
            >
                <SidebarItem label="System Admin" :to="{ name: 'systemAdmin' }" iconClass="fas fa-user-secret" />
                <SidebarItem label="Sign ou" iconClass="far fa-sign-out fa-flip-horizontal" @click.native="logout" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SidebarItem from './SidebarItem'

import SignoutButton from './SignoutButton'
import TheSidebarSpaceLogo from './TheSidebarSpaceLogo'

export default {
    name: 'TheSidebar',
    components: {
        SignoutButton,
        TheSidebarSpaceLogo,
        SidebarItem,
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
        ...mapActions('workspaces', ['SET_CURRENT_WORKSPACE_INDEX']),
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
    height: 60px;
    &.system-admin {
        height: 120px;
    }
    &.collapsed {
        height: 0;
    }
}
</style>
