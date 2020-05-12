<template>
    <PageLoader>
        <FilesPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FilesPage from './FilesPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'filesLoader',
    components: {
        FilesPage,
        PageLoader
    },
}
</script>

<style scoped lang="scss">

</style>