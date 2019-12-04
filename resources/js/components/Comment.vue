<template>
    <div class="comment-wrapper" :class="{'has-traits': comment.important || comment.votes.length > 0 || comment.focus}">
        <div class="traits">
            <span v-if="comment.important" class="circle small yellow"><i class="fas fa-exclamation"></i></span>
            <span v-if="comment.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
            <span v-if="comment.votes.length > 0" class="pill small primary"> <i class="fas fa-plus"></i> {{comment.votes.length}}</span>
        </div>
        <div class="comment" :class="{important: comment.important}">
            <span v-if="!own" class="body">{{comment.comment}}</span>
            <span v-else class="body"><Editable :value="commentToEdit.comment" :type="'text'" v-model="commentToEdit.comment" @submit="updateComment(commentToEdit)"/></span>
            
            <div class="controls">
                <button v-tooltip.top="'Delete'" class="button true-square invisible ghost dark-hover"
                @click="onDeleteComment">
                    <i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';
import Editable from './Editable'

export default {
    name: 'comment',
    props: [
        'comment'
    ],
    components: {
        Editable,
    },
    data: function() {
        return {
            commentToEdit: this.comment
        }
    },
    computed: {
        ...mapGetters('persist', ['authUser', 'userPermissionLevel']),
        authUser() {
            return AuthUser.query().first()
        },
        own() {
            return this.comment.user_id == this.authUser.id
        }
    },
    methods: {
        ...mapActions('entities/comments', ['updateComment', 'deleteComment']),
        onDeleteComment() {
            window.confirm(
                'Are you sure you want to delete this comment?'
            )
                ? this.deleteComment(this.comment.id)
                : false
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
        .own & {
            background: $primary;
            color: white;
        }
        .body {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        &.important {
            background: $yellow;
            color: $dark;
        }
        &:hover {
            .controls {
                opacity: 1;
            }
        }
        .controls {
            transition: .3s;
            opacity: 0;
            position: absolute;
            left: -36px;
            top: 50%;
            transform: translateY(-50%);
            display: none;
            .own & {
                display: block;
            }
        }
    }
</style>