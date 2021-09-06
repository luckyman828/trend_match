<template>
    <div class="chat-message" tabindex="0" @mousedown="onMousedown" @mouseup="onMouseup">
        <span class="sender" v-if="index == 0">{{ videoComment.user ? videoComment.user.name : 'Anonymous' }}</span>
        <span class="msg">{{ videoComment.content }}</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'chatMessage',
    props: ['videoComment', 'chatBundle', 'index'],
    data: function() {
        return {
            removeFocus: false,
        }
    },
    methods: {
        onMousedown(e) {
            // Check if the clicked element is or cotains the currently focused element
            if (
                !!document.activeElement &&
                (document.activeElement == e.target ||
                    e.target.contains(document.activeElement) ||
                    (document.body != document.activeElement && document.activeElement.contains(e.target)))
            ) {
                this.removeFocus = true
            }
        },
        onMouseup(e) {
            if (this.removeFocus) document.activeElement.blur()
            this.removeFocus = false
        },
    },
}
</script>

<style lang="scss" scoped>
.chat-message {
    background: rgba(black, 0.6);
    border-radius: 2px 16px 16px 2px;
    color: white;
    max-width: 240px;
    display: inline-flex;
    flex-direction: column;
    margin-right: auto;
    padding: 6px 16px 6px 8px;
    animation: flyin 0.1s ease-out 1;
    animation-iteration-count: 1;
    font-size: 12px;
    pointer-events: all;
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
        border-radius: 2px 16px 16px 8px;
    }
    &:first-child {
        border-radius: 8px 16px 16px 2px;
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
