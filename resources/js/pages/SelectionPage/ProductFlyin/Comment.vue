<template>
    <div class="comment-wrapper" 
    :class="[{'own': comment.user_id == authUser.id}, {'master': comment.selection.type == 'Master'}, 
    {'has-traits': hasTraits}, {'edit-active': editActive}]">
        <div class="traits">
            <span v-if="comment.important" class="circle small yellow"><i class="fas fa-exclamation"></i></span>
            <span v-if="comment.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
            <!-- <span v-if="comment.votes.length > 0" class="pill small primary"> <i class="fas fa-plus"></i> {{comment.votes.length}}</span> -->
        </div>
        <div class="comment" :class="[{important: comment.important}, {failed: comment.error}]">
            <span v-if="!editActive" class="body">{{comment.content}}</span>
            <span v-else class="body">
                <BaseInputTextArea ref="commentInputField" v-model="comment.content"
                @keyup.enter.exact.native="onUpdateComment" @keydown.enter.exact.native.prevent/>
            </span>

            <!-- Comment Controls -->
            <div class="controls" v-if="!editActive">

                <!-- comment error -->
                <span v-if="comment.error" class="failed clickable" v-tooltip.top="!comment.id ? 'Retry submit' : 'Retry edit'" @click="retrySubmitComment">
                    <i class="far fa-exclamation-circle"></i> Failed
                </span>

                <!-- comment posting -->
                <BaseLoader v-else-if="!comment.id" :msg="'posting..'"/>

                <!-- regular comment -->
                <template v-else>
                    <button v-tooltip.top="{content: 'Delete', delay: {show: 300}}" class="button invisible ghost-hover"
                    @click="onDeleteComment">
                        <i class="far fa-trash-alt"></i></button>
                    <button v-tooltip.top="{content: 'Edit', delay: {show: 300}}" class="button invisible ghost-hover"
                    @click="onEditComment">
                        <i class="far fa-pen"></i></button>
                </template>
                
            </div>
            <!-- End Comment Controls -->
        </div>
        <div class="save-controls" v-if="editActive">
            <button class="invisible ghost-hover" style="margin-right: 8px"
            @click="editActive = false">
                <span>Cancel</span>
            </button>
            <BaseButton buttonClass="green" :hotkey="{key: 'ENTER', label: 'Save', align: 'right'}" 
            @click="onUpdateComment">
                <span>Save</span>
            </BaseButton>
        </div>

        <div class="sender" v-if="displayAuthor && !editActive">
            <strong>{{comment.role == 'Approver' ? 'Approval' : comment.selection.name}}</strong> | 
            {{(comment.user_id == authUser.id) ? 'You' 
            : !commentIsAnonymized && comment.user ? comment.user.name : 'Anonymous'}}
        </div>

        <BaseDialog ref="confirmDeleteComment" type="confirm"
        confirmColor="red" confirmText="Yes, delete it">
            <div class="icon-graphic">
                <i class="lg primary far fa-comment"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete this comment?</h3>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'comment',
    props: [
        'comment',
        'product',
        'selection',
        'displayAuthor',
    ],
    data: function() {
        return {
            commentToEdit: this.comment,
            editActive: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        isOwn() {
            return this.comment.user_id == this.authUser.id
        },
        hasTraits() {
            return this.comment.important 
            // || this.comment.votes.length > 0 
            || this.comment.focus
        },
        commentIsAnonymized() {
            const yourRole = this.selection.your_role
            const displayRole = this.selection.settings.anonymize_comment
            if (this.authUserWorkspaceRole == 'Admin') return false
            return displayRole == 'None' || displayRole == 'Owner' && yourRole != 'Owner'
        }
    },
    methods: {
        ...mapActions('comments', ['insertOrUpdateComment', 'deleteComment']),
        async onDeleteComment() {
            if (await this.$refs.confirmDeleteComment.confirm()) {
                this.deleteComment({product: this.product, comment: this.comment})
            }
        },
        retrySubmitComment() {
            this.insertOrUpdateComment({product: this.product, comment: this.comment})
        },
        onUpdateComment() {
            this.insertOrUpdateComment({product: this.product, comment: this.comment})
            this.editActive = false
        },
        onEditComment() {
            this.editActive = true
            this.$nextTick(() => {
                this.$refs.commentInputField.focus()
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .comment-wrapper {
        position: relative;
        margin-bottom: 8px;
        max-width: calc(100% - 24px);
        &.edit-active {
            width: 100%;
            max-width: none;
            margin-bottom: 72px;
            .comment {
                padding: 2px;
                width: 100%;
                ::v-deep {
                    .input-wrapper {
                        border: none;
                        min-height: 160px;
                    }
                }
            }
        }
        &.has-traits {
            margin-top: 16px;
        }
        &.own {
            margin-left: auto;
            text-align: right;
        }
    }
    .sender {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: $font;
        margin-bottom: 20px;
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
        z-index: 2;
        white-space: nowrap;
        > * {
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            &:not(:last-child) {
                margin-right: 8px;
            }
        }
    }
    .comment {
        position: relative;
        padding: 12px;
        background: white;
        border-radius: 6px;
        display: inline-block;
        margin-bottom: 4px;
        text-align: left;
        .failed {
            color: $red;
        }
        .own:not(.master) & {
            background: $primary;
            color: white;
        }
        .master & {
            background: $yellow;
        }
        .body {
            white-space: pre-wrap;
            word-wrap: break-word;
            input {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
        }
        &.important {
            background: $yellow;
            color: $dark;
        }
        .own &:hover, &.failed {
            font-weight: 700;
            .controls {
                display: inline-flex;
            }
        }
        .controls {
            transition: .3s;
            position: absolute;
            right: 0;
            bottom: -36px;
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
</style>