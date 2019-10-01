<template>
    <div class="request-wrapper" :class="{own: (request.user_id == authUser.id)}">
        <div class="request">
            <strong class="sender">{{request.task.title}} | {{(request.user_id == authUser.id) ? 'You' : request.user.name}}</strong>
            <span class="body">{{request.comment}}</span>
            <small class="id">Request ID: {{request.id}}</small>
        </div>        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';

export default {
    name: 'request',
    props: [
        'request'
    ],
    computed: {
        ...mapGetters('persist', ['authUser', 'userPermissionLevel']),
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .request-wrapper {
        margin-bottom: 4px;
    }
    .request {
        padding: 12px;
        background: $light2;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        .sender {
            font-size: 12px;
        }
        .id {
            font-size: 10px;
            font-weight: 500;
        }
        .own & {
            background: $primary;
            color: white;
        }
        .body {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 16px 0;
        }
    }
</style>