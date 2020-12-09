<template>
    <div class="chat-overlay">
        <div class="chat-message-list" ref="messageList">
            <BaseLoader msg="Loading more" v-if="isFetchingMore" />
            <button class="white pill sm ghost" v-else-if="nextCursor" @click="onFetchMore">
                <span>Load more</span>
            </button>
            <ChatMessage v-for="videoComment in videoComments" :key="videoComment.id" :videoComment="videoComment" />
        </div>
        <ChatInputForm @submit="scrollToBottom" />
    </div>
</template>

<script>
import ChatMessage from './ChatMessage'
import ChatInputForm from './ChatInputForm'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'chatOverlay',
    components: {
        ChatMessage,
        ChatInputForm,
    },
    data: function() {
        return {
            isFetchingMore: false,
        }
    },
    computed: {
        ...mapGetters('videoComments', {
            videoComments: 'getVideoComments',
            nextCursor: 'getNextCursor',
        }),
        ...mapGetters('videoPresentation', {
            video: 'getCurrentVideo',
        }),
        ...mapGetters('auth', {
            authUser: 'authUser',
        }),
    },
    methods: {
        ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapMutations('videoComments', ['INSERT_OR_UPDATE_COMMENT']),
        async onFetchMore() {
            this.isFetchingMore = true
            await this.fetchVideoComments({ video: this.video, cursor: this.nextCursor })
            this.isFetchingMore = false
        },
        scrollToBottom() {
            const container = this.$refs.messageList
            container.scrollTo(0, container.scrollHeight)
        },
        commentArrivedHandler(comment) {
            if (this.authUser.id == comment.user.id) return
            // console.log('comment arrived', comment)
            this.INSERT_OR_UPDATE_COMMENT(comment)
            this.$nextTick(() => {
                this.scrollToBottom()
            })
        },
    },
    created() {
        const connection = this.$connection
        connection.invoke('SubscribeVideo', this.video.id)
        connection.on('OnVideoCommentArrived', this.commentArrivedHandler)
    },
    destroyed() {
        connection.invoke('UnSubscribeVideo')
        connection.off('OnVideoCommentArrived', this.commentArrivedHandler)
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
    button {
        margin-left: auto;
        min-height: 24px;
    }
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
