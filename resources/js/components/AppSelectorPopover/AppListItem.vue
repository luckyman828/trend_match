<template>
    <div
        class="app-list-item flex-list justify full-width center-v"
        :class="[{ disabled: isDisabled }, { unavailable: isUnavailable }, { current: isCurrent }]"
        @click="!isDisabled && onSetSpace(app)"
    >
        <div class="flex-list">
            <BaseImageSizer class="logo-sizer" aspect="1:1" fit="contain">
                <img class="logo" :src="getAppLogo" />
            </BaseImageSizer>
            <div class="flex-list flex-v lh-xs space-sm">
                <div class="name ft-12 ft-bd">{{ app.name }}</div>
                <div class="ft-10 ft-md color-grey">{{ app.byline }}</div>
            </div>
        </div>
        <BaseButton
            :buttonClass="['pill sm', isCurrent ? 'invisible grey' : 'white']"
            :disabled="isDisabled"
            @click="onSetSpace()"
        >
            <span v-if="isCurrent">Active</span>
            <span v-else-if="isUnavailable">Not activated</span>
            <span v-else class="color-primary">Open</span>
        </BaseButton>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'appListItem',
    props: ['app'],
    data() {
        return {}
    },
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('kollektApps', {
            currentApp: 'getCurrentApp',
        }),
        ...mapGetters('workspaces', {
            availableApps: 'getEnabledApps',
        }),
        isDisabled() {
            if (this.isSystemAdmin) return false
            return this.isCurrent || this.isUnavailable
        },
        isCurrent() {
            return this.currentApp && this.currentApp.name == this.app.name
        },
        isUnavailable() {
            return !this.availableApps.find(app => app.name == this.app.name)
        },
        getAppLogo() {
            const appLogo = this.app.logo
            return this.isCurrent ? appLogo.whiteOnColor : appLogo.colorOnWhite
        },
    },
    methods: {
        ...mapMutations('kollektApps', ['SET_KOLLEKT_APP', 'NAVIGATE_TO_CURRENT_APP']),
        onSetSpace() {
            if (this.isDisabled) return
            this.SET_KOLLEKT_APP(this.app.name)
            this.NAVIGATE_TO_CURRENT_APP()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.app-list-item {
    padding: 8px;
    width: 280px;
    border: solid 2px transparent;
    border-radius: $borderRadiusEl;
    &:not(.current):not(.disabled) {
        cursor: pointer;
    }
    &:hover,
    &.current {
        background: $bg;
    }
    .name {
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .logo-sizer {
        width: 32px;
    }
    &.unavailable {
        img {
            filter: grayscale(100%);
        }
    }
}
</style>
