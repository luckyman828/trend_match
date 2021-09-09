<template>
    <Portal to="navbar">
        <div class="navbar-users flex-list justify">
            <div class="items-left"></div>
            <div class="items-right">
                <BaseButton
                    buttonClass="dark pill"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'New users can only be added by a workspace admin'"
                    @click="setAddNewUserModalVisible(true)"
                >
                    <i class="far fa-user-plus"></i>
                    <span>Add user</span>
                </BaseButton>
            </div>
        </div>
    </Portal>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
    name: 'usersPageNavbar',
    data: function() {
        return {}
    },
    components: {},
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {
        ...mapMutations('users', ['setAddNewUserModalVisible']),
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar-users {
    display: flex;
    justify-content: space-between;
    grid-area: navbar;
    > * {
        display: flex;
        align-items: center;
    }
}
</style>
