<template>
    <PageLoader
        :status="status"
        loadingMsg="Getting your presentation ready"
        errorMsg="Error loading video"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <WatchVideoPage />
    </PageLoader>
</template>

<script>
import PageLoader from '../../../../components/common/PageLoader'
import WatchVideoPage from './WatchVideoPage'

export default {
    name: 'watchVideoPageLoader',
    components: {
        PageLoader,
        WatchVideoPage,
    },
}
</script>

<style></style>
