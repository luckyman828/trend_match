<template>
    <PageLoader>
        <UsersPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersPage from './UsersPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'usersPageLoader',
    components: {
        UsersPage,
        PageLoader
    },
}
</script>

<style scoped lang="scss">

</style>