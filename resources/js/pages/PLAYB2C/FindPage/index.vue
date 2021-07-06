<template>
    <PageLoader :status="loadingData ? 'loading' : 'success'">
        <Navbar />
        <PresentationGrid :presentations="presentations" />
    </PageLoader>
</template>

<script>
import PresentationGrid from './PresentationGrid/'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'Play.FindPage',
    components: { PresentationGrid, PageLoader, Navbar },
    data() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('playPresentations', {
            presentations: 'getPresentationsFilteredBySearch',
        }),
        ...mapGetters('workspaces', {
            currentWorkspace: 'getCurrentWorkspace',
        }),
    },
    watch: {
        currentWorkspace(newVal, oldVal) {
            this.initData(true)
        },
    },
    methods: {
        ...mapActions('playPresentations', ['fetchPresentations']),
        async initData() {
            this.loadingData = true
            await this.fetchPresentations()
            this.loadingData = false
        },
    },
    created() {
        this.initData()
    },
}
</script>

<style lang="scss" scoped></style>
