<template>
    <div class="presenter-mode-button-wrapper">
        <BaseToggle
            v-if="selection"
            :disabled="selection.your_job != 'Alignment'"
            disabledTooltip="Only Selection Owners can activate Presentation Mode"
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
            confirmText="Yes, go live!"
            cancelText="No, i'm not ready yet"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-file"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-presentation"></i>
            </div>
            <h3>You are about to enter Presentation Mode</h3>
            <p>In Presentation Mode, You decide what product is shown in the mobile app.</p>
            <p>
                When a selection is in Presentation Mode, noone can access the selection or any of its sub-selections
                outside of Presentation Mode.
            </p>
            <p><strong>This selection and all sub-selections will be unlocked and made visible</strong></p>

            <div class="available-selection-list">
                <h4>Choose selections to present for:</h4>
                <BaseSelectButtons
                    class="selections-to-present"
                    :submitOnChange="true"
                    optionNameKey="name"
                    :options="availableSelections"
                    v-model="selectionsToPresent"
                />
                <!-- <div class="form-element" v-for="selection in availableSelections" :key="selection.id">
                    <BaseCheckboxInputField v-model="selectionsToPresent">
                        <span>{{ selection.name }}</span>
                    </BaseCheckboxInputField>
                </div> -->
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
import { mapActions, mapGetters } from 'vuex'
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
            getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess}',
            availableSelections: 'getSelectionsAvailableForAlignment',
            getSelectionTree: 'getSelectionTree',
        }),
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        },
    },
    methods: {
        ...mapActions('selections', ['togglePresenterMode', 'startPresentation', 'stopPresentation']),
        async onTogglePresenterMode(selection) {
            if (!this.selection.is_presenting) {
                // Pre-select the selection and all descendants
                this.presetSelectionAndDescendants(selection)

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
@import '~@/_variables.scss';
.available-selection-list {
    text-align: left;
    max-width: 320px;
    margin: auto;
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
