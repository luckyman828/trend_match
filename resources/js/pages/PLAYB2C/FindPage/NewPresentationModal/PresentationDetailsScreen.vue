<template>
    <FlowBaseScreen
        class="presentation-details-screen"
        @next="onNext"
        @back="$emit('back')"
        header="Name and thumbnail"
        subHeader="Presentation details"
        v-bind="$attrs"
    >
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
                        <div class="flex-list thumbnail-list">
                            <BaseImageSizer aspect="16:9" fit="cover" :controlWidth="true">
                                <img :src="presentation.thumbnail" />
                                <div class="pill xs dark size-pill">
                                    <span>16:9</span>
                                </div>
                            </BaseImageSizer>
                            <BaseImageSizer aspect="9:16" fit="cover" :controlWidth="true">
                                <img :src="presentation.thumbnail" />
                                <div class="pill xs dark size-pill">
                                    <span>9:16</span>
                                </div>
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
        return {}
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
            const imageUrl = await this.uploadImageToWorkspace(newImage)
            this.presentation.thumbnail = imageUrl
        },
        onCancelUpload() {
            this.cancelUpload(this.presentation.uploadChannel)
        },
        onResumeUpload() {
            this.uploadVideo({ videoFile: this.presentation.uploadChannel.file, file: this.presentation })
        },
        onSubmitName() {
            document.activeElement.blur()
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
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
