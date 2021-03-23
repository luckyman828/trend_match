<template>
    <v-popover trigger="click" class="sidebar-item sidebar-space-logo-wrapper" placement="right">
        <div class="sidebar-space-logo">
            <BaseImageSizer class="sizer" aspect="1:1" fit="contain">
                <img :src="currentSpace.logo" />
            </BaseImageSizer>
        </div>
        <div class="space-selector space-list flex-list flex-v" slot="popover">
            <div
                class="space-list-item flex-list justify full-width center-v"
                :class="{ disabled: currentSpace.name == space.name }"
                v-for="(space, index) in availableSpaces"
                :key="index"
                @click="currentSpace.name != space.name && onSetSpace(space)"
            >
                <div class="flex-list">
                    <BaseImageSizer class="logo-sizer" aspect="1:1" fit="contain">
                        <img class="logo" :src="space.logo" />
                    </BaseImageSizer>
                    <div class="flex-list flex-v lh-xs space-xs">
                        <div class="name ft-14 ft-bd">{{ space.name }}</div>
                        <div class="ft-10 ft-md color-grey">{{ space.byline }}</div>
                    </div>
                </div>
                <BaseButton
                    buttonClass="pill sm fixed-width"
                    :disabled="currentSpace.name == space.name"
                    @click="onSetSpace(space)"
                >
                    <span>Open</span>
                </BaseButton>
            </div>
        </div>
    </v-popover>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'theSidebarSpaceLogo',
    computed: {
        ...mapGetters('workspaces', {
            availableSpaces: 'getEnabledSpaces',
        }),
        ...mapGetters('kollekt', {
            currentSpace: 'getCurrentSpace',
        }),
    },
    methods: {
        ...mapMutations('kollekt', ['SET_KOLLEKT_SPACE', 'NAVIGATE_TO_CURRENT_SPACE']),
        onSetSpace(space) {
            this.SET_KOLLEKT_SPACE(space.name)
            this.NAVIGATE_TO_CURRENT_SPACE()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar-item.sidebar-space-logo-wrapper {
    display: block;
}
.sidebar-space-logo {
    border-radius: 8px;
    overflow: hidden;
    .sizer {
        width: 100%;
    }
}
.space-list {
    padding: 6px;
    .space-list-item {
        padding: 8px;
        border: solid 2px transparent;
        border-radius: $borderRadiusEl;
        &:not(.disabled) {
            cursor: pointer;
        }
        &:hover {
            border-color: $primary300;
        }
        .name {
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .logo-sizer {
            width: 32px;
            .logo {
                border-radius: 8px;
                border: $borderElSoft;
                box-shadow: $shadowXs;
            }
        }
    }
}
</style>
