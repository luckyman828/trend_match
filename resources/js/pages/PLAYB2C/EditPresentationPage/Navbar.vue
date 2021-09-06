<template>
    <portal to="navbar">
        <div class="navbar-edit-presentation">
            <div class="flex-list justify">
                <div class="items-left flex-list space-md center-v">
                    <router-link class="button ghost primary pill" :to="{ name: 'play.find' }">
                        <i class="far fa-arrow-left"></i>
                        <span>Back</span>
                    </router-link>
                    <div class="presentation-name ft-12 ft-md" @click="showRenamePresentationModal = true">
                        {{ presentation.name }} <i class="far fa-pen edit"></i>
                    </div>
                </div>
                <div class="item-right flex-list center-v">
                    <div
                        class="upload-status pill sm yellow"
                        v-if="presentation.uploadChannel && presentation.uploadChannel.progress.status == 'Uploading'"
                    >
                        <i class="far fa-exclamation-triangle"></i>
                        <span>Keep Kollekt open while uploading</span>
                    </div>
                    <div
                        class="upload-status pill sm primary"
                        v-if="presentation.uploadChannel && presentation.uploadChannel.progress.status == 'Processing'"
                    >
                        <i class="far fa-info-circle"></i>
                        <span>Video is being processed. You may close Kollekt now.</span>
                    </div>
                    <div class="save-status pill sm w-xl" :class="saveStatus.theme">
                        <i class="far" :class="saveStatus.icon"></i>
                        <span>{{ saveStatus.msg }}</span>
                    </div>
                    <button class="pill ghost" v-show-contextmenu="{ ref: 'moreContext', placement: 'bottom' }">
                        <i class="far fa-ellipsis-h"></i>
                        <span>More</span>
                    </button>
                    <button class="pill dark" @click="showPublishModal = true">
                        <i class="fal fa-paper-plane"></i>
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            <div
                class="upload-progress rail"
                v-if="presentation.uploadChannel"
                :class="{ success: presentation.uploadChannel.progress.status != 'Uploading' }"
            >
                <div class="current" :style="{ width: presentation.uploadChannel.progress.progressPercentage }"></div>
            </div>

            <BaseContextMenu ref="moreContext" class="more-context">
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-file-video"
                        hotkey="KeyC"
                        :disabled="true"
                        disabledTooltip="Coming soon. Create a new video for now."
                    >
                        <u>C</u>hange video
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-pen"
                        hotkey="KeyR"
                        @click="showRenamePresentationModal = true"
                    >
                        <u>R</u>ename
                    </BaseContextMenuItem>
                    <BaseContextMenuItem iconClass="far fa-image" hotkey="KeyT" @click="showEditDetailsModal = true">
                        <span>Change <u>t</u>humbnail</span>
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-file-video"
                        hotkey="KeyL"
                        :disabled="true"
                        disabledTooltip="Coming soon"
                    >
                        <span>Go <u>l</u>ive</span>
                    </BaseContextMenuItem>
                    <BaseContextMenuItem iconClass="far fa-trash" hotkey="KeyD" @click="onDeletePresentation">
                        <u>D</u>elete presenation
                    </BaseContextMenuItem>
                </div>
            </BaseContextMenu>

            <RenamePresentationModal
                :show.sync="showRenamePresentationModal"
                v-if="showRenamePresentationModal"
                @submit="onSubmitRename"
            />

            <PublishModal :show.sync="showPublishModal" v-if="showPublishModal" />

            <BaseModal ref="editDetailsModal" :show.sync="showEditDetailsModal">
                <PresentationDetailsScreen nextText="Save details" :hideBack="true" @next="onSubmitDetails" />
            </BaseModal>

            <BaseDialog
                ref="deletePresentationDialog"
                type="confirm"
                confirmText="Yes, delete it"
                cancelText="No, keep it"
                confirmColor="red"
            >
                <div class="icon-graphic">
                    <i class="far fa-file primary lg"></i>
                    <i class="far fa-arrow-right lg"></i>
                    <i class="far fa-trash lg dark"></i>
                </div>
                <h3>Really delete this presentation?</h3>
                <p>It will be permanently deleted</p>
            </BaseDialog>
        </div>
    </portal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RenamePresentationModal from '../../../components/PLAY/RenamePresentationModal'
import PublishModal from '../../../components/PLAY/PublishModal'
import PresentationDetailsScreen from '../FindPage/NewPresentationModal/PresentationDetailsScreen'

export default {
    name: 'editVideoPresentationNavbar',
    components: {
        RenamePresentationModal,
        PresentationDetailsScreen,
        PublishModal,
    },
    data() {
        return {
            showRenamePresentationModal: false,
            showPublishModal: false,
            showEditDetailsModal: false,
            currentStatus: 'success',
            statusUpdateTimeout: null,
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
            status: 'getStatus',
        }),
        saveStatus() {
            if (this.currentStatus == 'saving') {
                return {
                    icon: 'fa-save',
                    msg: 'Saving changes..',
                    theme: 'primary',
                }
            }
            if (this.currentStatus == 'error') {
                return {
                    icon: 'fa-exclamation-triangle',
                    msg: 'Error saving',
                    theme: 'yellow',
                }
            } else {
                return {
                    icon: 'fa-check-circle',
                    msg: 'Changes auto saved',
                    theme: 'secondary',
                }
            }
        },
    },
    watch: {
        status(newVal) {
            // Make sure we show that we are saving for a little while to affirm the user
            const delay = 500
            if (newVal == 'saving') this.currentStatus = newVal
            else {
                if (this.statusUpdateTimeout) {
                    clearTimeout(this.statusUpdateTimeout)
                }
                this.statusUpdateTimeout = setTimeout(() => {
                    this.currentStatus = newVal
                }, delay)
            }
        },
    },
    methods: {
        ...mapActions('files', ['deleteFile']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async onDeletePresentation() {
            if (await this.$refs.deletePresentationDialog.confirm()) {
                await this.deleteFile(this.presentation).then(wasDeleted => {
                    if (wasDeleted) {
                        this.$router.push({ name: 'play.find' })
                    }
                })
            }
        },
        onSubmitDetails() {
            this.showEditDetailsModal = false
            this.SHOW_SNACKBAR({
                type: 'success',
                iconClass: 'far fa-check',
                msg: 'Presenation details updated',
            })
        },
        onSubmitRename() {
            this.SHOW_SNACKBAR({
                type: 'success',
                iconClass: 'far fa-check',
                msg: 'Presenation renamed',
            })
        },
    },
}
</script>

<style scoped lang="scss">
.presentation-name {
    cursor: pointer;
    color: $themeWhiteFontSoft;
    i.edit {
        transition: 0.2s ease-out;
        opacity: 0;
        margin-left: 4px;
    }
    &:hover {
        text-decoration: underline;
        i.edit {
            opacity: 1;
        }
    }
}
.more-context {
    z-index: 9;
}
.upload-progress {
    width: 100%;
    height: 4px;
    background: $themeLightBg;
    position: absolute;
    bottom: 0;
    left: 0;
    &.success {
        .current {
            background: $green;
        }
    }
    .current {
        height: 100%;
        border-radius: 0 2px 2px 0;
        background: $primary;
        transition: 0.2s;
    }
}
</style>
