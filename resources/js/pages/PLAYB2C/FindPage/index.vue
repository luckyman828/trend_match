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
    },
    methods: {
        ...mapActions('playPresentations', ['fetchPresentations']),
    },
    async created() {
        this.loadingData = true
        await this.fetchPresentations()
        this.loadingData = false
        // window.addEventListener('beforeunload', e => {
        //     e.returnValue = true
        // })
    },
    destroyed() {
        // window.removeEventListener('beforeunload')
    },
}
</script>

<style lang="scss" scoped></style>
