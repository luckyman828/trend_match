<template>
    <div class="page-loader">
        <slot v-if="!loading"/>
        <BaseLoader v-else/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'pageLoader',
    props: [
        'loading'
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