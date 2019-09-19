<template>
    <div class="comments">
        <div class="header">
            <h4>Comments</h4>

            <toggle v-if="userPermissionLevel < 2" :options="['team comments']" v-model="commentFilter" ref="toggle"/>
            <toggle v-else-if="userPermissionLevel == 2" :options="['team comments', 'remarks']" :defaultOption="2" v-model="commentFilter" ref="toggle"/>
            <toggle v-else :options="['all comments', 'remarks']" :defaultOption="2" v-model="commentFilter" ref="toggle"/>

        </div>


        <div class="comments-wrapper" v-if="commentFilter == 'all comments'">
            <div class="team" v-for="team in commentTeams" :key="team.id">
                    <comment :comment="comment" v-for="comment in team.comments" :key="comment.id" 
                    :class="[{'own-team': comment.team_id == currentTeamId}, {'own': comment.user_id == authUser.id}]"/>
            </div>
        </div>

        <div class="comments-wrapper" v-else>
            <comment :comment="comment" v-for="comment in commentsFiltered" :key="comment.id" 
            :class="[{'own-team': comment.team_id == currentTeamId}, {'own': comment.user_id == authUser.id}]"/>
        </div>


        <form @submit="onSubmitComment">
            <div class="input-wrapper">
                <i class="far fa-comment"></i>
                <textarea ref="commentField" @keydown.enter.exact.prevent @keyup.enter.exact="onSubmitComment" name="comment" id="comment-input" :placeholder="placeholderText" v-model="newComment.comment" 
                @input="resizeTextarea"></textarea>
                <label>
                    <input type="checkbox" v-model="newComment.important" name="comment-important">
                    <span class="checkmark" :class="{active: newComment.important}" @mouseover="showTooltip($event, 'Important comment')" @mouseleave="hideTooltip"><i class="fas fa-exclamation"></i></span>
                </label>
            </div>
            <input type="submit" class="button primary xl" value="Submit comment" :class="{disabled: submitDisabled}">
        </form>
        <Tooltip :tooltip="tooltip"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Tooltip from './Tooltip'
import TooltipAlt2 from './TooltipAlt2'
import Comment from './Comment'

export default {
    name: 'productSingleComments',
    props: [
        'comments',
        'authUser',
        'product',
    ],
    components: {
        Tooltip,
        TooltipAlt2,
        Comment,
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
        commentFilter: '',
    }},
    computed: {
        ...mapGetters('entities/comments', ['submittingComment']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName']),
        submitDisabled () {
            if(this.newComment.comment.length < 1 || this.submittingComment || this.currentTeamId < 0)
                return true
            else return false
        },
        placeholderText () {
            const filter = this.commentFilter
            if (filter == 'remarks') return 'Write a new remark..'
            else return 'Write a comment..'
        },
        commentsFiltered () {
            const comments = this.comments
            const filter = this.commentFilter
            let commentsFiltered = []
            // let commentTeams = []


            if (filter == 'team comments') {
                comments.forEach(comment => {
                    if (comment.team_id == this.currentTeamId)
                        commentsFiltered.push(comment)
                })
            } else if (filter == 'remarks') {
                comments.forEach(comment => {
                    if (comment.team_final || comment.phase_final || comment.team_id == 0)
                        commentsFiltered.push(comment)
                })
            } else if (filter == 'all comments') {
                commentsFiltered = comments
            }


            // Find the users actions and users teams actions
            commentsFiltered.forEach(comment => {
                // Check if the auth user made the comment
                comment.userComment = false
                if (comment.user_id == this.authUser.id && comment.team_id == this.currentTeamId)
                    comment.userComment = true

                // Check if the comment is the auth users final comment
                comment.user_final = false
                if (comment.team_final || comment.phase_final) {
                    if (this.actionScope == 'phaseAction')
                        if (comment.user_id == this.authUser.id)
                            comment.user_final = true
                    if (this.actionScope == 'teamAction')
                        if (comment.team_id == this.currentTeamId)
                            comment.user_final = true
                }
            })
            return commentsFiltered
        },
        commentTeams () {
            const comments = this.commentsFiltered
            let commentTeams = []

            // Group comments by team
            comments.forEach(comment => {
                if (!commentTeams.find(x => x.id == comment.team_id) )
                    if (comment.team_id > 0) {
                        comment.team.comments = []
                        commentTeams.push(comment.team)
                    }
                    else commentTeams.push ({id: 0, title: 'Global', comments: []})

                commentTeams.find(x => x.id == comment.team_id).comments.push(comment)
            })
            return commentTeams
        }
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
        async onSubmitComment(e) {
            if (e) e.preventDefault()

            if (!this.submitDisabled) {
                await this.createComment({comment: this.newComment})
    
                // Reset comment
                this.newComment.comment = ''
                this.newComment.important = false
                this.newComment.team_final = false
                this.newComment.phase_final = false

                // Reset textarea height
                this.$refs.commentField.style.height = ''
            }
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
        resizeTextarea() {
            const commentField = this.$refs.commentField
            commentField.style.height = ''
            commentField.style.height = commentField.scrollHeight + "px"
        }
    },
    mounted() {
        if (this.actionScope == 'phaseAction')
            this.finalOnly = true
        else
            this.finalOnly = false

        // Set the default comment filter by the value of the toggle
        if (this.$refs.toggle._props.defaultOption) {
            this.commentFilter = this.$refs.toggle._props.options[this.$refs.toggle._props.defaultOption - 1]
        } else {
            this.commentFilter = this.$refs.toggle._props.options[0]
        }
    },
    updated() {
        // Set comment scope
        if (this.actionScope == 'phaseAction') {
            this.newComment.team_id = 0
        } else {
            this.newComment.team_id = this.currentTeamId
        }
        // Set comment final per default
        if (this.userPermissionLevel >= 3) {
            this.newComment.phase_final = true
        } else if (this.userPermissionLevel >= 2) {
            this.newComment.team_final = true
        }

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
    form {
        margin-top: 12px;
        margin-bottom: 42px;
        @media screen and (max-width: $screenSmall) {
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
