<template>
    <div class="navbar-team">
        <div class="flex-wrapper">
            <div class="items-left"></div>
            <div class="items-right">
                <BaseButton
                    :buttonClass="'primary'"
                    @click="addTeamModalVisible = true"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create teams'"
                >
                    <i class="far fa-plus"></i>
                    <span>Add team</span>
                </BaseButton>
            </div>
        </div>

        <CreateTeamModal :show="addTeamModalVisible" @close="addTeamModalVisible = false" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateTeamModal from '../../components/CreateTeamModal'

export default {
    name: 'teamsPageNavbar',
    data: function() {
        return {
            addTeamName: '',
            addTeamModalVisible: false,
        }
    },
    components: {
        CreateTeamModal,
    },
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

.flex-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.items-left,
.items-right {
    display: flex;
    align-items: center;
}
.back-link {
    padding-right: 28px;
    border-right: solid 2px $light2;
    margin-right: 28px;
    .circle {
        margin-right: 8px;
    }
}
.breadcrumbs {
    display: flex;
    > * {
        display: inline-flex;
        align-items: center;
    }
    > *:not(:first-child)::before {
        content: '';
        pointer-events: none;
        color: $dark1;
        margin-left: 8px;
        margin-right: 10px;
        margin-bottom: 2px;
        font-size: 10px;
        font-family: 'Font Awesome 5 Pro';
        font-weight: 900;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        line-height: 1;
    }
    > *:last-child::before {
        content: '';
    }
}
</style>
