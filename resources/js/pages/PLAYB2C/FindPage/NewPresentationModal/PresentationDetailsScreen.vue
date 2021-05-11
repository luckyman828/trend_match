<template>
    <FlowBaseScreen
        class="presentation-details-screen"
        @next="onNext"
        @back="$emit('back')"
        header="Name and thumbnail"
        subHeader="Choose how you want to present you styles"
    >
        <div class="upload-progess bg-theme-light flex-list center-v" v-if="presentation.uploadChannel">
            <div class="name">{{ presentation.uploadChannel.file.name }}</div>
            <div class="size">{{ presentation.uploadChannel.file.size }}</div>
            <div class="progress">
                {{ presentation.uploadChannel.progress.status }}
                {{ presentation.uploadChannel.progress.progressPercentage }}
            </div>
            <button
                class="invisible pill ghost-hover"
                @click="onCancelUpload"
                v-if="['Uploading'].includes(presentation.uploadChannel.progress.status)"
            >
                <i class="far fa-times"></i>
                <span>Cancel</span>
            </button>
            <button
                class="invisible pill ghost-hover"
                @click="onCancelUpload"
                v-if="['Cancelled', 'Failed'].includes(presentation.uploadChannel.progress.status)"
            >
                <i class="far fa-play"></i>
                <span v-if="presentation.uploadChannel.progress.status == 'Failed'">Retry</span>
                <span v-if="presentation.uploadChannel.progress.status == 'Cancelled'">Resume</span>
            </button>
            <div class="invisible pill" v-if="presentation.uploadChannel.progress.status == 'Success'">
                <i class="far fa-check"></i>
                <span>Success</span>
            </div>
        </div>

        <BaseInputField v-model="presentation.name" :selectOnFocus="true" label="Presentation name" />

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
    },
}
</script>

<style></style>
