<template>
    <tr class="team-row table-row" ref="teamRow" @contextmenu.prevent="$emit('showContextMenu', $event, team)">
        <td class="select"><Checkbox/></td>
        <td v-if="editTitle" class="title">
            <i class="fas fa-users"></i>
            <EditInputWrapper :activateOnMount="true" :type="'text'"
                :value="teamToEdit.title" :oldValue="team.title" v-model="teamToEdit.title"
                @submit="updateTeam(teamToEdit); editTitle = false" @cancel="editTitle = false"/>
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
            <span>{{team.currency}}</span>
        </td>
        <td class="action">
            <button class="invisible ghost-hover primary" @click="showSingle(team.id)">View</button>
            <button class="square true-square invisible ghost-hover more"><i class="far fa-ellipsis-h medium"></i></button>
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
        teamToEdit: {
            id: this.team.id,
            title: this.team.title,
        },
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

</style>