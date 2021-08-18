<template>
    <PageLoader :status="isLoading ? 'loading' : 'success'">
        <div class="file-video-page">
            <h1>Video Page: {{ file.name }}</h1>
            <div class="flex-list full-width equal-width space-lg">
                <button class="primary lg">
                    <span>Upload video</span>
                </button>
                <button class="primary lg">
                    <span>Start livestream</span>
                </button>
            </div>
            <div class="upload-video-section form-wrapper" style="margin-top: 24px;">
                <BaseLoader v-if="isUploading" msg="Uploading video.." />
                <template v-else>
                    <BaseDroparea
                        class="form-element"
                        v-model="videoFileToUpload"
                        :accept="availableVideoFileExtensions.map(x => `.${x}`).join(',')"
                    >
                        <template v-if="videoFileToUpload">
                            <div class="file-to-upload flex-list">
                                <span>{{ videoFileToUpload.name }}</span>
                                <button class="invisible ghost-hover true-square" @click="videoFileToUpload = null">
                                    <i class="far fa-trash"></i>
                                </button>
                            </div>
                        </template>
                    </BaseDroparea>
                    <BaseButton
                        class="full-width form-element"
                        buttonClass="primary full-width lg"
                        @click="onUploadVideo"
                        :disabled="uploadDisabled"
                        :disabledTooltip="uploadDisabled"
                    >
                        <span>Upload video</span>
                    </BaseButton>
                </template>
            </div>
        </div>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'play.FileVideoPage',
    components: { PageLoader },
    data() {
        return {
            isLoading: true,
            isUploading: false,
            videoFileToUpload: null,
        }
    },
    computed: {
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        availableVideoFileExtensions() {
            return ['mov', 'mp4', 'm4v', 'm2ts', 'mpg', 'mkv']
        },
        uploadDisabled() {
            const file = this.videoFileToUpload
            if (!file) return 'No file selected'
            const extension = file.name.split('.').pop()
            if (!this.availableVideoFileExtensions.includes(extension))
                return 'Invalid extension. Must be one of: .mov, .mp4, .m4v, .m2ts, .mpg, .mkv'
            return false
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('videos', ['uploadFileVideo', 'checkVideoStatus', 'fetchVideoUrls']),
        ...mapActions('videoPresentation', ['fetchFileVideo']),
        async onUploadVideo() {
            this.isUploading = true
            await this.uploadFileVideo({ videoFile: this.videoFileToUpload, file: this.file })
            this.isUploading = false
        },
        async init() {
            // Fetch the file
            this.isLoading = true
            const fileId = this.$route.params.fileId
            const file = await this.fetchFile(fileId)
            if (file.video_count > 0) {
                // Get file video
                const video = await this.fetchFileVideo(fileId)
                console.log('video', video)
                // Check videostatus
                const status = await this.checkVideoStatus(video)
                console.log('status', status)
                const urls = await this.fetchVideoUrls(video)
                console.log('urls', urls)
            }
            this.isLoading = false
        },
    },
    created() {
        this.init()
    },
}
</script>
