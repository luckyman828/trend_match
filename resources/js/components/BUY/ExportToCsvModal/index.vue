<template>
    <BaseModal
        ref="exportModal"
        :header="'Export <strong>' + currentFile.name + '</strong> to CSV(Excel)'"
        @close="
            SET_SHOW_CSV_MODAL(false)
            $emit('close')
        "
        :show="show"
    >
        <template v-slot v-if="show">
            <h3 style="text-align: center">The products in your current view will be exported</h3>
            <form @submit.prevent>
                <div class="form-section">
                    <div class="form-element">
                        <BaseCheckboxInputField v-model="exportSelected">
                            Export selected products only
                        </BaseCheckboxInputField>
                    </div>
                    <!-- <div class="form-element">
                        <BaseCheckboxInputField v-model="excludeNoQtyVariants">
                            Exclude variants with no quantity
                        </BaseCheckboxInputField>
                    </div> -->
                </div>

                <CustomExportSection v-if="exportType == 'template'" :exportTemplate.sync="exportTemplate" />

                <BaseButton
                    style="width: 100%"
                    buttonClass="dark full-width lg"
                    @click="onExport"
                    :disabled="exportType == 'template' && (!exportTemplate || exportTemplate.headers.length <= 0)"
                    disabledTooltip="Select some headers to export"
                >
                    <span>Export</span>
                </BaseButton>
            </form>

            <BaseContextMenu ref="currencyContext">
                <template v-slot:header>
                    <span>Choose currency to export</span>
                </template>
                <template v-slot="slotProps">
                    <BaseSelectButtons
                        type="radio"
                        :options="availaleCurrencies"
                        v-model="currencyToExport"
                        :submitOnChange="true"
                    />
                    <div class="item-wrapper">
                        <button
                            style="margin-bottom: 8px; margin-top: -8px;"
                            @click="slotProps.hide()"
                            class="ghost full-width"
                        >
                            <span>Apply & Close</span>
                        </button>
                    </div>
                </template>
            </BaseContextMenu>
        </template>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import exportToCsv from '../../../mixins/exportToCsv'
import CustomExportSection from './CustomExportSection'

export default {
    name: 'buy.ExportCSVModal',
    components: { CustomExportSection },
    props: ['show'],
    mixins: [exportToCsv],
    data: function() {
        return {
            exportSelected: false,
            currencyToExport: null,
            exportTemplate: null,

            exportType: this.$route.name == 'editFile' ? 'dump' : 'template',

            exportAlignment: false,
            exportFeedback: false,
            exportRequests: false,
            exportComments: true,
            exportQuantity: true,
            exportVariants: true,

            excludeProductRows: false,

            defaultCsvHeaders: [
                'Product ID',
                'Product Name',
                'Category',
                'Product Minimum',
                'Variant Minimum',
                'Delivery',
                'Currency',
                'WHS',
                'RRP',
                'MU',
                'Product EANs',
                'Labels',
            ],
            defaultCsvDumpHeaders: [
                'Product ID',
                'Product Name',
                'Brand',
                'Category',
                'Buying Gruop',
                'Product Minimum',
                'Variant Minimum',
                'Composition',
                'Description',
                'EANs',
            ],
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace', 'getCustomProductFields']),
        ...mapGetters('selections', [
            'currentSelection',
            'selections',
            'selectionsStatus',
            'getSelections',
            'getSelectionChapter',
        ]),
        ...mapGetters('selections', {
            quantityEnabled: 'getQuantityModeActive',
        }),
        ...mapGetters('products', ['productsFiltered', 'getSelectedProducts', 'getCurrentViewProductsFiltered']),
        ...mapGetters('productFilters', ['getFilterSelectionIds']),
        ...mapGetters('selectionProducts', ['getSelections']),
        ...mapGetters('files', ['currentFile']),
        products() {
            if (this.$route.name.search('editFile') >= 0) {
                return this.productsFiltered
            } else return this.getCurrentViewProductsFiltered
        },
        productsToExport() {
            const products = this.exportSelected ? this.getSelectedProducts : this.products
            return products
        },
        selectionsToExport() {
            if (this.getFilterSelectionIds.length <= 0) return this.getSelections
            return this.getFilterSelectionIds.map(selectionId => {
                return this.getSelections.find(selection => selection.id == selectionId)
            })
        },
        availaleCurrencies() {
            const currenciesToReturn = []
            const products = this.products
            products.forEach(product => {
                product.prices.forEach(price => {
                    if (!!price.currency && !currenciesToReturn.includes(price.currency))
                        currenciesToReturn.push(price.currency)
                })
            })
            return currenciesToReturn
        },
        displayCurrencySelector() {
            if (!this.exportTemplate || this.exportType == 'dump') return
            return this.exportTemplate.headers.find(header => {
                return header.key && header.key.startsWith('price.')
            })
        },
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
            if (this.exportType == 'template') {
                this.exportCSVByTemplate()
                return
            }
            if (this.exportType == 'dump') {
                this.exportCsvDump()
                return
            }
            // START HEADERS
            // Instantiate default headers
            const headers = JSON.parse(JSON.stringify(this.defaultCsvHeaders))

            // Add extra data headers
            const extraFields = this.getCustomProductFields
            headers.push(...extraFields.filter(x => x.belong_to == 'Product').map(field => field.display_name))

            if (this.exportVariants) {
                headers.push('Variant Color', 'Variant Variant', 'Variant EANs')
                headers.push(...extraFields.filter(x => x.belong_to == 'Variant').map(field => field.display_name))
            }

            // Add additional headers based on settings

            const uniqueAlignmentOrigins = []
            const uniqueFeedbackOrigins = []

            // START FIND UNIQUE INPUT HEADERS
            // Loop through all products to find all input authors
            this.productsToExport.map(product => {
                const selectionInput = product

                if (this.exportRequests || this.exportAlignment) {
                    if (this.exportAlignment) {
                        selectionInput.alignments.map(action => {
                            const originExists = uniqueAlignmentOrigins.find(x => x.selection_id == action.selection_id)
                            if (!originExists)
                                uniqueAlignmentOrigins.push({
                                    selection: action.selection,
                                    selection_id: action.selection_id,
                                    labels: [],
                                })
                        })
                    }
                    if (this.exportRequests) {
                        selectionInput.requests.map(request => {
                            const originExists = uniqueAlignmentOrigins.find(
                                x => x.selection_id == request.selection_id
                            )
                            if (originExists) {
                                const label = request.labels[0]
                                const labelExists = !label || originExists.labels.includes(label)
                                if (!labelExists) originExists.labels.push(label)
                            }
                            if (!originExists)
                                uniqueAlignmentOrigins.push({
                                    selection: request.selection,
                                    selection_id: request.selection_id,
                                    labels: [...request.labels],
                                })
                        })
                    }
                }
                if (this.exportComments || this.exportFeedback) {
                    if (this.exportFeedback) {
                        selectionInput.feedbacks.map(feedback => {
                            const originExists = uniqueFeedbackOrigins.find(
                                x => x.selection_id == feedback.selection_id && x.user_id == feedback.user_id
                            )
                            if (!originExists)
                                uniqueFeedbackOrigins.push({
                                    selection: feedback.selection,
                                    selection_id: feedback.selection_id,
                                    user: feedback.user,
                                    user_id: feedback.user_id,
                                })
                        })
                    }
                    if (this.exportComments) {
                        selectionInput.comments.map(comment => {
                            const originExists = uniqueFeedbackOrigins.find(
                                x => x.selection_id == comment.selection_id && x.user_id == comment.user_id
                            )
                            if (!originExists)
                                uniqueFeedbackOrigins.push({
                                    selection: comment.selection,
                                    selection_id: comment.selection_id,
                                    user: comment.user,
                                    user_id: comment.user_id,
                                })
                        })
                    }
                }
            })
            // END FIND UNIQUE INPUT HEADERS

            // START QUANTITY HEADERS
            if (this.exportQuantity) {
                headers.push(
                    ...['Product Total Qty', 'Product Total Spend', 'Variant Total Qty', 'Variant Total Spend']
                )
            }
            // END QUANTITY HEADERS

            // START PUSH UNIQUE INPUT HEADERS
            if (this.exportAlignment || this.exportRequests) {
                uniqueAlignmentOrigins.map(origin => {
                    const chapter = this.getSelectionChapter(origin.selection)
                    const chapterName = chapter ? `[${chapter.name}] ` : ''
                    if (this.exportAlignment) {
                        headers.push(`${chapterName}${origin.selection.name} (Alignment)`)
                        // if (this.exportQuantity) {
                        //     headers.push(`${chapterName}${origin.selection.name} (QTY)`)
                        //     headers.push(`${chapterName}${origin.selection.name} (Spend)`)
                        // }
                    }
                    if (this.exportRequests) {
                        for (let i = -1; i < origin.labels.length; i++) {
                            const label = origin.labels[i]
                            headers.push(
                                `${chapterName}${origin.selection.name} (Request)${label ? ` - ${label}` : ''}`
                            )
                        }
                    }
                })
            }

            if (this.exportFeedback || this.exportComments) {
                uniqueFeedbackOrigins.map(origin => {
                    const chapter = this.getSelectionChapter(origin.selection)
                    const chapterName = chapter ? `[${chapter.name}] ` : ''
                    if (this.exportFeedback) {
                        headers.push(
                            `${chapterName}${origin.selection.name} - ${
                                origin.user ? origin.user.name : 'Anonymous'
                            } (Feedback)`
                        )
                        // if (this.exportQuantity) {
                        //     headers.push(
                        //         `${chapterName}${origin.selection.name} - ${
                        //             origin.author ? origin.author.name : 'Anonymous'
                        //         } (QTY)`
                        //     )
                        //     headers.push(
                        //         `${chapterName}${origin.selection.name} - ${
                        //             origin.author ? origin.author.name : 'Anonymous'
                        //         } (Spend)`
                        //     )
                        // }
                    }
                    if (this.exportComments) {
                        headers.push(
                            `${chapterName}${origin.selection.name} - ${
                                origin.user ? origin.user.name : 'Anonymous'
                            } (Comment)`
                        )
                    }
                })
            }
            // END PUSH UNIQUE INPUT HEADERS

            // END HEADERS

            // START ROW DATA
            const rows = []
            this.productsToExport.forEach(product => {
                const selectionInput = product
                const productPrice = this.getProductPrice(product)
                const productPriceWhs = productPrice && productPrice.wholesale_price ? productPrice.wholesale_price : 0
                const currentRow = this.getDefaultProductRowData(product)

                // INSTANTIATE SPACE FOR VARIANTS
                if (this.exportVariants) {
                    // Insert a blank column space for variant names
                    currentRow.push('')
                    // Variant variant
                    currentRow.push('')
                    // Insert a blank space for variant EANS
                    currentRow.push('')
                    // Push custom properties
                    const extraFields = this.getCustomProductFields
                    currentRow.push(
                        ...extraFields
                            .filter(x => x.belong_to == 'Variant')
                            .map(extraField => {
                                return ''
                            })
                    )
                }

                // START QUANTITY DATA
                if (this.exportQuantity) {
                    const quantity = selectionInput.quantity ? selectionInput.quantity : 0
                    currentRow.push(quantity) // Product total qty
                    currentRow.push(quantity * productPriceWhs) // Product total spend
                    currentRow.push('') // Blank for variant total quantity
                    currentRow.push('') // BLank for variant total spend
                }
                // END QUANTITY

                // START ALIGNMENT & REQUESTS
                if (this.exportAlignment || this.exportRequests) {
                    uniqueAlignmentOrigins.map(origin => {
                        if (this.exportAlignment) {
                            // Find the origin Action
                            const originAction = selectionInput.alignments.find(
                                action => action.selection_id == origin.selection_id
                            )
                            currentRow.push(originAction ? originAction.action : 'None')

                            // if (this.exportQuantity) {
                            //     if (!originAction) {
                            //         currentRow.push(...['', ''])
                            //     } else {
                            //         const quantity = originAction.quantity ? originAction.quantity : 0
                            //         currentRow.push(quantity)
                            //         currentRow.push(quantity * productPriceWhs)
                            //     }
                            // }
                        }

                        if (this.exportRequests) {
                            for (let i = -1; i < origin.labels.length; i++) {
                                // Find the origin Request(s)
                                const originRequestList = selectionInput.requests.filter(request => {
                                    let isMatch = request.selection_id == origin.selection_id
                                    const originLabel = origin.labels[i]
                                    if (originLabel) {
                                        isMatch = request.labels[0] == originLabel
                                    }
                                    return isMatch
                                })
                                // Merge the requests with a double line-break
                                const requestContentList = originRequestList.map(request => {
                                    let requestContent = request.content
                                    if (request.type == 'Ticket') {
                                        const requestStatus =
                                            request.status == 'Resolved'
                                                ? 'ACCEPTED'
                                                : request.status == 'Rejected'
                                                ? 'REJECTED'
                                                : 'OPEN'
                                        requestContent = `[${requestStatus}] ${
                                            request.labels.length > 0 ? `{${request.labels[0]}}` : ''
                                        } ${requestContent}`
                                    }
                                    return requestContent
                                })
                                currentRow.push(requestContentList.join('\n\n'))
                            }
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
                                feedback =>
                                    feedback.selection_id == origin.selection_id && feedback.user_id == origin.user_id
                            )
                            currentRow.push(originFeedback ? originFeedback.action : 'None')

                            // if (this.exportQuantity) {
                            //     if (!originFeedback) {
                            //         currentRow.push(...['', ''])
                            //     } else {
                            //         const quantity = originFeedback.quantity ? originFeedback.quantity : 0
                            //         currentRow.push(quantity)
                            //         currentRow.push(quantity * productPriceWhs)
                            //     }
                            // }
                        }

                        if (this.exportComments) {
                            // Find the origin Comment(s)
                            const originCommentList = selectionInput.comments.filter(
                                comment =>
                                    comment.selection_id == origin.selection_id && comment.user_id == origin.user_id
                            )
                            // Merge the comments with a double line-break
                            currentRow.push(originCommentList.map(comment => comment.content).join('\n\n'))
                        }
                    })
                }
                // END FEEDBACK & COMMENTS

                // END PRODUCT ROW
                // Push the product row data
                if (!(this.exportVariants && this.excludeProductRows)) {
                    rows.push(currentRow)
                }

                // START VARIANT
                if (this.exportVariants) {
                    selectionInput.variants.map(variant => {
                        const variantRow = this.getDefaultProductRowData(product)

                        // Push the variant name
                        variantRow.push(variant.color)
                        variantRow.push(variant.variant)

                        // Push the variant EANS
                        const allVariantEans = []
                        if (variant.ean) allVariantEans.push(variant.ean)
                        variant.ean_sizes.map(size => {
                            const existsInArr = allVariantEans.find(x => x == size.ean)
                            if (!existsInArr) allVariantEans.push(size.ean)
                        })
                        variantRow.push(allVariantEans.join(', '))

                        // Push custom properties
                        const extraFields = this.getCustomProductFields
                        variantRow.push(
                            ...extraFields
                                .filter(x => x.belong_to == 'Variant')
                                .map(extraField => {
                                    const propValue = variant.extra_data && variant.extra_data[extraField.name]
                                    return Array.isArray(propValue) ? propValue.join(', ') : propValue
                                })
                        )

                        // START QUANTITY DATA
                        if (this.exportQuantity) {
                            const quantity = variant.quantity ? variant.quantity : 0
                            variantRow.push(quantity) // Product total qty
                            variantRow.push(quantity * productPriceWhs) // Product total spend
                            variantRow.push(quantity) // Variant total quantity
                            variantRow.push(quantity * productPriceWhs) // Variant total spend
                        }
                        // END QUANTITY

                        // START ALIGNMENT & REQUESTS
                        if (this.exportAlignment || this.exportRequests) {
                            uniqueAlignmentOrigins.map(origin => {
                                if (this.exportAlignment) {
                                    // Find the origin Action
                                    const originAction = variant.alignments.find(
                                        action => action.selection_id == origin.selection_id
                                    )
                                    variantRow.push(originAction ? originAction.action : 'None')

                                    if (this.exportQuantity) {
                                        if (!originAction) {
                                            variantRow.push(...['', ''])
                                        } else {
                                            const quantity = originAction.quantity ? originAction.quantity : 0
                                            variantRow.push(quantity)
                                            variantRow.push(quantity * productPriceWhs)
                                        }
                                    }
                                }

                                if (this.exportRequests) {
                                    // If we are exporting requests, push a blank
                                    for (let i = -1; i < origin.labels.length; i++) {
                                        variantRow.push('')
                                    }
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
                                        feedback =>
                                            feedback.selection_id == origin.selection_id &&
                                            feedback.user_id == origin.user_id
                                    )
                                    variantRow.push(originFeedback ? originFeedback.action : 'None')

                                    if (this.exportQuantity) {
                                        if (!originFeedback) {
                                            variantRow.push(...['', ''])
                                        } else {
                                            const quantity = originFeedback.quantity ? originFeedback.quantity : 0
                                            variantRow.push(quantity)
                                            variantRow.push(quantity * productPriceWhs)
                                        }
                                    }
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

            let dateStr = DateTime.local().toLocaleString()
            // Replace slashes with dashes in date
            dateStr = dateStr.replace('/', '-')

            this.exportToCsv(
                `Kollekt Export - ${this.currentFile.name} - ${this.currentSelection.name} ${dateStr}.csv`,
                [headers].concat(rows)
            )
        },
        exportCsvDump() {
            // Instantiate headers
            const headers = JSON.parse(JSON.stringify(this.defaultCsvDumpHeaders))

            // Add extra data headers
            const extraFields = this.getCustomProductFields
            headers.push(...extraFields.filter(x => x.belong_to == 'Product').map(x => x.display_name))

            const currencies = []
            // Find out how many different currencies we have
            this.productsToExport.map(product => {
                product.prices.map(price => {
                    const alreadyAdded = currencies.find(x => x == price.currency)
                    if (!alreadyAdded && !!price.currency) currencies.push(price.currency)
                })
            })
            // Split currencies into columns
            currencies.map(currency => {
                headers.push(...[`WHS ${currency}`, `RRP ${currency}`, `MU ${currency}`])
            })

            // Add variant headers
            headers.push(...['Delivery', 'Variant Color', 'Variant Variant', 'Variant Sizes', 'Variant EAN'])
            headers.push(...extraFields.filter(x => x.belong_to == 'Variant').map(x => x.display_name))
            headers.push(...['Image URL', 'Assortment Name', 'Assortment EAN', 'Assortment Size'])

            const rows = []

            // MAP PRODUCTS
            this.productsToExport.map(product => {
                const productRow = this.getDefaultProductRowDumpData(product)

                // Add prices
                currencies.map(currency => {
                    const productPrice = product.prices.find(x => x.currency == currency)
                    if (!productPrice) {
                        productRow.push(...[, , ,])
                    } else {
                        productRow.push(
                            ...[
                                productPrice.wholesale_price,
                                productPrice.recommended_retail_price,
                                productPrice.mark_up,
                            ]
                        )
                    }
                })

                // Create a map of the variants
                const productVariantMap = []
                product.variants.map((variant, variantIndex) => {
                    if (variant.pictures.length <= 1) {
                        productVariantMap.push({ variantIndex, pictureIndex: 0 })
                        return
                    }
                    variant.pictures.map((picture, pictureIndex) => {
                        productVariantMap.push({ variantIndex, pictureIndex })
                    })
                })
                const extraRowCount = Math.max(
                    productVariantMap.length,
                    product.delivery_dates.length,
                    product.assortments.length,
                    1
                )

                // Add a row for each row we need to add
                for (let i = 0; i < extraRowCount; i++) {
                    const extraRow = JSON.parse(JSON.stringify(productRow))
                    // Add delivery date
                    extraRow.push(product.delivery_dates ? product.delivery_dates[i] : '')

                    // Add variant
                    const variantIndex = productVariantMap[i] ? productVariantMap[i].variantIndex : null

                    const variant = product.variants[variantIndex]
                    // Get the extra data
                    const extraFields = this.getCustomProductFields

                    if (!variant) {
                        extraRow.push(
                            ...['', '', '', ''].concat(
                                extraFields
                                    .filter(x => x.belong_to == 'Variant')
                                    .map(x => {
                                        return ''
                                    })
                            )
                        )
                    } else {
                        // Figure out what variant we are at
                        extraRow.push(
                            ...[
                                variant.color,
                                variant.variant,
                                variant.ean_sizes.map(size => size.size).join(', '),
                                variant.ean,
                            ].concat(
                                extraFields
                                    .filter(x => x.belong_to == 'Variant')
                                    .map(extraField => {
                                        const propValue = variant.extra_data[extraField.name]
                                        return Array.isArray(propValue) ? propValue.join(', ') : propValue
                                    })
                            )
                        )
                        const pictureIndex = productVariantMap[i] ? productVariantMap[i].pictureIndex : null
                        const picture = variant.pictures[pictureIndex]
                        if (!picture) {
                            extraRow.push('')
                        } else {
                            extraRow.push(picture.url)
                        }
                    }

                    // Add assortments
                    const assortment = product.assortments[i]
                    if (!assortment) {
                        extraRow.push(...['', '', ''])
                    } else {
                        extraRow.push(...[assortment.name, assortment.box_ean, assortment.box_size])
                    }

                    rows.push(extraRow)
                }
            })

            let dateStr = DateTime.local().toLocaleString()
            // Replace slashes with dashes in date
            dateStr = dateStr.replace('/', '-')

            this.exportToCsv(`Kollekt File Dump - ${this.currentFile.name} - ${dateStr}.csv`, [headers].concat(rows))
        },
        exportCSVByTemplate() {
            const rows = this.generateCSVRowsFromTemplate(
                this.productsToExport,
                this.exportTemplate,
                this.currencyToExport
            )
            if (!rows || rows.length <= 0) return

            let dateStr = DateTime.local().toLocaleString()
            // Replace slashes with dashes in date
            dateStr = dateStr.replace('/', '-')
            this.exportToCsv(
                `Kollekt ${this.exportTemplate.name} Export - ${this.currentFile.name} - ${dateStr}.csv`,
                rows
            )
        },
        getDefaultProductRowData(product) {
            const priceToReturn = this.getProductPrice(product)
            const arrayToReturn = [
                product.datasource_id,
                product.title,
                product.category,
                product.min_order,
                product.min_variant_order,
                product.delivery_dates.map(date => this.getPrettyDate(date, 'short')).join(', '),
                priceToReturn.currency || '',
                priceToReturn.wholesale_price || '',
                priceToReturn.recommended_retail_price || '',
                priceToReturn.mark_up || '',
                product.eans.join(', '),
                product.labels.join(', '),
            ]
            // Get the extra data
            const extraFields = this.getCustomProductFields
            arrayToReturn.push(
                ...extraFields
                    .filter(x => x.belong_to == 'Product')
                    .map(field => {
                        const propValue = product.extra_data[field.name]
                        return Array.isArray(propValue) ? propValue.join(', ') : propValue
                    })
            )
            return arrayToReturn
        },
        getDefaultProductRowDumpData(product) {
            const priceToReturn = this.getProductPrice(product)
            const arrayToReturn = [
                product.datasource_id,
                product.title,
                product.brand,
                product.category,
                product.buying_group,
                product.min_order,
                product.min_variant_order,
                product.composition,
                product.sale_description,
                product.eans.join(', '),
            ]
            // Get the extra data
            const extraFields = this.getCustomProductFields
            arrayToReturn.push(
                ...extraFields
                    .filter(x => x.belong_to == 'Product')
                    .map(field => {
                        const propValue = product.extra_data[field.name]
                        return Array.isArray(propValue) ? propValue.join(', ') : propValue
                    })
            )
            return arrayToReturn
        },
        getProductPrice(product) {
            let priceToReturn = {}
            if (product.prices && product.prices.length > 0) {
                if (this.currencyToExport && product.prices.find(x => x.currency == this.currencyToExport)) {
                    priceToReturn = product.prices.find(x => x.currency == this.currencyToExport)
                } else {
                    priceToReturn = product.prices[0]
                }
            }
            return priceToReturn
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
        this.exportQuantity = this.quantityEnabled
    },
}
</script>

<style lang="scss" scoped></style>
