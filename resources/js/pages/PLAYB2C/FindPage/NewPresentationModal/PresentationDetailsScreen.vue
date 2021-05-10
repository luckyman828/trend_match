<template>
    <FlowBaseScreen class="presentation-details-screen" @next="onNext" @back="$emit('back')">
        <p>I am secretly uploading your file in the background :3</p>
        <BaseInputField v-model="presentation.name" :selectOnFocus="true" />
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
    computed: {
        ...mapGetters('playPresentations', {
            presentation: 'getCurrentPresentation',
        }),
    },
    methods: {
        ...mapActions('workspaces', ['uploadImageToWorkspace']),
        ...mapActions('playPresentations', ['updatePresentationDetails']),
        onNext() {
            this.$emit('next')
            this.updatePresentationDetails(this.presentation)
        },
        async onImageChange(newImage) {
            // Upload the image
            const imageUrl = await this.uploadImageToWorkspace(newImage)
            this.presentation.thumbnail = imageUrl
        },
    },
    async mounted() {
        console.log('mounted')
        await this.onImageChange(this.presentation.thumbnail_blob)
        this.updatePresentationDetails(this.presentation)
    },
}
</script>

<style></style>
