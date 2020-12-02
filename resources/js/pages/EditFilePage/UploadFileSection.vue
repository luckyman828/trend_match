<template>
    <div class="upload-file-section form-wrapper">
        <template v-if="fileRows.length <= 0">
            <BaseDroparea
                class="form-element"
                :multiple="false"
                accept="text/csv, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                @input="onFile"
            />
            <BaseCheckboxInputField v-model="hasHeaderRow" class="sm">
                <span>Spreadsheet has header row</span>
            </BaseCheckboxInputField>
        </template>
        <template v-else>
            <p>Congratulations</p>
        </template>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import workbookUtils from '../../mixins/workbookUtils'
export default {
    name: 'uploadFileSection',
    mixins: [workbookUtils],
    data: function() {
        return {
            fileRows: [],
            fileHeaders: [],
            hasHeaderRow: true,
            result: [],
        }
    },
    methods: {
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async onFile(fileList) {
            const file = fileList[0]

            // Check that the file is valid
            const acceptedExtensions = ['tsv', 'csv', 'xlsx', 'xml', 'xls']
            const extension = file.name.split('.').pop()

            if (!acceptedExtensions.includes(extension)) {
                this.SHOW_SNACKBAR({
                    msg: 'Invalid file type',
                    type: 'info',
                    iconClass: 'fa-exclamation-triangle',
                })
                return
            }

            // Read the file
            const workbook = await this.readFile(file)

            // Read the file with SheetJS
            this.fileRows = this.parseWorkbookToRowsAndCells(workbook, !this.hasHeaderRow)

            // Read the headers
            this.fileHeaders = Object.keys(this.fileRows[0])

            // If there is only 1 hedaer row, simply read that column
            console.log('file headers', this.fileHeaders)
            if (this.fileHeaders.length == 1) {
                this.result = this.fileRows.map(row => row[this.fileHeaders[0]])
            }
            console.log('result', this.result, [...new Set(this.result)])
        },
        async readFile(file) {
            return await new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsArrayBuffer(file, 'ISO-8859-4')
                fileReader.onload = async e => {
                    resolve(e.target.result)
                }
            })
        },
    },
}
</script>

<style></style>
