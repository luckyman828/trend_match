<template>
    <BaseModal ref="exportModal" :header="'Export <strong>' + currentFile.name + '</strong> to CSV(Excel)'"
    @close="SET_SHOW_CSV_MODAL(false)" :show="show">
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <form @submit.prevent>

                <div class="form-section">
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportSelected">
                            Export selected products only
                        </BaseCheckboxInputField>
                    </div>


                    <div class="form-element">
                        <label for="currency-selector">Choose Currency to export</label>
                        <BaseInputField id="currency-selector" type="select" :disabled="true"
                        :value="currencyToExport || 'Choose currency to export'"
                        @click="showCurrencyContext($event)">
                            <i class="far fa-chevron-down"></i>
                        </BaseInputField>
                    </div>
                </div>

                <div class="form-section">
                    <h4>Choose what to export</h4>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportAlignment">
                            <span>Alignment</span>
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportFeedback">
                            <span>Feedback</span>
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportRequests">
                            <span>Requests</span>
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportComments">
                            <span>Comments</span>
                        </BaseCheckboxInputField>
                    </div>
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportQuantity">
                            <span>Quantity</span>
                        </BaseCheckboxInputField>
                    </div>
                </div>

                <div class="form-section">
                    <h4>Export variants?</h4>
                    <BaseCheckboxInputField v-model="exportVariants">
                        <span>Export variants</span>
                    </BaseCheckboxInputField>
                </div>

                <BaseButton style="width: 100%" buttonClass="dark full-width lg"
                v-tooltip="!exportOption && 'Please choose an export option'"
                @click="onExport">
                    <span>Export</span>
                </BaseButton>

            </form>

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
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
        // selectionsToExport: [],
        exportSelected: false,
        currencyToExport: null,

        exportAlignment: true,
        exportFeedback: true,
        exportRequests: true,
        exportComments: true,
        exportQuantity: true,
        exportVariants: true,

        exportOption: null,
        defaultCsvHeaders: ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Currency', 'WHS', 'RRP', 'MU'],
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('selections', ['currentSelection', 'selections', 'selectionsStatus', 'getSelections', 'getSelectionsAvailableForInputFiltering']),
        ...mapGetters('products', ['productsFiltered', 'getActiveSelectionInput', 'getSelectedSelectionIds', 'getSelectedProducts']),
        ...mapGetters('files', ['currentFile']),
        productsToExport() {
            const products = this.exportSelected ? this.getSelectedProducts : this.productsFiltered
            return products
        },
        selectionsToExport() {
            if (this.getSelectedSelectionIds.length <= 0) return this.getSelectionsAvailableForInputFiltering
            return this.getSelectedSelectionIds.map(selectionId => {
                return this.getSelectionsAvailableForInputFiltering.find(selection => selection.id == selectionId)
            })
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
        ...mapMutations('products', ['SET_SHOW_CSV_MODAL']),
        async showSelectionsContext(e) {
            this.$refs.selectionsContext.show(e)
        },
        async showCurrencyContext(e) {
            this.$refs.currencyContext.show(e)
        },
        onExport() {
            // START HEADERS
            // Instantiate default headers
            const headers = JSON.parse(JSON.stringify(this.defaultCsvHeaders))

            if (this.exportVariants) {
                headers.push('Variant Name')
            }

            // Add additional headers based on settings
            const firstProductInput = this.getActiveSelectionInput(this.productsToExport[0])

            const uniqueAlignmentOrigins = []
            const uniqueFeedbackOrigins = []

            // START FIND UNIQUE INPUT HEADERS
            // Loop through all products to find all input authors
            this.productsToExport.map(product => {
                const selectionInput = this.getActiveSelectionInput(product)

                if (this.exportRequests || this.exportAlignment) {
                    if (this.exportAlignment) {
                        selectionInput.actions.map(action => {
                            const originExists = uniqueAlignmentOrigins.find(x => x.selection_id == action.selection_id)
                            if (!originExists) uniqueAlignmentOrigins.push({
                                selection: action.selection,
                                selection_id: action.selection_id,
                            })
                        })
                    }
                    if (this.exportRequests) {
                        selectionInput.requests.map(request => {
                            const originExists = uniqueAlignmentOrigins.find(x => x.selection_id == request.selection_id)
                            if (!originExists) uniqueAlignmentOrigins.push({
                                selection: request.selection,
                                selection_id: request.selection_id,
                            })
                        })
                    }
                }
                if (this.exportComments || this.exportFeedback) {
                    if (this.exportFeedback) {
                        selectionInput.feedbacks.map(feedback => {
                            const originExists = uniqueFeedbackOrigins.find(x => x.selection_id == feedback.selection_id && x.user_id == feedback.user_id)
                            if (!originExists) uniqueFeedbackOrigins.push({
                                selection: feedback.selection,
                                selection_id: feedback.selection_id,
                                user: feedback.user,
                                user_id: feedback.user_id
                            })
                        })
                    }
                    if (this.exportComments) {
                        selectionInput.comments.map(comment => {
                            const originExists = uniqueFeedbackOrigins.find(x => x.selection_id == comment.selection_id && x.user_id == comment.user_id)
                            if (!originExists) uniqueFeedbackOrigins.push({
                                selection: comment.selection,
                                selection_id: comment.selection_id,
                                user: comment.user,
                                user_id: comment.user_id
                            })
                        })
                    }
                }
            })
            // END FIND UNIQUE INPUT HEADERS


            // START PUSH UNIQUE INPUT HEADERS
            if (this.exportAlignment || this.exportRequests) {
                uniqueAlignmentOrigins.map(origin => {
                    if (this.exportAlignment) {
                        headers.push(`${origin.selection.name} (Alignment)`)
                    }
                    if (this.exportRequests) {
                        headers.push(`${origin.selection.name} - ${origin.author ? origin.author.name : 'Anonymous'} (Request)`)
                    }
                })
            }

            if (this.exportFeedback || this.exportComments) {
                uniqueFeedbackOrigins.map(origin => {
                    if (this.exportFeedback) {
                        headers.push(`${origin.selection.name} - ${origin.user ? origin.user.name : 'Anonymous'} (Feedback)`)
                    }
                    if (this.exportComments) {
                        headers.push(`${origin.selection.name} - ${origin.user ? origin.user.name : 'Anonymous'} (Comment)`)
                    }
                })
            }
            // END PUSH UNIQUE INPUT HEADERS
            


            console.log('headers', headers)
            // END HEADERS


            // START ROW DATA
            const rows = []
            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                const currentRow = this.getDefaultProductRowData(product)


                // INSTANTIATE SPACE FOR VARIANTS
                if (this.exportVariants) {
                    // Insert a blank column space for variant names
                    currentRow.push('') 
                }

                // START ALIGNMENT & REQUESTS
                if (this.exportAlignment || this.exportRequests) {
                    uniqueAlignmentOrigins.map(origin => {

                        if (this.exportAlignment) {
                            // Find the origin Action
                            const originAction = selectionInput.actions.find(action => action.selection_id == origin.selection_id)
                            currentRow.push(originAction ? originAction.action : 'None')
                        }

                        if (this.exportRequests) {
                            // Find the origin Request(s)
                            const originRequestList = selectionInput.requests.filter(request => request.selection_id == origin.selection_id)
                            // Merge the requests with a double line-break
                            currentRow.push(originRequestList.map(request => request.content).join('\n\n'))
                        }

                    })
                }
                // END ALIGNMENT & REQUESTS

                // START FEEDBACK & COMMENTS
                if (this.exportFeedback || this.exportComments) {
                    uniqueFeedbackOrigins.map(origin => {

                        if (this.exportFeedback) {
                            // Find the origin Feedback
                            const originFeedback = selectionInput.feedbacks.find(
                                feedback => feedback.selection_id == origin.selection_id && feedback.user_id == origin.user_id
                            )
                            currentRow.push(originFeedback ? originFeedback.action : 'None')
                        }

                        if (this.exportComments) {
                            // Find the origin Comment(s)
                            const originCommentList = selectionInput.comments.filter(
                                comment => comment.selection_id == origin.selection_id && comment.user_id == origin.user_id
                            )
                            // Merge the comments with a double line-break
                            currentRow.push(originCommentList.map(comment => comment.content).join('\n\n'))
                        }

                    })
                }
                // END FEEDBACK & COMMENTS


                // selectionInput.variants.forEach(variant => {
                //     const rowToPush = this.getDefaultProductRowData(product).concat([
                //         selectionInput.quantity,
                //         selectionInput.quantity * productPrice.wholesale_price,
                //         variant.totalQuantity,
                //         variant.totalQuantity * productPrice.wholesale_price,
                //         variant.quantity,
                //         variant.quantity * productPrice.wholesale_price
                //     ])

                //     rows.push(rowToPush)
                // })

                // END PRODUCT ROW
                // Push the product row data
                rows.push(currentRow)

                // START VARIANT
                if (this.exportVariants) {
                    selectionInput.variants.map(variant => {
                        const variantRow = this.getDefaultProductRowData(product)

                        // Push the variant name
                        variantRow.push(variant.name)

                        // START ALIGNMENT & REQUESTS
                        if (this.exportAlignment || this.exportRequests) {
                            uniqueAlignmentOrigins.map(origin => {

                                if (this.exportAlignment) {
                                    // Find the origin Action
                                    const originAction = variant.actions.find(action => action.selection_id == origin.selection_id)
                                    variantRow.push(originAction ? originAction.action : 'None')
                                }

                                if (this.exportRequests) {
                                    // If we are exporting requests, push a blank
                                    variantRow.push('')
                                }

                            })
                        }
                        // END ALIGNMENT & REQUESTS

                        // START FEEDBACK & COMMENTS
                        if (this.exportFeedback || this.exportComments) {
                            uniqueFeedbackOrigins.map(origin => {

                                if (this.exportFeedback) {
                                    // Find the origin Feedback
                                    const originFeedback = variant.feedbacks.find(
                                        feedback => feedback.selection_id == origin.selection_id && feedback.user_id == origin.user_id
                                    )
                                    variantRow.push(originFeedback ? originFeedback.action : 'None')
                                }

                                if (this.exportComments) {
                                    // If we are exporting comments, push a blank
                                    variantRow.push('')
                                }

                            })
                        }
                        // END FEEDBACK & COMMENTS

                        // Push variant row
                        rows.push(variantRow)
                    })
                }
                // END VARIANT
            })
            // END ROW DATA

            console.log('the result', [headers].concat(rows))
            let dateStr = DateTime.local().toLocaleString()
            // Replace slashes with dashes in date
            dateStr = dateStr.replace('/', '-')

            this.exportToCsv(`Kollekt Export ${dateStr}.csv`, [headers].concat(rows))

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
                const selectionInput = this.getActiveSelectionInput(product)
                const rowToPush = this.getDefaultProductRowData(product)
                // Add the action input to the row
                selectionHeaders.forEach(header => {
                    const selectionAction = selectionInput.actions.find(x => x.selection.name == header)
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
                const selectionInput = this.getActiveSelectionInput(product)
                // Add the product's ID and Name to the the row array

                // Loop through the product's actions
                selectionInput.feedbacks.forEach(feedback => {
                    // Test if we need to add their selection to the headers
                    if (!selectionHeaders.includes(feedback.user.name) && feedback.selection_id == this.currentSelection.id){
                        selectionHeaders.push(feedback.user.name)
                    }

                })
            })
            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                const rowToPush = [product.datasource_id, product.title, product.category, product.min_order, product.min_variant_order, product.delivery_date, selectionInput.action || 'None']
                // Add the feedback input to the row
                selectionHeaders.forEach(header => {
                    const selectionFeedback = selectionInput.feedbacks.find(x => `${x.user.name}` == header)
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
                const selectionInput = this.getActiveSelectionInput(product)
                const selectionRequest = selectionInput.requests.find(x => x.selection_id == this.currentSelection.id)

                const rowToPush = [
                    product.datasource_id, 
                    product.title, 
                    product.category, 
                    product.min_order, 
                    product.min_variant_order, 
                    product.delivery_date, 
                    selectionInput.action || 'None',
                    selectionRequest ? selectionRequest.content : ''
                ]
                rows.push(rowToPush)
            })

            this.exportToCsv(`Kollekt - ${this.currentSelection.name} - Export.csv`, [headers].concat(rows))

        },
        exportCurrentSelectionQty() {

            const headers = this.defaultCsvHeaders.concat(['Product Total Qty', 'Product Total Spend', 'Variant Total Qty', 'Variant Total Spend', 'Your Qty', 'Your Spend'])
            // Add a header for each selection to export
            const rows = []
            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)

                let productPrice = {}
                if (product.prices && product.prices.length > 0) {
                    if (this.currencyToExport && product.prices.find(x => x.currency == this.currencyToExport)) {
                        productPrice = product.prices.find(x => x.currency == this.currencyToExport)
                    } else {
                        productPrice = product.prices[0]
                    }
                }

                selectionInput.variants.forEach(variant => {
                    const rowToPush = this.getDefaultProductRowData(product).concat([
                        selectionInput.quantity,
                        selectionInput.quantity * productPrice.wholesale_price,
                        variant.totalQuantity,
                        variant.totalQuantity * productPrice.wholesale_price,
                        variant.quantity,
                        variant.quantity * productPrice.wholesale_price
                    ])

                    rows.push(rowToPush)
                })
            })

            this.exportToCsv('Kollekt Quantity Export.csv', [headers].concat(rows))

        },
        exportCurrentVariantsFeedback() {
            const headers = ['Product ID', 'Product Name', 'Variant Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            const selectionHeaders = []
            const rows = []

            // Do an initial loop through the all the products and their variants to generate headers
            const uniqueAlignmentOrigins = []
            const uniqueFeedbackOrigins = []

            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)

                // Find all unique alignment origins
                selectionInput.variants.map(variant => {
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
                selectionInput.variants.map(variant => {
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
                const selectionInput = this.getActiveSelectionInput(product)
                selectionInput.variants.forEach(variant => {
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
                const selectionInput = this.getActiveSelectionInput(product)
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
                    const selectionRequest = selectionInput.requests.find(x => `${x.selection.name}` == header)
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
            // const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery', 'Product Total Qty', 'Variant Total Qty']
            const headers = this.defaultCsvHeaders.concat([
                'Variant Name', 'Product Total Qty', 'Product Total Spend', 'Variant Total Qty', 'Variant Total Spend',
            ])
            // const headers = this.getDefaultProductRowData().concat([
            //     'Variant Name', 'Product Total Qty', 'Variant Total Qty'
            // ])
            // Add a header for each selection to export
            const selectionsToExport = this.selectionsToExport
            // headers.push(...this.selectionsToExport.map(x => x.name))
            selectionsToExport.map(selection => {
                headers.push(selection.name + 'Qty')
                headers.push(selection.name + 'Spend')
            })
            const rows = []

            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)

                let productPrice = {}
                if (product.prices && product.prices.length > 0) {
                    if (this.currencyToExport && product.prices.find(x => x.currency == this.currencyToExport)) {
                        productPrice = product.prices.find(x => x.currency == this.currencyToExport)
                    } else {
                        productPrice = product.prices[0]
                    }
                }

                selectionInput.variants.forEach(variant => {
                    const rowToPush = this.getDefaultProductRowData(product).concat([
                        variant.name,
                        selectionInput.quantity,
                        selectionInput.quantity * productPrice.wholesale_price,
                        variant.totalQuantity,
                        variant.totalQuantity * productPrice.wholesale_price
                    ])

                    // Add the aligment qty
                    selectionsToExport.forEach(selection => {
                        const originAction = variant.actions.find(x => x.selection_id == selection.id)
                        rowToPush.push(originAction ? originAction.quantity : 0)

                        // Add the variant spend
                        rowToPush.push(originAction ? originAction.quantity * productPrice.wholesale_price : 0)
                    })

                    rows.push(rowToPush)
                })
            })

            this.exportToCsv('Kollekt Quantity Export.csv', [headers].concat(rows))

        },
        exportCommentsPerSelection() {
            const headers = ['Product ID', 'Product Name', 'Category', 'Product Minimum', 'Variant Minimum', 'Delivery']
            // Add a header for each selection and user to export
            const selectionHeaders = []
            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                selectionInput.comments.filter(comment => this.selectionsToExport.find(selection => selection.id == comment.selection_id)).forEach(comment => {
                    const commentAuthor = `${comment.user.name} (${comment.selection.name})`
                    const commentAuthorAdded = selectionHeaders.find(x => commentAuthor == x)
                    if (!commentAuthorAdded) selectionHeaders.push(commentAuthor)
                })
            })


            const rows = []

            // Loop through the products again to populate rows with data
            this.productsToExport.forEach(product => {
                const selectionInput = this.getActiveSelectionInput(product)
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
                    const selectionComments = selectionInput.comments.filter(x => `${x.user.name} (${x.selection.name})` == header)
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
    // created() {
    //     this.selectionsToExport = this.getSelectionsAvailableForInputFiltering
    // }
    created() {
        if (this.getSelectedProducts.length > 0) {
            this.exportSelected = true
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    

</style>
