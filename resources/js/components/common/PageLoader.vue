<template>
    <div class="page-loader" :class="[{ 'fit-page': fitPage || $route.meta.isFullscreen }]">
        <!-- Error  -->
        <BaseContentLoadError
            v-if="status == 'error'"
            :msg="errorMsg || 'error loading content'"
            :callback="errorCallback"
        />

        <!-- Loading -->
        <BaseLoader class="loader" v-else-if="status == 'loading'" :msg="loadingMsg || 'loading content'" />

        <!-- Success -->
        <div class="page-wrapper" :class="`theme-${theme}`" v-else>
            <slot />
            <slot v-if="isMobile" name="mobile" />
            <slot v-else name="desktop" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'pageLoader',
    props: ['loading', 'error', 'status', 'loadingMsg', 'errorMsg', 'errorCallback', 'fitPage', 'theme'],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('responsive', { isMobile: 'getIsMobile' }),
    },
    watch: {
        currentWorkspace: function(newVal, oldVal) {
            // Check if we have a new workspace
            if (!oldVal || newVal.id != oldVal.id) {
                this.$emit('workspaceChange', newVal)
            }
        },
    },
}
</script>

<style lang="scss">
.page-loader {
    height: 500px;
    &.fit-page {
        height: 100%;
        > .loader {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        @include mobile {
            overflow: hidden;
        }
        .page-wrapper {
            padding: 0;
            height: 100%;
        }
    }
    .page-wrapper {
        padding: 20px 60px 100px;
        @media screen and (max-width: $screenSm) {
            padding: 20px;
            padding-bottom: 80px;
        }
    }
}
</style>
