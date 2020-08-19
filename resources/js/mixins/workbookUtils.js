export default {
    methods: {
        parseWorkbookToRowsAndCells(workbook) {
            // Use SheetJS to parse the workbook
            const data = new Uint8Array(workbook)
            var workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: false, cellText: false })
            const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

            const rows = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                header: 1,
                blankrows: false,
                dateNF: 'YYYY-MM-DD',
            })

            return rows
        },
    },
}
