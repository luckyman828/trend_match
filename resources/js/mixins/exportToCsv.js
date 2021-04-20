import getUniqueObjectValuesByKey from '../helpers/getUniqueObjectValuesByKey'
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
            const headers = template.headers.filter(x => !!x.key) // filter out blank headers
            // rows.push({ key: 'headers', cells: headers.map(x => x.name) })
            rows.push({ key: 'headers', cells: ['rowKey', ...headers.map(x => x.name)] })
            // rows.push(headers.map(x => x.name))

            // Loop through our products to generate row data
            products.map(product => {
                const rowKeys = []

                // Helper method to generate unique row keys
                const generateRowKeys = (obj, keyObj, path) => {
                    // Find the array
                    const array = obj[keyObj.key]
                    if (!array || array.length <= 0) {
                        rowKeys.push(path.slice(0, path.lastIndexOf('.')))
                    }
                    array.map((arrayObj, index) => {
                        const arrayObjPath = `${path}:${index}`
                        // console.log('what should we do?', keyObj, path)
                        if (!keyObj.children || keyObj.children.length <= 0) {
                            rowKeys.push(arrayObjPath)
                        } else {
                            // console.log('llop throguh children', keyObj)
                            keyObj.children.map(childKeyObj => {
                                generateRowKeys(arrayObj, childKeyObj, `${arrayObjPath}.${childKeyObj.key}`)
                            })
                        }
                    })
                }

                const getRowKeyObj = (obj, rowKeySplit, headerKeySplit) => {
                    // Test if the row key matches the headerkey
                    let keyObj = obj

                    const remainingHeaderKeys = [...headerKeySplit]
                    headerKeySplit.map((headerKey, index) => {
                        const rowKey = rowKeySplit[index]
                        // Check if there is a match
                        if (rowKey && rowKey.key == headerKey) {
                            keyObj = keyObj[headerKey][rowKey.index]
                            remainingHeaderKeys.splice(0, 1)
                        }
                    })

                    // Test that the current rowKey is the best match
                    const currentRowKeySplit = rowKeySplit.map(x => x.key)
                    // const currentRowMatchLength =
                    //     headerKeyString.search(currentRowKeyString) == 0 ? currentRowKeyString.length : 0
                    const currentRowMatchLength = headerKeySplit.reduce(
                        (total, headerString, index) =>
                            currentRowKeySplit[index] && headerString == currentRowKeySplit[index]
                                ? (total += 1)
                                : total,
                        0
                    )
                    let currentRowKeyIsBestMatch = true

                    for (const rowKey of rowKeys) {
                        // Make a rowkeystring with no indices
                        const rowKeySplit = rowKey.split('.').map(x => x.split(':')[0])

                        const matchLength = headerKeySplit.reduce(
                            (total, headerString, index) =>
                                rowKeySplit[index] && headerString == rowKeySplit[index] ? (total += 1) : total,
                            0
                        )
                        if (matchLength > currentRowMatchLength) {
                            currentRowKeyIsBestMatch = false
                            break
                        }
                    }
                    if (!currentRowKeyIsBestMatch) keyObj = null

                    return { obj: keyObj, valueKey: remainingHeaderKeys.join('.') }
                }

                // First generate unique keys for each row necessary to express the product data
                template.rowKeys.map(rowKey => {
                    generateRowKeys(product, rowKey, rowKey.key)
                })

                // Loop through the unique product rows and populate the corresponding rows with data
                rowKeys.map(rowKey => {
                    // const row = { key: rowKey, cells: [] }
                    const row = { key: rowKey, cells: [rowKey] }
                    const rowKeySplit = rowKey
                        .split('.')
                        .map(scope => ({ key: scope.split(':')[0], index: scope.split(':')[1] }))
                    // Now loop through each of the templates headers and generate their row data
                    template.headers.map(header => {
                        // Split the headerKey so we can compare to the row key
                        const headerKey = header.key
                        const headerKeySplit = headerKey.split('.')

                        const rowKeyObj = getRowKeyObj(product, rowKeySplit, headerKeySplit)
                        console.log('row key obj', rowKeyObj, rowKey)
                        if (!rowKeyObj.obj) {
                            row.cells.push('')
                            return
                        }
                        const keyObj = rowKeyObj.obj
                        const ObjValueKey = rowKeyObj.valueKey
                        const cellValue = getUniqueObjectValuesByKey(keyObj, ObjValueKey)
                        row.cells.push(Array.isArray(cellValue) ? cellValue.join(', ') : cellValue)
                    })
                    rows.push(row)
                })
            })
            return rows.map(row => row.cells)
        },
        // generateCSVRowsFromTemplate(products, template, preferredCurrency) {
        //     const rows = []

        //     // Add headers
        //     rows.push(template.headers.filter(x => !!x.key).map(x => x.name))
        //     let rowIndex = 0

        //     products.map(product => {
        //         if (template.rowScope == 'Variant') {
        //             const variantCount = Math.max(product.variants.length, 1)
        //             for (let i = 0; i < variantCount; i++) {
        //                 const variant = product.variants[i]
        //                 if (template.inVariantsOnly) {
        //                     if (!variant) continue
        //                     // BUY
        //                     if (variant.selectionAlignment) {
        //                         if (!['In', 'Focus'].includes(variant.selectionAlignment.feedback)) {
        //                             continue
        //                         }
        //                     }
        //                     // SELECT
        //                     else {
        //                         // Find the variant in our selectionInput
        //                         const selectionInputVariant = product.getActiveSelectionInput.variants.find(
        //                             x => x.id == variant.id
        //                         )
        //                         const actionKey = store.getters['selections/getCurrentActionKey']
        //                         const variantAction = selectionInputVariant[actionKey]
        //                         if (!['In', 'Focus'].includes(variantAction)) continue
        //                     }
        //                 }
        //                 getRowData(product, variant)
        //             }
        //         } else {
        //             getRowData(product)
        //         }
        //     })

        //     function getRowData(product, variant) {
        //         const productRows = [[]]
        //         // Loop through the headers of our template and populate their data
        //         template.headers.map(header => {
        //             const isRowKey = header.isRowKey
        //             const key = header.key
        //             if (!key) return
        //             // Check if the key has a scope
        //             const scopeIndex = key.indexOf('.')
        //             const keyScope = scopeIndex >= 0 && key.slice(0, scopeIndex)
        //             if (keyScope) {
        //                 const scopeKey = key.slice(scopeIndex + 1)
        //                 if (keyScope == 'variant') {
        //                     const variantScopeIndex = scopeKey.indexOf('.')
        //                     const variantKeyScope = variantScopeIndex >= 0 && scopeKey.slice(0, variantScopeIndex)

        //                     if (variantKeyScope) {
        //                         const variantScopeKey = scopeKey.slice(variantScopeIndex + 1)
        //                         if (variantKeyScope == 'extra_data') {
        //                             const keyValue =
        //                                 variant && variant.extra_data ? variant.extra_data[variantScopeKey] : null
        //                             if (Array.isArray(keyValue)) {
        //                                 if (isRowKey) {
        //                                     // Instantiate extra rows
        //                                     keyValue.map((keyArrayValue, index) => {
        //                                         // console.log('keyArrayValue', index, keyArrayValue)
        //                                         let currentRow = productRows[index]
        //                                         if (!currentRow) {
        //                                             currentRow = JSON.parse(JSON.stringify(productRows[0]))
        //                                             productRows.push(currentRow)
        //                                         }
        //                                     })
        //                                     // Populate rows
        //                                     keyValue.map((keyArrayValue, index) => {
        //                                         let currentRow = productRows[index]
        //                                         currentRow.push(keyArrayValue)
        //                                     })
        //                                 } else productRows.map(row => row.push(keyValue.join(', ')))
        //                             } else {
        //                                 productRows.map(row => row.push(keyValue))
        //                             }
        //                         }
        //                     } else {
        //                         // We have to do some magic for sizes
        //                         if (scopeKey == 'sizes') {
        //                             productRows.map(row =>
        //                                 row.push(variant ? variant.ean_sizes.map(x => x.size).join(', ') : '')
        //                             )
        //                         } else {
        //                             const keyValue = Array.isArray(variant[scopeKey])
        //                                 ? variant[scopeKey].join(', ')
        //                                 : variant[scopeKey]
        //                             productRows.map(row => row.push(variant ? keyValue : ''))
        //                         }
        //                     }
        //                     return
        //                 }

        //                 if (keyScope == 'price') {
        //                     // See if we have the preffered currency available
        //                     if (product.prices.length <= 0) {
        //                         productRows.map(row => row.push())
        //                         return
        //                     }
        //                     let priceToExport = {}
        //                     if (!preferredCurrency) priceToExport = product.prices[0]
        //                     const priceMatch = product.prices.find(
        //                         x => x.currency && x.currency.toLowerCase() == preferredCurrency.toLowerCase()
        //                     )
        //                     if (priceMatch) priceToExport = priceMatch
        //                     productRows.map(row => row.push(priceToExport[scopeKey]))
        //                     return
        //                 }

        //                 const scopeValue = product[keyScope]
        //                 if (Array.isArray(scopeValue)) {
        //                     productRows.map(row => row.push(scopeValue.map(x => x[scopeKey]).join(', ')))
        //                     return
        //                 }

        //                 const keyValue = product[keyScope][scopeKey]
        //                 productRows.map(row => row.push(keyValue))
        //                 return
        //             }
        //             // END HAS SCOPE

        //             const keyValue = product[key]
        //             if (Array.isArray(keyValue)) {
        //                 if (key == 'delivery_dates') {
        //                     const prettyDates = keyValue.map(x =>
        //                         DateTime.fromFormat(x, 'yyyy-MM-dd').toFormat('MMMM yyyy')
        //                     )
        //                     productRows.map(row => row.push(prettyDates.join(', ')))
        //                     return
        //                 }
        //                 productRows.map(row => row.push(keyValue.join(', ')))
        //                 return
        //             }
        //             productRows.map(row => row.push(keyValue))
        //         })
        //         rows.push(...productRows)
        //         rowIndex++
        //     }

        //     return rows
        // },
    },
}
