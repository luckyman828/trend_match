<template>
    <BaseButton
        :buttonClass="selectionInput[currentAction] != action ? 'white' : actionColor"
        :disabled="!userWriteAccess.actions.hasAccess"
        v-tooltip="userWriteAccess.actions.msg"
        @click="onUpdateAction(action)"
    >
        <i :class="actionIconClass"></i>
        <span v-if="displayStyle != 'iconOnly'">{{ action }}</span>
    </BaseButton>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'productActionButton',
    props: ['action', 'product', 'displayStyle'],
    computed: {
        actionColor() {
            const action = this.action
            if (action == 'Out') return 'red'
            if (action == 'Focus') return 'primary'
            if (action == 'In') return 'green'
        },
        actionIconClass() {
            const action = this.action
            if (action == 'Out') return 'far fa-times-circle'
            if (action == 'Focus') return 'far fa-star'
            if (action == 'In') return 'far fa-heart'
        },
        ...mapGetters('products', ['getActiveSelectionInput']),
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
