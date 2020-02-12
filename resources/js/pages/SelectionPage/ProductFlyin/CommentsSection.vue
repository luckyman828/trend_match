<template>
    <BaseFlyinColumn class="comments">

        <template v-slot:header class="random">
            <BaseToggle class="toggle" :options="[
            {value: 'requests', label: 'Requests', count: product.comments.length},
            {value: 'comments', label: 'Comments', count: product.comments.length}
            ]"
            v-model="commentScope"/>
        </template>

        <template v-slot>
            <div class="comments-wrapper">
                <template v-if="commentScope == 'comments'">

                    <!-- <div class="sender-wrapper" v-for="(comment, index) in product.comments" :key="comment.id" :class="{own: comment.user_id == authUser.id}"> -->
                    <div class="sender-wrapper" v-for="(comment, index) in product.comments" :key="index" :class="{own: comment.user_id == authUser.id}">
                        <comment :product="product" :comment="comment"/>
                        <div class="sender" v-if="product.comments[index+1] ? product.comments[index+1].user_id != comment.user_id : true">{{comment.selection.name}} {{(comment.user_id == authUser.id) ? '| You' : comment.user.name}}</div>
                    </div>

                </template>

                <template v-if="commentScope == 'requests'">

                    <div class="selection-request" v-if="selectionRequest">
                        <request :request="selectionRequest"/>
                    </div>
                    <div v-if="product.requests.find(x => x.selection_id != selection.id)" class="break-line">Showing requests from other selections(s)</div>
                    <div class="requests-wrapper">
                        <request :request="request" v-for="request in product.requests.filter(x => x.selection_id != selection.id)" :key="request.id"/>
                    </div>

                </template>
            </div>


            <form @submit="onSubmit">
                <div class="controls">
                    <div class="left">
                        <button class="invisible" :class="{dark: writeScope == 'request'}" 
                        @click="setWriteScope('request')">
                            <span>Request</span>
                        </button>
                        <button class="invisible" :class="{dark: writeScope == 'comment'}" 
                        @click="setWriteScope('comment')">
                            <span>Comment</span>
                        </button>
                    </div>
                    <div class="right">
                    </div>
                </div>

                <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'request'}]">
                    <!-- <div class="input-wrapper request">
                        <textarea @click="activateWrite" ref="requestField" @keydown.enter.exact.prevent name="request" id="request-input" placeholder="Write your request here..." v-model="newRequest.body" 
                        @input="resizeTextarea($event)" @keyup.esc="deactivateWrite"></textarea>
                        <div class="edit-request" v-if="selectionRequest && !writeActive">
                            <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                        </div>
                    </div> -->
                    <div class="input-parent request">
                        <BaseInputTextArea ref="requestField"
                        placeholder="Write your request here..." v-model="newRequest.body" 
                        @click.native="activateWrite" @keydown.enter.exact.prevent.native  
                        @keyup.esc.native="deactivateWrite" @keyup.enter.exact.native="onSubmit"></BaseInputTextArea>
                        <div class="edit-request" v-if="selectionRequest && !writeActive">
                            <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                        </div>
                    </div>
                    <div class="flex-wrapper" v-if="writeActive">
                        <div class="left">
                            <small class="id" v-if="selectionRequest">Request ID: {{selectionRequest.id}}</small>
                            <div class="hotkey-tip" v-if="writeActive">
                                <span class="square ghost">ENTER</span>
                                <span>To save</span>
                            </div>
                        </div>
                        <div class="right">
                            <BaseTempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"><small class="request-succes">Request saved <i class="fas fa-clipboard-check green"></i></small></BaseTempAlert>
                            <template>
                                <button class="invisible" @click="cancelRequest"><span>Cancel</span></button>
                                <button class="green" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Save</span></button>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="form-input" :class="[{active: writeActive}, {hidden: writeScope != 'comment'}]">
                    <div class="input-parent comment">
                        <BaseInputTextArea ref="commentField"
                        placeholder="Write your comment here..." v-model="newComment.body" 
                        @click.native="activateWrite" @keydown.enter.exact.prevent.native  
                        @keyup.esc.native="deactivateWrite" @keyup.enter.exact.native="onSubmit"></BaseInputTextArea>
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
                            <button class="invisible" @click="writeActive = false"><span>Cancel</span></button>
                            <button class="green" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Submit</span></button>
                        </div>
                    </div>
                </div>

            </form>
        </template>
    </BaseFlyinColumn>
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
    ],
    components: {
        Comment,
        Request,
        BaseTempAlert
    },
    data: function () { return {
        newComment: {
            body: '',
            important: false,
            id: null
        },
        newRequest: {
            body: '',
            important: false,
            id: null
        },
        commentScope: 'comments',
        writeScope: 'comment',
        writeActive: false,
        submitting: false,
    }},
    watch: {
        product: function(newVal, oldVal) {
            if (newVal.id != oldVal.id)
                this.update()
        },
    },
    computed: {
        ...mapGetters('persist', ['authUser']),
        ...mapGetters('entities/selections', ['currentSelection']),
        submitDisabled () {
            if (this.writeScope == 'comment') {
                return this.newComment.body.length < 1 || this.submitting
            }
            else {
                return this.newRequest.body.length < 1
                // return this.newRequest.body.length < 1 || this.submitting
            }
        },
        selectionRequest() {
            return this.product.requests.find(x => x.selection_id == this.selection.id)
        }
    },
    methods: {
        ...mapActions('entities/comments', ['insertOrUpdateComment']),
        ...mapActions('entities/requests', ['insertOrUpdateRequest']),
        activateWrite() {
            // if (this.writeScope == 'request') {
            //     this.newRequest.id = (this.selectionRequest) ? this.selectionRequest.id : null
            //     this.$refs.requestField.focus()
            // } else {
            //     this.$refs.commentField.focus()
            //     // If scope is comment set the newComment id equal to the edited comment
            // }
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
        },
        cancelRequest() {
            this.deactivateWrite()
            this.newRequest.body = (this.selectionRequest) ? this.selectionRequest.comment : ''
        },
        async onSubmit(e) {
            if (e) e.preventDefault()
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            if (this.writeScope == 'comment') {

                // Instantiate the comment to post
                const commentToPost = {
                    id: this.newComment.id,
                    user_id: this.authUser.id,
                    product_id: this.product.id,
                    selection_id: this.currentSelection.id,
                    body: this.newComment.body,
                    user: this.authUser,
                    selection: this.currentSelection,
                    votes: []
                }
                // dispatch action
                this.insertOrUpdateComment({product: this.product, comment: commentToPost})
            }
            else { // If write scope is request

                // Instantiate the request to post
                const requestToPost = {
                    id: this.newRequest.id,
                    user_id: this.authUser.id,
                    product_id: this.product.id,
                    selection_id: this.currentSelection.id,
                    body: this.newRequest.body,
                    user: this.authUser,
                    selection: this.currentSelection
                }
                // dispatch action
                this.insertOrUpdateRequest(this.product, requestToPost)
            }
            // In any case
            this.submitting = false

            // Reset comment
            this.writeActive = false
            // Unset the focus
            document.activeElement.blur()
            
            // Reset comment
            if (this.writeScope == 'comment') {
                this.newComment.body = ''
            } else {
                this.newRequest.body = (this.selectionRequest) ? this.selectionRequest.body : ''
            }

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
            this.newRequest.body = (this.selectionRequest) ? this.selectionRequest.comment : ''
            // Set the id of the new request if one exists
            this.newRequest.id = (this.selectionRequest) ? this.selectionRequest.id : null
            // Reset the new comment field
            this.newComment.body = ''
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
    ::v-deep {
        &.fly-in-column {
            .header {
                display: flex;
                justify-content: center;
            }
            .body {
                display: flex;
                flex-direction: column;
                padding: 0;
            }
        }
    }
    .comments-wrapper {
        height: 100%;
        overflow-y: auto;
        padding: 16px 16px 64px;
        .sender {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: $dark2;
        }
    }
    form {
        padding: 20px 16px 28px;
        .controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            .left {
                > :first-child {
                    margin-left: -12px;
                }
                // > :not(:last-child) {
                //     margin-right: 8px;
                // }
            }
        }
        .form-input {
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
    .request-succes {
        margin-right: 8px;
        font-weight: 500;
    }
</style>
