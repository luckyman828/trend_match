<template>
    <div class="comments">
        <h4>Comments</h4>
        <div class="comments-wrapper">
            <div class="comment-wrapper" v-for="comment in comments" :key="comment.id">
                <div class="comment">
                    <span class="important bubble" v-if="comment.important"><i class="fas fa-exclamation"></i></span>
                    <span v-if="comment.votes.length > 0" class="votes bubble" :class="{second: comment.important}">{{comment.votes.length}}</span>
                    <span class="votes pill" v-if="comment.final">Final comment <i class="far fa-comment-check"></i></span>
                    <span class="body">{{comment.comment}}</span>
                    <span :class="{active: comment.product_final}" @click="onMarkAsFinal(comment)" class="circle" @mouseover="showTooltip($event, 'Choose as final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span>
                </div>
                <span class="user" v-if="comment.user != null"><span class="team">{{comment.user.team.title}}</span> | {{comment.user.email}},</span>
            </div>
        </div>
        <form @submit="onSubmitComment">
            <div class="input-wrapper">
                <i class="far fa-comment"></i>
                <textarea name="comment" id="comment-input" placeholder="Write a comment.." v-model="newComment.comment" 
                oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
                <label>
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <span class="checkmark" :class="{active: newComment.important}" @mouseover="showTooltip($event, 'Important comment')" @mouseleave="hideTooltip"><i class="fas fa-exclamation"></i></span>
                </label>
            </div>
            <input type="submit" value="Submit comment" :class="{disabled: newComment.comment.length < 1}">
        </form>
        <Tooltip :tooltip="tooltip"/>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tooltip from './Tooltip'

export default {
    name: 'productSingleComments',
    props: [
        'comments',
        'authUser',
        'product',
    ],
    components: {
        Tooltip,
    },
    data: function () { return {
            newComment: {
                user_id: this.authUser.id,
                product_id: this.product.id,
                comment: '',
                important: false,
                final: false,
                product_final: false,
            },
            user_id: this.authUser.id,
            tooltip: {
                active: false,
                position: {},
                type: 'text',
                data: ''
            },
    }},
    watch: {
        product: function (newVal, oldVal) {
            this.newComment.product_id = newVal.id
        },
        authUser: function (newVal, oldVal) {
            this.newComment.user_id = newVal.id
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment']),
        ...mapActions('entities/comments', ['markAsFinal']),
        onSubmitComment(e) {
            e.preventDefault()
            console.log('submitting comment to store')
            this.createComment({comment: this.newComment})
        },
        onMarkAsFinal(comment) {
            console.log('Comment: ' + comment.id)
            // comment.product_final = !comment.product_final; // This let's us toggle the comments status
            comment.product_final = !comment.product_final; // This always sets the comment as final
            this.markAsFinal({comment: comment})
        },
        showTooltip(event, data) {
            const rect = event.target.getBoundingClientRect()

            // Set tooltip position
            this.tooltip.position.top = rect.top - rect.height - 10
            this.tooltip.position.center = rect.left

            // Set tooltip data
            this.tooltip.data = data

            // Make tooltip active
            this.tooltip.active = true;
        },
            
        hideTooltip() {
            this.tooltip.active = false;
        },
    }
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
    h4 {
        font-size: 18px;
        font-weight: 400;
    }
    .comments-wrapper {
        background: $light1;
        border-radius: 8px;
        padding: 36px;
        max-height: 70vh;
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    .comment-wrapper {
        margin-bottom: 36px;
        &:hover .circle {
            opacity: 1;
        }
    }
    .comment {
        position: relative;
        padding: 12px;
        background: $light2;
        border-radius: 6px;
        display: inline-block;
        clear: both;
        min-width: 170px;
    }
    .user {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: $dark2;
        margin-top: 4px;
    }
    .bubble {
        display: inline-block;
        height: 20px;
        width: 20px;
        border-radius: 10px;
        line-height: 20px;
        text-align: center;
        color: $dark;
        left: -10px;
        top: -10px;
        box-shadow: 0 3px 6px rgba(0,0,0,.1);
        background: $light1;
        position: absolute;
        z-index: 1;
        font-weight: 700;
        font-size: 12px;
        i {
            font-size: 9px;
        }
        &.votes {
            color: $primary;
        }
        &.second {
            left: 18px;
        }
    }
    .circle {
        position: absolute;
        right: -56px;
        height: 44px;
        width: 44px;
        display: block;
        top: 2px;
        line-height: 46px;
        text-align: center;
        background: $light2;
        border-radius: 20px;
        color: $dark2;
        transition: .3s;
        opacity: 0;
        cursor: pointer;
        i {
            font-size: 20px;
        }
        &:hover {
            color: $primary;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
            background: white;
        }
        &.active {
            color: $primary;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
            background: white;
            opacity: 1;
        }
    }
    .pill {
        display: inline-block;
        position: absolute;
        z-index: 1;
        width: auto;
        height: 20px;
        padding: 0 12px;
        line-height: 20px;
        text-align: center;
        color: $primary;
        right: -10px;
        top: -10px;
        box-shadow: 0 3px 6px rgba(0,0,0,.1);
        background: $light1;
        font-weight: 500;
    }
    form {
        margin-top: 12px;
        .input-wrapper {
            border-radius: 6px;
            border: solid 2px $light2;
            box-sizing: border-box;
            padding: 10px 52px 2px 44px;
            font-size: 14px;
            font-weight: 500;
            position: relative;
            color: $dark2;
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
            -webkit-appearance: none;
            border: none;
            height: 32px;
            border-radius: 4px;
            margin-top: 12px;
            background: $primary;
            color: white;
            padding: 4px 12px;
            width: 100%;
            text-align: center;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 60px;
            &.disabled {
                pointer-events: none;
                opacity: .5;
            }
        }
    }
</style>
