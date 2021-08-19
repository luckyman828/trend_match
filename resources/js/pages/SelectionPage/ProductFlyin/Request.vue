<template>
    <div
        class="request-wrapper"
        :class="[
            { own: isOwn },
            { master: isMaster },
            { 'has-traits': request.focus },
            { 'edit-active': editActive },
            { 'no-controls': disableControls },
            { 'has-thread': isTicket },
            { 'has-label': hasLabel },
        ]"
    >
        <div class="traits">
            <span v-if="request.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
        </div>
        <div class="request">
            <div class="ribbon" v-if="isTicket" :class="request.status" v-tooltip="statusTooltip" />
            <div class="inner">
                <strong class="sender">
                    <SelectionChapterPill :selection="request.selection" />
                    <span v-if="request.selection.type != 'Chapter'">{{ request.selection.name }}</span>
                    <!-- </span> -->
                    <span> | </span>
                    <span class="sender" :class="request.author_id == authUser.id ? 'square primary xs' : ''">
                        <span>{{
                            request.author_id == authUser.id
                                ? 'You'
                                : request.author
                                ? request.author.name
                                : 'Anonymous'
                        }}</span>
                    </span>
                </strong>

                <div
                    class="content-wrapper"
                    v-if="!editActive"
                    @click="isTicket && !disableControls && !editActive && onToggleRequestThread($event)"
                >
                    <span class="content">{{ request.content }}</span>
                </div>
                <RequestInputArea
                    v-else
                    :request="requestToEdit"
                    :selectionInput="selectionInput"
                    ref="requestInput"
                    @cancel="onCancel"
                    @submit="onUpdateRequest"
                />

                <div class="label-wrapper">
                    <v-popover
                        v-if="hasLabel || hasEditAccess"
                        ref="labelPopover"
                        trigger="click"
                        :disabled="!hasEditAccess"
                        @hide="$refs.labelList.removeListeners()"
                        @show="$refs.labelList.addListeners()"
                    >
                        <div class="request-label ghost dark xs square" :class="{ clickable: hasEditAccess }">
                            <span v-if="hasLabel">#{{ request.labels[0] }}</span>
                            <template v-else> <i class="far fa-plus"></i><span>Add label</span> </template>
                        </div>
                        <RequestLabelList
                            ref="labelList"
                            slot="popover"
                            :selectionInput="selectionInput"
                            :request="request"
                            @update="$refs.labelPopover.hide()"
                        />
                    </v-popover>
                </div>

                <div class="timestamp" v-if="request.created_at">
                    {{ getPrettyTimestamp(request.created_at) }}
                </div>

                <div class="thread-controls" v-if="isTicket && !disableControls">
                    <button
                        class="view-thread-button no-bg dark ghost-hover sm"
                        v-tooltip="'View request thread'"
                        @click="SET_CURRENT_REQUEST_THREAD(request)"
                    >
                        <span>{{ request.discussions.length }}</span>
                        <i class="far fa-comment"></i>

                        <div
                            v-if="displayUnreadBullets && hasNewComment"
                            class="circle min primary new-comment-indicator"
                        ></div>
                    </button>
                </div>
            </div>
        </div>
        <!-- Request Controls -->
        <div class="controls" v-if="!selectionInput.is_completed && !editActive && !disableControls && hasEditAccess">
            <button
                v-tooltip.top="{ content: 'Delete', delay: { show: 300 } }"
                class="button no-bg ghost-hover"
                @click="onDeleteRequest"
            >
                <i class="far fa-trash-alt"></i>
            </button>

            <button
                v-tooltip.top="{ content: 'Edit', delay: { show: 300 } }"
                class="button no-bg ghost-hover"
                @click="onEditRequest"
            >
                <i class="far fa-pen"></i>
            </button>
        </div>

        <div class="resolve-actions flex-list sm" v-if="isTicket && hasTicketControl">
            <BaseButton
                v-tooltip="'Accept'"
                :disabled="!hasTicketControl"
                disabledTooltip="Only approvers and owners can accept a request"
                :buttonClass="request.status != 'Resolved' ? 'ghost green sm' : 'green sm'"
                @click="onSetStatus('Resolved')"
            >
                <i class="far fa-check-circle"></i>
                <span>Accept</span>
            </BaseButton>
            <BaseButton
                v-tooltip="'Reject'"
                :disabled="!hasTicketControl"
                disabledTooltip="Only approvers and owners can reject a request"
                :buttonClass="request.status != 'Rejected' ? 'ghost red sm' : 'red sm'"
                @click="onSetStatus('Rejected')"
            >
                <i class="far fa-times-circle"></i>
                <span>Reject</span>
            </BaseButton>
        </div>

        <BaseDialog ref="confirmDeleteRequest" type="confirm" confirmColor="red" confirmText="Yes, delete it">
            <div class="icon-graphic">
                <i class="lg primary far fa-clipboard-check"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete this request?</h3>
        </BaseDialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import RequestInputArea from './RequestInputArea'
import RequestLabelList from './RequestLabelList'
import SelectionChapterPill from '../../../components/common/SelectionChapterPill'

export default {
    name: 'request',
    components: {
        RequestInputArea,
        RequestLabelList,
        SelectionChapterPill,
    },
    props: ['request', 'selectionInput', 'disableControls'],
    data: function() {
        return {
            requestToEdit: this.request,
            editActive: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('requests', ['getCurrentRequestThread']),
        ...mapGetters('selections', ['currentSelection', 'getCurrentSelectionMode', 'getCurrentPDPSelection']),
        ...mapGetters('selections', {
            displayUnreadBullets: 'getDisplayUnreadBullets',
            ticketModeActive: 'getTicketModeActive',
        }),
        isOwn() {
            return this.request.selection_id == this.getCurrentPDPSelection.id
        },
        isMaster() {
            return this.request.selection.type == 'Master'
        },
        isTicket() {
            return this.request.type == 'Ticket'
        },
        hasLabel() {
            return this.request.labels.length > 0
        },
        hasNewComment() {
            const request = this.request
            if (this.selectionInput.is_completed) return false
            if (this.getCurrentSelectionMode == 'Approval') {
                return request.hasUnreadAlignerComment
            }
            if (this.getCurrentSelectionMode == 'Alignment') {
                return request.hasUnreadApproverComment
            }
        },
        statusTooltip() {
            if (this.request.status == 'Open') return 'Request awaiting decision'
            if (this.request.status == 'Resolved') return `Request accepted by approver`
            if (this.request.status == 'Rejected') return `Request rejected by approver`
        },
        requestStatus() {
            return this.request.status
        },
        hasTicketControl() {
            if (this.request.product.is_completed) return false
            return (
                ['Alignment', 'Approval'].includes(this.request.selection.your_job) ||
                this.currentSelection.your_job == 'Approval' ||
                (this.currentSelection.type == 'Master' && this.currentSelection.your_job == 'Alignment')
            )
        },
        hasEditAccess() {
            if (this.request.product.is_completed) return false
            return this.request.selection.your_job == 'Alignment' || this.request.selection.your_role == 'Owner'
        },
    },
    watch: {
        requestStatus(newVal) {
            this.onReadRequest()
        },
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest', 'deleteRequest', 'updateRequestStatus']),
        ...mapMutations('requests', ['SET_CURRENT_REQUEST_THREAD', 'SET_REQUEST_READ']),
        async onDeleteRequest() {
            if (await this.$refs.confirmDeleteRequest.confirm()) {
                this.deleteRequest({ selectionInput: this.selectionInput, request: this.request })
            }
        },
        onReadRequest() {
            this.SET_REQUEST_READ(this.request)
        },
        onCancel() {
            this.editActive = false
        },
        onUpdateRequest() {
            Object.assign(this.request, this.requestToEdit)
            this.editActive = false
        },
        onEditRequest() {
            this.editActive = true
            this.requestToEdit = JSON.parse(JSON.stringify(this.request))
            this.$nextTick(() => {
                this.$refs.requestInput.activateWrite()
            })
        },
        onSetStatus(status) {
            const statusToSet = this.request.status == status ? 'Open' : status
            this.updateRequestStatus({ request: this.request, status: statusToSet })
        },
        onToggleRequestThread(e) {
            // Don't trigger when clicking buttons
            if (
                e.target.tagName == 'button' ||
                e.target.classList.contains('.square') ||
                e.target.closest('button') ||
                e.target.closest('.square')
            )
                return
            const requestToSet =
                this.getCurrentRequestThread && this.getCurrentRequestThread.id == this.request.id ? null : this.request
            this.SET_CURRENT_REQUEST_THREAD(requestToSet)
        },
    },
    destroyed() {
        this.onReadRequest()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.request-wrapper {
    margin-bottom: 4px;
    position: relative;
    &.has-traits {
        margin-top: 24px;
    }
    &.edit-active {
        width: 100%;
        max-width: none;
        margin-bottom: 72px;
        .request {
            padding: 2px;
            width: 100%;
            transition: none;
            .sender {
                margin-bottom: 4px;
            }
            ::v-deep {
                .input-wrapper {
                    min-height: 160px;
                    margin-left: -8px;
                    width: calc(100% + 20px);
                }
                .request-label {
                    left: 4px;
                }
            }
        }
    }
    &:not(.has-label) {
        .label-wrapper {
            opacity: 0;
        }
    }
    &.has-thread {
        .request .content-wrapper {
            cursor: pointer;
        }
        &:not(.no-controls) {
            .label-wrapper {
                margin-bottom: -30px;
            }
        }
    }
    &.no-controls {
        .request .content-wrapper {
            cursor: default;
        }
        .request > .inner {
            padding-bottom: 20px;
        }
    }
    &:hover {
        .controls {
            display: block;
        }

        .resolve-actions {
            display: flex;
        }
        .label-wrapper {
            opacity: 1;
        }
    }
    .resolve-actions {
        flex: 1;
        display: none;
        background: white;
        padding: 4px;
        border-radius: 4px;
        box-shadow: $shadowEl;
        border: $borderEl;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1;
        transform: translateY(75%);
    }
    .timestamp {
        position: absolute;
        bottom: 2px;
        font-size: 10px;
        color: $grey600;
    }
}
.save-controls {
    position: absolute;
    bottom: -8px;
    right: 0;
    transform: translateY(100%);
    display: flex;
}
.traits {
    position: absolute;
    top: -16px;
    left: -10px;
    z-index: 1;
    white-space: nowrap;
    > * {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        &:not(:last-child) {
            margin-right: 8px;
        }
    }
}
.pill {
    i {
        font-size: 8px;
        margin-right: 4px;
    }
}
.save-controls {
    position: absolute;
    bottom: -8px;
    right: 0;
    transform: translateY(100%);
    display: flex;
}
.request {
    border-radius: 6px;
    background: white;
    position: relative;
    border: $borderElSoft;
    box-shadow: $shadowEl;
    display: flex;
    overflow: hidden;
    .ribbon {
        width: 8px;
        background: $yellow;
        &.Rejected {
            background: $red;
        }
        &.Resolved {
            background: $green;
        }
    }

    .inner {
        padding: 8px 12px 12px 8px;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        padding-bottom: 20px;
    }
    .thread-controls {
        display: inline-flex;
        justify-content: flex-end;
        margin-top: 8px;
        margin-left: auto;
    }
    .sender {
        font-size: 12px;
    }
    .id {
        font-size: 12px;
        font-weight: 500;
    }
    .content-wrapper {
        margin: 8px 0 0;
    }
    .content {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}
.controls {
    transition: 0.3s;
    position: absolute;
    right: 0;
    top: 0;
    padding: 4px;
    display: none;
    background: white;
    border-radius: 4px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    z-index: 1;
    > *:not(:first-child) {
        margin-left: 8px;
        &::before {
            content: '';
            display: block;
            width: 1px;
            height: 28px;
            background: #cfcfcf;
            position: absolute;
            left: -6px;
        }
    }
    .loader {
        height: 24px;
        flex-direction: row;
    }
}
.view-thread-button {
    position: relative;
    .new-comment-indicator {
        position: absolute;
        right: 2px;
        top: 0;
    }
}
.request-label {
    margin-top: 4px;
}
</style>
