<template>
    <FlowBaseScreen class="upload-video-screen" @next="onNext" @back="$emit('back')" :nextDisabled="submitDisabled">
        <BaseDroparea v-model="fileToUpload">
            <template v-if="fileToUpload">
                <div class="flex-list center-v">
                    <div>{{ fileToUpload.name }}</div>
                    <button class="true-square invisible ghost-hover" @click="fileToUpload = null">
                        <i class="far fa-trash"></i>
                    </button>
                </div>
            </template>
        </BaseDroparea>
    </FlowBaseScreen>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FlowBaseScreen from './FlowBaseScreen'

export default {
    name: 'uploadVideoScreen',
    components: { FlowBaseScreen },
    data() {
        return {
            fileToUpload: null,
        }
    },
    computed: {
        ...mapGetters('playPresentations', {
            presentation: 'getCurrentPresentation',
        }),
        availableExtensions() {
            return ['mov', 'mp4', 'm4v', 'm2ts', 'mpg', 'mkv']
        },
        submitDisabled() {
            if (!this.fileToUpload) return 'No video selected'
            const extension = this.fileToUpload.name.split('.').pop()
            if (!this.availableExtensions.includes(extension))
                return 'Invalid extension. Must be one of: .mov, .mp4, .m4v, .m2ts, .mpg, .mkv'
            return false
        },
    },
    methods: {
        ...mapActions('videos', ['uploadFileVideo']),
        async onNext() {
            if (this.presentation.name == 'New presentation') {
                // Preset the name of our new file to the name of our video
                this.presentation.name = this.fileToUpload.name
            }

            // Preset the video thumbnail as the first frame of the video
            const firstFrame = await this.getFirstFrame()
            // this.$set(this.presentation, 'thumbnail', firstFrame.previewUrl)
            this.$set(this.presentation, 'thumbnail_blob', firstFrame)

            this.$emit('next')
            // Start uploading the video in the background
            this.uploadFileVideo({ videoFile: this.fileToUpload, file: this.presentation })
        },
        async getFirstFrame() {
            return await new Promise(resolve => {
                const _CANVAS = document.createElement('canvas')
                const _CTX = _CANVAS.getContext('2d')
                const _VIDEO = document.createElement('video')

                // Object Url as the video source
                _VIDEO.setAttribute('src', URL.createObjectURL(this.fileToUpload))

                // Load the video and show it
                _VIDEO.load()

                _VIDEO.currentTime = 0.001

                // Load metadata of the video to get video duration and dimensions
                _VIDEO.addEventListener('loadedmetadata', function() {
                    // Set canvas dimensions same as video dimensions
                    _CANVAS.width = _VIDEO.videoWidth
                    _CANVAS.height = _VIDEO.videoHeight
                })

                _VIDEO.addEventListener('canplay', function() {
                    _CANVAS.style.display = 'inline'
                    _CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth, _VIDEO.videoHeight)
                    // const frameUrl = _CANVAS.toDataURL('image/jpeg')
                    // const frameUrl = null
                    // resolve({ previewUrl: frameUrl, blob: frameBlob })
                    _CANVAS.toBlob(blob => {
                        resolve(blob)
                    }, 'image/jpeg')
                })
            })
        },
    },
}
</script>

<style></style>
