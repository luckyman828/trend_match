<template>
    <div class="app-selector app-list flex-list flex-v" slot="popover">
        <AppListItem v-for="(app, index) in availableApps" :key="index" :app="app" @upgrade="appToBuy = app" />
        <div class="list-item">
            <router-link class="button no-bg primary full-width sm ghost-hover" :to="{ name: 'selectApp' }">
                <span>Go to Home</span>
            </router-link>
        </div>

        <BuyAppModal :show="!!appToBuy" @close="appToBuy = null" :app="appToBuy" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppListItem from './AppListItem'
import BuyAppModal from '../BuyAppModal'

export default {
    name: 'appSelectorPopover',
    components: { AppListItem, BuyAppModal },
    data() {
        return {
            appToBuy: null,
        }
    },
    computed: {
        ...mapGetters('kollektApps', {
            allApps: 'getApps',
        }),
        ...mapGetters('workspaces', {
            availableApps: 'getEnabledApps',
        }),
    },
}
</script>

<style lang="scss" scoped>
.app-list {
    padding: 6px;
}
</style>
