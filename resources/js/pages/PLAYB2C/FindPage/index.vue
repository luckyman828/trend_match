<template>
    <PageLoader :status="loadingData ? 'loading' : 'success'">
        <div class="play-home">
            <h1>Library</h1>
            <PresentationGrid :presentations="presentations" />
        </div>
    </PageLoader>
</template>

<script>
import PresentationGrid from './PresentationGrid/'
import PageLoader from '../../../components/common/PageLoader'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'Play.FindPage',
    components: { PresentationGrid, PageLoader },
    data() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('playPresentations', {
            presentations: 'getPresentations',
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

<style lang="scss" scoped>
.play-home {
}
</style>
