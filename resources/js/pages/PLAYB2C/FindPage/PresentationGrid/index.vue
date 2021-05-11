<template>
    <div class="presentation-grid-wrapper">
        <div class="presentation-grid">
            <div class="card-sizer" v-for="presentation in presentations" :key="presentation.id">
                <PresentationCard
                    :ref="`presentation-${presentation.id}`"
                    class="presentation-card"
                    :presentation="presentation"
                    @contextmenu="onShowContextmenu($event, presentation)"
                    @click.native="onGoToEditPresentation(presentation)"
                />
            </div>
        </div>

        <NewPresentationModal
            v-if="showNewPresentationModal"
            :show="showNewPresentationModal"
            @close="showNewPresentationModal = false"
        />

        <BaseContextMenu ref="presentationContextMenu" class="context-file">
            <template v-if="contextPresentation">
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-play"
                        hotkey="KeyW"
                        @click="onGoToWatchPresentation(contextPresentation)"
                    >
                        <u>W</u>atch presentation
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-edit"
                        hotkey="KeyE"
                        @click="onGoToEditPresentation(contextPresentation)"
                    >
                        <span>Go to <u>E</u>dit presentation</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-pen" hotkey="KeyR" @click="onRename(contextPresentation)">
                        <u>R</u>ename
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        iconClass="far fa-image"
                        hotkey="KeyC"
                        @click="onChangeThumbnail(contextPresentation)"
                    >
                        <u>C</u>hange thumbnail
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-trash-alt"
                        :disabled="workspaceRole != 'Admin'"
                        disabledTooltip="Only admins can delete files"
                        hotkey="KeyD"
                        @click="onDeletePresentation(contextPresentation)"
                    >
                        <span><u>D</u>elete presentation</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

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

        <BaseModal ref="editDetailsModal" :show="showEditDetailsModal" @close="showEditDetailsModal = false">
            <PresentationDetailsScreen nextText="Save details" :hideBack="true" @next="showEditDetailsModal = false" />
        </BaseModal>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PresentationCard from './PresentationCard'
import NewPresentationModal from '../NewPresentationModal/'
import PresentationDetailsScreen from '../NewPresentationModal/PresentationDetailsScreen'

export default {
    name: 'presentationGrid',
    components: { PresentationCard, NewPresentationModal, PresentationDetailsScreen },
    props: ['presentations'],
    data() {
        return {
            showNewPresentationModal: false,
            showEditDetailsModal: false,
            contextPresentation: null,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            workspaceRole: 'getAuthUserWorkspaceRole',
        }),
    },
    methods: {
        ...mapActions('files', ['deleteFile', 'insertOrUpdateFile']),
        ...mapMutations('playPresentations', ['SET_CURRENT_PRESENTATION']),
        onShowNewPresentationModal(presentation) {
            this.SET_CURRENT_PRESENTATION(presentation)
            this.showNewPresentationModal = true
        },
        onShowContextmenu(e, presentation) {
            this.contextPresentation = presentation
            const contextMenu = this.$refs.presentationContextMenu
            // Position the contextual menu
            contextMenu.show(e)
        },
        async onDeletePresentation(presentation) {
            if (await this.$refs.deletePresentationDialog.confirm()) {
                this.deleteFile(presentation)
            }
        },
        onGoToEditPresentation(presentation) {
            if (presentation.video_count > 0) {
                this.$router.push({ name: 'play.editPresentation', params: { presentationId: presentation.id } })
            } else {
                this.onShowNewPresentationModal(presentation)
            }
        },
        onGoToWatchPresentation(presentation) {
            this.$router.push({ name: 'play.watchPresentation', params: { presentationId: presentation.id } })
        },
        onRename(presentation) {
            this.$refs[`presentation-${presentation.id}`][0].rename()
        },
        onChangeThumbnail(presentation) {
            this.SET_CURRENT_PRESENTATION(presentation)
            this.showEditDetailsModal = true
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.presentation-grid {
    display: flex;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-gap: 16px;
    .card-sizer {
        height: 0;
        width: 100%;
        position: relative;
        // padding-top: 75%;
        padding-top: 100%;
        > * {
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
}
</style>
