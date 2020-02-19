<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Selection Users: '+selection.name" disableNavigation=true 
            @close="$emit('close')"/>
        </template>
        <template v-slot>
            <!-- <SelectionTeamsTable v-if="show" :selection="selection"/> -->
            <SelectionUsersTable style="margin-top: 40px;" v-if="show" :selection="selection"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionUsersTable from './SelectionUsersTable'
import SelectionTeamsTable from './SelectionTeamsTable'
export default {
    name: 'selectionUsersFlyin',
    components: {
        SelectionUsersTable,
        SelectionTeamsTable,
    },
    props: [
        'show',
        'selection',
    ],
    computed: {
        ...mapGetters('users', ['users'])
    },
    methods: {
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