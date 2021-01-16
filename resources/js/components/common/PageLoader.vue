<template>
    <div class="page-loader" :class="[{ 'fit-page': fitPage }]">
        <!-- Error  -->
        <BaseContentLoadError
            v-if="status == 'error'"
            :msg="errorMsg || 'error loading content'"
            :callback="errorCallback"
        />

        <!-- Loading -->
        <BaseLoader v-else-if="status == 'loading'" :msg="loadingMsg || 'loading content'" />

        <!-- Success -->
        <div class="page-wrapper" :class="`theme-${theme}`" v-else>
            <slot />
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
@import '~@/_variables.scss';
.page-loader {
    height: 500px;
    &.fit-page {
        height: 100%;
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
        &.theme-dark {
            background: $dark;
        }
        @media screen and (max-width: $screenSm) {
            padding: 20px;
        }
    }
}
</style>
