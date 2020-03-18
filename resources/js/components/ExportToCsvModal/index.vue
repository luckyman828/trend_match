<template>
    <BaseModal ref="exportModal" :header="'Export <strong>' + currentFile.name + '</strong> to CSV(Excel)'"
    @close="$emit('close')" :show="show">
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <form @submit.prevent>
                <!-- <div class="form-section">
                    <h4>Export Current Selection Actions and Requests</h4> -->
                    <button class="ghost md full-width form-element" @click="exportCurrentSelection">
                        <span>Export Current Selection Actions & Requests</span>
                    </button>
                <!-- </div> -->

                <!-- <div class="form-section">
                    <h4>Export Current Selection Feedback</h4> -->
                    <button class="ghost md full-width form-element" @click="exportCurrentSelectionFeedback">
                        <span>Export Current Selection Feedback</span>
                    </button>
                <!-- </div> -->

                <!-- <div class="form-section">
                    <h4>Export Actions from All Selections</h4> -->
                    <!-- <div class="form-element">
                        <BaseCheckboxInputField v-model="includeCurrentSelection">
                            Include Current Selection
                        </BaseCheckboxInputField>
                    </div> -->
                    <button class="ghost md full-width form-element" @click="exportActionsPerSelection">
                        <span>Export Actions for all Selections</span>
                    </button>
                <!-- </div> -->

                <!-- <div class="form-section">
                    <h4>Export Requests</h4> -->
                    <button class="ghost md full-width form-element" @click="exportRequestsPerSelection">
                        <span>Export Requests for all Selections</span>
                    </button>
                    <button class="ghost md full-width form-element" @click="exportCommentsPerSelection">
                        <span>Export Comments for all Selections</span>
                    </button>
                    <!-- <button class="ghost md full-width form-element" @click="exportCommentsPerSelection">
                        <span>Export Comments per Selection</span>
                    </button> -->
                <!-- </div> -->
            </form>
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import exportToCsv from '../../mixins/exportToCsv'


export default {
    name: "exportCSVModal",
    props: [
        'show'
    ],
    mixins: [
        exportToCsv
    ],
    data: function () { return {
        // includeCurrentSelection: true,

        onlyWithRequests: false,
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('selections', ['currentSelection']),
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
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', this.currentSelection.name]
            const selectionHeaders = []
            const rows = []
            // Loop through the products and generate headers
            this.productsToExport.forEach(product => {
                // Add the product's ID and Name to the the row array

                // Loop through the product's actions
                product.actions.forEach(action => {
                    // Test if we need to add their selection to the headers
                    if (!selectionHeaders.includes(action.selection.name) && action.selection_id != this.currentSelection.id) {
                        selectionHeaders.push(action.selection.name)
                    }

                })
            })
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const rowToPush = [product.datasource_id, product.title, product.category, product.min_order, product.min_variant_order, product.delivery_date, product.action || 'None']
                // Add the action input to the row
                selectionHeaders.forEach(header => {
                    const selectionAction = product.actions.find(x => x.selection.name == header)
                    if (selectionAction) rowToPush.push(selectionAction.action)
                    else rowToPush.push('None')
                })

                rows.push(rowToPush)
            })
            // Add action headers to our headers
            headers.push(...selectionHeaders)

            this.exportToCsv('Kollekt Action Export.csv', [headers].concat(rows))

        },
        exportCurrentSelectionFeedback() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Alignment Action']
            const selectionHeaders = []
            const rows = []
            // Loop through the products and generate headers
            this.productsToExport.forEach(product => {
                // Add the product's ID and Name to the the row array

                // Loop through the product's actions
                product.feedbacks.forEach(feedback => {
                    // Test if we need to add their selection to the headers
                    if (!selectionHeaders.includes(feedback.user.name) && feedback.selection_id == this.currentSelection.id){
                        selectionHeaders.push(feedback.user.name)
                    }

                })
            })
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const rowToPush = [product.datasource_id, product.title, product.category, product.min_order, product.min_variant_order, product.delivery_date, product.action || 'None']
                // Add the feedback input to the row
                selectionHeaders.forEach(header => {
                    const selectionFeedback = product.feedbacks.find(x => `${x.user.name}` == header)
                    if (selectionFeedback) rowToPush.push(selectionFeedback.action)
                    else rowToPush.push('None')
                })

                rows.push(rowToPush)
            })
            // Add feedback headers to our headers
            headers.push(...selectionHeaders)

            this.exportToCsv('Kollekt Action Export.csv', [headers].concat(rows))

        },
        exportCurrentSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Action', 'Request']
            const rows = []
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const selectionRequest = product.requests.find(x => x.selection_id == this.currentSelection.id)

                const rowToPush = [
                    product.datasource_id, 
                    product.title, 
                    product.category, 
                    product.min_order, 
                    product.min_variant_order, 
                    product.delivery_date, 
                    product.action || 'None',
                    selectionRequest ? selectionRequest.content : ''
                ]
                rows.push(rowToPush)
            })

            this.exportToCsv(`Kollekt - ${this.currentSelection.name} - Export.csv`, [headers].concat(rows))

        },
        exportRequestsPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            const selectionHeaders = []
            const rows = []
            // Loop through the products
            this.productsToExport.forEach(product => {
                // Add the product's ID and Name to the the row array
                const rowToPush = [
                    product.datasource_id, 
                    product.title, 
                    product.category, 
                    product.min_order, 
                    product.min_variant_order, 
                    product.delivery_date, 
                ]

                // Loop through the product's requests
                product.requests.forEach(request => {
                    // Test if we need to add their selection to the headers
                    if (!selectionHeaders.includes(`${request.selection.name}`)) {
                        selectionHeaders.push(`${request.selection.name}`)
                    }

                })
                // Add the request input to the row
                selectionHeaders.forEach(header => {
                    const selectionRequest = product.requests.find(x => `${x.selection.name}` == header)
                    if (selectionRequest) rowToPush.push(selectionRequest.content)
                    else rowToPush.push('')
                })

                rows.push(rowToPush)
            })
            // Add request headers to our headers
            headers.push(...selectionHeaders)

            this.exportToCsv('Kollekt Request Export.csv', [headers].concat(rows))

        },
        exportCommentsPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            const selectionHeaders = []
            const rows = []
             // Loop through the products and generate headers
            this.productsToExport.forEach(product => {
                // Add the product's ID and Name to the the row array

                // Loop through the product's comments
                product.comments.forEach(comment => {
                    // Test if we need to add their selection to the headers
                    if (!selectionHeaders.includes(`${comment.user.name} (${comment.selection.name})`)) {
                        selectionHeaders.push(`${comment.user.name} (${comment.selection.name})`)
                    }

                })
            })
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                // Add the product's ID and Name to the the row array
                const rowToPush = [
                    product.datasource_id, 
                    product.title, 
                    product.category, 
                    product.min_order, 
                    product.min_variant_order, 
                    product.delivery_date, 
                ]
                const cellsToPush = []

                // Add the comment input to the row
                const extraCells = []
                let headerIndex = 0
                selectionHeaders.forEach(header => {
                    const selectionComments = product.comments.filter(x => `${x.user.name} (${x.selection.name})` == header)
                    if (selectionComments.length > 0) {
                        cellsToPush.push(selectionComments[0].content)
                        if (selectionComments.length > 1) {
                        let commentCount = 0
                            selectionComments.forEach(comment => {
                                if (commentCount > 0) {
                                    const extraCellObject = extraCells.find(x => x.headerIndex == headerIndex)
                                    if (extraCellObject) {
                                        extraCellObject.comments.push(comment.content)
                                    } else {
                                        extraCells.push({headerIndex, comments: [comment.content]})
                                    }
                                }
                                commentCount++
                            })
                        }
                    }
                    else {
                        cellsToPush.push('')
                    }
                    headerIndex++
                })

                // Push the row
                rows.push(rowToPush.concat(cellsToPush))

                // Create extra rows from the extra cells
                if (extraCells.length > 0) {
                    // Find the highest number of extra cells
                    const maxCommentCount = extraCells.reduce((min, x) => x.comments.length > min ? x.comments.length : min, extraCells[0].comments.length)

                    for (let commentIndex = 0; commentIndex < maxCommentCount; commentIndex++) {
                        const extraCellsToPush = []
                        headerIndex = 0
                        selectionHeaders.forEach(header => {
                            // Test if we have any extra cells for this header index
                            const extraCell = extraCells.find(x => x.headerIndex == headerIndex)
                            if (extraCell && extraCell.comments[commentIndex]) {
                                extraCellsToPush.push(extraCell.comments[commentIndex])
                            } else {
                                extraCellsToPush.push('')
                            }
                            headerIndex++
                        })
                        rows.push(rowToPush.concat(extraCellsToPush))
                    }

                    // console.log(rowToPush)
                    // console.log(extraCells)

                }

            })
            // Add comment headers to our headers
            headers.push(...selectionHeaders)

            this.exportToCsv('Kollekt Comment Export.csv', [headers].concat(rows))

        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    

</style>
