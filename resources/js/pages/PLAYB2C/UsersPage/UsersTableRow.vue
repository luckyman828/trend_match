<template>
    <BaseTableInnerRow class="user-row">
        <td class="title" v-if="editName">
            <i class="fa-user" :class="user.id ? 'fas' : 'far'"></i>
            <BaseEditInputWrapper
                ref="editName"
                :activateOnMount="true"
                :type="'text'"
                :value="userToEdit.name"
                :oldValue="user.name"
                v-model="userToEdit.name"
                @submit="
                    updateUser(userToEdit)
                    editName = false
                "
                @cancel="
                    $emit('cancelEditName')
                    editName = false
                "
            />
        </td>
        <td class="title" v-else>
            <i class="fas fa-user"></i>
            <span v-tooltip="user.name.length > 26 && user.name"
                >{{ user.name | truncate(26) }}{{ isSelf ? ` (You)` : '' }}</span
            >
        </td>
        <td class="email" v-if="editEmail">
            <BaseEditInputWrapper
                ref="editEmail"
                :activateOnMount="true"
                :type="'text'"
                :value="userToEdit.email"
                :oldValue="user.email"
                v-model="userToEdit.email"
                @submit="
                    updateUser(userToEdit)
                    editEmail = false
                "
                @cancel="
                    $emit('cancelEditEmail')
                    editEmail = false
                "
            />
        </td>
        <td class="email" v-else v-tooltip="user.email.length > 34 && user.email">{{ user.email | truncate(34) }}</td>
        <td class="action">
            <button class="pill ghost dark red-hover" @click="onRemoveUser">
                <i class="far fa-times"></i>
                <span>Remove user</span>
            </button>
        </td>
    </BaseTableInnerRow>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'usersTableRow',
    props: ['user'],
    data: function() {
        return {
            editName: false,
            editEmail: false,
            userToEdit: this.user,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        isSelf() {
            return this.authUser.id == this.user.id
        },
    },
    methods: {
        ...mapActions('users', ['insertOrUpdateWorkspaceUsers']),
        selectUser() {
            this.$refs.selectBox.check()
        },
        async onRemoveUser() {
            this.user.appRole = null
            await this.insertOrUpdateWorkspaceUsers([this.user])
        },
    },
}
</script>

<style scoped lang="scss">
.user-row {
    .action {
        opacity: 0;
    }
    &:hover {
        .action {
            opacity: 1;
        }
    }
}
</style>
