<template>
    <PageLoader :status="status"
    loadingMsg="loading files"
    errorMsg="error loading files"
    :errorCallback="() => fetchData()">
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
        ...mapGetters('files', ['filesStatus', 'files']),
        status () {
            return this.filesStatus
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