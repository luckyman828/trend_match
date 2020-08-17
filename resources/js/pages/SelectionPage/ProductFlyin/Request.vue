<template>
    <div class="request-wrapper" :class="[{own: isOwn}, {master: isMaster}, 
    {'has-traits': request.focus}, {'edit-active': editActive}, {'no-controls': disableControls}, 
    {'has-thread': approvalEnabled && isMaster}]">
        <div class="traits">
            <span v-if="request.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
        </div>
        <div class="request">
            <strong class="sender">
                {{request.selection.name}} | 
                {{request.author_id == authUser.id ? 'You' : request.author ? request.author.name : 'Anonymous'}}</strong>

            <span v-if="!editActive" class="content">{{request.content}}</span>
            <span v-else class="content">
                <BaseInputTextArea ref="requestInputField" v-model="requestToEdit.content"
                @keyup.enter.exact.native="onUpdateRequest" @keydown.enter.exact.native.prevent
                @keydown.esc.native="onCancel"/>
            </span>

            <div class="thread-controls" v-if="isMaster && !disableControls && approvalEnabled">
                <button class="view-thread-button invisible dark ghost-hover sm"
                v-tooltip="request.isResolved ? 'Request resolved' : hasNewComment ? 'New comment' : 'View request thread'"
                @click="SET_CURRENT_REQUEST_THREAD(request)">

                    <i v-if="request.isResolved" class="far fa-check"></i>

                    <span>{{request.discussions.length}}</span>
                    <i class="far fa-comment"></i>

                    <div v-if="hasNewComment" class="circle xxs primary new-comment-indicator"></div>
                </button>
            </div>

            <!-- Request Controls -->
            <div class="controls" v-if="!editActive && !disableControls && isOwn && getCurrentPDPSelection.your_role == 'Owner'">

                <button v-tooltip.top="{content: 'Delete', delay: {show: 300}}" class="button invisible ghost-hover"
                @click="onDeleteRequest">
                    <i class="far fa-trash-alt"></i>
                </button>

                <button v-tooltip.top="{content: 'Edit', delay: {show: 300}}" class="button invisible ghost-hover"
                @click="onEditRequest">
                    <i class="far fa-pen"></i>
                </button>

            </div>
            <!-- End Comment Controls -->
        </div> 
        <div class="save-controls" v-if="editActive">
            <button class="invisible ghost-hover" style="margin-right: 8px"
            @click="onCancel">
                <span>Cancel</span>
            </button>
            <BaseButton buttonClass="primary" :hotkey="{key: 'ENTER', label: 'Save', align: 'right'}" 
            @click="onUpdateRequest">
                <span>Save</span>
            </BaseButton>
        </div>

        <BaseDialog ref="confirmDeleteRequest" type="confirm"
        confirmColor="red" confirmText="Yes, delete it">
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
    props: [
        'request',
        'selectionInput',
        'disableControls',
    ],
    data: function() { return {
        requestToEdit: this.request,
        editActive: false,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('files', {
            approvalEnabled: 'getApprovalEnabled'
        }),
        ...mapGetters('selections', ['currentSelection', 'getCurrentSelectionMode', 'getCurrentPDPSelection']),
        isOwn() {
            return this.request.selection_id == this.getCurrentPDPSelection.id
        },
        isMaster() {
            return this.request.selection.type == 'Master'
        },
        hasNewComment() {
            return this.getCurrentSelectionMode == 'Alignment' && this.request.hasUnreadApproverComment || 
            this.getCurrentSelectionMode == 'Approvel' && this.request.hasUnreadAlignerComment
        },
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest', 'deleteRequest']),
        ...mapMutations('requests', ['SET_CURRENT_REQUEST_THREAD']),
        async onDeleteRequest() {
            if (await this.$refs.confirmDeleteRequest.confirm()) {
                this.deleteRequest({selectionInput: this.selectionInput, request: this.request})
            }
        },
        onCancel() {
            this.editActive = false
        },
        onUpdateRequest() {
            this.request.content = this.requestToEdit.content
            this.insertOrUpdateRequest({selectionInput: this.selectionInput, request: this.request})
            this.editActive = false
        },
        onEditRequest() {
            this.editActive = true
            this.requestToEdit = JSON.parse(JSON.stringify(this.request))
            this.$nextTick(() => {
                this.$refs.requestInputField.focus()
                this.$refs.requestInputField.select()
            })
        }
    }
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
            padding-bottom: 40px;
        }
    }
    &.no-controls {
        .request {
            padding-bottom: 20px;
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
        box-shadow: 0 3px 6px rgba(0,0,0,.2);
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
    padding: 12px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    background: white;
    position: relative;
    &:hover {
        .controls {
            display: block;
        }
    }
    .thread-controls {
        position: absolute;
        right: 6px;
        bottom: 6px;
    }
    .sender {
        font-size: 12px;
    }
    .id {
        font-size: 12px;
        font-weight: 500;
    }
    .own:not(.master) & {
        background: $primary;
        color: white;
        strong {
            color: white;
        }
    }
    .master & {
        background: $yellow;
    }
    .content {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin-top: 12px;
    }
    .controls {
        transition: .3s;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 4px;
        display: none;
        background: white;
        border-radius: 4px;
        box-shadow: 0 3px 6px rgba(0,0,0,.2);
        z-index: 1;
        > *:not(:first-child) {
            margin-left: 8px;
            &::before {
                content: "";
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
</style>