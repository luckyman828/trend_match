<template>
    <BaseModal :show="show" @close="$emit('close')">
        <div class="form-wrapper">
            <h3>Video thumbnail</h3>
            <p>
                <i class="far fa-info-circle"></i>
                This image will be shown on the login screen, when users are trying to join your video presentation.
            </p>
            <div class="img-wrapper form-element">
                <BaseLoader v-if="uploadingImage" msg="Uploading image" />
                <template v-else-if="currentVideo.thumbnail && !editImageActive">
                    <img :src="currentVideo.thumbnail" />
                    <div class="hover flex-list flex-v center-h center-v">
                        <button class="white" @click="editImageActive = true">
                            <i class="far fa-pen"></i>
                            <span>Change cover image</span>
                        </button>
                    </div>
                </template>
                <BaseDroparea v-else accept="image/*" ref="droparea" v-slot="slotProps" @input="onFilesChange">
                    <div class="flex-list flex-v center-h" @click="slotProps.activate()">
                        <i class="far fa-image lg grey"></i>
                        <span>Drag files here or</span>
                        <button class="primary">
                            <span>Click to browse</span>
                        </button>
                    </div>
                    <button class="ghost cancel-button" v-if="currentVideo.thumbnail" @click="editImageActive = false">
                        <i class="far fa-times"></i>
                        <span>Cancel</span>
                    </button>
                </BaseDroparea>
            </div>
            <button class="primary form-element full-width lg" @click="$emit('close')">
                <span>Done</span>
            </button>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'videoThumbnailModal',
    data: function() {
        return {
            uploadingMsg: null,
            uploadingImage: false,
            editImageActive: false,
        }
    },
    props: ['show'],
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
    },
    methods: {
        ...mapActions('workspaces', ['uploadImageToWorkspace']),
        ...mapActions('videoPresentation', ['updateVideoThumbnail']),
        async onFilesChange(fileList) {
            this.uploadingImage = true
            this.uploadingMsg = 'Uploading image'
            this.editImageActive = false

            const file = fileList[0]
            const newUrl = await this.uploadImageToWorkspace(file)

            console.log('uploaded thumbnail', newUrl)
            this.currentVideo.thumbnail = newUrl
            this.uploadingMsg = 'Saving video changes'
            await this.updateVideoThumbnail(this.currentVideo)

            this.uploadingImage = false
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

h3 {
    margin-top: 28px;
}

.img-wrapper {
    width: 100%;
    border: $borderEl;
    position: relative;
    height: 292px;
    > * {
        height: 100%;
    }
    img {
        height: 100%;
        width: 100%;
        object-fit: contain;
    }
    .hover {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: none;
        background: rgba(black, 0.5);
    }
    &:hover {
        .hover {
            display: flex;
        }
    }
}
.cancel-button {
    position: absolute;
    right: 12px;
    top: 4px;
}
</style>
