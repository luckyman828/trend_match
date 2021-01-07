<template>
    <div class="presenter-mode-button-wrapper">
        <!-- <v-popover :disabled="selection.your_job != 'Alignment' || !selection.is_presenting"> -->
        <v-popover :disabled="true">
            <BaseToggle
                v-if="selection"
                :disabled="selection.your_job != 'Alignment'"
                disabledTooltip="Only Selection Owners can activate Presentation Mode"
                :label="showLabel ? 'Presentation' : ''"
                sizeClass="xs"
                :isActive="selection && selection.is_presenting"
                @toggle="onTogglePresenterMode(selection)"
            />
            <!-- <div class="selection-list" slot="popover">
                <div class="selection-list-item" v-for="selection in currentPresentation.selections">
                    <i class="far fa-poll"></i>
                    <span>{{selection.name}}</span>
                </div>
            </div> -->
        </v-popover>

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
            <!-- <p>
                When a selection is in Presentation Mode, noone can access the selection or any of its sub-selections
                outside of Presentation Mode.
            </p> -->
            <!-- <p><strong>The selected selection will be unlocked and made visible.</strong></p> -->

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
                    console.log('show dialog pls')
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
@import '~@/_variables.scss';
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
