<template>
    <div class="comments">
        
        <div class="tab-headers">
            <span :class="{active: commentScope == 'comments'}" class="tab" @click="setCommentScope('comments')">
                Comments <span class="circle small" :class="(commentScope == 'comments') ? 'white' : 'light'">{{product.requests.length}}</span>
            </span>
            <span :class="{active: commentScope == 'requests'}" class="tab" @click="setCommentScope('requests')">
                Requests <span class="circle small" :class="(commentScope == 'requests') ? 'white' : 'light'">{{product.requests.length}}</span>
            </span>
        </div>

        <div class="comments-wrapper">
            <div class="inner">

                <div class="own-request">
                    <request v-if="requests.find(x => x.task_id == currentTask.id)" :request="requests.find(x => x.task_id == currentTask.id)"/>
                </div>

                <template v-if="commentScope == 'comments'">
                    <div class="sender-wrapper" v-for="(sender, index) in commentsGroupedBySender" :key="index" :class="{own: sender.user.id == authUser.id}">
                        <comment :comment="comment" v-for="comment in sender.comments" :key="comment.id"/>
                        <div class="sender">{{sender.task.title}} | {{(sender.user.id == authUser.id) ? 'You' : sender.user.name}}</div>
                    </div>
                </template>

                <template v-if="commentScope == 'requests'">
                    <div class="requests-wrapper">
                        <request :request="request" v-for="request in requests.filter(x => x.task_id != currentTask.id)" :key="request.id"/>
                    </div>
                </template>

            </div>
        </div>


        <form @submit="onSubmitComment">
            <div class="controls">
                <div class="left">
                    <div class="set-scope">
                        <span class="button invisible" :class="{active: writeScope == 'request'}" @click="setWriteScope('request')">Your Request</span>
                        <span class="button invisible" :class="{active: writeScope == 'comment'}" @click="setWriteScope('comment')">Comment</span>
                    </div>
                </div>
                <div class="right">

                </div>
            </div>

            <div class="form-input" v-if="writeScope == 'request'" :class="{active: writeActive}">
                <div class="input-wrapper request">
                    <textarea @click="writeActive = true" ref="requestField" @keydown.enter.exact.prevent @keyup.enter.exact="onSubmitComment" name="request" id="request-input" placeholder="Write your request here..." v-model="newRequest.comment" 
                    @input="resizeTextarea"></textarea>
                </div>
                <div class="flex-wrapper" v-if="writeActive">
                    <div class="left"></div>
                    <div class="right">
                        <span class="button invisible">Cancel</span>
                        <span class="button green">Save</span>
                    </div>
                </div>
            </div>

            <div class="form-input" v-if="writeScope == 'comment'" :class="{active: writeActive}">
                <div class="input-wrapper comment">
                    <textarea @click="writeActive = true" ref="commentField" @keydown.enter.exact.prevent @keyup.enter.exact="onSubmitComment" name="comment" id="comment-input" :placeholder="placeholderText" v-model="newComment.comment" 
                    @input="resizeTextarea"></textarea>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TooltipAlt2 from './TooltipAlt2'
import Comment from './Comment'
import Request from './Request'

export default {
    name: 'productSingleComments',
    props: [
        'comments',
        'requests',
        'authUser',
        'product',
    ],
    components: {
        TooltipAlt2,
        Comment,
        Request,
    },
    data: function () { return {
        newComment: {
            comment: '',
            important: false,
            is_request: false,
        },
        newRequest: {
            comment: '',
            is_request: true,
        },
        user_id: this.authUser.id,
        finalOnly: true,
        commentFilter: '',
        commentScope: 'comments',
        writeScope: 'comment',
        writeActive: false,
    }},
    computed: {
        ...mapGetters('entities/comments', ['submittingComment']),
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'currentTask']),
        submitDisabled () {
            if(this.newComment.comment.length < 1 || this.submittingComment)
                return true
            else return false
        },
        commentToPost () {
            return {
                user_id: this.authUser.id,
                product_id: this.product.id,
                team_id: this.currentTeamId,
                comment: this.newComment.comment,
                important: this.newComment.important,
                is_request: this.newComment.is_request,
            }
        },
        RequestToPost () {
            return {
                user_id: this.authUser.id,
                product_id: this.product.id,
                team_id: this.currentTeamId,
                comment: this.newRequest.comment,
                is_request: this.newRequest.is_request,
            }
        },
        placeholderText () {
            const filter = this.commentFilter
            if (this.userPermissionLevel >= 2) return 'Write a new remark..'
            else return 'Write a comment..'
        },
        submitText () {
            const filter = this.commentFilter
            // if (filter == 'remarks') return 'Submit remark'
            if (this.userPermissionLevel >= 2) return 'Submit remark'
            else return 'Submit comment'
        },
        commentsGroupedBySender() {
            const comments = this.comments
            let senders = []
            comments.forEach(comment => {
                const existingSender = senders.find(x => x.task.id == comment.task_id && x.user.id == comment.user_id)
                if (existingSender == null) {
                    senders.push({task: comment.task, user: comment.user, comments: [comment]})
                } else {
                    existingSender.comments.push(comment)
                }
            })
            return senders
        }
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
        async onSubmitComment(e) {
            if (e) e.preventDefault()

            if (!this.submitDisabled) {
                await this.createComment({comment: this.commentToPost})
    
                // Reset comment
                this.newComment.comment = ''
                this.newComment.important = false
                this.newComment.team_final = false
                this.newComment.phase_final = false

                // Reset textarea height
                this.$refs.commentField.style.height = ''
            }
        },
        resizeTextarea() {
            const commentField = this.$refs.commentField
            commentField.style.height = ''
            commentField.style.height = commentField.scrollHeight + "px"
        },
        setCommentScope(scope) {
            this.commentScope = scope
        },
        setWriteScope(scope) {
            this.writeActive = false
            this.writeScope = scope
        },
    },
    mounted() {
    },
    updated() {
    },
    created() {
    },
    destroyed() {
    }
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
    h4 {
        font-size: 18px;
        font-weight: 400;
        margin: 0;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .tab-headers {
        .tab {
            justify-content: space-between;
        }
    }
    .sender-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 20px;
        &.own {
            align-items: flex-end
        }
    }
    .comments-wrapper {
        background: $light1;
        border-radius: 0 8px 0 0;
        padding: 16px 4px 16px 0;
        height: 100%;
        .inner {
            padding: 0 12px;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;
        }
        .sender {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: $dark2;
        }
    }
    form {
        margin-bottom: 42px;
        padding: 8px 0 24px;
        background: white;
        box-shadow: 0 -3px 6px rgba($dark, 10%);
        @media screen and (max-width: $screenSmall) {
            margin-bottom: 0px;
        }
        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            margin-bottom: 0px;
        }
        .controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            .set-scope {
                span {
                    font-size: 14px;
                    font-weight: 500;
                    color: $dark2;
                    cursor: pointer;
                    user-select: none;
                    &:not(:last-child) {
                        margin-right: -8px;
                    }
                    &.active {
                        color: $dark;
                        cursor: auto;
                    }
                }
            }
        }
        .form-input {
            padding: 0 12px;
            .input-wrapper {
                border-radius: 6px;
                border: solid 2px $light2;
                background: $light2;
                box-sizing: border-box;
                padding: 8px 12px 4px 12px;
                font-size: 14px;
                font-weight: 500;
                color: $dark2;
                max-height: 200px;
                overflow: auto;
                cursor: pointer;
            }
            textarea {
                border: none;
                height: 22px;
                overflow: hidden;
                width: 100%;
                resize: none;
                color: $dark1;
                background: transparent;
                cursor: pointer;
                &:focus {
                    outline: none;
                }
                &::placeholder {
                    color: $dark2;
                }
            }
            &.active {
                .input-wrapper {
                    border: solid 2px $light2;
                    background: white;
                    cursor: auto;
                }
                textarea {
                    cursor: auto;
                }
            }
            .flex-wrapper {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
            }
        }
        .checkmark {
            height: 32px;
            width: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 16px;
            background: $light1;
            color: $dark2;
            position: absolute;
            right: 16px;
            top: 6px;
            cursor: pointer;
            &.active {
                color: $primary;
            }
        }
        input[type=submit] {
            margin-top: 12px;
        }
    }
</style>
