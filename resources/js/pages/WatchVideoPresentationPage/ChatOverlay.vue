<template>
    <div class="chat-overlay">
        <div class="chat-message-list">
            <ChatMessage v-for="videoComment in videoComments" :key="videoComment.id" :videoComment="videoComment" />
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
        max-height: 400px;
        min-width: 200px;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-right: 8px;
        margin-right: -8px;
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(white, 0);
            border-radius: 2px;
        }
        &::-webkit-scrollbar-track {
            background: none;
        }
        &:hover {
            &::-webkit-scrollbar-thumb {
                background: rgba(white, 1);
            }
            ::v-deep {
                .chat-message {
                    background: black;
                }
            }
        }
    }
}
</style>
