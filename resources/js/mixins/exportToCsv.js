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
        generateCSVRowsFromTemplate(products, template) {
            console.log('generate CSV rows from template', products, template)
            const rows = []

            // Add headers
            rows.push(template.headers.map(x => x.name))

            products.map(product => {
                if (template.rowScope == 'Variant') {
                    for (let i = 0; i < Math.max(product.variants.length, 1); i++) {
                        const variant = product.variants[i]
                        getRowData(product, variant)
                    }
                } else {
                    getRowData(product)
                }
            })

            function getRowData(product, variant) {
                console.log('get row data', product.title, variant)
                const row = []
                // Loop through the headers of our template and populate their data
                template.headers.map(header => {
                    const key = header.key
                    // Check if the key has a scope
                    const scopeIndex = key.indexOf('.')
                    const keyScope = scopeIndex >= 0 && key.slice(0, scopeIndex)
                    if (keyScope) {
                        const scopeKey = key.slice(scopeIndex + 1)
                        if (keyScope == 'variant') {
                            // We have to do some magic for sizes
                            if (scopeKey == 'sizes') {
                                row.push(variant ? variant.ean_sizes.map(x => x.size).join(', ') : '')
                            } else {
                                row.push(variant ? variant[scopeKey] : '')
                            }
                            return
                        }
                        if (keyScope == 'assortment') {
                            row.push('havent done assortmetns')
                            return
                        }

                        if (keyScope == 'price') {
                            row.push('havent done prices')
                            return
                        }

                        const scopeValue = product[keyScope]
                        if (Array.isArray(scopeValue)) {
                            row.push(scopeValue.map(x => x[scopeKey]).join(', '))
                            return
                        }

                        const keyValue = product[keyScope][scopeKey]
                        row.push(keyValue)
                        return
                    }

                    const keyValue = product[key]
                    if (Array.isArray(keyValue)) {
                        row.push(keyValue.join(', '))
                        return
                    }
                    row.push(keyValue)
                })
                rows.push(row)
            }

            console.log('Return rows', rows)
            return rows
        },
    },
}
