<template>
    <PageLoader :status="status">
        <div class="results-page">
            <h1>Welcome to your results</h1>
        </div>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'resultsPage',
    components: { PageLoader },
    data: function() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('selections', ['currentSelectionStatus', 'getCurrentSelections']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('files', ['filesStatus']),
        status() {
            if (this.productsStatus == 'error' || this.currentSelectionStatus == 'error' || this.filesStatus == 'error')
                return 'error'
            if (
                this.productsStatus == 'loading' ||
                this.currentSelectionStatus == 'loading' ||
                this.filesStatus == 'loading' ||
                this.loadingData
            )
                return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts', 'fetchSelectionProducts']),
        ...mapMutations('products', ['SET_SELECTIONS_AVAILABLE_FOR_INPUT_FILTERING']),
        ...mapActions('selections', [
            'fetchSelection',
            'fetchSelections',
            'filterSelectionsByAvailabilityForAlignment',
            'fetchSelectionSettings',
        ]),
        ...mapActions('teams', ['fetchTeamUsers']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapMutations('presentationQueue', ['SET_PRESENTER_QUEUE']),
        async fetchSelectionTeamsUsers(teams) {
            // Use of promise and map to fetch users for all teams in parallel
            await Promise.all(
                teams.map(async team => {
                    await this.fetchTeamUsers(team)
                })
            )
        },
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchFile(fileId)

            // Fetch current selection
            const selectionId = this.$route.params.selectionId
            const selection = await this.fetchSelection({ selectionId })

            // This works because vuex actions are always promises
            let promisesToResolve = [
                await this.fetchProducts({ fileId }),
                await this.fetchSelectionProducts(selection),
                await this.fetchSelectionSettings(selection),
                await this.fetchSelections({ fileId }),
            ]

            if (selection.is_presenting) {
                promisesToResolve.push(this.fetchPresentationDetails(selection.presentation_id))
            }

            // Use promise.all to resolve all the promises simultaneously
            await Promise.all(promisesToResolve)

            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
</style>
