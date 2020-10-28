<template>
    <PageLoader
        :status="status"
        loadingMsg="loading selection"
        errorMsg="error loading selection"
        :errorCallback="() => fetchData()"
    >
        <SelectionPage />
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
        PageLoader,
    },
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
            if (!this.getCurrentSelections || this.getCurrentSelections.find(x => !x.settings)) return 'loading'
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
        ...mapMutations('presenterQueue', ['SET_PRESENTER_QUEUE']),
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

            // Fetch selection products
            await this.fetchProducts({ fileId })
            await this.fetchSelectionProducts(selection)

            // Fetch selection settings
            await this.fetchSelectionSettings(selection) // Used to know whether comments are anonyized or not

            // Fetch selections that are available for alignment for the auth user
            const selections = await this.fetchSelections({ fileId })

            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
