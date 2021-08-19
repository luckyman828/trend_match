<template>
    <FlowBaseScreen
        class="upload-video-screen"
        @next="onNext"
        @back="$emit('back')"
        :nextDisabled="submitDisabled"
        nextText="Add name and thumbnail"
        header="Create presentation"
        subHeader="Upload video"
    >
        <BaseDroparea
            v-model="fileToUpload"
            theme="light"
            :accept="availableExtensions.map(x => `.${x}`).join(',')"
            @input="onFileChange"
        >
            <template v-slot="slotProps">
                <div class="flex-list flex-v space-md center-h" v-if="!fileToUpload" @click="slotProps.activate()">
                    <img src="images/svg/undraw_Upload_re_pasx.svg" />
                    <div class="ft-16 ft-bd">
                        <span>Drop your video file here</span>
                    </div>
                    <div class="flex-list flex-v space-sm center-h">
                        <button class="pill white">
                            <i class="far fa-laptop"></i>
                            <span>Browse your computer</span>
                        </button>
                        <div class="color-grey ft-12 ft-md">
                            Supported formats: .mov, .mp4, .m4v, .m2ts, .mpg, .mkv
                        </div>
                    </div>
                </div>

                <!-- File uploading preview -->
                <template v-else>
                    <div class="file-to-upload bg-theme-white">
                        <div class="flex-list center-v space-md">
                            <BaseImageSizer aspect="1:1" fit="cover">
                                <img :src="presentation.thumbnail" />
                            </BaseImageSizer>
                            <div class="flex-list flex-v lh-min space-xs name-wrapper">
                                <div class="ft-14 ft-bd name">{{ fileToUpload.name }}</div>
                                <div class="color-primary ft-12 ft-md">{{ formatBytes(fileToUpload.size) }}</div>
                            </div>
                            <div
                                class="progress flex-list center-v space-xs auto-left"
                                :class="{ success: presentation.uploadChannel.progress.status != 'Uploading' }"
                                v-if="presentation.uploadChannel"
                            >
                                <div class="ft-12">
                                    {{ presentation.uploadChannel.progress.progressPercentage }}
                                </div>
                                <div class="rail">
                                    <div
                                        class="current"
                                        :style="{ width: presentation.uploadChannel.progress.progressPercentage }"
                                    ></div>
                                </div>
                            </div>
                            <button class="more-button circle no-bg ghost-hover sm auto-left" @click="showContext">
                                <i class="far fa-ellipsis-h"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex-list flex-v center-h">
                        <div class="ft-16 ft-bd">Success!</div>
                        <div class="ft-12 ft-md color-grey">Your video is being uploaded</div>
                        <button class="pill white" @click="slotProps.activate()">
                            <i class="far fa-laptop"></i>
                            <span>Choose another file</span>
                        </button>
                    </div>
                </template>
            </template>

            <!-- On drag over -->
            <template v-slot:dragDisplay>
                <div class="flex-list flex-v space-md center-h">
                    <img src="images/svg/undraw_Upload_re_pasx.svg" />
                    <div class="ft-16 ft-bd">
                        <span>Let go now 🙌</span>
                    </div>
                    <div class="flex-list flex-v space-sm center-h">
                        <BaseButton buttonClass="pill white" :disabled="true">
                            <i class="far fa-laptop"></i>
                            <span>Browse your computer</span>
                        </BaseButton>
                        <div class="color-grey ft-12 ft-md" style="opacity: 0">
                            Supported formats: .mov, .mp4, .m4v, .m2ts, .mpg, .mkv
                        </div>
                    </div>
                </div>
            </template>
        </BaseDroparea>

        <BaseContextMenu ref="contextMenu">
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="onCancel">
                    <u>C</u>ancel upload
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
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
        ...mapActions('playPresentations', ['updatePresentationDetails']),
        ...mapActions('workspaces', ['uploadImageToWorkspace']),
        formatBytes(value) {
            return formatBytes(value)
        },
        async onFileChange(newfile) {
            // Start uploading the video in the background
            this.uploadFileVideo({ videoFile: newfile, file: this.presentation })
            // Preset the video thumbnail as the first frame of the video
            const firstFrame = await this.getFirstFrame()
            // Upload the image
            const imageUrl = await this.uploadImageToWorkspace(firstFrame)
            this.presentation.thumbnail = imageUrl

            // Preset the name
            if (this.presentation.name == 'New presentation') {
                // Preset the name of our new file to the name of our video
                this.presentation.name = this.fileToUpload.name.split('.').shift()
            }
            // Save the new details
            this.updatePresentationDetails(this.presentation)
        },
        onCancel() {
            this.fileToUpload = null
            this.cancelUpload(this.presentation.uploadChannel)
        },
        showContext(e) {
            this.$refs.contextMenu.show(e)
        },
        async onNext() {
            this.$emit('next')
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
.upload-video-screen {
    img {
        height: 92px;
        width: 92px;
        object-fit: contain;
    }
    .drop-area {
        width: 100%;
        height: 232px;
    }
    .choose-another-file {
        position: absolute;
        bottom: 32px;
    }
    .file-to-upload {
        padding: 8px;
        border-radius: 24px;
        margin-bottom: 48px;
        width: 100%;
        .img-sizer {
            width: 32px;
            border-radius: 50px;
            overflow: hidden;
            flex-shrink: 0;
        }
        .more-button {
            flex-shrink: 0;
        }
        .name-wrapper {
            overflow: hidden;
            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .progress {
            width: 200px;
            flex-shrink: 0;
            &.success {
                .rail {
                    .current {
                        background: $success;
                    }
                }
            }
            .rail {
                flex: 1;
                background: $grey200;
                height: 8px;
                border-radius: 4px;
                .current {
                    height: 100%;
                    width: 0;
                    background: $dark;
                    transition: width 0.2s;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>
