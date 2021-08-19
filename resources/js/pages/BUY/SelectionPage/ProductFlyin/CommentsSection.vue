<template>
    <BaseFlyinColumn class="comments">
        <template v-slot:header>
            <span>Comments</span>
            <div class="pill dark xxs">
                <span>{{ selectionInput.comments.length }}</span>
            </div>
        </template>

        <template v-slot>
            <div class="comments-wrapper">
                <div
                    class="sender-wrapper"
                    v-for="(senderBundle, bundleIndex) in commentsBundledBySender"
                    :key="bundleIndex"
                >
                    <comment
                        v-for="(comment, index) in senderBundle.comments"
                        :key="index"
                        :index="index"
                        :comment="comment"
                        :selectionInput="selectionInput"
                    />
                </div>
            </div>

            <div class="form-wrapper">
                <strong class="form-header">Write comment</strong>

                <form @submit="onSubmit" :class="[{ active: writeActive }]">
                    <div class="input-parent comment">
                        <BaseInputTextArea
                            ref="commentField"
                            :disabled="!userWriteAccess.comments.hasAccess"
                            v-tooltip="!userWriteAccess.comments.hasAccess && userWriteAccess.comments.msg"
                            :placeholder="
                                userWriteAccess.comments.hasAccess
                                    ? 'Write your comment here...'
                                    : userWriteAccess.comments.msg
                            "
                            v-model="newComment.content"
                            @click.native="userWriteAccess.comments.hasAccess && activateWrite()"
                            @keydown.native.enter.exact.prevent
                            @keyup.native.esc="deactivateWrite"
                            @keyup.native.enter.exact="onSubmit"
                        ></BaseInputTextArea>
                    </div>
                    <div class="flex-wrapper" v-if="writeActive">
                        <div class="left">
                            <div class="hotkey-tip">
                                <span class="square ghost">ENTER</span>
                                <span>To submit</span>
                            </div>
                        </div>
                        <div class="right">
                            <button type="button" class="no-bg ghost-wrapper" @click="writeActive = false">
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
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Comment from './Comment'
import BaseTempAlert from '../../../../components/ui/BaseTempAlert'

export default {
    name: 'commentsSection',
    props: ['selectionInput'],
    components: {
        Comment,
        BaseTempAlert,
    },
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
    watch: {
        selectionInput: function(newVal, oldVal) {
            if (newVal.id != oldVal.id) this.update()
        },
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', {
            currentSelection: 'getCurrentSelection',
            getAuthUserSelectionWriteAccess: 'getAuthUserSelectionWriteAccess',
        }),
        submitDisabled() {
            return this.newComment.content.length < 1 || this.submitting
        },
        userWriteAccess() {
            return this.getAuthUserSelectionWriteAccess(this.currentSelection, this.selectionInput)
        },
        commentsSorted() {
            return this.selectionInput.comments.sort((a, b) => {
                return a.id - b.id
            })
        },
        commentsBundledBySender() {
            // Bundle chat messages with the same sender
            const bundles = []
            this.commentsSorted.map((comment, index) => {
                const lastBundle = bundles[bundles.length - 1]
                // If the sender of the last bundle is the same as the current comment
                if (lastBundle && lastBundle.sender.id == comment.user.id) {
                    lastBundle.comments.push(comment)
                } else {
                    const newBundle = {
                        sender: comment.user,
                        comments: [comment],
                    }
                    bundles.push(newBundle)
                }
            })
            return bundles
        },
    },
    methods: {
        ...mapActions('comments', ['insertOrUpdateComment']),
        activateWrite() {
            this.$refs.commentField.focus()
            this.$refs.commentField.select()
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
            this.resizeTextareas()
        },
        async onSubmit(e) {
            if (e) e.preventDefault()
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the comment to post
            const commentToPost = {
                id: this.newComment.id,
                user_id: this.authUser.id,
                product_id: this.selectionInput.id,
                selection_id: this.currentSelection.id,
                content: this.newComment.content,
                user: this.authUser,
                selection: this.currentSelection,
                votes: [],
            }
            // dispatch action
            this.insertOrUpdateComment({ selectionInput: this.selectionInput, comment: commentToPost })
            this.submitting = false

            // Reset comment
            this.newComment.content = ''

            // this.deactivateWrite()
        },
        update() {
            // Reset the new comment field
            this.newComment.content = ''
            this.writeActive = false

            // Preset the height of the request field
            this.resizeTextareas()
        },
        resizeTextareas() {
            this.$nextTick(() => {
                this.$refs.commentField.resize()
            })
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type != 'textarea' && e.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Enter') {
                    this.activateWrite()
                }
            }
        },
    },
    mounted() {
        this.update()
    },
    created() {
        // Insert small delay before we add our event listener to stop the same event that showed this section, do things inside the component
        setTimeout(() => {
            document.body.addEventListener('keyup', this.hotkeyHandler)
        }, 10)
    },
    destroyed() {
        document.body.removeEventListener('keyup', this.hotkeyHandler)
    },
}
</script>

<style lang="scss" scoped>
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
h3 {
    display: flex;
    align-items: center;
    .pill {
        margin-left: 12px;
    }
}
.comments {
    background: $bluegrey250;
}
.comments-wrapper {
    height: 100%;
    overflow-y: auto;
    padding: 16px 16px 64px;
}
.sender-wrapper {
    margin-bottom: 4px;
}
.form-wrapper {
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
    form {
        .id {
            font-size: 12px;
            color: $dark2;
            display: block;
            margin-top: -2px;
        }
        .flex-wrapper {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            // align-items: center;
            .right {
                white-space: nowrap;
            }
        }
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
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.tab-headers {
    .tab {
        justify-content: space-between;
    }
}
.request-wrapper {
    margin-bottom: 16px;
}
.break-line {
    &::after,
    &::before {
        content: '';
        display: block;
        height: 2px;
        background: $dark2;
        flex: 1;
    }
    &::after {
        margin-left: 12px;
    }
    &::before {
        margin-right: 12px;
    }
    color: $dark2;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 12px;
}
.request-success {
    margin-right: 8px;
    font-weight: 500;
}
</style>
