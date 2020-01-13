<template>
    <tr class="team-row table-row" ref="teamRow" @contextmenu.prevent="$emit('showContextMenu', $event, team)">
        <td class="select"><Checkbox/></td>
        <td v-if="editTitle" class="title">
            <i class="fa-users" :class="team.id ? 'fas' : 'far'"></i>
            <EditInputWrapper ref="editTitle" :activateOnMount="true" :type="'text'"
                :value="teamToEdit.title" :oldValue="team.title" v-model="teamToEdit.title"
                @submit="updateTeam(teamToEdit); editTitle = false" @cancel="$emit('cancelEditTitle'); editTitle = false;"/>
        </td>
        <td v-else class="title clickable" @click="showSingle(team.id)">
            <i class="fas fa-users"></i>
            <span>{{team.title}}</span>
        </td>
        <td class="owner">{{team.owner}}</td>
        <td class="members clickable" @click="showSingle(team.id)"><span>{{team.users.length}}<template v-if="team.invites.length > 0"> ({{team.invites.length}})</template> Members</span></td>
        <td class="files">
            <v-popover :aria-disabled="team.files.length <= 0" style="display: inline-block">
                <span class="tooltip-target">{{team.files.length}} <i class="far fa-info-circle"/></span>
                <tooltip-list slot="popover" :header="'Team files'" :array="team.files" :arrayValueKey="'title'"/>
            </v-popover>
        </td>
        <td class="currency">
            <button class="ghost editable sm" @click.stop="$emit('editCurrency', $event, team)"><span>{{team.currency}}</span></button>
        </td>
        <td class="action">
            <button class="invisible ghost-hover primary" @click="showSingle(team.id)"><span>View / Edit</span></button>
            <button class="invisible ghost-hover" @click.stop="$emit('showContextMenu', $event, team)"><i class="far fa-ellipsis-h medium"></i></button>
        </td>
    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'teamsTableRow',
    props: [
        'team',
        'index'
    ],
    data: function() { return {
        editTitle: false,
        // teamToEdit: {
        //     id: this.team.id,
        //     title: this.team.title,
        // },
        teamToEdit: this.team,
    }},
    methods: {
        ...mapActions('entities/teams', ['updateTeam']),
        showSingle(id) {
            this.$emit('showSingle', id)
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