<template>
    <PageLoader
        :status="status"
        loadingMsg="Getting your presentation ready"
        errorMsg="Error loading video"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <WatchVideoPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import WatchVideoPresentationPage from './WatchVideoPresentationPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'watchVideoPresentationPageLoader',
    components: {
        PageLoader,
        WatchVideoPresentationPage,
    },
    data: function() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('selections', ['currentSelectionStatus']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('presentation', {
            presentationIsActive: 'getPresentationIsActive',
        }),
        ...mapGetters('liveUpdates', {
            liveUpdateIsConnected: 'getIsConnected',
        }),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('files', ['filesStatus']),
        status() {
            if (this.productsStatus == 'error' || this.currentSelectionStatus == 'error' || this.filesStatus == 'error')
                return 'error'
            if (
                !this.liveUpdateIsConnected ||
                this.productsStatus == 'loading' ||
                this.currentSelectionStatus == 'loading' ||
                this.filesStatus == 'loading' ||
                this.loadingData
            )
                return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selectionProducts', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelection', 'fetchSelections', 'fetchSelectionSettings']),
        ...mapActions('videoPresentation', ['fetchFileVideo', 'fetchVideo']),
        ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            const file = await this.fetchFile(fileId)

            // Fetch current selection
            const selectionId = this.$route.params.selectionId
            const selection = await this.fetchSelection({ selectionId })

            // Fetch selection products
            await this.fetchProducts({ fileId })
            await this.fetchSelectionProducts(selection)

            // Fetch selection settings
            await this.fetchSelectionSettings(selection) // Used to know whether comments are anonyized or not

            // Fetch selections that are available for alignment for the auth user
            const selections = await this.fetchSelections({ fileId })

            const fileVideo = await this.fetchFileVideo(fileId)
            this.SET_CURRENT_VIDEO(fileVideo)

            if (this.presentationIsActive) {
                // Fetch the currently presented product
                this.SET_VIDEO_TYPE('live')
                await this.fetchPresentationDetails(selection.presentation_id)
                await this.fetchVideoComments({ video })
            } else {
                this.SET_VIDEO_TYPE('static')
            }

            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
