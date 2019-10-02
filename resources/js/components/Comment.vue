<template>
    <div class="comment-wrapper">
        <div class="comment">
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
        margin-bottom: 4px;
        max-width: calc(100% - 56px);
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
    }
</style>