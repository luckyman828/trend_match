<template>
    <div class="comment-wrapper">
        <div class="comment">
            <TooltipAlt2 v-if="comment.important" :body="'Important'">
                <span class="important bubble"><i class="fas fa-exclamation"></i></span>
            </TooltipAlt2>
            <template v-if="comment.votes.length > 0">
                <tooltipAlt2 v-if="userPermissionLevel == 2" :header="'Comment votes'" :array="comment.votesScoped.map(vote => vote.user.email)">
                    <span class="votes bubble" :class="{second: comment.important}">{{comment.votesScoped.length}}</span>
                </tooltipAlt2>
                <tooltipAlt2 v-else-if="userPermissionLevel > 2" :header="'Comment votes'" :array="comment.teamVotes" :arrayLabelKey="'title'" :arrayValueKey="'votes'">
                    <span class="votes bubble" :class="{second: comment.important}">{{comment.votes.length}}</span>
                </tooltipAlt2>
                <span v-else class="votes bubble" :class="{second: comment.important}">{{comment.votesScoped.length}}</span>
            </template>
            <div class="pill-wrapper">
                <span class="votes phase-final pill" v-if="comment.phase_final && actionScope != 'phaseAction'">Phase final <i class="far fa-comment-check"></i></span>
                <!-- <template v-if="actionScope == 'teamAction'">
                    <span class="votes team-final pill" v-if="comment.team_final && comment.team_id != currentTeamId">Team final <i class="far fa-comment-check"></i></span>
                </template> -->
                <!-- <template v-else>
                    <span class="votes team-final pill" v-if="comment.team_final">Team final <i class="far fa-comment-check"></i></span>
                </template> -->
            </div>
            <span class="body">{{comment.comment}}</span>
            <template v-if="userPermissionLevel >= 2">
                <!-- <TooltipAlt2 v-if="actionScope == 'phaseAction'" :body="'Choose as remark'">
                    <span :class="{active: comment.phase_final}" @click="onMarkAsFinal(comment)" class="circle"><i class="far fa-comment-check"></i></span>
                </TooltipAlt2>
                <TooltipAlt2 v-else-if="actionScope == 'teamAction' && comment.team_id == currentTeamId" :body="'Choose as team remark'">
                    <span :class="{active: comment.team_final && comment.team_id == currentTeamId}" @click="onMarkAsFinal(comment)" class="circle"><i class="far fa-comment-check"></i></span>
                </TooltipAlt2> -->
                <TooltipAlt2 v-if="actionScope == 'phaseAction'" :body="'Remark'">
                    <span :class="{active: comment.phase_final}" class="circle"><i class="far fa-comment-check"></i></span>
                </TooltipAlt2>
                <TooltipAlt2 v-else-if="actionScope == 'teamAction' && comment.user_id == authUser.id" :body="'Remark'">
                    <span :class="{active: comment.team_final && comment.team_id == currentTeamId}" class="circle"><i class="far fa-comment-check"></i></span>
                </TooltipAlt2>
            </template>
        </div>
        <span class="user" v-if="comment.user != null">
            <span class="team" v-if="comment.team_id > 0">
                <template v-if="comment.team">
                    {{comment.team.title}}
                </template>
            </span>
            <span class="team" v-else>Global</span>
            <template v-if="comment.user_id == authUser.id">
                | You
            </template>
            <template v-else-if="userPermissionLevel >= 2">
                | {{comment.user.email}}
            </template>
        </span>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';

export default {
    name: 'comment',
    props: [
        'comment'
    ],
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName']),
        authUser() {
            return AuthUser.query().first()
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment', 'markAsTeamFinal', 'markAsPhaseFinal']),
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
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

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
        // margin-right: 56px;
        max-width: calc(100% - 56px);
        // .own-team & {
        //     background: rgba($primary, 70%);
        //     color: white;
        // }
        .own & {
            background: $primary;
            color: white;
            text-align: left;
            margin-right: 0;
            margin-left: 56px;
        }
        .body {
            white-space: pre-wrap;
            word-wrap: break-word;
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
        user-select: none;
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
        // cursor: pointer;
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
</style>