<template>
    <BaseTableInnerRow class="user-row table-row" ref="userRow">
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
            <button v-if="authUserWorkspaceRole == 'Admin'" class="ghost editable sm" @click.stop="$emit('edit-role', $event, user)"><span>{{user.role}}</span></button>
            <span v-else>{{user.role}}</span>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'teamUsersTableRow',
    props: [
        'user',
        'team',
    ],
    data: function() { return {
        editName: false,
        userToEdit: this.user,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapActions('users', ['updateUser']),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.user-row {
    &.self {
        .title {
            i {
                color: $primary;
            }
        }
        font-weight: 500;
    }
}

</style>