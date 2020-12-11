<template>
    <div class="chat-overlay">
        <div class="chat-message-list" ref="messageList">
            <BaseLoader msg="Loading more" v-if="isFetchingMore" />
            <button class="white pill sm ghost" v-else-if="nextCursor" @click="onFetchMore">
                <span>Load more</span>
            </button>
            <div class="chat-bundle" v-for="(chatBundle, bundleIndex) in chatBundles" :key="bundleIndex">
                <ChatMessage
                    :class="{ 'from-presenter': chatBundle.sender.id == presentation.presenter.id }"
                    v-for="(videoComment, index) in chatBundle.comments"
                    :key="videoComment.id"
                    :videoComment="videoComment"
                    :index="index"
                    :chatBundle="chatBundle"
                />
            </div>
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
        ...mapGetters('presentation', {
            presentation: 'getCurrentPresentationDetails',
        }),
        chatBundles() {
            // Bundle chat messages with the same sender
            const bundles = []
            let currentBundle = []
            this.videoComments.map((comment, index) => {
                const lastBundle = bundles[bundles.length - 1]
                // If the sender of the last bundle is the same as the current comment
                if (lastBundle && lastBundle.sender.id == comment.user.id) {
                    lastBundle.comments.push(comment)
                } else {
                    const newBundle = {
                        sender: comment.user,
                        comments: [comment],
                    }
                    bundles.push(newBundle)
                }
            })
            return bundles
        },
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
    mounted() {
        this.scrollToBottom()
    },
    created() {
        console.log('subscribe chat', this.video)
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
                    &.from-presenter {
                        background: $primary;
                        .sender {
                            color: $grey400;
                        }
                    }
                }
            }
        }
        .chat-bundle {
            display: flex;
            flex-direction: column;
            margin-top: 8px;
        }
    }
}
</style>
