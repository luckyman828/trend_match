<template>
    <BaseFlyin class="request-thread-flyin" :show="show" @close="close" placement="right">
        <template v-slot:header v-if="show">
            <BaseFlyinHeader v-if="show" :disableNavigation="true"
            @close="close">
                <template v-slot:left>
                    <h3>Request: {{request.id}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>

        <template v-slot:default>
            <div class="inner">
                <div class="request">
                    <Request :request="request" :disableControls="true"/>

                    <!-- <div class="divider">
                        <span>Request comments</span>
                    </div> -->
                </div>


                <div class="comment-section">
                    <RequestComment v-for="(comment, index) in request.comments" :key="comment.id"
                    :comment="comment"
                    :displayAuthor="!request.comments[index+1] || request.comments[index+1].role != request.comments[index].role"/>

                    <div class="divider" v-if="!request.isResolved && !hasNewComment && !(getCurrentSelectionMode == 'Approval' && request.comments.length <= 0)">
                        <span>Awaiting reply from {{getCurrentSelectionMode == 'Alignment' ? 'Approver' : 'Aligner'}}</span>
                    </div>
                </div>


                <div class="resolve-button" v-if="getCurrentSelectionMode == 'Alignment'">
                    <button class="lg full-width" :class="[request.isResolved ? 'green' : 'primary', {'is-resolved': request.isResolved}]"
                    @click="onResolve">
                        <span v-if="!request.isResolved">Mark as resolved</span>
                        <template v-else>
                            <span>Resolved by {{request.completed_by_user ? request.completed_by_user.name : 'Aligner'}}</span>
                            <span class="hover">Re-open request</span>
                        </template>
                    </button>
                </div>
                <div class="resolved-banner" 
                v-if="getCurrentSelectionMode == 'Approval' && request.isResolved">
                    <span>Resolved by {{request.completed_by_user ? request.completed_by_user.name : 'Aligner'}}</span>
                </div>

                <div class="form-wrapper" v-if="!request.isResolved">
                    <strong class="form-header">Write comment</strong>

                    <form @submit="onSubmit" :class="[{active: writeActive}]">
                        <div class="input-parent comment">
                            <BaseInputTextArea ref="commentField"
                            placeholder="Write your comment here..."
                            v-model="newComment.content" 
                            @click.native="activateWrite()" @keydown.native.enter.exact.prevent  
                            @keyup.native.esc="deactivateWrite" @keyup.native.enter.exact="onSubmit"/>
                        </div>
                        <div class="flex-wrapper" v-if="writeActive">
                            <div class="left">
                                <div class="hotkey-tip">
                                    <span class="square ghost">ENTER</span>
                                    <span>To submit</span>
                                </div>
                            </div>
                            <div class="right">
                                <button type="button" class="invisible" @click="writeActive = false"><span>Cancel</span></button>
                                <button type="button" class="primary" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Submit</span></button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </template>
        
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Request from './Request'
import RequestComment from './RequestComment'

export default {
    name: 'requestThreadFlyin',
    components: {
        Request,
        RequestComment,
    },
    data: function () { return {
        newComment: {
            content: '',
            important: false,
        },
        writeActive: false,
        submitting: false,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('requests', {
            show: 'getRequestThreadVisible',
            request: 'getCurrentRequestThread'
        }),
        ...mapGetters('selections', ['getCurrentSelection', 'getCurrentSelectionMode']),
        submitDisabled () {
            return this.newComment.content.length < 1 || this.submitting
        },
        hasNewComment() {
            return this.getCurrentSelectionMode == 'Alignment' && this.request.hasUnreadApproverComment || this.request.hasUnreadAlignerComment
        }
    },
    methods: {
        ...mapMutations('requests', {
            close: 'SET_CURRENT_REQUEST_THREAD'
        }),
        ...mapActions('requests', ['insertOrUpdateRequestComment', 'resolveRequest']),
        activateWrite() {
            if (this.request.isResolved) return
            this.$refs.commentField.focus()
            this.$refs.commentField.select()
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
        },
        onResolve() {
            // If we are un-resolving the request, remove the focus from the button so we can use ENTER to start writing a new comment
            if (this.request.isResolved) document.activeElement.blur()
            this.resolveRequest(this.request)
        },
        async onSubmit() {

            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the comment to post
            const commentToPost = {
                user_id: this.authUser.id,
                user: this.authUser,
                request_id: this.request.id,
                content: this.newComment.content,
                role: this.getCurrentSelection.your_role,
                selection_id: this.request.selection_id,
                selection: this.request.selection,
            }

            // dispatch action
            await this.insertOrUpdateRequestComment({request: this.request, comment: commentToPost})
            this.submitting = false

            // Reset comment
            this.newComment.content = ''
            

        },
        hotkeyHandler(e) {
            const key = e.code
            if (this.show && event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Enter') {
                    this.activateWrite()
                }
            }
        },
    },
    created() {
        // Insert small delay before we add our event listener to stop the same event that showed this section, do things inside the component
        setTimeout(() => {
            document.body.addEventListener('keyup', this.hotkeyHandler)
        }, 10)
    },
    destroyed() {
        document.body.removeEventListener('keyup', this.hotkeyHandler)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.request-thread-flyin {
    ::v-deep {
        .flyin.placement-right {
            width: 400px;
            min-width: 0;
        }
    }
    .resolve-button, .resolved-banner {
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
        padding: 16px 16px 64px;
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
        }
        input[type=submit] {
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
    span {
        margin: 0 20px;
        white-space: nowrap;
        font-size: 12px;
        color: $fontSoft;
    }
    &::before, &::after {
        content: "";
        height: 1px;
        background: $borderColorEl;
        width: 100%;
    }
}

</style>