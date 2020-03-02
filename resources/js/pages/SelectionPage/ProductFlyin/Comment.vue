<template>
    <div class="comment-wrapper" :class="[{'has-traits': hasTraits}, {'edit-active': editActive}]">
        <div class="traits">
            <span v-if="comment.important" class="circle small yellow"><i class="fas fa-exclamation"></i></span>
            <span v-if="comment.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
            <!-- <span v-if="comment.votes.length > 0" class="pill small primary"> <i class="fas fa-plus"></i> {{comment.votes.length}}</span> -->
        </div>
        <div class="comment" :class="[{important: comment.important}, {failed: comment.error}]">
            <span v-if="!editActive" class="body">{{comment.content}}</span>
            <span v-else class="body">
                <BaseInputTextArea v-model="comment.content"
                @keyup.enter.exact.native="onUpdateComment" @keydown.enter.exact.native.prevent/>
            </span>
            <div class="controls">

                <!-- comment error -->
                <template v-if="comment.error">
                    <span v-if="typeof comment.id != 'number'" class="failed clickable" v-tooltip.top="'Retry submit'" @click="retrySubmitComment">
                        <i class="far fa-exclamation-circle"></i> Failed</span>
                    <span v-else class="failed clickable" v-tooltip.top="'Retry edit'" @click="retrySubmitComment">
                        <i class="far fa-exclamation-circle"></i> Failed</span>
                </template>

                <!-- comment posting -->
                <template v-else-if="!comment.id">
                    <BaseLoader :message="'posting..'"/>
                </template>

                <!-- regular comment -->
                <template v-else>
                    <button v-tooltip.top="'Delete'" class="button true-square invisible ghost dark-hover"
                    @click="onDeleteComment">
                        <i class="far fa-trash-alt"></i></button>
                    <button v-tooltip.top="'Edit'" class="button true-square invisible ghost dark-hover"
                    @click="editActive = true">
                        <i class="far fa-pen"></i></button>
                </template>
                
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'comment',
    props: [
        'comment',
        'product'
    ],
    data: function() {
        return {
            commentToEdit: this.comment,
            editActive: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        own() {
            return this.comment.user_id == this.authUser.id
        },
        hasTraits() {
            return this.comment.important 
            // || this.comment.votes.length > 0 
            || this.comment.focus
        }
    },
    methods: {
        ...mapActions('comments', ['insertOrUpdateComment', 'deleteComment']),
        onDeleteComment() {
            window.confirm(
                'Are you sure you want to delete this comment?'
            )
                ? this.deleteComment({product: this.product, comment: this.comment})
                : false
        },
        retrySubmitComment() {
            this.insertOrUpdateComment({product: this.product, comment: this.comment})
        },
        onUpdateComment() {
            this.insertOrUpdateComment({product: this.product, comment: this.comment})
            this.editActive = false
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .comment-wrapper {
        position: relative;
        margin-bottom: 4px;
        max-width: calc(100% - 64px);
        &.edit-active {
            width: 100%;
            .comment {
                padding: 2px;
                ::v-deep {
                    .input-wrapper {
                        border: none;
                    }
                }
            }
        }
        &.has-traits {
            margin-top: 16px;
        }
    }
    .pill {
        i {
            font-size: 8px;
            margin-right: 4px;
        }
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
        background: $light2;
        border-radius: 6px;
        width: 100%;
        z-index: 1;
        .failed {
            color: $red;
        }
        .own & {
            background: $primary;
            color: white;
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
        &:hover, &.failed {
            .controls {
                opacity: 1;
            }
        }
        .controls {
            white-space: nowrap;
            transition: .3s;
            opacity: 0;
            position: absolute;
            left: calc(-100% - 4px);
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
            display: none;
            justify-content: flex-end;
            .loader {
                height: 24px;
                flex-direction: row;
            }
            .own & {
                display: flex;
            }
        }
    }
</style>