<template>
    <BaseFlyin ref="fileApproversFlyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'File Approvers: '+file.name" disableNavigation=true @close="$emit('close')"/>
        </template>
        <template v-slot>
            <FileApproversTable v-if="show" :file="file"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FileApproversTable from './FileApproversTable'
export default {
    name: 'fileApproversFlyin',
    components: {
        FileApproversTable
    },
    props: [
        'show',
        'file'
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