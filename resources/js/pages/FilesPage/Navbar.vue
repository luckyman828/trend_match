<template>
    <div class="navbar-files flex-wrapper">
        <div class="items-left">

        </div>
        <div class="item-right">
            <BaseButton buttonClass="primary" :disabled="authUserWorkspaceRole != 'Admin'"
            v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create new files'"
            @click="createFileModalVisible = true">
                <span>Add file</span>
            </BaseButton>
        </div>

        <CreateFileModal :show="createFileModalVisible" ref="createFileModal" 
        @close="createFileModalVisible = false" :key="createFileKey"
        @reset="createFileKey++"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateFileModal from './CreateFileModal/'

export default {
    name: 'filesPageNavbar',
    components: {
        CreateFileModal
    },
    data: function () { return {
        createFileModalVisible: false,
        createFileKey: 0,
    }},
    computed: {
        ...mapGetters('workspaces', ['authUserWorkspaceRole'])
    },
    methods: {
    }
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