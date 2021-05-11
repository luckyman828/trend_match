<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <Navbar />
        <EditPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditPresentationPage from './EditPresentationPage'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'editPresentationPageLoader',
    components: {
        PageLoader,
        EditPresentationPage,
        Navbar,
    },
    data: function() {
        return { dataReady: false }
    },
    computed: {
        ...mapGetters('playPresentation', {
            video: 'getVideo',
        }),
        status() {
            if (!this.dataReady) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('playPresentation', ['fetchPresentation']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('videos', ['fetchVideoUrls']),
        async fetchData() {
            this.dataReady = false

            const presentationId = this.$route.params.presentationId
            await this.fetchPresentation(presentationId)
            const video = this.video

            await Promise.all([this.fetchProducts({ fileId: presentationId }), this.fetchVideoUrls(video)])

            this.dataReady = true
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
