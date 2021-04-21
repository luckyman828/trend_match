import store from '../store/'

export default {
    methods: {
        exportToCsv(filename, rows) {
            // SheetJS
            const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: true })
            const csvFile = XLSX.utils.sheet_to_csv(worksheet, { FS: ';' })

            var BOM = '\uFEFF'
            var blob = new Blob([BOM + csvFile], { type: 'text/csv;charset=utf-8;' })
            if (navigator.msSaveBlob) {
                // IE 10+
                navigator.msSaveBlob(blob, filename)
            } else {
                var link = document.createElement('a')
                if (link.download !== undefined) {
                    // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob)
                    link.setAttribute('href', url)
                    link.setAttribute('download', filename)
                    link.style.visibility = 'hidden'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                }
            }
        },
        generateCSVRowsFromTemplate(products, template, preferredCurrency) {
            const rows = []

            // Add headers
            rows.push(template.headers.filter(x => !!x.key).map(x => x.name))
            let rowIndex = 0

            products.map(product => {
                if (template.rowScope == 'Variant') {
                    const variantCount = Math.max(product.variants.length, 1)
                    for (let i = 0; i < variantCount; i++) {
                        const variant = product.variants[i]
                        const selectionInputVariant = variant.selectionAlignment
                            ? variant.selectionAlignment
                            : product.getActiveSelectionInput &&
                              product.getActiveSelectionInput.variants.find(x => x.id == variant.id)

                        if (template.inVariantsOnly && selectionInputVariant) {
                            const actionKey = store.getters['selections/getCurrentActionKey']
                            const variantAction = selectionInputVariant[actionKey]
                            if (!['In', 'Focus'].includes(variantAction)) continue
                        }
                        getRowData(product, selectionInputVariant ? selectionInputVariant : variant)
                    }
                } else {
                    getRowData(product)
                }
            })

            function getRowData(product, variant) {
                const productRows = [[]]
                // Loop through the headers of our template and populate their data
                template.headers.map(header => {
                    const isRowKey = header.isRowKey
                    const key = header.key
                    if (!key) return
                    // Check if the key has a scope
                    const scopeIndex = key.indexOf('.')
                    const keyScope = scopeIndex >= 0 && key.slice(0, scopeIndex)
                    if (keyScope) {
                        const scopeKey = key.slice(scopeIndex + 1)
                        if (keyScope == 'variant') {
                            const variantScopeIndex = scopeKey.indexOf('.')
                            const variantKeyScope = variantScopeIndex >= 0 && scopeKey.slice(0, variantScopeIndex)

                            if (variantKeyScope) {
                                const variantScopeKey = scopeKey.slice(variantScopeIndex + 1)
                                if (variantKeyScope == 'extra_data') {
                                    const keyValue =
                                        variant && variant.extra_data ? variant.extra_data[variantScopeKey] : null
                                    if (Array.isArray(keyValue)) {
                                        if (isRowKey) {
                                            // Instantiate extra rows
                                            keyValue.map((keyArrayValue, index) => {
                                                // console.log('keyArrayValue', index, keyArrayValue)
                                                let currentRow = productRows[index]
                                                if (!currentRow) {
                                                    currentRow = JSON.parse(JSON.stringify(productRows[0]))
                                                    productRows.push(currentRow)
                                                }
                                            })
                                            // Populate rows
                                            keyValue.map((keyArrayValue, index) => {
                                                let currentRow = productRows[index]
                                                currentRow.push(keyArrayValue)
                                            })
                                        } else productRows.map(row => row.push(keyValue.join(', ')))
                                    } else {
                                        productRows.map(row => row.push(keyValue))
                                    }
                                }
                            } else {
                                // We have to do some magic for sizes
                                if (scopeKey == 'sizes') {
                                    productRows.map(row =>
                                        row.push(variant ? variant.ean_sizes.map(x => x.size).join(', ') : '')
                                    )
                                } else {
                                    const keyValue = Array.isArray(variant[scopeKey])
                                        ? variant[scopeKey].join(', ')
                                        : variant[scopeKey]
                                    productRows.map(row => row.push(variant ? keyValue : ''))
                                }
                            }
                            return
                        }

                        if (keyScope == 'price') {
                            // See if we have the preffered currency available
                            if (product.prices.length <= 0) {
                                productRows.map(row => row.push())
                                return
                            }
                            let priceToExport = {}
                            if (!preferredCurrency) priceToExport = product.prices[0]
                            const priceMatch = product.prices.find(
                                x => x.currency && x.currency.toLowerCase() == preferredCurrency.toLowerCase()
                            )
                            if (priceMatch) priceToExport = priceMatch
                            productRows.map(row => row.push(priceToExport[scopeKey]))
                            return
                        }

                        const scopeValue = product[keyScope]
                        if (Array.isArray(scopeValue)) {
                            productRows.map(row => row.push(scopeValue.map(x => x[scopeKey]).join(', ')))
                            return
                        }

                        const keyValue = product[keyScope][scopeKey]
                        productRows.map(row => row.push(keyValue))
                        return
                    }
                    // END HAS SCOPE

                    const keyValue = product[key]
                    if (Array.isArray(keyValue)) {
                        if (key == 'delivery_dates') {
                            const prettyDates = keyValue.map(x =>
                                DateTime.fromFormat(x, 'yyyy-MM-dd').toFormat('MMMM yyyy')
                            )
                            productRows.map(row => row.push(prettyDates.join(', ')))
                            return
                        }
                        productRows.map(row => row.push(keyValue.join(', ')))
                        return
                    }
                    productRows.map(row => row.push(keyValue))
                })
                rows.push(...productRows)
                rowIndex++
            }

            return rows
        },
    },
}
