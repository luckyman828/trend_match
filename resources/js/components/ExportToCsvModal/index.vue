<template>
    <BaseModal ref="exportModal" :header="'Export <strong>' + currentFile.name + '</strong> to CSV(Excel)'"
    @close="$emit('close')" :show="show">
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <!-- <form>
                <h4>Requests & comments</h4>
                <div class="form-element">
                    <BaseCheckboxInputField v-model="exportComments">
                        Include Requests and comments
                    </BaseCheckboxInputField>
                </div>
            </form> -->
            <button class="ghost md full-width" @click="exportActionsPerSelection">
                <span>Export Action per Selection</span>
            </button>
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import exportToCsv from '../../mixins/exportToCsv'


export default {
    name: "exportProductsModal",
    props: [
        'show'
    ],
    mixins: [
        exportToCsv
    ],
    data: function () { return {
        exportingPDF: false,
        exportComments: true,
        generatedPDF: null,
        onlyWithRequests: false,
        includeDistribution: false,
        includeNotDecided: false,
        currentSelectionOnly: false,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('products', ['productsFiltered']),
        ...mapGetters('files', ['currentFile']),
        productsToExport() {
            const products = this.productsFiltered
            if (this.onlyWithRequests) {
                return products.filter(product => product.requests.length > 0)
            } else return products
        }
    },
    methods: {
        exportActionsPerSelection() {
            const headers = ['Product ID', 'Product Name']
            const rows = []
            // Loop through the products and add their ID and Name to the the row array
            this.productsToExport.forEach(product => {
                rows.push([product.datasource_id, product.title])
            })

            this.exportToCsv('kollekt_csv_export.csv', [headers].concat(rows))

            // Loop through the selections and add the selections name to the headers array
            // Then add the action for each product
        }
    },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    

</style>
