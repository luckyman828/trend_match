<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left"></div>
        <div class="item-right flex-list">
            <BaseButton
                buttonClass="primary ghost"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new files'"
                @click="showNewFileModal = true"
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

        <CreateFileModal
            :show="createFileModalVisible"
            ref="createFileModal"
            @close="createFileModalVisible = false"
            :key="createFileKey"
            @reset="createFileKey++"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateFileModal from './CreateFileModal/'
import NewFileModal from './NewFileModal'

export default {
    name: 'filesPageNavbar',
    components: {
        CreateFileModal,
        NewFileModal,
    },
    data: function() {
        return {
            showNewFileModal: false,
            createFileModalVisible: false,
            createFileKey: 0,
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
