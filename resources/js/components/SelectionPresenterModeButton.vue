<template>
    <div class="presenter-mode-button-wrapper">
        <BaseToggle
            v-if="selection"
            :disabled="!hasEditAccess"
            :label="showLabel ? 'Presentation' : ''"
            sizeClass="xs"
            :isActive="selection && selection.is_presenting"
            @toggle="onTogglePresenterMode(selection)"
        />

        <!-- Confirm dialog -->
        <BaseDialog
            ref="confirmStart"
            type="confirm"
            confirmColor="primary"
            :confirmText="`Yes, go live (${selectionsToPresent.length})`"
            cancelText="No, i'm not ready yet"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-file"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-presentation"></i>
            </div>
            <h3>You are about to enter Presentation Mode</h3>
            <p>In Presentation Mode, You decide what product is shown in the app.</p>

            <div class="available-selection-list">
                <h4>Choose selections to present for:</h4>
                <div class="selections-to-present">
                    <BaseSelectButton
                        v-for="theSelection in availableSelections"
                        :key="theSelection.id"
                        :modelValue="theSelection"
                        v-model="selectionsToPresent"
                        :disabled="
                            selectionsToPresent.length > 0 &&
                                selectionsToPresent[0].product_set_identifier != theSelection.product_set_identifier
                        "
                        disabledTooltip="Selection belongs to different chapter."
                    >
                        <div class="pill xs" v-if="theSelection.parent_chapter">
                            <i class="fas fa-project-diagram"></i><span>{{ theSelection.parent_chapter.name }}</span>
                        </div>
                        <i
                            class="far fa-presentation primary"
                            v-if="theSelection.is_presenting"
                            v-tooltip="'In presentation'"
                        ></i>
                        <span>{{ theSelection.name }}</span>
                    </BaseSelectButton>
                </div>
            </div>
        </BaseDialog>

        <BaseDialog
            ref="confirmStop"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, end presentation"
            cancelText="No, stay live"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-presentation"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-times"></i>
            </div>
            <h3>You are about to stop Presentation Mode</h3>
            <p>This will end Presentation Mode for all viewers.</p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'selectionPresenterModeButton',
    props: {
        selection: {},
        showLabel: {
            default: true,
        },
    },
    data: function() {
        return {
            selectionsToPresent: [],
        }
    },
    computed: {
        ...mapGetters('selections', {
            availableSelections: 'getSelectionsAvailableForPresentation',
            allSelections: 'getSelections',
        }),
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('auth', {
            authUser: 'authUser',
        }),
        hasEditAccess() {
            if (!this.selection) return false
            return (
                (!this.selection.is_presenting &&
                    this.selection.your_job == 'Alignment' &&
                    this.selection.your_role == 'Owner') ||
                (this.selection.is_presenting && this.currentFile.editable) ||
                (this.selection.presentation && this.selection.presentation.presenter.id == this.authUser.id)
            )
        },
    },
    methods: {
        ...mapActions('selections', [
            'togglePresenterMode',
            'startPresentation',
            'stopPresentation',
            'fetchSelection',
            'fetchSelections',
            'createSelectionTree',
        ]),
        ...mapMutations('selections', ['UPDATE_SELECTION']),
        async onTogglePresenterMode(selection) {
            if (!this.selection.is_presenting) {
                // Make sure we have fethed the selections children
                if (!selection.children || selection.children.length <= 0) {
                    const selections =
                        this.allSelections && this.allSelections.length > 0
                            ? this.allSelections
                            : await this.fetchSelections({ fileId: selection.file_id })
                    const tree = await this.createSelectionTree(selections)
                    const theSelection = selections.find(x => x.id == selection.id)
                    await this.UPDATE_SELECTION(theSelection)
                }

                const hasChapters = this.availableSelections.find(x => x.type == 'Chapter')
                if (!(hasChapters && selection.type == 'Master')) {
                    // Pre-select the selection and all descendants
                    this.presetSelectionAndDescendants(selection)
                }

                if (await this.$refs.confirmStart.confirm()) {
                    this.startPresentation({ selections: this.selectionsToPresent })
                }
            } else {
                const dialogToShow = selection.is_presenting ? this.$refs.confirmStop : this.$refs.confirmStart
                if (await dialogToShow.confirm()) {
                    await this.stopPresentation({ presentationId: selection.presentation_id })
                    // await this.togglePresenterMode({ selection })
                    this.$emit('toggle', !selection.is_presenting)
                }
            }
        },
        presetSelectionAndDescendants(selection) {
            const existsInArray = this.selectionsToPresent.find(x => x.id == selection.id)
            if (!existsInArray) {
                // Find the selection in the available selections list
                const selectionToPush = this.availableSelections.find(x => x.id == selection.id)
                if (selectionToPush) {
                    this.selectionsToPresent.push(selectionToPush)
                }
            }

            selection.children.map(child => {
                this.presetSelectionAndDescendants(child)
            })
        },
    },
}
</script>

<style scoped lang="scss">
::v-deep {
    .modal {
        width: 560px;
    }
}
.available-selection-list {
    text-align: left;
    // max-width: 320px;
    // margin: auto;
    margin-top: 20px;
    h4 {
        margin: 4px 0;
    }
}
.selections-to-present {
    background: $bg;
    border-radius: $borderRadiusEl;
    border: $borderEl;
}
</style>
