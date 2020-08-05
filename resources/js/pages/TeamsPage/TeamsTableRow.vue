<template>
    <BaseTableInnerRow>
        <td v-if="editTitle" class="title">
            <i class="fa-users" :class="team.id ? 'fas' : 'far'"></i>
            <BaseInputField inputClass="small" 
            v-model="teamToEdit.title" 
            :selectOnFocus="true"
            :focusOnMount="true"
            @keyup.enter.native="insertOrUpdateTeam(teamToEdit); editTitle = false"
            @keydown.esc.native="$emit('cancelEditTitle'); editTitle = false;"
            @blur="$emit('cancelEditTitle'); editTitle = false;"/>
        </td>
        <td v-else class="title clickable" @click="showSingle()">
            <i class="fa-users" :class="team.id ? 'fas' : 'far'"></i>
            <span>{{team.title}}</span>
        </td>
        <!-- <td class="owner">{{team.owner}}</td> -->
        <td class="members"><span>{{team.user_count}} Members</span></td>
        <!-- <td class="files">
            <v-popover :aria-disabled="team.files.length <= 0" style="display: inline-block">
                <span class="tooltip-target">{{team.files.length}} <i class="far fa-info-circle"/></span>
                <BaseTooltipList slot="popover" :header="'Team files'" :array="team.files" :arrayValueKey="'title'"/>
            </v-popover>
        </td> -->
        <td class="currency">
            <button v-if="authUserWorkspaceRole == 'Admin'" class="ghost editable sm" 
            @click.stop="$emit('edit-currency', $event, team)">
                <span>{{team.currency ? team.currency : 'Set currency'}}</span>
            </button>
            <span v-else>{{team.currency ? team.currency : 'No currency set'}}</span>
        </td>
        <td class="action">
            <button class="invisible ghost-hover primary" 
            @click="showSingle()">
                <span>View{{authUserWorkspaceRole == 'Admin' ? '/ Edit' : ''}}</span>
            </button>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'teamsTableRow',
    props: [
        'team',
    ],
    data: function() { return {
        editTitle: false,
        // teamToEdit: {
        //     id: this.team.id,
        //     title: this.team.title,
        // },
        teamToEdit: this.team,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
    },
    methods: {
        ...mapActions('teams', ['insertOrUpdateTeam']),
        showSingle() {
            this.$emit('showSingle', this.team)
        },
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .currency .button {
        min-width: 64px;
        font-weight: 400;
        font-size: 14px;
        &:hover {
            border: solid 2px $primary;
        }
    }

</style>