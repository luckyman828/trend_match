<template>
    <div class="sidebar-item" :class="{ active: isActive }">
        <!-- Router link -->
        <router-link
            v-if="to"
            :to="to"
            class="inner flex-list flex-v center-h"
            v-tooltip.right="displayTooltips && label"
        >
            <i v-if="iconClass" class="icon" :class="iconClass"></i>
            <div class="pill xxs" :class="isActive ? 'dark pill' : 'no-bg'" v-if="label">
                <span class="label">{{ label }}</span>
            </div>
        </router-link>

        <!-- External link -->
        <a
            v-else-if="href"
            :href="href"
            target="_blank"
            class="inner flex-list flex-v center-h"
            v-tooltip.right="displayTooltips && label"
        >
            <i v-if="iconClass" class="icon" :class="iconClass"></i>
            <div class="pill xxs black" v-if="label">
                <span class="label">{{ label }}</span>
            </div>
        </a>

        <!-- Not link -->
        <div v-else class="inner flex-list flex-v center-h" v-tooltip.right="displayTooltips && label">
            <i v-if="iconClass" class="icon" :class="iconClass"></i>
            <div class="pill xxs black" v-if="label">
                <span class="label">{{ label }}</span>
            </div>
        </div>

        <!-- Custom content -->
        <slot />
    </div>
</template>

<script>
export default {
    name: 'sidebarItem',
    props: ['label', 'to', 'iconClass', 'href'],
    computed: {
        isActive() {
            return !!this.to && !!this.$route.matched && !!this.$route.matched.find(route => route.name == this.to.name)
        },
        displayTooltips() {
            return window.innerWidth <= 1400
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar-item {
    position: relative;
    cursor: pointer;

    .pill {
        overflow: hidden;
        width: 100%;
    }
    .label {
        opacity: 0.8;
        overflow: hidden;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .icon {
        opacity: 0.4;
        color: white;
        font-size: 16px;
    }
    &:hover,
    &.active {
        .label,
        .icon {
            opacity: 1;
            color: white;
        }
    }
    &.active:not(:hover) {
        .icon {
            color: $primary;
        }
    }
}
</style>
