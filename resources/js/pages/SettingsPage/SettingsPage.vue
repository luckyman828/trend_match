<template>
    <div class="settings-page">
        <h1>Settings</h1>
        <div class="form-wrapper">
            <div class="form-section">
                <h3>Workspace Cover Image</h3>
                <p>
                    <i class="far fa-info-circle"></i>
                    This image will be shown on the login screen, when users are trying to join your selections, if no
                    other cover image is available.
                </p>
                <div class="img-wrapper">
                    <BaseLoader v-if="uploadingCoverImage" msg="Uploading image" />
                    <template v-else-if="workspace.cover_image && !editImageActive">
                        <img :src="workspace.cover_image" />
                        <div class="hover flex-list flex-v center-h center-v">
                            <button class="white" @click="editImageActive = true">
                                <i class="far fa-pen"></i>
                                <span>Replace cover image</span>
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
                        <button
                            class="ghost cancel-button"
                            v-if="workspace.cover_image"
                            @click="editImageActive = false"
                        >
                            <i class="far fa-times"></i>
                            <span>Cancel</span>
                        </button>
                    </BaseDroparea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'settingsPage',
    data: function() {
        return {
            coverImageToUpload: null,
            editImageActive: false,
            uploadingCoverImage: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
            realRole: 'getRealWorkspaceRole',
        }),
    },
    methods: {
        ...mapActions('workspaces', ['uploadWorkspaceCoverImage']),
        async onFilesChange(fileList) {
            this.uploadingCoverImage = true
            const file = fileList[0]
            this.editImageActive = false
            await this.uploadWorkspaceCoverImage(file)
            this.uploadingCoverImage = false
        },
    },
    created() {
        if (this.realRole != 'Owner') this.$router.push({ name: 'files' })
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.form-wrapper {
    max-width: 600px;
}
.img-wrapper {
    width: 100%;
    border: $borderEl;
    position: relative;
    height: 336px;
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
