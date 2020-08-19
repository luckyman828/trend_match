export default {
    methods: {
        parseWorkbookToRowsAndCells(workbook) {
            // Use SheetJS to parse the workbook
            const data = new Uint8Array(workbook)
            var workbook = XLSX.read(data, { type: 'array' })
            const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]
            console.log('workbook', workbook, sheet)

            const rows = XLSX.utils.sheet_to_json(sheet, { raw: false, header: 1, blankrows: false })
            // Remove empty rows

            console.log('rows:', rows)

            return rows
        },
    },
}
