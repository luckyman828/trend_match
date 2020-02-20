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
    }},
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('selections', ['selectionsStatus']),
        loading () {
            return (this.productsStatus != 'success' || this.selectionsStatus != 'success')
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelection']),
        
    },
    created() {
        // Fetch the current file and the products
        const fileId = this.$route.params.fileId
        this.fetchFile(fileId)

        // Fetch selection data
        const selectionId = this.$route.params.selectionId
        this.fetchSelection(selectionId)
        this.fetchSelectionProducts(selectionId)
    },
}
</script>

<style scoped lang="scss">

</style>