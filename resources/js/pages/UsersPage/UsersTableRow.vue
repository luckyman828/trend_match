<template>
    <BaseTableInnerRow>
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
        <td class="role">
            <!-- Admin -->
            <button
                v-if="authUserWorkspaceRole == 'Admin'"
                class="ghost editable sm"
                @click="$emit('editRole', $event, user)"
            >
                <span>{{ user.role }}</span>
            </button>
            <!-- Member -->
            <span v-else>{{ user.role }}</span>
        </td>
        <td class="currency">
            <!-- Admin or self -->
            <button
                v-if="authUserWorkspaceRole == 'Admin'"
                class="ghost editable sm"
                @click="$emit('editCurrency', $event, user)"
            >
                <span>{{ user.currency ? user.currency : 'Set currency' }}</span>
            </button>
            <!-- Member -->
            <span v-else>{{ user.currency ? user.currency : 'No currency set' }}</span>
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
        selectUser() {
            this.$refs.selectBox.check()
        },
    },
}
</script>

<style scoped lang="scss">
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
