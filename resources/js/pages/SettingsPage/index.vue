<template>
    <PageLoader>
        <SettingsPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SettingsPage from './SettingsPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'filesLoader',
    components: {
        PageLoader,
        SettingsPage,
    },
}
</script>

<style scoped lang="scss"></style>
