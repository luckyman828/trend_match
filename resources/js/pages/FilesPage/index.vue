<template>
    <PageLoader :loading="loading"
    @workspaceChange="fetchData">
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
    data: function () { return {
    }},
    computed: {
        ...mapGetters('files', ['loadingFiles', 'files']),
        loading () {
            return (this.loadingFiles)
        }
    },
    methods: {
        ...mapActions('files', ['fetchFiles']),
        fetchData() {
            this.fetchFiles()
        }
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss">

</style>