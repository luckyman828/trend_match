<template>
    <tr class="team-row table-row" ref="teamRow">
        <td class="select"><Checkbox/></td>
        <td class="title clickable">
            <i class="fas fa-users"></i>
            <span>{{team.title}}</span>
        </td>
        <td class="owner">{{team.owner}}</td>
        <td class="members clickable"><span>{{team.users.length}}<template v-if="team.invites.length > 0"> ({{team.invites.length}})</template> Members</span></td>
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
            <button class="invisible ghost-hover primary">View</button>
            <button class="square true-square invisible ghost-hover more"><i class="far fa-ellipsis-h"></i></button>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'teamsTableRow',
    props: [
        'team',
        'index'
    ]
}
</script>

<style>

</style>