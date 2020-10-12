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
        ]"
    >
        <div class="traits">
            <span v-if="request.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
        </div>
        <div class="request" @click="isTicket && !disableControls && onToggleRequestThread($event)">
            <div class="ribbon" v-if="isTicket" :class="request.status" v-tooltip="statusTooltip" />
            <div class="inner">
                <!-- <div class="label-list">
                    <div class="square xs label selection" :class="request.selection_id == getCurrentPDPSelection.id ? 'primary' : ''">
                        <span>{{request.selection.name}}</span>
                    </div>
                    <div class="label sender ghost square xs" :class="request.author_id == authUser.id ? 'primary' : ''">
                        <span>{{request.author_id == authUser.id ? 'You' : request.author ? request.author.name : 'Anonymous'}}</span>
                    </div>

                </div> -->
                <strong class="sender">
                    <!-- <span class="selection" :class="request.selection_id == getCurrentPDPSelection.id ? 'square primary xs' : ''"> -->
                    <span>{{ request.selection.name }}</span>
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

                <span v-if="!editActive" class="content">{{ request.content }}</span>
                <span v-else class="content">
                    <BaseInputTextArea
                        ref="requestInputField"
                        v-model="requestToEdit.content"
                        @keyup.enter.exact.native="onUpdateRequest"
                        @keydown.enter.exact.native.prevent
                        @keydown.esc.native="onCancel"
                    />
                </span>

                <div class="thread-controls" v-if="isTicket && !disableControls">
                    <div class="resolve-actions" v-if="hasTicketControl">
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

                    <button
                        class="view-thread-button invisible dark ghost-hover sm"
                        v-tooltip="'View request thread'"
                        @click="SET_CURRENT_REQUEST_THREAD(request)"
                    >
                        <span>{{ request.discussions.length }}</span>
                        <i class="far fa-comment"></i>

                        <div
                            v-if="displayUnreadBullets && hasNewComment"
                            class="circle xxs primary new-comment-indicator"
                        ></div>
                    </button>
                </div>
            </div>
        </div>
        <!-- Request Controls -->
        <div
            class="controls"
            v-if="
                !selectionInput.is_completed &&
                    !editActive &&
                    !disableControls &&
                    isOwn &&
                    getCurrentPDPSelection.your_role == 'Owner'
            "
        >
            <button
                v-tooltip.top="{ content: 'Delete', delay: { show: 300 } }"
                class="button invisible ghost-hover"
                @click="onDeleteRequest"
            >
                <i class="far fa-trash-alt"></i>
            </button>

            <button
                v-tooltip.top="{ content: 'Edit', delay: { show: 300 } }"
                class="button invisible ghost-hover"
                @click="onEditRequest"
            >
                <i class="far fa-pen"></i>
            </button>
        </div>
        <!-- End Comment Controls -->
        <div class="save-controls" v-if="editActive">
            <button class="invisible ghost-hover" style="margin-right: 8px" @click="onCancel">
                <span>Cancel</span>
            </button>
            <BaseButton
                buttonClass="primary"
                :hotkey="{ key: 'ENTER', label: 'Save', align: 'right' }"
                @click="onUpdateRequest"
            >
                <span>Save</span>
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

export default {
    name: 'request',
    props: ['request', 'selectionInput', 'disableControls'],
    data: function() {
        return {
            requestToEdit: this.request,
            editActive: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('files', {
            approvalEnabled: 'getApprovalEnabled',
        }),
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
        hasNewComment() {
            const request = this.request
            if (this.selectionInput.is_completed) return false
            if (this.getCurrentSelectionMode == 'Approval') {
                return request.hasUnreadAlignerComment
            }
            if (this.getCurrentSelectionMode == 'Alignment') {
                return request.hasUnreadApproverComment
            }
            // return this.getCurrentSelectionMode == 'Alignment' && this.request.hasUnreadApproverComment ||
            // this.getCurrentSelectionMode == 'Approval' && this.request.status == 'Open' && this.request.hasUnreadAlignerComment
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
            return (
                ['Owner', 'Approver'].includes(this.request.selection.your_role) ||
                this.currentSelection.your_role == 'Approver'
            )
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
            this.request.content = this.requestToEdit.content
            this.insertOrUpdateRequest({ selectionInput: this.selectionInput, request: this.request })
            this.editActive = false
        },
        onEditRequest() {
            this.editActive = true
            this.requestToEdit = JSON.parse(JSON.stringify(this.request))
            this.$nextTick(() => {
                this.$refs.requestInputField.focus()
                this.$refs.requestInputField.select()
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
    created() {
        // this.onReadRequest()
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
                margin-left: 10px;
                margin-top: 10px;
            }
            .content {
                margin-bottom: 0;
            }
            ::v-deep {
                .input-wrapper {
                    border: none;
                    min-height: 160px;
                }
            }
        }
    }
    &.has-thread {
        .request {
            cursor: pointer;
        }
        .request > .inner {
            // padding-bottom: 40px;
        }
    }
    &.no-controls {
        .request {
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
    &:hover {
        .thread-controls .resolve-actions {
            display: block;
        }
    }
    // &.Open .inner {
    //     border-left: solid 8px $yellow;
    // }
    // &.Rejected .inner {
    //     border-left: solid 8px $red;
    // }
    // &.Resolved .inner {
    //     border-left: solid 8px $green;
    // }
    .inner {
        padding: 8px 12px 12px 8px;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }
    .thread-controls {
        // position: absolute;
        // right: 6px;
        // bottom: 6px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
        .resolve-actions {
            flex: 1;
            display: none;
        }
    }
    .sender {
        font-size: 12px;
    }
    .id {
        font-size: 12px;
        font-weight: 500;
    }
    // .own:not(.master) & {
    //     background: $primary;
    //     color: white;
    //     strong {
    //         color: white;
    //     }
    // }
    // .master & {
    //     background: $yellow;
    // }
    .content {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin-top: 12px;
        margin-left: 4px;
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
        right: 0;
        top: 0;
        height: 10px;
        width: 10px;
    }
}
.label-list {
    display: flex;
    flex-wrap: wrap;
    .label {
        margin-bottom: 4px;
        &:not(:last-child) {
            margin-right: 4px;
        }
        // &.selection {
        //     margin-right: 4px;
        // }
        // &.sender {
        //     color: $fontSoft;
        //     font-weight: 500;
        //     &.primary {
        //         color: $primary;
        //     }
        // }
    }
}
</style>
