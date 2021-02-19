<template>
    <PageLoader
        :status="status"
        loadingMsg="Getting your presentation ready"
        errorMsg="Error loading video"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <MobileVideoPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MobileVideoPresentationPage from './MobileVideoPresentationPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'mobileVideoPresentationPageLoader',
    components: {
        PageLoader,
        MobileVideoPresentationPage,
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
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('files', ['filesStatus']),
        status() {
            if (this.productsStatus == 'error' || this.currentSelectionStatus == 'error' || this.filesStatus == 'error')
                return 'error'
            if (
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
        ...mapActions('videoPresentation', ['fetchFileVideo']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
        ...mapActions('videoComments', ['fetchVideoComments']),
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

            await this.fetchVideoComments({ video: fileVideo.video })

            if (this.presentationIsActive) {
                this.SET_VIDEO_TYPE('live')
                // Fetch the currently presented product
                await this.fetchPresentationDetails(selection.presentation_id)
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
