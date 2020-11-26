<template>
    <div class="new-request-form">
        <strong class="form-header">{{ ticketModeActive ? 'Open ticket' : 'Your Request' }}</strong>
        <RequestInputArea
            ref="inputArea"
            :request="newRequest"
            :disabled="!userWriteAccess.requests.hasAccess"
            :disabledTooltip="userWriteAccess.requests.msg"
            :selectionInput="selectionInput"
            @keydown.native.tab="onTab"
            @cancel="cancelRequest"
            @submit="resetRequest"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import RequestInputArea from './RequestInputArea'
export default {
    name: 'newRequestForm',
    props: ['selectionInput'],
    components: {
        RequestInputArea,
    },
    data: function() {
        return {
            newRequest: null,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', {
            ticketModeActive: 'getTicketModeActive',
            currentTicketMode: 'getCurrentTicketMode',
            writeAccess: 'getAuthUserSelectionWriteAccess',
            currentSelection: 'currentSelection',
        }),
        userWriteAccess() {
            return this.writeAccess(this.selectionInput.selection, this.selectionInput)
        },
        selectionRequest() {
            return this.selectionInput.selectionRequest
        },
    },
    watch: {
        selectionRequest: function(newVal, oldVal) {
            this.update()
        },
        currentRequestThread(newVal) {
            if (newVal) {
                this.deactivateWrite()
            }
        },
    },
    methods: {
        ...mapMutations('requests', ['SET_CURRENT_REQUEST_THREAD']),

        update() {
            // Find the existing selection request if any
            // Set the new request equal to the existing if one exists
            this.currentSelection.settings.ticket_level != 'None' ? 'Ticket' : 'Request'
            if (this.currentTicketMode == 'None') {
                if (this.selectionRequest) this.newRequest = this.selectionRequest
                else this.newRequest = this.getDefaultRequest()
                this.deactivateWrite()
            }
        },

        hotkeyHandler(e) {
            const key = e.code
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Enter') {
                    this.$emit('hotkeyEnter', e)
                }
            }
        },
        onTab(e) {
            if (this.currentRequestThread) {
                this.deactivateWrite()
                this.$emit('activateCommentWrite')
            }
        },
        activateWrite() {
            this.SET_CURRENT_REQUEST_THREAD(null)
            this.$refs.inputArea.activateWrite()
        },
        deactivateWrite() {
            this.$refs.inputArea.deactivateWrite()
        },
        cancelRequest() {
            this.resetRequest()
        },
        resetRequest() {
            this.newRequest = this.getDefaultRequest()
            this.newRequest.content =
                this.selectionRequest && this.currentTicketMode != 'Multiple' ? this.selectionRequest.content : ''
            this.newRequest.label =
                this.selectionRequest && this.currentTicketMode != 'Multiple' ? this.selectionRequest.label : ''
        },
        getDefaultRequest() {
            return {
                content: '',
                label: null,
                type: this.currentTicketMode != 'None' ? 'Ticket' : 'Request',
                author_id: this.authUser.id,
                author: this.authUser,
                selection_id: this.selectionInput.selection_id,
                selection: this.selectionInput.selection,
                discussions: [],
                completed_at: null,
                completed_by_user: null,
                status: 'Open',
                status_updated_at: null,
                status_updated_by_user: null,
            }
        },
    },
    mounted() {
        this.update()
    },
    created() {
        this.resetRequest()
        // Insert small delay before we add our event listener to stop the same event that showed this section, do things inside the component
        setTimeout(() => {
            document.body.addEventListener('keydown', this.hotkeyHandler)
        }, 10)
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';

.new-request-form {
    padding: 20px 16px 28px;
    .form-header {
        margin-left: 4px;
        margin-bottom: 4px;
        display: block;
    }
    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .left {
            > :first-child {
                margin-left: -12px;
            }
            // > :not(:last-child) {
            //     margin-right: 8px;
            // }
        }
    }
    .id {
        font-size: 12px;
        color: $dark2;
        display: block;
        margin-top: -2px;
    }
    .edit-request {
        position: absolute;
        right: 12px;
        font-size: 10px;
        color: $dark;
        font-weight: 500;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        .circle {
            height: 24px;
            width: 24px;
            margin-left: 4px;
        }
    }
}
</style>
