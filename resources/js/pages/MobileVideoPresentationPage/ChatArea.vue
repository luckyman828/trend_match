<template>
    <div class="chat-area" @click="onClick" v-touch:swipe.left="onHide" :class="{ show: show }">
        <button class="white trigger pill" v-if="!show" @click="onShow" v-touch:swipe.right="onShow">
            <i class="far fa-comments"></i>
            <i class="far fa-angle-right"></i>
        </button>
        <div class="chat-message-list" ref="messageList" :class="{ highlight: highlight }">
            <BaseLoader msg="Loading more" v-if="isFetchingMore" />
            <button class="white pill sm ghost" v-else-if="nextCursor" @click="onFetchMore">
                <span>Load more</span>
            </button>
            <div class="chat-bundle" v-for="(chatBundle, bundleIndex) in chatBundles" :key="bundleIndex">
                <ChatMessage
                    :class="{ 'from-presenter': !!presentation && chatBundle.sender.id == presentation.presenter.id }"
                    v-for="(videoComment, index) in chatBundle.comments"
                    :key="videoComment.id"
                    :videoComment="videoComment"
                    :index="index"
                    :chatBundle="chatBundle"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ChatMessage from './ChatMessage'
export default {
    name: 'chatArea',
    components: {
        ChatMessage,
    },
    data: function() {
        return {
            isFetchingMore: false,
            highlight: false,
            show: true,
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
        ...mapActions('videoPlayer', ['togglePlaying']),
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
            // if (this.authUser.id == comment.user.id) return
            // console.log('comment arrived', comment)
            this.INSERT_OR_UPDATE_COMMENT(comment)
            this.$nextTick(() => {
                this.scrollToBottom()
            })
        },
        onClick(e) {
            if (!e.target.closest('.chat-message') && !e.target.closest('.trigger')) this.togglePlaying()
        },
        onHide() {
            this.show = false
        },
        onShow() {
            this.show = true
        },
    },
    mounted() {
        this.scrollToBottom()
    },
    created() {
        const connection = this.$connection
        connection.invoke('SubscribeVideo', this.video.id)
        connection.on('OnVideoCommentArrived', this.commentArrivedHandler)
    },
    destroyed() {
        const connection = this.$connection
        connection.invoke('UnSubscribeVideo')
        connection.off('OnVideoCommentArrived', this.commentArrivedHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.chat-area {
    position: fixed;
    left: 16px;
    bottom: 100px;
    width: calc(100vw - 120px);
    transition: transform $videoPauseTransition;
    // pointer-events: none;
    .desired-paused & {
        transform: translateY(-20px);
    }
    &.show {
        .chat-message-list {
            transform: none;
        }
    }
    .trigger {
        position: absolute;
        top: 35%;
        left: -8px;
        i:last-child {
            width: 8px;
            margin-right: 8px;
        }
    }
}
.chat-message-list {
    // display: flex;
    // flex-direction: column;
    max-height: 50vh;
    min-width: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 8px;
    margin-right: -8px;
    justify-content: flex-end;
    transition: transform 0.2s ease-out;
    transform: translateX(calc(-100% - 16px));
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
    &:focus-within {
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
</style>
