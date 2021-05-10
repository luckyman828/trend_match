<template>
    <FlowBaseScreen
        class="upload-video-screen"
        @next="onNext"
        @back="$emit('back')"
        :nextDisabled="submitDisabled"
        header="Upload video"
        subHeader="Choose how you want to present you styles"
    >
        <BaseDroparea
            v-model="fileToUpload"
            class="bg-theme-light interactable"
            v-slot="slotProps"
            :accept="availableExtensions.map(x => `.${x}`).join(',')"
            @input="onFileChange"
        >
            <div class="flex-list flex-v space-md center-h" v-if="!fileToUpload" @click="slotProps.activate()">
                <div class="true-square xxl white">
                    <i class="fas fa-upload primary"></i>
                </div>
                <div class="ft-16 ft-md">
                    <span>Drop your video file here</span>
                </div>
                <div class="flex-list flex-v space-sm center-h">
                    <button class="pill dark">
                        <span>Browse your computer</span>
                    </button>
                    <div class="color-grey ft-12 ft-md">
                        Supported formats: .mov, .mp4, .m4v, .m2ts, .mpg, .mkv
                    </div>
                </div>
            </div>

            <template v-else>
                <div class="file-to-upload">
                    <div class="flex-list center-v">
                        <div>{{ fileToUpload.name }}</div>
                        <div>{{ formatBytes(fileToUpload.size) }}</div>
                        <button class="pill invisible ghost-hover sm" @click="onCancel">
                            <i class="far fa-times"></i>
                            <span>Cancel</span>
                        </button>
                    </div>
                    <div class="progress" v-if="presentation.uploadChannel">
                        {{ presentation.uploadChannel.progress.status }}
                        {{ presentation.uploadChannel.progress.progressPercentage }}
                    </div>
                </div>
                <button class="dark pill choose-another-file" @click="slotProps.activate()">
                    <span>Choose another file</span>
                </button>
            </template>
        </BaseDroparea>
    </FlowBaseScreen>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FlowBaseScreen from './FlowBaseScreen'
import formatBytes from '../../../../helpers/formatBytes'

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
        ...mapActions('videos', ['uploadFileVideo', 'cancelUpload']),
        formatBytes(value) {
            return formatBytes(value)
        },
        onFileChange(newfile) {
            this.uploadFileVideo({ videoFile: newfile, file: this.presentation })
        },
        onCancel() {
            this.fileToUpload = null
            this.cancelUpload(this.presentation.uploadChannel)
        },
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

<style scoped lang="scss">
@import '~@/_variables.scss';
.upload-video-screen {
    .drop-area {
        width: 512px;
        height: 232px;
        border: $borderEl;
        border-radius: $borderRadiusEl;
    }
    .choose-another-file {
        position: absolute;
        bottom: 32px;
    }
}
</style>
