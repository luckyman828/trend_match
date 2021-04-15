<template>
    <BaseFlyinColumn class="request-thread-section">
        <template v-slot:header>
            <button class="circle" style="margin-left: -8px" @click="close(null)">
                <i class="far fa-times"></i>
            </button>
            <h3 style="margin-left: 8px">Request thread</h3>
        </template>

        <template v-slot>
            <div class="inner">
                <div class="request">
                    <Request :request="request" :disableControls="true" :selectionInput="selectionInput" />

                    <div class="resolve-actions" v-if="request.type == 'Ticket' && hasTicketControl">
                        <BaseButton
                            :disabled="getCurrentSelectionMode == 'Feedback'"
                            disabledTooltip="Only approvers and owners can accept a request"
                            :buttonClass="request.status != 'Resolved' ? 'ghost green' : 'green'"
                            @click="onSetStatus('Resolved')"
                        >
                            <i class="far fa-check-circle"></i>
                            <span>Accept</span>
                        </BaseButton>
                        <BaseButton
                            :disabled="getCurrentSelectionMode == 'Feedback'"
                            disabledTooltip="Only approvers and owners can reject a request"
                            :buttonClass="request.status != 'Rejected' ? 'ghost red' : 'red'"
                            @click="onSetStatus('Rejected')"
                        >
                            <i class="far fa-times-circle"></i>
                            <span>Reject</span>
                        </BaseButton>
                    </div>

                    <div class="divider">
                        <span>Request comments</span>
                    </div>
                </div>

                <div class="comment-section">
                    <RequestComment
                        v-for="(comment, index) in request.discussions"
                        :key="comment.id"
                        :comment="comment"
                        :request="request"
                        :displayAuthor="
                            !request.discussions[index + 1] ||
                                request.discussions[index + 1].selection_id !=
                                    request.discussions[index].selection_id ||
                                request.discussions[index + 1].author_id != request.discussions[index].author_id ||
                                new Date(request.discussions[index + 1].created_at).toDateString() !=
                                    new Date(request.discussions[index].created_at).toDateString()
                        "
                    />

                    <div
                        class="divider"
                        v-if="
                            request.status == 'Open' &&
                                !hasNewComment &&
                                !(getCurrentSelectionMode == 'Approval' && request.discussions.length <= 0)
                        "
                    >
                        <span>Awaiting reply from {{ request.hasUnreadApproverComment ? 'Aligner' : 'Approver' }}</span>
                    </div>

                    <div class="divider" v-if="request.status != 'Open'">
                        <span>
                            Request
                            <span class="status" :class="request.status">
                                {{ request.status == 'Resolved' ? 'Accepted' : 'Rejected' }}
                            </span>
                            by {{ request.status_updated_by_user ? request.status_updated_by_user.name : 'Anonymous' }}
                        </span>
                    </div>
                </div>

                <div class="form-wrapper" v-if="request.type == 'Ticket' && hasTicketControl">
                    <strong class="form-header">Write comment</strong>

                    <form @submit="onSubmit" :class="[{ active: writeActive }]">
                        <div class="input-parent comment">
                            <BaseInputTextArea
                                ref="commentField"
                                placeholder="Write your comment here..."
                                v-model="newComment.content"
                                @click.native="activateWrite()"
                                @keydown.native.enter.exact.prevent
                                @keyup.native.esc="deactivateWrite"
                                @keyup.native.enter.exact="onSubmit"
                            />
                        </div>
                        <div class="flex-wrapper" v-if="writeActive">
                            <div class="left">
                                <div class="hotkey-tip">
                                    <span class="square ghost">ENTER</span>
                                    <span>To submit</span>
                                </div>
                            </div>
                            <div class="right">
                                <button type="button" class="invisible" @click="writeActive = false">
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="button"
                                    class="primary"
                                    :class="{ disabled: submitDisabled }"
                                    @click="onSubmit"
                                >
                                    <span>Submit</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Request from './Request'
import RequestComment from './RequestComment'

export default {
    name: 'requestThreadSection',
    components: {
        Request,
        RequestComment,
    },
    props: ['selectionInput'],
    data: function() {
        return {
            newComment: {
                content: '',
                important: false,
            },
            writeActive: false,
            submitting: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('products', ['currentProduct']),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('requests', {
            show: 'getRequestThreadVisible',
            request: 'getCurrentRequestThread',
        }),
        ...mapGetters('selections', ['getCurrentSelection', 'getCurrentSelectionMode', 'getCurrentPDPSelection']),
        submitDisabled() {
            return this.newComment.content.length < 1 || this.submitting
        },
        hasNewComment() {
            return (
                (this.getCurrentSelectionMode == 'Alignment' && this.request.hasUnreadApproverComment) ||
                (this.getCurrentSelectionMode == 'Approval' && this.request.hasUnreadAlignerComment)
            )
        },
        hasTicketControl() {
            if (this.request.product.is_completed) return false
            return (
                ['Owner', 'Approver'].includes(this.request.selection.your_role) ||
                this.getCurrentSelection.your_role == 'Approver' ||
                (this.getCurrentSelection.type == 'Master' && this.getCurrentSelection.your_role == 'Owner')
            )
        },
    },
    watch: {
        request() {
            this.onReadRequest()
        },
        currentProduct() {
            this.close()
        },
    },
    methods: {
        ...mapMutations('requests', {
            close: 'SET_CURRENT_REQUEST_THREAD',
            SET_REQUEST_READ: 'SET_REQUEST_READ',
        }),
        ...mapActions('requests', ['insertOrUpdateRequestComment', 'updateRequestStatus']),
        onReadRequest() {
            this.SET_REQUEST_READ(this.request)
        },
        activateWrite() {
            if (this.request.type != 'Ticket' || !this.hasTicketControl) return
            this.$refs.commentField.focus()
            this.$refs.commentField.select()
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
        },
        onSetStatus(status) {
            const statusToSet = this.request.status == status ? 'Open' : status
            this.updateRequestStatus({ request: this.request, status: statusToSet })
        },
        async onSubmit() {
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the comment to post
            const commentToPost = {
                author_id: this.authUser.id,
                request_id: this.request.id,
                content: this.newComment.content,
                role: this.getCurrentSelection.your_role,
                selection_id: this.getCurrentSelection.id,
                created_at: new Date().toISOString(),
            }

            // dispatch action
            await this.insertOrUpdateRequestComment({ request: this.request, comment: commentToPost })
            this.submitting = false

            // Reset comment
            this.newComment.content = ''
        },
        hotkeyHandler(e) {
            const key = e.code
            if (this.show && event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Escape') {
                    this.close()
                }
                if (key == 'Enter') {
                    this.activateWrite()
                }
                if (key == 'KeyR') {
                    this.onSetStatus('Rejected')
                }
                if (key == 'KeyA') {
                    this.onSetStatus('Resolved')
                }
                if (key == 'Tab') {
                    if (e.shiftKey) {
                        this.$emit('onTab', false)
                    } else {
                        this.$emit('onTab', true)
                    }
                }
            }
        },
    },
    created() {
        // Insert small delay before we add our event listener to stop the same event that showed this section, do things inside the component
        setTimeout(() => {
            document.body.addEventListener('keydown', this.hotkeyHandler)
        }, 10)
    },
    mounted() {
        // this.activateWrite()
        this.onReadRequest()
    },
    destroyed() {
        document.body.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

::v-deep {
    &.flyin-column {
        .header {
            display: flex;
            align-items: center;
        }
        .body {
            display: flex;
            flex-direction: column;
            padding: 0;
        }
    }
}

.request-thread-section {
    h3 {
        margin: 0;
    }
    .resolve-button,
    .resolved-banner {
        border-top: $borderEl;
        border-bottom: $borderEl;
        ::v-deep {
            button {
                border-radius: 0;
                &.is-resolved {
                    span.hover {
                        display: none;
                    }
                    &:hover {
                        background: $red;
                        border-color: $red;
                        span {
                            display: none;
                        }
                        span.hover {
                            display: inline;
                        }
                    }
                }
            }
        }
    }
    .resolved-banner {
        height: 48px;
        min-height: 48px;
        background: $green;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
    }
    .inner {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .request {
        padding: 16px;
    }
    .comment-section {
        height: 100%;
        overflow-y: auto;
        padding: 0 16px 64px;
    }
    .form-wrapper {
        padding: 20px 16px 28px;
    }
    form {
        .flex-wrapper {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            // align-items: center;
            > * {
                white-space: nowrap;
            }
        }
        input[type='submit'] {
            margin-top: 12px;
        }
    }
    .hotkey-tip {
        .square {
            border-width: 1px;
            height: auto;
            padding: 2px 4px;
            min-width: 0;
            font-weight: 400;
            border-radius: 2px;
            font-size: 9px;
            margin-right: 2px;
        }
        font-size: 10px;
        color: $dark2;
    }
}
.divider {
    position: relative;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    margin: auto;
    // max-width: calc(100% - 16px * 2);
    > span {
        margin: 0 8px;
        font-size: 12px;
        color: $fontSoft;
        flex: 3;
    }
    .status {
        font-weight: 700;
        &.Resolved {
            color: $green;
        }
        &.Rejected {
            color: $red;
        }
    }
    &::before,
    &::after {
        content: '';
        height: 1px;
        background: $borderColorEl;
        flex: 1;
    }
}
.resolve-actions {
    display: flex;
    justify-content: center;
    margin: 12px 0 20px;
    > :not(:first-child) {
        margin-left: 8px;
    }
}
</style>
