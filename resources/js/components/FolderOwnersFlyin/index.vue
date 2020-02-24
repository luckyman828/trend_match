<template>
    <BaseFlyin :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Folder Owners: '+folder.name" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FolderOwnersTable v-if="show" :folder="folder"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FolderOwnersTable from './FolderOwnersTable'
export default {
    name: 'folderOwnersFlyin',
    components: {
        FolderOwnersTable
    },
    props: [
        'show',
        'folder'
    ],
    computed: {
        ...mapGetters('users', ['users', 'loadingUsers'])
    },
    methods: {
        ...mapActions('users', ['fetchUsers'])
    },
    created() {
        // Check if we have any workspace users, else fetch them
        if (!this.users && !this.loadingUsers) this.fetchUsers()
    }
}
</script>

<style>

</style>