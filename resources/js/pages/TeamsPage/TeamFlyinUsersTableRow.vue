<template>
    <tr class="user-row table-row" ref="userRow" @contextmenu.prevent="$emit('showContextMenu', $event, user)">
        <td class="select"><BaseCheckbox/></td>
        <td v-if="editName" class="title">
            <i class="fa-user" :class="user.id ? 'fas' : 'far'"></i>
            <BaseEditInputWrapper ref="editName" :activateOnMount="true" :type="'text'"
                :value="userToEdit.name" :oldValue="user.name" v-model="userToEdit.name"
                @submit="updateUser(userToEdit); editName = false" @cancel="$emit('cancelEditName'); editName = false;"/>
        </td>
        <td v-else class="title">
            <i class="fas fa-user"></i>
            <span>{{user.name}}</span>
        </td>
        <td class="email">{{user.email}}</td>
        <td class="role">
            <button v-if="authUserWorkspaceRole == 'Admin'" class="ghost editable sm" @click.stop="$emit('editRole', $event, user)"><span>{{user.role}}</span></button>
            <span v-else>{{user.role}}</span>
        </td>
        <!-- <td class="currency">
            <button class="ghost editable sm" @click.stop="$emit('editCurrency', $event, user)"><span>{{user.currency ? user.currency : 'Set user currency'}}</span></button>
        </td> -->
        <td class="action">
            <button v-if="authUserWorkspaceRole == 'Admin'" class="invisible ghost-hover" @click.stop="$emit('showContextMenu', $event, user)"><i class="far fa-ellipsis-h medium"></i></button>
        </td>
    </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'teamSingleFlyinUsersTableRow',
    props: [
        'user',
        'team',
        'index'
    ],
    data: function() { return {
        editName: false,
        userToEdit: this.user,
    }},
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole'])
    },
    methods: {
        ...mapActions('users', ['updateUser']),
    },
}
</script>

<style>

</style>