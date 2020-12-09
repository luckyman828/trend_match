<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left"></div>
        <div class="item-right flex-list">
            <BaseButton
                buttonClass="primary ghost"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new folders'"
                @click="showNewFolderModal = true"
            >
                <i class="far fa-folder-plus"></i>
                <span>Add folder</span>
            </BaseButton>
            <BaseButton
                buttonClass="primary"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new files'"
                @click="showNewFileModal = true"
            >
                <i class="far fa-file-plus"></i>
                <span>Add file</span>
            </BaseButton>
        </div>

        <NewFileModal :show="showNewFileModal" @close="showNewFileModal = false" />
        <NewFolderModal :show="showNewFolderModal" @close="showNewFolderModal = false" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NewFileModal from './NewFileModal'
import NewFolderModal from './NewFolderModal'

export default {
    name: 'filesPageNavbar',
    components: {
        NewFileModal,
        NewFolderModal,
    },
    data: function() {
        return {
            showNewFileModal: false,
            showNewFolderModal: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
    },
    methods: {},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.navbar-files {
    display: flex;
    justify-content: space-between;
    > * {
        display: flex;
        align-items: center;
    }
}
</style>
