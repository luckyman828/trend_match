<template>
    <div class="comments">
        <h4>Comments</h4>
        <div class="comments-wrapper">
            <div class="comment-wrapper" v-for="comment in comments" :key="comment.id">
                <div class="comment">
                    <span class="important bubble" v-if="comment.important"><i class="fas fa-exclamation"></i></span>
                    <span class="votes bubble" :class="{second: comment.important}">{{comment.votes.length}}</span>
                    <span class="votes pill" v-if="comment.final">Final comment <i class="far fa-comment-medical"></i></span>
                    <span class="body">{{comment.comment}}</span>
                    <span @click="onMarkAsFinal(comment)" class="circle"><i class="far fa-comment-medical"></i></span>
                </div>
                <span class="user" v-if="comment.user != null"><span class="team">{{comment.user.team.title}}</span> | {{comment.user.email}},</span>
            </div>
        </div>
        <form @submit="onSubmitComment">
            <input type="text" name="comment" id="comment-input" placeholder="Write a comment.." v-model="comment.comment">
            <label>Mark as important
                <input type="checkbox" v-model="comment.important" name="comment-important">
            </label>
            <input type="submit" value="Submit comment">
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'productSingleComments',
    props: [
        'comments',
        'authUser',
        'product',
    ],
    data: function () { return {
            comment: {
                user_id: this.authUser.id,
                product_id: this.product.id,
                comment: '',
                important: false,
                final: false,
                product_final: false,
            },
            user_id: this.authUser.id,
    }},
    watch: {
        product: function (newVal, oldVal) {
            this.comment.product_id = newVal.id
        },
        authUser: function (newVal, oldVal) {
            this.comment.user_id = newVal.id
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment']),
        ...mapActions('entities/comments', ['markAsFinal']),
        onSubmitComment(e) {
            e.preventDefault()
            this.createComment({comment: this.comment})
        },
        onMarkAsFinal(comment) {
            console.log('Comment: ' + comment.id)
            // comment.product_final = !comment.product_final; // This let's us toggle the comments status
            comment.product_final = true; // This always sets the comment as final
            console.log(comment.product_final)
            this.markAsFinal({comment: comment})
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
    }
    .comment-wrapper {
        margin-bottom: 30px;
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
        cursor: pointer;
        i {
            font-size: 20px;
        }
        &:hover {
            color: $primary;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
            background: white;
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
</style>
