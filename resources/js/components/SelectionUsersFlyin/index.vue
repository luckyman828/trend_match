<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Selection Users: '+selection.name" disableNavigation=true 
            @close="$emit('close')"/>
        </template>
        <template v-slot>
            <!-- <SelectionTeamsTable v-if="show && !loading" :selection="selection"/> -->
            <SelectionUsersTable style="margin-top: 40px;" v-if="show && !loading" :selection="selection"/>
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
    data: function() {return {
        loadingUsers: true,
    }},
    watch: {
        selection: async function(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                // If we have a new selection
                // -> Fetch selections users
                this.loadingUsers = true
                await this.fetchSelectionUsers(this.selection)
                this.loadingUsers = false
            }
        }
    },
    computed: {
        ...mapGetters('users', ['users']),
        loading() {
            return this.loadingUsers
        }
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('selections', ['fetchSelectionUsers'])
    },
    created() {
        // Check if we have any workspace users, else fetch them
        if (!this.users) this.fetchUsers()
    }
}
</script>

<style>

</style>