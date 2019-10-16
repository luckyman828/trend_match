<template>
    <div class="comment-wrapper" :class="{'has-traits': comment.important || comment.votes.length > 0}">
        <div class="traits">
            <span v-if="comment.important" class="circle small yellow"><i class="fas fa-exclamation"></i></span>
            <span v-if="comment.votes.length > 0" class="pill small primary"> <i class="fas fa-plus"></i> {{comment.votes.length}}</span>
        </div>
        <div class="comment" :class="{important: comment.important}">
            <span class="body">{{comment.comment}}</span>
        </div>        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';

export default {
    name: 'comment',
    props: [
        'comment'
    ],
    computed: {
        ...mapGetters('persist', ['authUser', 'userPermissionLevel']),
        authUser() {
            return AuthUser.query().first()
        },
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .comment-wrapper {
        position: relative;
        margin-bottom: 4px;
        max-width: calc(100% - 56px);
        &.has-traits {
            margin-top: 12px;
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
        top: -14px;
        left: -10px;
        z-index: 1;
        > * {
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            &*:not(:last-child) {
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
    }
</style>