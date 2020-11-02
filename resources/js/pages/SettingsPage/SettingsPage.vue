<template>
    <div class="settings-page">
        <h1>Settings</h1>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'settingsPage',
    computed: {
        ...mapGetters('workspaces', {
            yourRole: 'authUserWorkspaceRole',
        }),
    },
    created() {},
}
</script>

<style></style>
