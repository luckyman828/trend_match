<template>
    <div class="app-selector app-list flex-list flex-v" slot="popover">
        <AppListItem v-for="(app, index) in allApps" :key="index" :app="app" />
        <div class="list-item">
            <router-link class="button invisible primary full-width sm ghost-hover" :to="{ name: 'selectApp' }">
                <span>Go to Home</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppListItem from './AppListItem'

export default {
    name: 'appSelectorPopover',
    components: { AppListItem },
    computed: {
        ...mapGetters('kollektApps', {
            allApps: 'getApps',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.app-list {
    padding: 6px;
}
</style>
