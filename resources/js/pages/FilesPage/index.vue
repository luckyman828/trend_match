<template>
    <PageLoader>
        <FilesPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FilesPage from './FilesPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'filesLoader',
    components: {
        FilesPage,
        PageLoader
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace'])
    },
    watch: {
        currentWorkspace(newVal, oldVal) {
            this.SET_CURRENT_PATH_FOLDER()
        }
    },
    methods: {
        ...mapMutations('files', ['SET_CURRENT_PATH_FOLDER'])
    }
}
</script>

<style scoped lang="scss">

</style>