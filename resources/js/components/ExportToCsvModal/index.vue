<template>
    <BaseModal ref="exportModal" :header="'Export <strong>' + currentFile.name + '</strong> to CSV(Excel)'"
    @close="$emit('close')" :show="show">
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <form @submit.prevent>
                <div class="form-element">
                    <label for="currency-selector">Choose Currency to export</label>
                    <BaseInputField id="currency-selector" type="select" :disabled="true"
                    :value="currencyToExport || 'Choose currency to export'"
                    @click="showCurrencyContext($event)">
                        <i class="far fa-chevron-down"></i>
                    </BaseInputField>
                </div>

                <div class="form-section">
                    <h4>Export Current Selection</h4>
                    <BaseRadioInputField class="form-element" :value="'currentRequests'" v-model="exportOption">
                        <span>Export Alignment & Requests</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'currentFeedback'" v-model="exportOption">
                        <span>Export Alignment & Feedback</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'currentVariants'" v-model="exportOption">
                        <span>Export Variant Alignment & Feedback</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'currentQty'" v-model="exportOption">
                        <span>Export Quantity</span>
                    </BaseRadioInputField>
                </div>
                <div class="form-section">
                    <h4>Export Multiple Selections</h4>

                    <div class="form-element">
                        <label for="selections-selector">Choose selections to export</label>
                        <BaseInputField id="selections-selector" type="select" :disabled="true"
                        :value="`Exporting from ${selectionsToExport.length} Selections`"
                        @click="showSelectionsContext($event)">
                            <i class="far fa-chevron-down"></i>
                        </BaseInputField>
                    </div>

                    <BaseRadioInputField class="form-element" :value="'alignments'" v-model="exportOption">
                        <span>Export Alignments</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'requests'" v-model="exportOption">
                        <span>Export Requests</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'comments'" v-model="exportOption">
                        <span>Export Comments</span>
                    </BaseRadioInputField>

                    <BaseRadioInputField class="form-element" :value="'quantity'" v-model="exportOption">
                        <span>Export Quantity</span>
                    </BaseRadioInputField>


                    <BaseButton style="width: 100%" buttonClass="dark full-width lg" :disabled="!exportOption"
                    v-tooltip="!exportOption && 'Please choose an export option'"
                    @click="onExport">
                        <span>Export</span>
                    </BaseButton>
                </div>

            </form>
            <BaseContextMenu ref="selectionsContext">
                <template v-slot:header>
                    <span>Choose selections to export</span>
                </template>
                <template v-slot="slotProps">
                    <BaseSelectButtons :options="selections" optionNameKey="name"
                    v-model="selectionsToExport" :submitOnChange="true"/>
                    <div class="item-wrapper">
                        <button style="margin-bottom: 8px; margin-top: -8px;" @click="slotProps.hide()" class="ghost full-width"><span>Apply & Close</span></button>
                    </div>
                </template>
            </BaseContextMenu>

            <BaseContextMenu ref="currencyContext">
                <template v-slot:header>
                    <span>Choose currency to export</span>
                </template>
                <template v-slot="slotProps">
                    <BaseSelectButtons type="radio" :options="availaleCurrencies"
                    v-model="currencyToExport" :submitOnChange="true"/>
                    <div class="item-wrapper">
                        <button style="margin-bottom: 8px; margin-top: -8px;" @click="slotProps.hide()" class="ghost full-width"><span>Apply & Close</span></button>
                    </div>
                </template>
            </BaseContextMenu>
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
        selectionsToExport: [],
        currencyToExport: null,
        exportOption: null,
        defaultCsvHeaders: ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Currency', 'WHS', 'RRP', 'MU'],
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('selections', ['currentSelection', 'selections', 'selectionsStatus', 'getSelections']),
        ...mapGetters('products', ['productsFiltered']),
        ...mapGetters('files', ['currentFile']),
        productsToExport() {
            const products = this.productsFiltered
            return products
        },
        availaleCurrencies() {
            const currenciesToReturn = []
            const products = this.productsFiltered
            products.forEach(product => {
                product.prices.forEach(price => {
                    if (!currenciesToReturn.includes(price.currency))
                        currenciesToReturn.push(price.currency)
                })
            })
            return currenciesToReturn
        }
    },
    methods: {
        ...mapActions('selections', ['fetchSelections']),
        async showSelectionsContext(e) {
            this.$refs.selectionsContext.show(e)
        },
        async showCurrencyContext(e) {
            this.$refs.currencyContext.show(e)
        },
        onExport() {
            const option = this.exportOption
            if (option == 'currentRequests')
                this.exportCurrentSelection()
            if (option == 'currentFeedback')
                this.exportCurrentSelectionFeedback()
            if (option == 'currentQty')
                this.exportCurrentSelectionQty()
            if (option == 'alignments')
                this.exportActionsPerSelection()
            if (option == 'requests')
                this.exportRequestsPerSelection()
            if (option == 'comments')
                this.exportCommentsPerSelection()
            if (option == 'quantity')
                this.exportQtyPerSelection()
            if (option == 'currentVariants')
                this.exportCurrentVariantsFeedback()

        },
        getDefaultProductRowData(product) {
            let priceToReturn = {}
            if (product.prices && product.prices.length > 0) {
                if (this.currencyToExport && product.prices.find(x => x.currency == this.currencyToExport)) {
                    priceToReturn = product.prices.find(x => x.currency == this.currencyToExport)
                } else {
                    priceToReturn = product.prices[0]
                }
            }
            return [
                product.datasource_id, 
                product.title, 
                product.category, 
                product.min_order, 
                product.min_variant_order, 
                product.delivery_date,
                priceToReturn.currency || '',
                priceToReturn.wholesale_price || '',
                priceToReturn.recommended_retail_price || '',
                priceToReturn.mark_up || '',
            ]
        },
        exportActionsPerSelection() {
            const headers = JSON.parse(JSON.stringify(this.defaultCsvHeaders))
            // Add a header for each selection to export
            const selectionHeaders = [...this.selectionsToExport.map(x => x.name)]
            const rows = []
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const rowToPush = this.getDefaultProductRowData(product)
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
        exportCurrentSelectionQty() {
            // const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Action', 'Your Qty', 'Total Qty']
            // const rows = []
            // // Loop through the products again to populate rows with data
            // this.productsToExport.forEach(product => {
            //     const selectionRequest = product.requests.find(x => x.selection_id == this.currentSelection.id)

            //     const rowToPush = [
            //         product.datasource_id, 
            //         product.title, 
            //         product.category, 
            //         product.min_order, 
            //         product.min_variant_order, 
            //         product.delivery_date, 
            //         product.action || 'None',
            //         product.your_quantity,
            //         product.quantity
            //     ]
            //     rows.push(rowToPush)
            // })

            // this.exportToCsv(`Kollekt - ${this.currentSelection.name} - Export.csv`, [headers].concat(rows))
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Product Total Qty', 'Variant Total Qty', 'Your Qty']
            // Add a header for each selection to export
            const rows = []

            this.productsToExport.forEach(product => {
                product.variants.forEach(variant => {
                    const rowToPush = [
                        product.datasource_id, 
                        product.title, 
                        product.category, 
                        product.min_order, 
                        product.min_variant_order, 
                        product.delivery_date, 
                        product.quantity,
                        variant.totalQuantity,
                        variant.quantity
                    ]

                    // // Add the aligment qty
                    // selectionsToExport.forEach(selection => {
                    //     const originAction = variant.actions.find(x => x.selection_id == selection.id)
                    //     rowToPush.push(originAction ? originAction.quantity : 0)
                    // })

                    rows.push(rowToPush)
                })
            })

            this.exportToCsv('Kollekt Request Export.csv', [headers].concat(rows))

        },
        exportCurrentVariantsFeedback() {
            const headers = ['Product ID', 'Product Name', 'Variant Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            const selectionHeaders = []
            const rows = []

            // Do an initial loop through the all the products and their variants to generate headers
            const uniqueAlignmentOrigins = []
            const uniqueFeedbackOrigins = []

            this.productsToExport.forEach(product => {

                // Find all unique alignment origins
                product.variants.map(variant => {
                    variant.actions.map(action => {
                        const existingOrigin = uniqueAlignmentOrigins.find(x => x.selection_id == action.selection_id)
                        if (!existingOrigin) uniqueAlignmentOrigins.push({
                            user_id: action.user_id, 
                            selection_id: action.selection_id, 
                            user: action.user,
                            selection: action.selection
                        })
                    })
                })

                // Find all unique feedback origins
                product.variants.map(variant => {
                    variant.feedbacks.map(feedback => {
                        const existingUser = uniqueFeedbackOrigins.find(x => x.user_id == feedback.user_id && x.selection_id == feedback.selection_id)
                        if (!existingUser) uniqueFeedbackOrigins.push({
                            user_id: feedback.user_id, 
                            selection_id: feedback.selection_id, 
                            user: feedback.user,
                            selection: feedback.selection
                        })
                    })
                })

            })

            // Add the unique origins to our headers
            headers.push(...uniqueAlignmentOrigins.map(x => 'Alignment: ' + x.selection.name))
            headers.push(...uniqueFeedbackOrigins.map(x => `Feedback: ${x.selection.name} - ${x.user ? x.user.name : 'Anonymous'}`))


            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                product.variants.forEach(variant => {
                    const rowToPush = [product.datasource_id, product.title, variant.name, product.category, product.min_order, product.min_variant_order, product.delivery_date]

                    // Add the aligment
                    uniqueAlignmentOrigins.forEach(alignmentOrigin => {
                        const originAction = variant.actions.find(x => x.selection_id == alignmentOrigin.selection_id)
                        rowToPush.push(originAction ? originAction.action : 'None')
                    })

                    // Add the feedback
                    uniqueFeedbackOrigins.forEach(feedbackOrigin => {
                        const originFeedback = variant.actions.find(x => x.selection_id == feedbackOrigin.selection_id && x.user_id == feedbackOrigin.user_id)
                        rowToPush.push(originFeedback ? originFeedback.action : 'None')
                    })

                    // Add the row to our list of rows
                    rows.push(rowToPush)
                })
            })

            this.exportToCsv('Kollekt Variant Input Export.csv', [headers].concat(rows))

        },
        exportRequestsPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            // Add a header for each selection to export
            const selectionHeaders = [...this.selectionsToExport.map(x => x.name)]
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
        exportQtyPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Product Total Qty', 'Variant Total Qty']
            // Add a header for each selection to export
            const selectionsToExport = this.selectionsToExport
            headers.push(...this.selectionsToExport.map(x => x.name))
            const rows = []

            this.productsToExport.forEach(product => {
                product.variants.forEach(variant => {
                    const rowToPush = [
                        product.datasource_id, 
                        product.title, 
                        product.category, 
                        product.min_order, 
                        product.min_variant_order, 
                        product.delivery_date, 
                        product.quantity,
                        variant.totalQuantity
                    ]

                    // Add the aligment qty
                    selectionsToExport.forEach(selection => {
                        const originAction = variant.actions.find(x => x.selection_id == selection.id)
                        rowToPush.push(originAction ? originAction.quantity : 0)
                    })

                    rows.push(rowToPush)
                })
            })

            this.exportToCsv('Kollekt Request Export.csv', [headers].concat(rows))

        },
        exportCommentsPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            // Add a header for each selection to export
            const selectionHeaders = [...this.selectionsToExport.map(x => x.name)]
            const rows = []

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
    mounted() {
        this.currencyToExport = this.availaleCurrencies[0]
    },
    created() {
        if (this.selectionsStatus != 'success' && this.selectionsStatus != 'loading') {
            this.fetchSelections({fileId: this.currentFile.id}).then(selections => {
                // Preset the selections to export to all selections
                this.selectionsToExport = selections
            })
        } else {
            this.selectionsToExport = this.getSelections
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    

</style>
