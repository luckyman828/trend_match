<template>
    <div class="settings-page">
        <Breadcrumbs />
        <h1>Settings</h1>
        <div class="form-wrapper">
            <div class="form-section">
                <h3>Workspace name</h3>
                <BaseEditInputWrapper
                    v-model="workspace.title"
                    :oldValue="workspace.title"
                    @submit="onUpdateWorkspaceDetails"
                />
            </div>

            <CustomProductFieldsForm class="form-section" />

            <ProductLabelsForm class="form-section" />

            <div class="form-section">
                <h3>Workspace logo</h3>
                <div class="img-wrapper logo-wrapper">
                    <BaseLoader v-if="uploadingLogo" msg="Uploading image" />
                    <template v-else-if="workspace.logo && !editLogoActive">
                        <img :src="workspace.logo" />
                        <div class="hover flex-list flex-v center-h center-v">
                            <button class="white" @click="editLogoActive = true">
                                <i class="far fa-pen"></i>
                                <span>Change logo</span>
                            </button>
                        </div>
                    </template>
                    <BaseDroparea v-else accept="image/*" ref="droparea" v-slot="slotProps" @input="onLogoFilesChange">
                        <div class="flex-list flex-v center-h" @click="slotProps.activate()">
                            <i class="far fa-image lg grey"></i>
                            <span>Drag files here or</span>
                            <button class="primary">
                                <span>Click to browse</span>
                            </button>
                        </div>
                        <button v-if="workspace.logo" class="ghost cancel-button" @click="editLogoActive = false">
                            <i class="far fa-times"></i>
                            <span>Cancel</span>
                        </button>
                    </BaseDroparea>
                </div>
            </div>

            <div class="form-section">
                <h3>Workspace cover image</h3>
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
                                <span>Change cover image</span>
                            </button>
                        </div>
                    </template>
                    <BaseDroparea v-else accept="image/*" ref="droparea" v-slot="slotProps" @input="onCoverFilesChange">
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

            <div class="form-section" v-if="isSystemAdmin">
                <div class="form-element">
                    <button class="ghost" @click="showDangerousOptions = !showDangerousOptions">
                        <i class="far fa-eye"></i>
                        <span>Show dangerous options</span>
                    </button>
                </div>
                <div class="form-element" v-if="showDangerousOptions">
                    <BaseButton
                        buttonClass="red"
                        @click="onDeleteWorkspace"
                        :disabled="!users || users.length > 0"
                        disabledTooltip="Workspace still has users. You must remove all users before you can delete this workspace."
                    >
                        <i class="far fa-trash"></i>
                        <span>Delete workspace</span>
                    </BaseButton>
                </div>
            </div>
        </div>

        <BaseDialog ref="confirmDeleteWorkspace" type="confirm" confirmColor="red">
            <div class="icon-graphic">
                <i class="lg primary far fa-building"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete this workspace?</h3>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import CustomProductFieldsForm from './CustomProductFieldsForm'
import ProductLabelsForm from './ProductLabelsForm'
export default {
    name: 'settingsPage',
    components: {
        Breadcrumbs,
        CustomProductFieldsForm,
        ProductLabelsForm,
    },
    data: function() {
        return {
            editImageActive: false,
            editLogoActive: false,
            uploadingCoverImage: false,
            uploadingLogo: false,
            showDangerousOptions: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
            realRole: 'getRealWorkspaceRole',
        }),
        ...mapGetters('users', {
            users: 'users',
        }),
        ...mapGetters('auth', {
            isSystemAdmin: 'getIsSystemAdmin',
        }),
    },
    methods: {
        ...mapActions('workspaces', [
            'uploadWorkspaceCoverImage',
            'uploadWorkspaceLogo',
            'updateWorkspaceDetails',
            'deleteWorkspace',
        ]),
        async onCoverFilesChange(fileList) {
            this.uploadingCoverImage = true
            const file = fileList[0]
            this.editImageActive = false
            await this.uploadWorkspaceCoverImage(file)
            this.uploadingCoverImage = false
        },
        async onLogoFilesChange(fileList) {
            this.uploadingLogo = true
            const file = fileList[0]
            this.editLogoActive = false
            await this.uploadWorkspaceLogo(file)
            this.uploadingLogo = false
        },
        async onDeleteWorkspace() {
            // Check if the workspace has users
            if ((await this.$refs.confirmDeleteWorkspace.confirm()) && this.users.length <= 0) {
                console.log('delete workspace', this.users)
                this.deleteWorkspace(this.workspace)
            }
        },
        async onUpdateWorkspaceDetails() {
            await this.updateWorkspaceDetails(this.workspace)
        },
    },
    created() {
        if (this.realRole != 'Owner' && !this.isSystemAdmin) this.$router.push({ name: 'files' })
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
.logo-wrapper {
    height: 160px;
}
.cancel-button {
    position: absolute;
    right: 12px;
    top: 4px;
}
.custom-property-list {
}
</style>
