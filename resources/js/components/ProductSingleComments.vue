<template>
    <div class="comments">
        <div class="header">
            <h4>Comments</h4>
            <div class="toggle" @click="finalOnly = !finalOnly">
                <span class="option" :class="{active: !finalOnly}">All</span>
                <span class="option" :class="{active: finalOnly}">Final comment</span>
            </div>
        </div>
        <div class="comments-wrapper">
            <div class="comment-wrapper" v-for="comment in commentsToShow" :key="comment.id" :class="[{'own-team': comment.team_id == currentTeamId}, {'own': comment.user_id == authUser.id}]">
                <div class="comment">
                    <span class="important bubble" v-if="comment.important" @mouseover="showTooltip($event, 'Important')" @mouseleave="hideTooltip"><i class="fas fa-exclamation"></i></span>
                    <span v-if="comment.votes.length > 0" class="votes bubble" :class="{second: comment.important}">{{comment.votes.length}}</span>
                    <div class="pill-wrapper">
                        <span class="votes phase-final pill" v-if="comment.phase_final && actionScope != 'phaseAction'">Phase final <i class="far fa-comment-check"></i></span>
                        <template v-if="actionScope == 'teamAction'">
                            <span class="votes team-final pill" v-if="comment.team_final && comment.team_id != currentTeamId">Team final <i class="far fa-comment-check"></i></span>
                        </template>
                        <template v-else>
                            <span class="votes team-final pill" v-if="comment.team_final">Team final <i class="far fa-comment-check"></i></span>
                        </template>
                    </div>
                    <span class="body">{{comment.comment}}</span>

                    <!-- <span v-if="authUser.role_id >= 2" :class="{active: comment.product_final}" @click="onMarkAsFinal(comment)" class="circle" @mouseover="showTooltip($event, 'Choose as final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span>
                    <span v-else :class="{active: comment.team_final}" @click="onMarkAsFinal(comment)" class="circle disabled" @mouseover="showTooltip($event, 'Final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span> -->
                     <template v-if="userPermissionLevel >= 2">
                        <!-- <span v-if="actionScope == 'phaseAction'" :class="{active: comment.user_final}" @click="onMarkAsFinal(comment)" class="circle" @mouseover="showTooltip($event, 'Choose as final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span> -->
                        <span v-if="actionScope == 'phaseAction'" :class="{active: comment.phase_final}" @click="onMarkAsFinal(comment)" class="circle" @mouseover="showTooltip($event, 'Choose as phase final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span>
                        <span v-else-if="actionScope == 'teamAction' && comment.team_id == currentTeamId" :class="{active: comment.team_final && comment.team_id == currentTeamId}" @click="onMarkAsFinal(comment)" class="circle" @mouseover="showTooltip($event, 'Choose as team final comment')" @mouseleave="hideTooltip"><i class="far fa-comment-check"></i></span>
                     </template>
                </div>
                <span class="user" v-if="comment.user != null">
                    <span class="team" v-if="comment.team_id > 0">
                        <template v-if="comment.team">
                            {{comment.team.title}} | 
                        </template>
                    </span>
                    <span class="team" v-else>Global | </span>
                    {{comment.user.email}}
                </span>
            </div>
        </div>
        <form @submit="onSubmitComment">
            <div class="input-wrapper">
                <i class="far fa-comment"></i>
                <textarea @keyup.enter="onSubmitComment" name="comment" id="comment-input" placeholder="Write a comment.." v-model="newComment.comment" 
                oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
                <label>
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <span class="checkmark" :class="{active: newComment.important}" @mouseover="showTooltip($event, 'Important comment')" @mouseleave="hideTooltip"><i class="fas fa-exclamation"></i></span>
                </label>
            </div>
            <input type="submit" class="button primary xl" value="Submit comment" :class="{disabled: (newComment.comment.length < 1 || submittingComment)}">
        </form>
        <Tooltip :tooltip="tooltip"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
            team_id: this.currentTeamId,
            phase: 1,
            comment: '',
            important: false,
            team_final: false,
            phase_final: false,
        },
        user_id: this.authUser.id,
        tooltip: {
            active: false,
            position: {},
            type: 'text',
            data: ''
        },
        finalOnly: true,
    }},
    // watch: {
    //     product: function (newVal, oldVal) {
    //         this.newComment.product_id = newVal.id
    //     },
    //     authUser: function (newVal, oldVal) {
    //         this.newComment.user_id = newVal.id
    //     },
    // },
    computed: {
        ...mapGetters('entities/comments', ['submittingComment']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName']),
        commentsToShow () {
            const comments = this.comments
            let commentsToReturn = []
            // Scope to team if auth user role is less than 3
            if (this.finalOnly) {
                comments.forEach(comment => {
                    // Check if the comment is final
                    if (comment.team_final || comment.phase_final)
                        commentsToReturn.push(comment)

                    // Check if the auth user made the comment
                    comment.userComment = false
                    if (comment.user_id == this.authUser.id && comment.team_id == this.currentTeamId) {
                        comment.userComment = true
                        // Check if the comment is already in the array
                        if (!commentsToReturn.find(x => x.id == comment.id))
                            commentsToReturn.push(comment)
                    }
                })
            } else {
                commentsToReturn = comments
            }
            commentsToReturn.forEach(comment => {
                comment.user_final = false
                // Check if the comment is the auth users final comment
                if (comment.team_final || comment.phase_final) {
                    if (this.actionScope == 'phaseAction')
                        if (comment.user_id == this.authUser.id)
                            comment.user_final = true
                    if (this.actionScope == 'teamAction')
                        if (comment.team_id == this.currentTeamId)
                            comment.user_final = true
                }
            })
            return commentsToReturn
        }
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
        async onSubmitComment(e) {
            e.preventDefault()
            console.log('submitting comment to store')
            await this.createComment({comment: this.newComment})

            // Reset comment
            this.newComment.comment = ''
            this.newComment.important = false
            this.newComment.team_final = false
            this.newComment.phase_final = false
        },
        onMarkAsFinal(comment) {
            if (this.actionScope == 'phaseAction') {
                comment.phase_final = !comment.phase_final
                this.markAsPhaseFinal({comment: comment})
            }
            else if (this.actionScope == 'teamAction') {
                comment.team_final = !comment.team_final
                this.markAsTeamFinal({comment: comment})
            }
        },
        showTooltip(event, data) {
            const rect = event.target.getBoundingClientRect()

            // Set tooltip position
            this.tooltip.position.top = rect.top - rect.height - 12
            this.tooltip.position.center = rect.left

            // Set tooltip data
            this.tooltip.data = data

            // Make tooltip active
            this.tooltip.active = true;
        },
            
        hideTooltip() {
            this.tooltip.active = false;
        },
    },
    mounted() {
        if (this.actionScope == 'phaseAction')
            this.finalOnly = true
        else
            this.finalOnly = false
    },
    updated() {
        if (this.actionScope == 'phaseAction') {
            this.newComment.team_id = 0
        } else {
            this.newComment.team_id = this.currentTeamId
        }
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
    .toggle {
        border: solid 1px $light2;
        border-radius: 50px;
        user-select: none;
        cursor: pointer;
        .option {
            font-size: 12px;
            padding: 6px 14px;
            font-weight: 700;
            color: $dark2;
            text-transform: uppercase;
            display: inline-block;
            &.active {
                color: $dark;
                background: $light2;
                border-radius: 50px;
            }
            // &:first-child {
            //     margin-right: 8px;
            // }
        }
    }
    .comments-wrapper {
        background: $light1;
        border-radius: 8px;
        padding: 36px 24px;
        height: 57vh;
        max-height: 57vh;
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    .comment-wrapper {
        margin-bottom: 24px;
        &:hover .circle {
            opacity: 1;
        }
        &.own {
            text-align: right;
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
        margin-right: 56px;
        .own-team & {
            background: rgba($primary, 70%);
            color: white;
        }
        .own & {
            background: $primary;
            color: white;
            text-align: left;
            margin-right: 0;
            margin-left: 56px;
        }
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
        .comment-wrapper.own & {
            right: auto;
            left: -56px;
        }
        i {
            font-size: 20px;
        }
        &:hover {
            color: $primary;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
            background: white;
            opacity: 1;
        }
        &.active {
            color: $primary;
            box-shadow: 0 3px 6px rgba(0,0,0,.1);
            background: white;
            opacity: 1;
        }
        &.disabled:not(.active) {
            display: none;
        }
        &.disabled {
            cursor: auto;
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
        &.phase-final {
            background: $primary;
            color: white;
        }
        &:nth-child(2) {
            right: 100px;
        }
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
        // input[type=submit] {
        //     -webkit-appearance: none;
        //     border: none;
        //     height: 32px;
        //     border-radius: 4px;
        //     margin-top: 12px;
        //     background: $primary;
        //     color: white;
        //     padding: 4px 12px;
        //     width: 100%;
        //     text-align: center;
        //     font-weight: 700;
        //     font-size: 12px;
        //     margin-bottom: 60px;
        //     &.disabled {
        //         pointer-events: none;
        //         opacity: .5;
        //     }
        // }
    }
</style>
