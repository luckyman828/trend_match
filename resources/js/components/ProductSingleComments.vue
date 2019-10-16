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

                    <template v-if="currentTask.type == 'approval'">
                        <div class="requests-wrapper" v-if="requests.length > 0">
                            <request :request="request" v-for="request in requests" :key="request.id"/>
                        </div>
                        <div class="sender-wrapper" v-for="comment in comments" :key="comment.id" :class="{own: comment.user.id == authUser.id}">
                            <comment :comment="comment"/>
                            <div class="sender">{{comment.task.title}} | {{(comment.user.id == authUser.id) ? 'You' : comment.user.name}}</div>
                        </div>
                        <div class="break-line" v-if="(product.currentAction)"><span class="pill" :class="product.currentAction.action == 1 ? 'green' : 'red'">Marked as {{product.currentAction.action == 1 ? 'IN' : 'OUT'}} by {{(product.currentAction.user_id == authUser.id) ? 'You' : product.currentAction.user.name}}</span></div>
                        <div class="break-line" v-else-if="(product.requests.length < 1)"><span class="pill green">Marked as IN by {{(product.inheritedAction.user_id == authUser.id) ? 'You' : product.inheritedAction.user.name}} in {{currentTask.inheritFromTask.title}}</span></div>
                        <div class="break-line" v-else-if="!product.newComment">Awaiting response from {{userPermissionLevel == 3 ? 'Requester' : 'Approver'}}</div>
                    </template>

                    <template v-else-if="currentTask.type == 'decision'">
                        <div class="requests-wrapper" v-if="requests.length > 0">
                            <request :request="requests.find(x => x.user_id == authUser.id)"/>
                        </div>
                        <div class="requests-wrapper" v-if="requests.length > 0">
                            <request :request="request" v-for="request in requests.filter(x => x.user_id != authUser.id)" :key="request.id"/>
                        </div>
                        <div class="sender-wrapper" v-for="(comment, index) in comments" :key="comment.id" :class="{own: comment.user.id == authUser.id}">
                            <comment :comment="comment"/>
                            <div class="sender" v-if="comments[index+1] ? comments[index+1].user_id != comment.user_id : true">{{comment.task.title}} {{(comment.user_id == authUser.id) ? '| You' : userPermissionLevel > 1 ? '| ' + comment.user.name : ''}}</div>
                        </div>
                        <div class="break-line" v-if="product.outInFilter"><span class="pill red">Marked as OUT by {{(product.outInFilter.user_id == authUser.id) ? 'You' : product.outInFilter.user.name}} in {{product.outInFilter.task.title}}</span></div>
                    </template>

                    <div v-else class="sender-wrapper" v-for="(comment, index) in comments" :key="comment.id" :class="{own: comment.user.id == authUser.id}">
                        <comment :comment="comment"/>
                        <div class="sender" v-if="comments[index+1] ? comments[index+1].user_id != comment.user_id : true">{{comment.task.title}} {{(comment.user_id == authUser.id) ? '| You' : userPermissionLevel > 1 ? '| ' + comment.user.name : ''}}</div>
                    </div>
                </template>

                <template v-if="commentScope == 'requests'">
                    <div class="task-request" v-if="taskRequest">
                        <request :request="taskRequest"/>
                    </div>
                    <div v-if="requests.find(x => x.task_id != currentTask.id)" class="break-line">Showing requests from prev. task(s)</div>
                    <div class="requests-wrapper">
                        <request :request="request" v-for="request in requests.filter(x => x.task_id != currentTask.id)" :key="request.id"/>
                    </div>
                </template>

            </div>
        </div>


        <form @submit="onSubmitComment" v-if="!commentsClosed">
            <div class="controls">
                <div class="left">
                    <div class="set-scope">
                        <span v-if="!['feedback','approval','decision'].includes(currentTask.type)" class="button invisible" :class="{active: writeScope == 'request'}" @click="setWriteScope('request')">Your Request</span>
                        <span class="button invisible" :class="{active: writeScope == 'comment'}" @click="setWriteScope('comment')">Comment</span>
                    </div>
                </div>
                <div class="right">

                </div>
            </div>

            <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'request'}]">
                <div class="input-wrapper request">
                    <textarea @click="activateWrite" ref="requestField" @keydown.enter.exact.prevent name="request" id="request-input" placeholder="Write your request here..." v-model="newRequest.comment" 
                    @input="resizeTextarea($event)" @keyup.esc="deactivateWrite"></textarea>
                    <div class="edit-request" v-if="taskRequest && !writeActive">
                        <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                    </div>
                </div>
                <div class="flex-wrapper">
                    <div class="left">
                        <small class="id" v-if="taskRequest">Request ID: {{taskRequest.id}}</small>
                        <div class="hotkey-tip" v-if="writeActive">
                            <span class="square ghost">ENTER</span>
                            <span>To save</span>
                        </div>
                    </div>
                    <div class="right">
                        <TempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"><small class="request-succes">Request saved <i class="fas fa-clipboard-check green"></i></small></TempAlert>
                        <template v-if="writeActive">
                            <span class="button invisible" @click="cancelRequest">Cancel</span>
                            <span class="button green" :class="{disabled: submitDisabled}" @click="onSubmitComment">Save</span>
                        </template>
                    </div>
                </div>
            </div>

            <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'comment'}]">
                <div class="input-wrapper comment">
                    <textarea @click="activateWrite" ref="commentField" @keydown.enter.exact.prevent name="comment" id="comment-input" placeholder="Write your comment here..." v-model="newComment.comment" 
                    @input="resizeTextarea($event)" @keyup.esc="deactivateWrite"></textarea>
                </div>
                <label class="checkbox">
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <TooltipAlt2 :body="'Important comment'">
                        <span class="checkmark" :class="{active: newComment.important}"><i class="fas fa-exclamation"></i></span>
                    </TooltipAlt2>
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
import { mapActions, mapGetters } from 'vuex'
import TooltipAlt2 from './TooltipAlt2'
import Comment from './Comment'
import Request from './Request'
import TempAlert from './TempAlert'

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
        TempAlert
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
        user_id: this.authUser.id,
        commentScope: 'comments',
        writeScope: 'comment',
        writeActive: false,
        submittingComment: false,
    }},
    watch: {
        product(newVal, oldVal) {
            if (newVal.id != oldVal.id)
                this.update()
        },
    },
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'userPermissionLevel', 'currentTask']),
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
        taskRequest() {
            const taskRequest = this.requests.find(x => x.task_id == this.currentTask.id)
            if (taskRequest) {
                return taskRequest
            }
        },
        commentToPost () {
            if (this.writeScope == 'comment') {
                return {
                    id: this.newComment.id,
                    user_id: this.authUser.id,
                    product_id: this.product.id,
                    task_id: this.currentTask.id,
                    team_id: this.currentTeamId,
                    comment: this.newComment.comment,
                    important: this.newComment.important,
                }
            } else {
                return {
                    id: this.newRequest.id,
                    user_id: this.authUser.id,
                    product_id: this.product.id,
                    task_id: this.currentTask.id,
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
            return !(['feedback','approval', 'decision'].includes(this.currentTask.type))
        },
        commentsClosed() {
            let isClosed = false
            if (this.currentTask.type == 'approval') {
                if (this.product.decisionAction || this.product.currentAction)
                    isClosed = true
            }
            else if (this.currentTask.type == 'decision') {
                if (this.currentTask.approvalParent && (this.product.currentAction || this.product.buyerAction))
                    isClosed = true
            }
            return isClosed
        }
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
        activateWrite() {
            if (this.writeScope == 'request') {
                this.newRequest.id = (this.taskRequest) ? this.taskRequest.id : null
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
            this.newRequest.comment = (this.taskRequest) ? this.taskRequest.comment : ''
        },
        async onSubmitComment(e) {
            if (e) e.preventDefault()

            if (!this.submitDisabled) {
                this.submittingComment = true
                try {
                    // Succes
                    await this.createComment({comment: this.commentToPost})
                    this.$refs.requestSucces.show()
                    
                    // Reset comment
                    if (this.writeScope == 'comment') {
                        this.newComment.comment = ''
                        this.newComment.important = false
                        // Reset textarea height
                        this.$refs.commentField.style.height = ''
                    } else {
                        this.newRequest.comment = (this.taskRequest) ? this.taskRequest.comment : ''
                        this.newRequest.important = false
                        // Reset textarea height
                        // this.$refs.requestField.style.height = ''
                    }
                } catch (err) {
                    // Error
                }
                // In any case
                this.submittingComment = false
                this.writeActive = false
                // Unset the focus
                document.activeElement.blur()

            }
        },
        async onCompleteTask(file_id, task_id) {
            this.submittingTaskComplete = true
            await this.completeTask({file_id: file_id, task_id: task_id})
            // .then(reponse => succes = response)
            this.submittingTaskComplete = false
        },
        resizeTextarea(event) {
            const commentField = event.target
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
        update() {
            // Set the new request equal to the existing if one exists
            this.newRequest.comment = (this.taskRequest) ? this.taskRequest.comment : ''
            // Set the id of the new request if one exists
            this.newRequest.id = (this.taskRequest) ? this.taskRequest.id : null
            // Reset the new comment field
            this.newComment.comment = ''
            this.writeActive = false

            // Set the default write / view scope
            const type = this.currentTask.type
            if (this.currentTask.parentTasks.find(x => x.type == 'feedback')){
                this.commentScope = 'comments'
                this.writeScope = 'request'
            }
            else if (['feedback','approval', 'decision'].includes(type)) {
                this.commentScope = 'comments'
                this.writeScope = 'comment'
            } 
            else {
                this.commentScope = 'requests'
                this.writeScope = 'request'
            }

            // console.log(this.newRequest.comment)
            // console.log(this.$refs.requestField.innerHTML)
            // console.log(this.$refs.requestField.scrollHeight + "px")
            // Set the height of the request field
            if (this.writeScope == 'request' && this.newRequest.comment > 1)
                this.$refs.requestField.style.height = this.$refs.requestField.scrollHeight + "px"
        },
        hotkeyHandler(e) {
            const key = e.code
            if (key == 'Enter') {
                if (this.writeActive && !e.shiftKey) {
                    e.preventDefault()
                    this.onSubmitComment()
                } else {
                    this.activateWrite()
                }
            }
                // SET FOCUS ON ACTIVE TEXTFIELD
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
            .input-wrapper {
                border-radius: 6px;
                border: solid 2px $light2;
                background: $light2;
                box-sizing: border-box;
                font-size: 14px;
                color: $dark2;
                max-height: 200px;
                overflow: auto;
                cursor: pointer;
                position: relative;
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
            }
            textarea {
                padding: 8px 108px 8px 12px;
                border: none;
                height: 30px;
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
