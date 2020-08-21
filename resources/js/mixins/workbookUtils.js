export default {
    methods: {
        parseWorkbookToRowsAndCells(workbook) {
            // Use SheetJS to parse the workbook
            const data = new Uint8Array(workbook)
            var workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false })
            const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

            const rows = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                // header: 1,
                blankrows: false,
                dateNF: 'YYYY-MM-DD',
                defval: null,
            })

            // const headers = XLSX.utils.sheet_to_json(sheet, {
            //     range: 'A1:A3',
            //     raw: true,
            //     header: 1,
            // })

            // console.log('headers', headers)
            // console.log('rows', rows)

            return rows
        },
        validateMappedField(field, rows, depth) {
            // Assume no error
            let isValid = true
            field.error = false

            // Set the limit to a maximum of the number of lines in the file
            const numberOfRowsToValidate = rows.length < depth ? rows.length : depth

            // Test n values
            for (let i = 0; i <= numberOfRowsToValidate - 1; i++) {
                // Find the field value
                const fieldValue = rows[i][field.fieldName]

                // Test that the field actually has a value
                if (fieldValue && isValid) {
                    // Test for integers
                    if (field.type == 'number') {
                        if (isNaN(fieldValue)) {
                            field.error = `Must be a <strong>number</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>`
                            isValid = false
                        }
                    }
                    // Test for correct date
                    if (field.type == 'date') {
                        // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
                        // Regex that looks for a work with exactly 3 characters between A-z.
                        const reg = new RegExp('\\b[A-z]{3}\\b')
                        let valueToTest = JSON.parse(JSON.stringify(fieldValue))
                        if (reg.test(valueToTest)) {
                            // If true then add a "1-" to the date to avoid ambiguity
                            valueToTest = '1-' + valueToTest
                        }
                        const dateValue = new Date(valueToTest)
                        if (!dateValue instanceof Date || isNaN(dateValue)) {
                            field.error = `Invalid <strong>Date format</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>
                            <br>Make sure that values only contain <strong>English</strong> month names`
                            isValid = false
                        }
                    }
                    // Test for correct url
                    if (field.type == 'url') {
                        const urlReg = new RegExp(
                            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/
                        )
                        if (!urlReg.test(fieldValue)) {
                            field.error = `Must be a <strong>isValid URL</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i + 2}</strong>`
                            isValid = false
                        }
                    }
                }
            }
            return isValid
        },
        autoMapField(field, availableFields, matchesToAvoid) {
            let foundMatch = false
            availableFields.forEach(fieldCollection => {
                if (foundMatch) return

                const altMatch = fieldCollection.headers.find(header => {
                    return field.headersToMatch.find(headerMatch => {
                        return headerMatch.search(header.toLowerCase()) >= 0
                    })
                })

                const matches = fieldCollection.headers.filter(header =>
                    field.headersToMatch.find(
                        headerMatch =>
                            headerMatch.search(header.toLowerCase()) >= 0 ||
                            header.toLowerCase().search(headerMatch) >= 0
                    )
                )

                if (matches.length > 0) {
                    let match = matches[0]
                    if (matchesToAvoid) {
                        // Find a match that is not included in the matched to avoid array
                        match = matches.find(
                            theMatch =>
                                !matchesToAvoid.find(
                                    x => x.fieldName == theMatch && x.fileName == fieldCollection.fileName
                                )
                        )
                    }
                    if (match) {
                        foundMatch = true
                        field.fieldName = match
                        field.file = fieldCollection
                        field.autoMatched = true
                    }
                }
            })
        },
    },
}
