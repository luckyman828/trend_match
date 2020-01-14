<template>
    <tr class="user-row table-row" ref="userRow" @contextmenu.prevent="$emit('showContextMenu', $event, user)">
        <td class="select"><Checkbox/></td>
        <td v-if="editName" class="title">
            <i class="fa-user" :class="user.id ? 'fas' : 'far'"></i>
            <EditInputWrapper ref="editName" :activateOnMount="true" :type="'text'"
                :value="userToEdit.name" :oldValue="user.name" v-model="userToEdit.name"
                @submit="updateUser(userToEdit); editName = false" @cancel="$emit('cancelEditName'); editName = false;"/>
        </td>
        <td v-else class="title clickable">
            <i class="fas fa-user"></i>
            <span>{{user.name}}</span>
        </td>
        <td class="email">{{user.email}}</td>
        <td class="role">{{user.workspaceUsers[0].workspaceRole}}</td>
        <td class="currency">
            <button class="ghost editable sm" @click.stop="$emit('editCurrency', $event, user)"><span>{{user.currency ? user.currency : 'Set currency'}}</span></button>
        </td>
        <td class="action">
            <button class="invisible ghost-hover primary">View</button>
            <button class="square true-square invisible ghost-hover more"><i class="far fa-ellipsis-h medium"></i></button>
        </td>
    </tr>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'usersTableRow',
    props: [
        'user',
        'index'
    ],
    data: function() { return {
        editName: false,
        userToEdit: JSON.parse(JSON.stringify(this.user)),
    }},
    methods: {
        ...mapActions('entities/users', ['updateUser']),
    },
}
</script>

<style>

</style>