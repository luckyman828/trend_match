<template>
    <div class="chat-overlay">
        <div class="chat-message-list">
            <ChatMessage
                v-for="videoComment in videoComments.slice().reverse()"
                :key="videoComment.id"
                :videoComment="videoComment"
            />
        </div>
        <ChatInputForm />
    </div>
</template>

<script>
import ChatMessage from './ChatMessage'
import ChatInputForm from './ChatInputForm'
import { mapGetters } from 'vuex'
export default {
    name: 'chatOverlay',
    components: {
        ChatMessage,
        ChatInputForm,
    },
    data: function() {
        return {}
    },
    computed: {
        ...mapGetters('videoComments', {
            videoComments: 'getVideoComments',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.chat-overlay {
    position: absolute;
    bottom: calc(#{$heightPlayerControls} + #{$heightVideoTimeline} + 16px);
    right: 16px;
    z-index: 1;
    pointer-events: all;
    .chat-message-list {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        &:hover {
            ::v-deep {
                .chat-message {
                    background: black;
                }
            }
        }
    }
}
</style>
