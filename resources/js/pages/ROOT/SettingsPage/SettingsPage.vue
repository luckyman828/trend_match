<template>
    <div class="settings-page sm">
        <button class="pill ghost primary sm" @click="$router.go(-1)">
            <i class="far fa-arrow-left"></i>
            <span>Back</span>
        </button>
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

            <TicketLabelsForm class="form-section" />

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

            <template v-if="isSystemAdmin">
                <h1>System admin settings</h1>

                <!-- PLAY SHOP -->
                <div class="form-section">
                    <h4>PLAY SHOP</h4>
                    <div class="form-element">
                        <BaseCheckboxInputField
                            :value="!!workspace.play_shop"
                            :modelValue="true"
                            @input="onTogglePlayShop"
                        >
                            <span>Link PLAY Shop</span>
                        </BaseCheckboxInputField>
                    </div>
                    <template v-if="workspace.play_shop">
                        <div class="form-element">
                            <BaseDropdownInputField
                                type="radio"
                                v-model="workspace.play_shop.type"
                                innerlabel="Shop type"
                                :options="['SHOPIFY', 'DKC_BAP']"
                            />
                        </div>
                        <div class="form-element">
                            <BaseInputField
                                v-model="workspace.play_shop.url"
                                innerlabel="Shop URL"
                                placeholder="https://my-webshop.com"
                            />
                        </div>
                        <div class="form-element">
                            <BaseInputField
                                v-model="workspace.play_shop.checkout_url"
                                innerlabel="Shop checkout URL"
                                placeholder="https://my-webshop.com/checkout"
                            />
                        </div>
                    </template>
                    <button class="primary full-width lg" @click="onUpdateWorkspaceDetails">
                        <span>Save PLAY Shop changes</span>
                    </button>
                </div>

                <!-- WORKSPACE FEATURES  -->
                <div class="form-section">
                    <h4>Enabled features</h4>
                    <div class="form-element" v-for="(feature, index) in allFeatures" :key="index">
                        <BaseCheckboxInputField
                            v-model="workspace.feature_flags"
                            :modelValue="feature"
                            @input="onUpdateWorkspaceDetails"
                        >
                            <span>{{ feature }}</span>
                        </BaseCheckboxInputField>
                    </div>
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
            </template>
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
import Breadcrumbs from '../../../components/common/Breadcrumbs'
import CustomProductFieldsForm from './CustomProductFieldsForm'
import ProductLabelsForm from './ProductLabelsForm'
import TicketLabelsForm from './TicketLabelsForm'
export default {
    name: 'settingsPage',
    components: {
        Breadcrumbs,
        CustomProductFieldsForm,
        ProductLabelsForm,
        TicketLabelsForm,
    },
    data: function() {
        return {
            editImageActive: false,
            editLogoActive: false,
            uploadingCoverImage: false,
            uploadingLogo: false,
            showDangerousOptions: false,
            prevRoute: null,
            basePlayShop: {
                type: 'SHOPIFY',
                url: '',
                checkout_url: '',
            },
        }
    },
    computed: {
        ...mapGetters('kollektFeatures', {
            allFeatures: 'getFeatureFlags',
        }),
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
                this.deleteWorkspace(this.workspace)
            }
        },
        async onUpdateWorkspaceDetails() {
            this.workspace.style_option_enabled = this.workspace.feature_flags.includes('bestseller_style_option')
            await this.updateWorkspaceDetails(this.workspace)
        },
        onTogglePlayShop(shopEnabled) {
            if (this.workspace.play_shop) {
                this.basePlayShop = this.workspace.play_shop
                this.workspace.play_shop = null
            } else {
                this.workspace.play_shop = this.basePlayShop
            }
        },
    },
    created() {
        if (this.realRole != 'Owner' && !this.isSystemAdmin) this.$router.push({ name: 'files' })
    },
}
</script>

<style scoped lang="scss">
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
