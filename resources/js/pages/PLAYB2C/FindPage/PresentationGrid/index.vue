<template>
    <div class="presentation-grid-wrapper">
        <div class="presentation-grid">
            <div class="card-sizer" v-for="presentation in presentations" :key="presentation.id">
                <PresentationCard
                    class="presentation-card"
                    :presentation="presentation"
                    @contextmenu.prevent.native="onShowContextmenu($event, presentation)"
                    @click.native="onGoToPresentation(presentation)"
                />
            </div>
            <div class="card-sizer">
                <div class="new-presentation presentation-card flex-list center-v center-h" @click="onNewPresentation">
                    <div class="flex-list flex-v center-v center-h">
                        <i class="far fa-plus lg"></i>
                        <p>New Presentation</p>
                    </div>
                </div>
            </div>
        </div>

        <NewPresentationModal
            v-if="showNewPresentationModal"
            :show="showNewPresentationModal"
            @close="showNewPresentationModal = false"
        />

        <BaseContextMenu ref="presentationContextMenu" class="context-file">
            <div class="item-group" v-if="contextPresentation">
                <BaseContextMenuItem iconClass="far fa-file" hotkey="KeyV"> <u>V</u>iew file </BaseContextMenuItem>
            </div>
            <!-- <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-pen"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can rename files"
                    hotkey="KeyR"
                    @click="fileToEdit = contextMenuItem"
                >
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-long-arrow-alt-right"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can move files"
                    hotkey="KeyM"
                    @click="onMoveFiles()"
                >
                    <span><u>M</u>ove to</span>
                </BaseContextMenuItem>
            </div> -->
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    :disabled="workspaceRole != 'Admin'"
                    disabledTooltip="Only admins can delete files"
                    hotkey="KeyD"
                    @click="onDeletePresentation(contextPresentation)"
                >
                    <span><u>D</u>elete file</span>
                </BaseContextMenuItem>
            </div>
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
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PresentationCard from './PresentationCard'
import NewPresentationModal from '../NewPresentationModal/'

export default {
    name: 'presentationGrid',
    components: { PresentationCard, NewPresentationModal },
    props: ['presentations'],
    data() {
        return {
            showNewPresentationModal: false,
            contextPresentation: null,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            workspaceRole: 'getAuthUserWorkspaceRole',
        }),
    },
    methods: {
        ...mapActions('playPresentations', ['instantiateBasePresentation']),
        ...mapActions('files', ['deleteFile', 'insertOrUpdateFile']),
        ...mapMutations('playPresentations', ['SET_CURRENT_PRESENTATION']),
        async onNewPresentation() {
            // Secretly create a new file
            const newPresentation = await this.instantiateBasePresentation()
            this.onShowNewPresentationModal(newPresentation)
            await this.insertOrUpdateFile({ file: newPresentation })
        },
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
        onGoToPresentation(presentation) {
            if (presentation.video_count > 0) {
                this.$router.push({ name: 'play.editPresentation', params: { presentationId: presentation.id } })
            } else {
                this.onShowNewPresentationModal(presentation)
            }
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
        padding-top: 75%;
        > * {
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
        }
    }
    .presentation-card {
        background: white;
        border: $borderEl;
        border-radius: 8px;
        transition: 0.1s ease-out;
        cursor: pointer;
        &.disabled {
            background: $bluegrey400;
            cursor: default;
        }
        &:not(.disabled) {
            &:hover {
                // background: $dark;
                // color: white;
                box-shadow: 0 3px 6px 0 rgba(117, 134, 156, 0.5);
                transform: translateY(-4px);
            }
        }
    }
}
</style>
