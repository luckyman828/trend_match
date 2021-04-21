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
            rows.push({ key: 'headers', cells: headers.map(x => x.name) })
            // rows.push({ key: 'headers', cells: ['rowKey', ...headers.map(x => x.name)] })
            // rows.push(headers.map(x => x.name))

            // Loop through our products to generate row data
            products.map(product => {
                const rowKeys = []

                // Helper method to generate unique row keys
                const generateRowKeys = (obj, keyObj, path) => {
                    // Find the array
                    const array = obj[keyObj.key]
                    // if (!array || array.length <= 0) {
                    //     rowKeys.push(path.slice(0, path.lastIndexOf('.')))
                    // }
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
                    const row = { key: rowKey, cells: [] }
                    // const row = { key: rowKey, cells: [rowKey] }
                    const rowKeySplit = rowKey
                        .split('.')
                        .map(scope => ({ key: scope.split(':')[0], index: scope.split(':')[1] }))
                    // Now loop through each of the templates headers and generate their row data
                    template.headers.map(header => {
                        // Split the headerKey so we can compare to the row key
                        const headerKey = header.key
                        const headerKeySplit = headerKey.split('.')

                        const rowKeyObj = getRowKeyObj(product, rowKeySplit, headerKeySplit)
                        if (!rowKeyObj.obj) {
                            row.cells.push('')
                            return
                        }
                        const keyObj = rowKeyObj.obj
                        const ObjValueKey = rowKeyObj.valueKey
                        let cellValue = getUniqueObjectValuesByKey(keyObj, ObjValueKey)

                        // DKC CUSTOM CODE: Format assortment name
                        if (ObjValueKey == 'assortment') {
                            cellValue = cellValue ? cellValue[0].split(';')[0] : cellValue
                        }
                        // END DKC CUSTOM CODE: Format assortment name

                        row.cells.push(Array.isArray(cellValue) ? cellValue.join(', ') : cellValue)
                    })
                    rows.push(row)
                })
            })
            // Filter rows
            const rowsFiltered = rows.filter((row, index) => {
                if (index <= 0) return true
                let keepRow = true

                for (let i = 0; i < headers.length; i++) {
                    const header = headers[i]
                    const cellValue = row.cells[i]
                    if (header.filterValues) {
                        for (const filterValue of header.filterValues) {
                            if (filterValue == cellValue) {
                                keepRow = false
                                break
                            }
                        }
                    }
                }
                return keepRow
            })

            return rowsFiltered.map(row => row.cells)
        },
    },
}
