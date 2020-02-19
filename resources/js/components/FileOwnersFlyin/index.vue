<template>
    <BaseFlyin :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'File Owners: '+file.name" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FileOwnersTable v-if="show" :file="file"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FileOwnersTable from './FileOwnersTable'
export default {
    name: 'fileOwnersFlyin',
    components: {
        FileOwnersTable
    },
    props: [
        'file',
        'show'
    ],
    computed: {
        ...mapGetters('users', ['users'])
    },
    watch: {
        file: function(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                // If we have a new file
                // -> Fetch file owners
                this.fetchFileOwners(this.file)
            }
        }
    },
    methods: {
        ...mapActions('files', ['fetchFileOwners']),
        ...mapActions('users', ['fetchUsers'])
    },
    created() {
        // Check if we have any workspace users, else fetch them
        if (!this.users) this.fetchUsers()
    }
}
</script>

<style>

</style>