<template>
    <div class="comments">
        
        <div class="tab-headers">
            <span :class="{active: commentScope == 'commentsScoped'}" class="tab" @click="setCommentScope('commentsScoped')">
                Comments <span class="circle small" :class="(commentScope == 'commentsScoped') ? 'white' : 'light'">{{product.requests.length}}</span>
            </span>
            <span :class="{active: commentScope == 'requests'}" class="tab" @click="setCommentScope('requests')">
                Requests <span class="circle small" :class="(commentScope == 'requests') ? 'white' : 'light'">{{product.requests.length}}</span>
            </span>
        </div>

        <div class="comments-wrapper">
            <div class="inner">
                <div class="sender-wrapper" v-for="(sender, index) in commentsGroupedBySender" :key="index" :class="{own: sender.user.id == authUser.id}">
                    <comment :comment="comment" v-for="comment in sender.comments" :key="comment.id"/>
                    <div class="sender">{{sender.task.title}} | {{sender.user.name}}</div>
                </div>
            </div>
        </div>


        <form @submit="onSubmitComment">
            <div class="input-wrapper">
                <i class="far fa-comment"></i>
                <textarea ref="commentField" @keydown.enter.exact.prevent @keyup.enter.exact="onSubmitComment" name="comment" id="comment-input" :placeholder="placeholderText" v-model="newComment.comment" 
                @input="resizeTextarea"></textarea>
                <label>
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <span class="checkmark" :class="{active: newComment.important}"><i class="fas fa-exclamation"></i></span>
                </label>
            </div>
            <input type="submit" class="button primary xl" :value="submitText" :class="{disabled: submitDisabled}">
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TooltipAlt2 from './TooltipAlt2'
import Comment from './Comment'

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
    },
    data: function () { return {
        newComment: {
            phase: 1,
            comment: '',
            important: false,
            is_request: false,
        },
        user_id: this.authUser.id,
        finalOnly: true,
        commentFilter: '',
        commentScope: 'commentsScoped',
    }},
    computed: {
        ...mapGetters('entities/comments', ['submittingComment']),
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel']),
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
                phase: 1,
                comment: this.newComment.comment,
                important: this.newComment.important,
                is_request: this.newComment.is_request,
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
            padding: 0 24px;
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
        margin-top: 12px;
        margin-bottom: 42px;
        @media screen and (max-width: $screenSmall) {
            margin-bottom: 0px;
        }
        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi)
        {
            margin-bottom: 0px;
        }
        .input-wrapper {
            border-radius: 6px;
            border: solid 2px $light2;
            box-sizing: border-box;
            padding: 10px 52px 2px 44px;
            font-size: 14px;
            font-weight: 500;
            position: relative;
            color: $dark2;
            max-height: 200px;
            overflow: auto;
            > i {
                position: absolute;
                left: 14px;
                top: 12px;
                font-size: 20px;
            }
            input[type=checkbox] {
                display: none;
            }
            label {
                position: absolute;
                right: 0;
                top: 0;
            }
        }
        textarea {
            border: none;
            height: 22px;
            overflow: hidden;
            width: 100%;
            resize: none;
            font-weight: 500;
            color: $dark1;
            &:focus {
                outline: none;
            }
            &::placeholder {
                color: $dark2;
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
