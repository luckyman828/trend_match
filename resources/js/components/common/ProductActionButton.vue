<template>
    <BaseButton
        :buttonClass="[selectionInput[currentAction] != action ? 'white' : actionColor, buttonClass]"
        :disabled="!userWriteAccess.actions.hasAccess"
        v-tooltip="userWriteAccess.actions.msg"
        @click="onUpdateAction(action)"
    >
        <i :class="[actionIconClass, actionIconColor]"></i>
        <span v-if="displayStyle != 'iconOnly' && displayStyle != 'coleredIcons'">{{ action }}</span>
    </BaseButton>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'productActionButton',
    props: ['action', 'product', 'displayStyle', 'buttonClass'],
    computed: {
        actionColor() {
            const action = this.action
            if (action == 'Out') return 'red'
            if (action == 'Focus') return 'primary'
            if (action == 'In') return 'green'
        },
        actionIconClass() {
            const action = this.action
            if (action == 'Out') return this.displayStyle == 'coleredIcons' ? 'fas fa-times' : 'far fa-times-circle'
            if (action == 'Focus') return 'far fa-star'
            if (action == 'In') return 'far fa-heart'
        },
        actionIconColor() {
            if (!this.displayStyle == 'coloredIcons') return
            return this.selectionInput[this.currentAction] == this.action ? 'white' : this.actionColor
        },
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            currentSelectionMode: 'currentSelectionMode',
            getAuthUserSelectionWriteAccess: 'getAuthUserSelectionWriteAccess',
            getSelectionModeAction: 'getSelectionModeAction',
        }),
        currentSelectionModeAction() {
            return this.getSelectionModeAction(this.currentSelectionMode)
        },
        currentAction() {
            return this.currentSelectionModeAction
        },
        selectionInput() {
            return this.getActiveSelectionInput(this.product)
        },
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.selection, this.product)
        },
    },
    methods: {
        ...mapActions('actions', ['updateFeedbacks', 'updateActions']),
        onUpdateAction(action) {
            const selectionInput = this.selectionInput
            if (this.currentSelectionMode == 'Feedback') {
                const selectionFeedback = selectionInput.yourSelectionFeedback
                const newAction = selectionFeedback.action == action ? 'None' : action
                this.updateFeedbacks({ actions: [selectionFeedback], newAction })
            }
            if (this.currentSelectionMode == 'Alignment') {
                const selectionAction = selectionInput.selectionAction
                const newAction = selectionAction.action == action ? 'None' : action
                this.updateActions({ actions: [selectionAction], newAction })
            }
        },
    },
}
</script>
