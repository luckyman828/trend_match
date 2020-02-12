<template>
    <div class="comments">
        
        <div class="tab-headers">
            <span v-if="commentsAvailable" :class="{active: commentScope == 'comments'}" class="tab" @click="setCommentScope('comments')">
                Comments <span class="circle small" :class="(commentScope == 'comments') ? 'white' : 'light'">{{comments.length}}</span>
            </span>
            <span v-if="requestsAvailable" :class="{active: commentScope == 'requests'}" class="tab" @click="setCommentScope('requests')">
                Requests <span class="circle small" :class="(commentScope == 'requests') ? 'white' : 'light'">{{requests.length}}</span>
            </span>
        </div>

        <div class="comments-wrapper">
            <div class="inner">

                <template v-if="commentScope == 'comments'">

                    <div class="sender-wrapper" v-for="(comment, index) in comments" :key="comment.id" :class="{own: comment.user_id == authUser.id}">
                        <comment :comment="comment"/>
                        <div class="sender" v-if="comments[index+1] ? comments[index+1].user_id != comment.user_id : true">{{comment.selection.name}} {{(comment.user_id == authUser.id) ? '| You' : userPermissionLevel > 1 ? '| ' + comment.user.name : ''}}</div>
                    </div>

                </template>

                <template v-if="commentScope == 'requests'">

                    <div class="selection-request" v-if="selectionRequest">
                        <request :request="selectionRequest"/>
                    </div>
                    <div v-if="requests.find(x => x.selection_id != selection.id)" class="break-line">Showing requests from other selections(s)</div>
                    <div class="requests-wrapper">
                        <request :request="request" v-for="request in requests.filter(x => x.selection_id != selection.id)" :key="request.id"/>
                    </div>

                </template>

            </div>
        </div>


        <form @submit="onSubmitComment" v-if="!commentsClosed">
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

            <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'request'}]">
                <!-- <div class="input-wrapper request">
                    <textarea @click="activateWrite" ref="requestField" @keydown.enter.exact.prevent name="request" id="request-input" placeholder="Write your request here..." v-model="newRequest.comment" 
                    @input="resizeTextarea($event)" @keyup.esc="deactivateWrite"></textarea>
                    <div class="edit-request" v-if="selectionRequest && !writeActive">
                        <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                    </div>
                </div> -->
                <div class="input-parent request">
                    <textarea class="input-wrapper" @click="activateWrite" ref="requestField" @keydown.enter.exact.prevent name="request" id="request-input" placeholder="Write your request here..." v-model="newRequest.comment" 
                   @input="resizeTextarea($event.target)" @keyup.esc="deactivateWrite" @keyup.enter.exact="onSubmitComment"></textarea>
                    <div class="edit-request" v-if="selectionRequest && !writeActive">
                        <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                    </div>
                </div>
                <div class="flex-wrapper">
                    <div class="left">
                        <small class="id" v-if="selectionRequest">Request ID: {{selectionRequest.id}}</small>
                        <div class="hotkey-tip" v-if="writeActive">
                            <span class="square ghost">ENTER</span>
                            <span>To save</span>
                        </div>
                    </div>
                    <div class="right">
                        <BaseTempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"><small class="request-succes">Request saved <i class="fas fa-clipboard-check green"></i></small></BaseTempAlert>
                        <template v-if="writeActive">
                            <span class="button invisible" @click="cancelRequest">Cancel</span>
                            <span class="button green" :class="{disabled: submitDisabled}" @click="onSubmitComment">Save</span>
                        </template>
                    </div>
                </div>
            </div>

            <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'comment'}]">
                <div class="input-parent comment">
                    <textarea class="input-wrapper" @click="activateWrite" ref="commentField" @keydown.enter.exact.prevent name="comment" id="comment-input" placeholder="Write your comment here..." v-model="newComment.comment" 
                    @input="resizeTextarea($event.target)" @keyup.esc="deactivateWrite" @keyup.enter.exact="onSubmitComment"></textarea>
                </div>
                <label class="checkbox">
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <span v-tooltip.top="'Important comment'" class="checkmark" :class="{active: newComment.important}"><i class="fas fa-exclamation"></i></span>
                </label>
                <div class="flex-wrapper" v-if="writeActive">
                    <div class="left">
                        <div class="hotkey-tip">
                            <span class="square ghost">ENTER</span>
                            <span>To submit</span>
                        </div>
                    </div>
                    <div class="right">
                        <span class="button invisible" @click="writeActive = false">Cancel</span>
                        <span class="button green" :class="{disabled: submitDisabled}" @click="onSubmitComment">Submit</span>
                    </div>
                </div>
            </div>

        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Comment from './Comment'
import Request from './Request'
import BaseTempAlert from '../../../components/ui/BaseTempAlert'

export default {
    name: 'commentsSection',
    props: [
        'product',
        'selection'
    ],
    components: {
        Comment,
        Request,
        BaseTempAlert
    },
    data: function () { return {
        newComment: {
            comment: '',
            important: false,
            id: null
        },
        newRequest: {
            comment: '',
            important: false,
            id: null
        },
        user_id: this.authUserId,
        commentScope: 'comments',
        writeScope: 'comment',
        writeActive: false,
    }},
    watch: {
        product: function(newVal, oldVal) {
            if (newVal.id != oldVal.id)
                this.update()
        },
    },
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'authUser', 'authUserId']),
        ...mapGetters('entities/comments', ['submittingComment']),
        comments() {
            return this.product.comments
        },
        requests() {
            return this.product.requests
        },
        submitDisabled () {
            if (this.writeScope == 'comment') {
                if(this.newComment.comment.length < 1 || this.submittingComment)
                return true
                else return false
            }
            else {
                if(this.newRequest.comment.length < 1 || this.submittingComment)
                return true
                else return false
            }
        },
        commentToPost () {
            if (this.writeScope == 'comment') {
                return {
                    id: this.$uuid.v4(),
                    user_id: this.authUserId,
                    product_id: this.product.id,
                    selection_id: this.selection.id,
                    team_id: this.currentTeamId,
                    comment: this.newComment.comment,
                    important: this.newComment.important,
                }
            } else {
                return {
                    id: this.$uuid.v4(),
                    user_id: this.authUserId,
                    product_id: this.product.id,
                    selection_id: this.selection.id,
                    team_id: this.currentTeamId,
                    comment: this.newRequest.comment,
                    important: this.newRequest.important,
                    is_request: true,
                }
            }
        },
        commentsAvailable() {
            return true
        },
        requestsAvailable() {
            return true
        },
        commentsClosed() {
            let isClosed = false
            return isClosed
        },
        selectionRequest() {
            return this.product.requests.find(x => x.selection_id == this.selection.id)
        }
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
        ...mapMutations('entities/comments', ['setSubmitting']),
        activateWrite() {
            if (this.writeScope == 'request') {
                this.newRequest.id = (this.selectionRequest) ? this.selectionRequest.id : null
                this.$refs.requestField.focus()
            } else {
                this.$refs.commentField.focus()
                // If scope is comment set the newComment id equal to the edited comment
            }
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
        },
        cancelRequest() {
            this.deactivateWrite()
            this.newRequest.comment = (this.selectionRequest) ? this.selectionRequest.comment : ''
        },
        async onSubmitComment(e) {
            if (e) e.preventDefault()


            if (!this.submitDisabled) {
                // this.setSubmitting = true
                    // Succes
                    this.createComment({comment: this.commentToPost})
                    .then(success => {
                        if (success) {
                            console.log('succes')
                            // On succes
                        } else {
                            console.log('error')
                            // On error
                        }
                    })
                // In any case
                // this.setSubmitting = false

                // Reset comment
                this.$refs.requestSucces.show()
                this.writeActive = false
                // Unset the focus
                document.activeElement.blur()
                
                // Reset comment
                if (this.writeScope == 'comment') {
                    this.newComment.comment = ''
                    this.newComment.important = false
                    // Reset textarea height
                    this.$refs.commentField.style.height = ''
                } else {
                    this.newRequest.comment = (this.selectionRequest) ? this.selectionRequest.comment : ''
                    this.newRequest.important = false
                    // Reset textarea height
                    // this.$refs.requestField.style.height = ''
                }

            }
        },
        resizeTextarea(textarea) {
            const commentField = textarea
            // Avoid weird resizing when there is only 1 character in the textarea
            // if (event.target.value.length > 1) {
                commentField.style.height = ''

                // Avoid making the textarea smaller than default
                const offset = 4
                if (commentField.scrollHeight + offset > 42) {
                    commentField.style.height = commentField.scrollHeight + offset + "px"
                }
            // }
        },
        setCommentScope(scope) {
            this.commentScope = scope
        },
        setWriteScope(scope) {
            this.writeActive = false
            this.writeScope = scope
        },
        update() {
            // Set the new request equal to the existing if one exists
            this.newRequest.comment = (this.selectionRequest) ? this.selectionRequest.comment : ''
            // Set the id of the new request if one exists
            this.newRequest.id = (this.selectionRequest) ? this.selectionRequest.id : null
            // Reset the new comment field
            this.newComment.comment = ''
            this.writeActive = false

            // Preset the height of the request field
            // Use the nextTick function to make sure all the data has been set

            this.$nextTick(() => {
                if (this.writeScope == 'request' && this.$refs.requestField)
                    this.resizeTextarea(this.$refs.requestField)
            })
        },
        hotkeyHandler(e) {
            const key = e.code
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Enter') {
                    this.activateWrite()
                }
            }
        }
    },
    mounted() {
        this.update()
    },
    created() {
        document.body.addEventListener('keyup', this.hotkeyHandler)
    },
    destroyed() {
        document.body.removeEventListener('keyup', this.hotkeyHandler)
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
    .hotkey-tip {
        .square {
            border-width: 1px;
            height: auto;
            padding: 2px 4px;
            min-width: 0;
            font-weight: 400;
            border-radius: 2px;
            font-size: 9px;
            margin-right: 2px;
        }
        font-size: 10px;
        color: $dark2;
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
    .request-wrapper {
        margin-bottom: 16px;
    }
    .sender-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 4px;
        &.own {
            align-items: flex-end
        }
    }
    .sender {
        margin-bottom: 20px;
    }
    .break-line {
        &::after, &::before {
            content: '';
            display: block;
            height: 2px;
            background: $dark2;
            flex: 1;
        }
        &::after {
            margin-left: 12px;
        }
        &::before {
            margin-right: 12px;
        }
        color: $dark2;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 12px;
    }
    .comments-wrapper {
        background: $light1;
        border-radius: 0 8px 0 0;
        padding: 16px 4px 16px 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        .inner {
            padding: 0 16px;
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
        padding: 8px 0 24px;
        background: white;
        box-shadow: 0 -3px 6px rgba($dark, 10%);
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
            position: relative;
            padding: 0 12px;
            &.hidden {
                display: none;
            }
            .id {
                font-size: 12px;
                color: $dark2;
                display: block;
                margin-top: -2px;
            }
            .edit-request {
                position: absolute;
                right: 12px;
                font-size: 10px;
                color: $dark;
                font-weight: 500;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                .circle {
                    height: 24px;
                    width: 24px;
                    margin-left: 4px;
                }
            }
            .input-wrapper {
                border-radius: 6px;
                border: solid 2px $light2;
                background: $light2;
                box-sizing: border-box;
                font-size: 14px;
                // color: $dark2;
                max-height: 200px;
                overflow: auto;
                cursor: pointer;
                position: relative;
            }
            textarea {
                padding: 8px 108px 8px 12px;
                border: none;
                height: 42px;
                overflow: hidden;
                width: 100%;
                resize: none;
                color: $dark1;
                background: transparent;
                cursor: pointer;
                line-height: 1.49;
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
                // align-items: center;
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
            top: 4px;
            cursor: pointer;
            &.active {
                color: $primary;
            }
        }
        input[type=submit] {
            margin-top: 12px;
        }
    }
    .request-succes {
        margin-right: 8px;
        font-weight: 500;
    }
</style>
