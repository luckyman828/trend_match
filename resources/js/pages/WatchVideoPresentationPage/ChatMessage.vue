<template>
    <div class="chat-message" :class="{ 'from-presenter': senderIsPresenter }">
        <span class="sender" v-if="index == 0">{{ videoComment.user ? videoComment.user.name : 'Anonymous' }}</span>
        <span class="msg">{{ videoComment.content }}</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'chatMessage',
    props: ['videoComment', 'chatBundle', 'index'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.chat-message {
    background: rgba(black, 0.6);
    border-radius: 16px 2px 2px 16px;
    color: white;
    max-width: 240px;
    display: inline-flex;
    flex-direction: column;
    margin-left: auto;
    padding: 6px 8px 6px 16px;
    animation: flyin 0.1s ease-out 1;
    animation-iteration-count: 1;
    font-size: 12px;
    align-items: flex-end;
    .msg {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-weight: 500;
    }
    .sender {
        // font-weight: 700;
        color: $grey700;
        font-size: 11px;
    }
    &:not(:first-child) {
        margin-top: 2px;
    }
    &:last-child {
        border-radius: 16px 2px 8px 16px;
    }
    &:first-child {
        border-radius: 16px 8px 2px 16px;
    }
    &.from-presenter {
        background: rgba($primary, 0.6);
        .sender {
            color: $grey500;
        }
    }
}
@keyframes flyin {
    from {
        transform: translateX(calc(100% + 16px));
    }
    to {
        transform: none;
    }
}
</style>
