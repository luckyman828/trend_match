<template>
    <BaseToggle v-if="selection && selection.type == 'Master'"
        :disabled="!userHasEditAccess"
        disabledTooltip="Only Selection Owners can activate Presentation Mode"
        :label="showLabel ? 'Presentation' : ''" sizeClass="xs"
        :isActive="selection && selection.presenterModeActive"
        @toggle="onTogglePresenterMode(selection)"/>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'selectionPresenterModeButton',
    props: {
        selection: {},
        showLabel: {
            default: true
        }
    },
    computed: {
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess']),
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        }
    },
    methods: {
        ...mapActions('selections', ['togglePresenterMode']),
        onTogglePresenterMode(selection) {
            if (confirm(!selection.presenterModeActive ? 
                'ATTENTION: You are about to enter Presentation Mode.\n\nIn Presentation Mode, You decide what product is shown in the mobile app.\n\nWhen a selection is in Presentation Mode, noone can access the selection or any of its sub-selections outside of Presentation Mode.\n\nPress "Okay" to continue.'
                : 'ATTENTION: You are about to stop Presentation Mode.\n\nThis will end Presentation Mode for all viewers.\n\n Press "Okay" to continue.'
            )) {
                this.togglePresenterMode(selection)
            }
        }
    }
}
</script>

<style>

</style>