<template>
    <tr class="user-row table-row" ref="userRow" :class="{self: isSelf}"
    @contextmenu.prevent="$emit('showContextMenu', $event, user)">
        <td class="select">
            <BaseCheckbox :value="user" :modelValue="selectedUsers" 
            @change="$emit('update:selectedUsers', $event)"/>
        </td>
        <td class="title" v-if="editName">
            <i class="fa-user" :class="user.id ? 'fas' : 'far'"></i>
            <BaseEditInputWrapper ref="editName" :activateOnMount="true" :type="'text'"
                :value="userToEdit.name" :oldValue="user.name" v-model="userToEdit.name"
                @submit="updateUser(userToEdit); editName = false" @cancel="$emit('cancelEditName'); editName = false;"/>
        </td>
        <td class="title" v-else>
            <i class="fas fa-user"></i>
            <span>{{user.name}}{{isSelf ? ` (You)` : ''}}</span>
        </td>
        <td class="email" v-if="editEmail">
            <BaseEditInputWrapper ref="editEmail" :activateOnMount="true" :type="'text'"
                :value="userToEdit.email" :oldValue="user.email" v-model="userToEdit.email"
                @submit="updateUser(userToEdit); editEmail = false" @cancel="$emit('cancelEditEmail'); editEmail = false;"/>
        </td>
        <td class="email" v-else>{{user.email}}</td>
        <td class="role">
            <!-- Admin -->
            <button v-if="authUserWorkspaceRole == 'Admin'" 
            class="ghost editable sm" 
            @click.stop="$emit('editRole', $event, user)">
                <span>{{user.role}}</span>
            </button>
            <!-- Member -->
            <span v-else>{{user.role}}</span>
        </td>
        <td class="currency">
            <!-- Admin or self -->
            <button v-if="authUserWorkspaceRole == 'Admin' || isSelf"
            class="ghost editable sm" 
            @click.stop="$emit('editCurrency', $event, user)">
                <span>{{user.currency ? user.currency : 'Set currency'}}</span>
            </button>
            <!-- Member -->
            <span v-else>{{user.currency ? user.currency : 'No currency set'}}</span>
        </td>
        <td class="action">
            <button class="invisible ghost-hover" @click.stop="$emit('showContextMenu', $event, user)"><i class="far fa-ellipsis-h medium"></i></button>
        </td>
    </tr>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'usersTableRow',
    props: [
        'user',
        'selectedUsers'
    ],
    data: function() { return {
        editName: false,
        editEmail: false,
        userToEdit: this.user,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        isSelf() {
            return this.authUser.id == this.user.id
        }
    },
    methods: {
        ...mapActions('users', ['updateWorkspaceUser', 'updateUser']),
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .user-row {
        &.self {
            i {
                color: $primary;
            }
            font-weight: 500;
        }
    }

</style>