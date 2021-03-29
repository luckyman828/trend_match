<template>
    <div
        class="space-list-item flex-list justify full-width center-v"
        :class="[{ disabled: isDisabled }, { unavailable: isUnavailable }, { current: isCurrent }]"
        @click="!isDisabled && onSetSpace(space)"
    >
        <div class="flex-list">
            <BaseImageSizer class="logo-sizer" aspect="1:1" fit="contain">
                <img class="logo" :src="space.logo" />
            </BaseImageSizer>
            <div class="flex-list flex-v lh-xs space-xs">
                <div class="name ft-12 ft-bd">{{ space.name }}</div>
                <div class="ft-10 ft-md color-grey">{{ space.byline }}</div>
            </div>
        </div>
        <BaseButton
            buttonClass="pill sm"
            :class="isCurrent ? 'invisible' : 'white'"
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
    name: 'spaceListItem',
    props: ['space'],
    computed: {
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('kollektSpaces', {
            currentSpace: 'getCurrentSpace',
        }),
        ...mapGetters('workspaces', {
            availableSpaces: 'getEnabledSpaces',
        }),
        isDisabled() {
            if (this.isSystemAdmin) return false
            return this.isCurrent || this.isUnavailable
        },
        isCurrent() {
            return this.currentSpace.name == this.space.name
        },
        isUnavailable() {
            return !this.availableSpaces.find(space => space.name == this.space.name)
        },
    },
    methods: {
        ...mapMutations('kollektSpaces', ['SET_KOLLEKT_SPACE', 'NAVIGATE_TO_CURRENT_SPACE']),
        onSetSpace() {
            if (this.isDisabled) return
            this.SET_KOLLEKT_SPACE(this.space.name)
            this.NAVIGATE_TO_CURRENT_SPACE()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.space-list-item {
    padding: 8px;
    width: 280px;
    border: solid 2px transparent;
    border-radius: $borderRadiusEl;
    &:not(.disabled) {
        cursor: pointer;
    }
    &:hover {
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
