import getUniqueObjectValuesByKey from './getUniqueObjectValuesByKey'

export default function exportToCsv(filename, rows) {
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
}
export function generateCSVRowsFromTemplate(products, template, preferredCurrency) {
    console.log('generate csv rows from template', products, template)
    const rows = []

    // Add headers
    const headers = template.headers.filter(x => !!x.key) // filter out blank headers
    const headerCells = headers.map(x => x.name)
    rows.push({ key: 'headers', cells: template.printRowKey ? ['rowKey', ...headerCells] : headerCells })

    // Loop through our products to generate row data
    products.map(product => {
        const rowKeys = []

        // Helper method to generate unique row keys
        const generateRowKeys = (obj, keyObj, path) => {
            // console.log('generate row key', obj, keyObj, path)
            const keyValue = getUniqueObjectValuesByKey(obj, keyObj.key)
            const keyPath = path.slice(0, path.lastIndexOf('.'))

            if (!keyValue) {
                if (keyObj.rowFilters && keyObj.rowFilters.find(filter => filter.type == 'include')) {
                    return
                }
                rowKeys.push(keyPath)
                return
            }

            // Key is array
            if (Array.isArray(keyValue)) {
                if (keyValue.length <= 0) {
                    if (keyObj.rowFilters && keyObj.rowFilters.find(filter => filter.type == 'include')) {
                        return
                    }
                    rowKeys.push(keyPath)
                    return
                }
                keyValue.map((arrayObj, index) => {
                    // console.log('loop through array', arrayObj, keyObj)
                    if (!passesRowKeyFilter(keyObj, arrayObj)) return

                    const arrayObjPath = `${path}:${index}`
                    // console.log('what should we do?', keyObj, path)
                    if (!keyObj.children || keyObj.children.length <= 0) {
                        // console.log('push array child')
                        rowKeys.push(arrayObjPath)
                    } else {
                        // console.log('llop throguh children', keyObj)
                        keyObj.children.map(childKeyObj => {
                            generateRowKeys(arrayObj, childKeyObj, `${arrayObjPath}.${childKeyObj.key}`)
                        })
                    }
                })
                return
            }
        }

        const passesRowKeyFilter = (rowKeyObj, rowKeyValueObject) => {
            if (!rowKeyObj.rowFilters) return true
            let excludeRow = false
            for (const rowFilter of rowKeyObj.rowFilters) {
                // console.log('passes row filter', rowFilter, rowKeyValueObject, rowKeyObj)
                // console.log('get filter key value', rowKeyValueObject, rowFilter)
                const filterKeyValue =
                    typeof rowKeyValueObject != 'object'
                        ? [rowKeyValueObject]
                        : getUniqueObjectValuesByKey(rowKeyValueObject, rowFilter.key)

                const matchesFilter = !!filterKeyValue.find(x => rowFilter.values.includes(x))
                if ((rowFilter.type == 'exclude' && matchesFilter) || (rowFilter.type == 'include' && !matchesFilter)) {
                    excludeRow = true
                    break
                }
            }
            // console.log('passes rowFilter', !excludeRow)
            return !excludeRow
        }

        const getRowKeyObj = (obj, rowKeySplit, headerKeySplit) => {
            // console.log('rowkey obj', obj, rowKeySplit, headerKeySplit)
            // Test if the row key matches the headerkey
            let keyObj = obj

            const remainingHeaderKeys = [...headerKeySplit]
            headerKeySplit.map((headerKey, index) => {
                const rowKey = rowKeySplit[index]
                // Check if there is a match
                if (rowKey && rowKey.key == headerKey) {
                    // console.log('get row key value ', keyObj, headerKey, rowKey)
                    if (rowKey.index != null) {
                        keyObj = keyObj[headerKey][rowKey.index]
                    } else {
                        keyObj = keyObj[headerKey]
                    }
                    remainingHeaderKeys.splice(0, 1)
                }
            })

            // console.log('key obj so far', keyObj)

            // Test that the current rowKey is the best match
            const currentRowKeySplit = rowKeySplit.map(x => x.key)
            // const currentRowMatchLength =
            //     headerKeyString.search(currentRowKeyString) == 0 ? currentRowKeyString.length : 0
            const currentRowMatchLength = headerKeySplit.reduce(
                (total, headerString, index) =>
                    currentRowKeySplit[index] && headerString == currentRowKeySplit[index] ? (total += 1) : total,
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

            // console.log('rowKey obj result', keyObj, remainingHeaderKeys.join('.'))

            return { obj: keyObj, valueKey: remainingHeaderKeys.join('.') }
        }

        // First generate unique keys for each row necessary to express the product data
        const templateRowKeys = template.rowKeys ? template.rowKeys : [{ key: 'product' }]
        templateRowKeys.map(rowKey => {
            generateRowKeys(product, rowKey, rowKey.key)
        })

        // console.log('Result row keys', rowKeys)

        // Loop through the unique product rows and populate the corresponding rows with data
        rowKeys.map(rowKey => {
            const row = { key: rowKey, cells: template.printRowKey ? [rowKey] : [] }
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
                let cellValue = typeof keyObj == 'object' ? getUniqueObjectValuesByKey(keyObj, ObjValueKey) : keyObj

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

        for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
            const header = headers[headerIndex]
            const cellIndex = template.printRowKey ? headerIndex + 1 : headerIndex
            const cellValue = row.cells[cellIndex]
            if (header.filters) {
                for (const filter of header.filters) {
                    for (const filterValue of filter.values) {
                        if (
                            (filter.type == 'exclude' && filterValue == cellValue) ||
                            (filter.type == 'include' && filterValue != cellValue)
                        ) {
                            keepRow = false
                            break
                        }
                    }
                }
            }
        }
        return keepRow
    })

    return rowsFiltered.map(row => row.cells)
}
