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
        ...mapGetters('selections', ['selectionsStatus']),
        loading () {
            return (this.productsStatus != 'success' || this.selectionsStatus != 'success' || this.loadingData)
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelection', 'calculateAllSelectionUsers']),
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

        // Fetch selection data
        const selectionId = this.$route.params.selectionId
        let selection
        selection = await this.fetchSelection(selectionId),
        this.fetchSelectionProducts(selectionId)
        console.log(selection)
        await this.fetchSelectionTeamsUsers(selection.teams)
        await this.calculateAllSelectionUsers(selection)
        this.loadingData = false
    },
}
</script>

<style scoped lang="scss">

</style>