<template>
    <div class="product-space-selector">
        <div class="container sm">
            <h1>Hello {{ authUser ? authUser.name : 'Anon' }}</h1>
            <div class="flex-list">
                <BaseDropdownInputField
                    class="workspace-selector"
                    innerLabel="Workspace"
                    :options="availableWorkspaces"
                    type="radio"
                    v-model="currentWorkspace"
                    nameKey="title"
                />
                <v-popover trigger="click" v-if="isSystemAdmin">
                    <button class="ghost md" v-tooltip="'Edit enabled workspace features'">
                        <i class="fas fa-cog"></i>
                    </button>
                    <BaseContextMenu slot="popover" :inline="true">
                        <BaseSelectButtons
                            :options="allFeatures"
                            v-model="currentWorkspace.feature_flags"
                            :submitOnChange="true"
                            @input="onUpdateWorkspaceDetails"
                        />
                    </BaseContextMenu>
                </v-popover>
            </div>
            <div class="space-list flex-list md">
                <div
                    class="space-card flex-list flex-v md wrap"
                    v-for="(space, index) in availableSpaces"
                    :key="index"
                    @click="onSetSpace(space.name)"
                >
                    <div class="logo-wrapper">
                        <img :src="space.logo.color" />
                    </div>
                    <div class="name ft-bd ft-20">{{ space.name }}</div>
                    <div class="dscription ft-md ft-16">{{ space.byline }}</div>
                    <button class="dark fullw-width">
                        <span>Go</span>
                    </button>
                </div>
                <div v-if="availableSpaces.length == 0">No spaces enabled for this workspace.</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'productSpaceSelectorPage',
    computed: {
        ...mapGetters('auth', {
            authUser: 'authUser',
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('workspaces', {
            availableSpaces: 'getEnabledSpaces',
            getCurrentWorkspace: 'getCurrentWorkspace',
            availableWorkspaces: 'workspaces',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('kollektFeatures', {
            allFeatures: 'getFeatureFlags',
        }),
        currentWorkspace: {
            get() {
                return this.getCurrentWorkspace
            },
            set(newWorkspace) {
                this.SET_CURRENT_WORKSPACE_ID(newWorkspace.id)
            },
        },
    },
    methods: {
        ...mapActions('workspaces', ['updateWorkspaceDetails']),
        ...mapMutations('kollektSpaces', ['SET_KOLLEKT_SPACE', 'NAVIGATE_TO_CURRENT_SPACE']),
        ...mapMutations('workspaces', ['SET_CURRENT_WORKSPACE_ID']),
        onSetSpace(space) {
            this.SET_KOLLEKT_SPACE(space)
            this.NAVIGATE_TO_CURRENT_SPACE()
        },
        async onUpdateWorkspaceDetails() {
            await this.$nextTick()
            await this.updateWorkspaceDetails(this.currentWorkspace)
        },
    },
    created() {
        this.SET_KOLLEKT_SPACE()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-space-selector {
    padding: 60px 12px;
}
.workspace-selector {
    display: inline-block;
    width: 300px;
}
.space-list {
    margin-top: 60px;
}
.space-card {
    background: white;
    border: $borderEl;
    border-radius: 8px;
    transition: 0.1s ease-out;
    cursor: pointer;
    padding: 32px;
    border-radius: $borderRadiusModule;
    flex: 0 0 300px;
    .logo-wrapper {
        height: 100px;
        width: 100px;
        margin: 0 auto 16px;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
            filter: drop-shadow($shadowXs);
        }
    }
    .go-button {
        margin-top: auto !important;
    }
    .name {
        text-transform: uppercase;
    }
    &.disabled {
        background: $bluegrey400;
        cursor: default;
    }
    &:not(.disabled) {
        &:hover {
            // background: $dark;
            // color: white;
            box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
            transform: translateY(-4px);
        }
    }
}
</style>
