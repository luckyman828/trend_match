<template>
    <Portal to="navbar">
        <div class="navbar-files flex-list justify">
            <div class="items-left"></div>
            <div class="item-right flex-list">
                <BaseButton
                    buttonClass="ghost pill"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new folders'"
                    @click="showNewFolderModal = true"
                >
                    <i class="far fa-folder-plus"></i>
                    <span>Add folder</span>
                </BaseButton>
                <BaseButton
                    buttonClass="dark pill"
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
    </Portal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NewFileModal from './NewFileModal'
import NewFolderModal from './NewFolderModal'

export default {
    name: 'buy.FilesPageNavbar',
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
.navbar-files {
    display: flex;
    justify-content: space-between;
    grid-area: navbar;
    > * {
        display: flex;
        align-items: center;
    }
}
</style>
