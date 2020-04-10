<template>
    <PageLoader :loading="loading">
        <SelectionPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionPage from './SelectionPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'selectionPageLoader',
    components: {
        SelectionPage,
        PageLoader
    },
    data: function () { return {
        loadingData: true,
    }},
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('selections', ['currentSelectionStatus']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        loading () {
            return (this.productsStatus != 'success' || this.currentSelectionStatus != 'success' || this.loadingData)
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelection', 'fetchSelections', 'filterSelectionsByAvailabilityForAlignment']),
        ...mapActions('teams', ['fetchTeamUsers']),
        async fetchSelectionTeamsUsers(teams) {
            // Use of promise and map to fetch users for all teams in parallel
            await Promise.all(teams.map(async team => {
                await this.fetchTeamUsers(team)
            }))
        }
    },
    async created() {
        this.loadingData = true
        // Fetch the current file and the products
        const fileId = this.$route.params.fileId
        this.fetchFile(fileId)

        // Fetch current selection
        const selectionId = this.$route.params.selectionId
        const selection = await this.fetchSelection({selectionId})

        // Fetch selection products
        await this.fetchSelectionProducts({selections: [selection], addToState: true})

        // Fetch selections that are available for alignment for the auth user
        const selections = await this.fetchSelections({fileId})
        // Filter the selections so we only get the ones we have access to
        const selectionsFiltered = selections.filter(x => {
            // Return all selections for workspace admins
            if (this.authUserWorkspaceRole == 'Admin') return true

            // Else filter out hidden selections
            return x.is_visible
        })
        await this.filterSelectionsByAvailabilityForAlignment(selectionsFiltered)

        this.loadingData = false
    },
}
</script>

<style scoped lang="scss">

</style>