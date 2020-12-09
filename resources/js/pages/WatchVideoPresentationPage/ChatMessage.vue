<template>
    <div class="chat-message">
        <span class="msg">{{ videoComment.content }}</span>
        <span class="sender">{{ videoComment.author ? videoComment.author.name : 'Anonymous' }}</span>
    </div>
</template>

<script>
export default {
    name: 'chatMessage',
    props: ['videoComment'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.chat-message {
    background: rgba(black, 0.6);
    border-radius: 16px 8px 2px 16px;
    color: white;
    max-width: 240px;
    display: inline-flex;
    margin-top: 6px;
    margin-left: auto;
    padding: 6px 8px 6px 16px;
    animation: flyin 0.1s ease-out 1;
    animation-iteration-count: 1;
    font-size: 12px;
    align-items: center;
    .msg {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .sender {
        font-weight: 700;
        margin-left: 12px;
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
