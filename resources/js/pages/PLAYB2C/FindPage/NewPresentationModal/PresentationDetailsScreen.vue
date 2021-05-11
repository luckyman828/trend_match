<template>
    <FlowBaseScreen
        class="presentation-details-screen"
        @next="onNext"
        @back="$emit('back')"
        header="Name and thumbnail"
        subHeader="Details"
        v-bind="$attrs"
    >
        <div class="name-input-wrapper bg-theme-light">
            <BaseInputField
                v-model="presentation.name"
                :selectOnFocus="true"
                label="Presentation name"
                @submit="onSubmitName"
            />
        </div>

        <label>Thumbnail</label>
        <ImageUploadArea
            :image.sync="presentation.thumbnail"
            v-model="imageToUpload"
            @input="onImageChange"
            aspect="4:3"
            fit="cover"
        />
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
            imageToUpload: null,
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
    border-radius: $borderRadiusMd;
    padding: 8px 12px;
    width: 300px;
    &::v-deep {
        input {
            line-height: 1;
            font-weight: 700;
            font-size: 14px;
            &:not(:focus) {
                border: none;
                padding: 0;
                height: auto;
                min-height: 0;
                background: none;
            }
        }
    }
}
</style>
