<template>
    <div class="page-loader">

        <!-- Error  -->
        <BaseContentLoadError v-if="status == 'error'" :msg="errorMsg || 'error loading content'" :callback="errorCallback"/>

        <!-- Loading -->
        <BaseLoader v-else-if="status == 'loading'" :msg="loadingMsg || 'loading content'"/>

        <!-- Success -->
        <slot v-else/>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'pageLoader',
    props: [
        'loading',
        'error',
        'status',
        'loadingMsg',
        'errorMsg',
        'errorCallback'
    ],
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
    },
    watch: {
        currentWorkspace: function(newVal, oldVal) {
            // Check if we have a new workspace
            if (!oldVal || newVal.id != oldVal.id) {
                this.$emit('workspaceChange', newVal)
            }
        }
    },
}
</script>

<style lang="scss">
    .page-loader {
        height: 500px;
        > * {
            padding-bottom: 100px;
        }
    }
</style>