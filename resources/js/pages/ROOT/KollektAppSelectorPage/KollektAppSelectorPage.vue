<template>
    <div class="kollekt-app-selector home">
        <h1>Welcome {{ authUser ? authUser.name.split(' ')[0] : 'Anon' }}</h1>
        <div class="flex-list flex-v card card-md details space-md bg-theme-grey">
            <div class="flex-list workspace-selector center-v space-md">
                <div class="logo-wrapper" :class="{ 'has-logo': !!currentWorkspace.logo }">
                    <BaseImageSizer v-if="currentWorkspace.logo" class="logo-sizer" aspect="1:1">
                        <img :src="currentWorkspace.logo" />
                    </BaseImageSizer>
                    <span class="logo-text" v-else>{{ currentWorkspace.title }}</span>
                </div>
                <div class="name ft-16 ft-bd">
                    {{ currentWorkspace.title }}
                </div>
                <div class="action-list flex-list">
                    <v-popover trigger="click" v-if="isSystemAdmin || realWorkspaceRole == 'Owner'">
                        <button class="white circle">
                            <i class="far fa-ellipsis-h"></i>
                        </button>
                        <BaseContextMenu slot="popover" :inline="true">
                            <div class="item-group" v-if="isSystemAdmin || realWorkspaceRole == 'Owner'">
                                <BaseContextMenuItem
                                    iconClass="fas fa-cog"
                                    hotkey="keyS"
                                    @click="
                                        $router.push({
                                            name: 'workspaceSettings',
                                            params: { workspaceId: currentWorkspace.id },
                                        })
                                    "
                                >
                                    <span>Edit workspace <u>S</u>ettings</span>
                                </BaseContextMenuItem>
                            </div>
                            <div class="item-group" v-if="isSystemAdmin">
                                <v-popover trigger="click">
                                    <BaseContextMenuItem iconClass="fas fa-tasks" hotkey="keyF">
                                        <span>Edit enabled workspace <u>F</u>eatures</span>
                                    </BaseContextMenuItem>
                                    <BaseContextMenu slot="popover" :inline="true">
                                        <BaseSelectButtons
                                            :search="allFeatures.length > 5"
                                            :focusSearchOnMount="allFeatures.length > 5"
                                            :options="allFeatures"
                                            v-model="currentWorkspace.feature_flags"
                                            :submitOnChange="true"
                                            @input="onUpdateWorkspaceDetails"
                                        />
                                    </BaseContextMenu>
                                </v-popover>
                            </div>
                        </BaseContextMenu>
                    </v-popover>
                    <v-popover trigger="click">
                        <button class="white pill">
                            <span>Change workspace</span>
                            <i class="fas fa-caret-down"></i>
                        </button>
                        <BaseSelectButtons
                            slot="popover"
                            :options="availableWorkspaces"
                            :search="availableWorkspaces.length > 5"
                            :focusSearchOnMount="availableWorkspaces.length > 5"
                            type="radio"
                            v-model="currentWorkspace"
                            optionNameKey="title"
                            v-close-popover
                            :submitOnChange="true"
                        />
                    </v-popover>
                </div>
            </div>

            <div class="card card-sm card-round bg-theme-white flex-list justify user-details center-v">
                <div class="user flex-list">
                    <AuthUserIcon />
                    <div class="flex-list flex-v lh-xs space-sm">
                        <div class="name ft-12 ft-bd">{{ authUser.name }}</div>
                        <div class="email ft-10 ft-md">{{ authUser.email }}</div>
                    </div>
                </div>
                <div class="role">
                    <div class="pill secondary sm">
                        <span>Workspace {{ realWorkspaceRole }}</span>
                    </div>
                </div>
                <div class="action-list flex-list" @click="signOut">
                    <button class="invisible ghost-hover pill">
                        <i class="far fa-sign-out"></i>
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="app-section">
            <div class="square light xs"><span class="color-dark">APPS</span></div>
            <div class="app-list grid col-2 gap-md">
                <AppListItem v-for="(app, index) in allApps" :key="index" :app="app" @upgrade="appToBuy = app" />
            </div>
        </div>

        <BuyAppModal :show="!!appToBuy" @close="appToBuy = null" :app="appToBuy" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AuthUserIcon from '../../../components/AuthUserIcon'
import BuyAppModal from '../../../components/BuyAppModal'
import AppListItem from './AppListItem'

export default {
    name: 'kollektAppSelectorPage',
    components: { AuthUserIcon, AppListItem, BuyAppModal },
    data() {
        return {
            appToBuy: null,
        }
    },
    computed: {
        ...mapGetters('auth', {
            authUser: 'authUser',
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('workspaces', {
            availableApps: 'getEnabledApps',
            getCurrentWorkspace: 'getCurrentWorkspace',
            availableWorkspaces: 'workspaces',
            workspaceRole: 'authUserWorkspaceRole',
            realWorkspaceRole: 'getRealWorkspaceRole',
        }),
        ...mapGetters('kollektFeatures', {
            allFeatures: 'getFeatureFlags',
        }),
        ...mapGetters('kollektApps', {
            allApps: 'getApps',
        }),
        currentWorkspace: {
            get() {
                return this.getCurrentWorkspace
            },
            set(newWorkspace) {
                this.changeWorkspace(newWorkspace.id)
            },
        },
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapActions('workspaces', ['updateWorkspaceDetails', 'changeWorkspace']),
        ...mapMutations('kollektApps', ['SET_KOLLEKT_APP', 'NAVIGATE_TO_CURRENT_APP']),
        onSetApp(app) {
            this.SET_KOLLEKT_APP(app)
            this.NAVIGATE_TO_CURRENT_APP()
        },
        async onUpdateWorkspaceDetails() {
            await this.$nextTick()
            await this.updateWorkspaceDetails(this.currentWorkspace)
        },
        signOut() {
            this.logout()
        },
    },
    created() {
        this.SET_KOLLEKT_APP()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.kollekt-app-selector {
    width: 608px;
    h1 {
        font-size: 20px;
        margin: 0;
        margin-bottom: 16px;
    }
    .details {
        .workspace-selector {
            position: relative;
            .action-list {
                position: absolute;
                right: 0;
                top: 0;
            }
        }
        .logo-wrapper {
            width: 92px;
            height: 92px;
            color: white;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            &:not(.has-logo) {
                background: $dark100;
            }
            .logo-text {
                font-size: 10px;
                color: white;
                text-transform: uppercase;
                padding: 8px;
                white-space: pre-line;
                letter-spacing: 1px;
                font-weight: 700;
            }
            .logo-sizer {
                width: 100%;
            }
        }
        .long-pill {
            background: white;
            border-radius: 24px;
            padding: 8px;
        }
    }
    .app-section {
        margin-top: 32px;
        .app-list {
            margin-top: 8px;
        }
    }
}
</style>
