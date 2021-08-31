<template>
    <FlowBaseScreen
        class="presentation-details-screen"
        @next="onNext"
        @back="$emit('back')"
        header="Name and thumbnail"
        subHeader="Presentation details"
        v-bind="$attrs"
    >
        <template v-if="presentation">
            <div class="upload-progress-wrapper flex-list center-h" v-if="presentation.uploadChannel">
                <div
                    class="upload-progress flex-list center-v space-md"
                    :class="{ success: presentation.uploadChannel.progress.status != 'Uploading' }"
                >
                    <div class="ft-10 ft-bd file-name">
                        {{ presentation.uploadChannel.file.name }}
                    </div>
                    <div class="flex-list space-xs center-v">
                        <div class="ft-10 color-grey">
                            {{ presentation.uploadChannel.progress.progressPercentage }}
                        </div>
                        <div class="rail">
                            <div
                                class="current"
                                :style="{ width: presentation.uploadChannel.progress.progressPercentage }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="name-input-wrapper">
                <BaseInputField
                    v-model="presentation.name"
                    theme="light"
                    class="lg"
                    :selectOnFocus="true"
                    innerLabel="Presentation name"
                    v-slot="slotProps"
                    @submit="onSubmitName"
                >
                    <button class="white pill" @click="slotProps.activate()">
                        <i class="far fa-pen"></i>
                        <span>Edit</span>
                    </button>
                </BaseInputField>
            </div>

            <div class="thumbnail-section">
                <div class="ft-14 ft-bd label">Thumbnail</div>
                <BaseDroparea class="thumbnail-droparea" theme="light" @input="onImageChange" accept="image/*">
                    <template v-slot="slotProps">
                        <!-- No thumbnail -->
                        <template v-if="!presentation.thumbnail">
                            <img class="upload-graphic" src="images/svg/undraw_Upload_re_pasx.svg" />
                            <div class="ft-16 ft-bd">
                                Drop your thumbnail file here
                            </div>
                            <button class="bottom-action white pill" @click="slotProps.activate()">
                                <i class="far fa-laptop"></i>
                                <span>Browse your computer</span>
                            </button>
                        </template>

                        <!-- Has thumbnail -->
                        <template v-else>
                            <div
                                class="flex-list thumbnail-list"
                                :class="{ uploading: uploadingThumbnail }"
                                @click="slotProps.activate()"
                            >
                                <BaseImageSizer aspect="16:9" fit="cover" :controlWidth="true">
                                    <img :src="presentation.thumbnail" />
                                    <div class="pill xs dark size-pill">
                                        <span>16:9</span>
                                    </div>
                                    <BaseLoader
                                        class="thumbnail-loader"
                                        msg="Uploading image"
                                        theme="dark"
                                        v-if="uploadingThumbnail"
                                    />
                                </BaseImageSizer>
                                <BaseImageSizer aspect="9:16" fit="cover" :controlWidth="true">
                                    <img :src="presentation.thumbnail" />
                                    <div class="pill xs dark size-pill">
                                        <span>9:16</span>
                                    </div>
                                    <BaseLoader
                                        class="thumbnail-loader"
                                        msg="Uploading image"
                                        theme="dark"
                                        v-if="uploadingThumbnail"
                                    />
                                </BaseImageSizer>
                            </div>
                            <button class="bottom-action white pill" @click="slotProps.activate()">
                                <i class="far fa-laptop"></i>
                                <span>Choose another file</span>
                            </button>
                        </template>
                    </template>
                </BaseDroparea>
            </div>
        </template>
    </FlowBaseScreen>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import formatBytes from '../../../../mixins/formatBytes'
import FlowBaseScreen from './FlowBaseScreen'
import ImageUploadArea from './ImageUploadArea'

export default {
    name: 'presentationDetailsScreen',
    components: { FlowBaseScreen, ImageUploadArea },
    data() {
        return {
            uploadingThumbnail: false,
        }
    },
    mixins: [formatBytes],
    computed: {
        ...mapGetters('playPresentations', {
            presentation: 'getCurrentPresentation',
        }),
    },
    methods: {
        ...mapActions('workspaces', ['uploadImageToWorkspace']),
        ...mapActions('playPresentations', ['updatePresentationDetails']),
        ...mapActions('videos', ['cancelUpload', 'uploadFileVideo']),
        onNext() {
            this.$emit('next')
            this.updatePresentationDetails(this.presentation)
        },
        async onImageChange(newImage) {
            // Upload the image
            this.uploadingThumbnail = true
            const imageUrl = await this.uploadImageToWorkspace(newImage)
            this.uploadingThumbnail = false
            this.presentation.thumbnail = imageUrl
            this.updatePresentationDetails(this.presentation)
        },
        onCancelUpload() {
            this.cancelUpload(this.presentation.uploadChannel)
        },
        onResumeUpload() {
            this.uploadVideo({ videoFile: this.presentation.uploadChannel.file, file: this.presentation })
        },
        onSubmitName() {
            document.activeElement.blur()
            this.updatePresentationDetails(this.presentation)
        },
    },
}
</script>

<style scoped lang="scss">
.upload-progress-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 20px;
    height: 12px;
    z-index: 1;
    .upload-progress {
        width: 280px;
        overflow: hidden;
        height: 20px;
        background: white;
        &.success {
            .rail {
                .current {
                    background: $success;
                }
            }
        }
        .file-name {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .rail {
            flex-shrink: 0;
            width: 164px;
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
.name-input-wrapper {
    &:focus-within {
        button {
            display: none;
        }
    }
}
.thumbnail-section {
    margin-top: 32px;
    .label {
        margin-bottom: 16px;
        line-height: 1;
    }
    .thumbnail-loader {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    .thumbnail-droparea {
        padding-bottom: 64px;
        .upload-graphic {
            height: 92px;
            width: 92px;
            object-fit: contain;
        }
        .bottom-action {
            position: absolute;
            bottom: 16px;
        }
        .thumbnail-list {
            width: 100%;
            img {
                border-radius: $borderRadiusMd;
            }
            &.uploading {
                img {
                    opacity: 0.5;
                }
            }
        }
        .size-pill {
            position: absolute;
            right: 16px;
            bottom: 16px;
            opacity: 0.75;
            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>
