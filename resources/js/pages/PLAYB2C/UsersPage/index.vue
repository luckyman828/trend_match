<template>
    <PageLoader>
        <UsersPage @show-add-users-modal="showAddUsersModal = true" />
        <Navbar @show-add-users-modal="showAddUsersModal = true" />
        <AddUsersToAppModal :show.sync="showAddUsersModal" />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersPage from './UsersPage'
import Navbar from './Navbar'
import AddUsersToAppModal from './AddUsersToAppModal/'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'usersPageLoader',
    components: {
        UsersPage,
        Navbar,
        PageLoader,
        AddUsersToAppModal,
    },
    data() {
        return {
            showAddUsersModal: false,
        }
    },
}
</script>

<style scoped lang="scss"></style>
