<template>
    <PageLoader>
        <FilesPage />
        <Navbar />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FilesPage from './FilesPage'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'buy.FilesLoader',
    components: {
        FilesPage,
        PageLoader,
        Navbar,
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
    },
    watch: {
        currentWorkspace(newVal, oldVal) {
            this.SET_CURRENT_PATH_FOLDER()
        },
    },
    methods: {
        ...mapMutations('files', ['SET_CURRENT_PATH_FOLDER']),
    },
}
</script>

<style scoped lang="scss"></style>
