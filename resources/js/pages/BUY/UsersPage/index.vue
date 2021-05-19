<template>
    <PageLoader>
        <UsersPage />
        <Navbar />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersPage from './UsersPage'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'usersPageLoader',
    components: {
        UsersPage,
        Navbar,
        PageLoader,
    },
}
</script>

<style scoped lang="scss"></style>
