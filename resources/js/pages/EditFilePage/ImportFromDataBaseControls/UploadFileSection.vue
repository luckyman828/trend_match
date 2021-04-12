<template>
    <div class="upload-file-section form-wrapper">
        <BaseDropdownInputField
            class="form-element"
            innerLabel="Company"
            :search="availableCompanies.length > 5"
            placeholder="Choose company"
            type="radio"
            :options="availableCompanies"
            nameKey="name"
            :value="selectedCompany"
            :resize="false"
            @input="$emit('update:selectedCompany', $event)"
        >
            <button class="primary full-width" v-close-popover>
                <span>Done</span>
            </button>
        </BaseDropdownInputField>

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
        <template v-else-if="fileHeaders.length > 1 && result.length <= 0">
            <p>Which column holds your ids?</p>
            <BaseDropdownInputField
                placeholder="Choose column"
                :options="fileHeaders"
                type="radio"
                :search="true"
                @input="$event => getColumnValues($event)"
            />
        </template>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import BaseSelectButtonsContextMenu from '../../../components/ui/input/BaseSelectButtonsContextMenu.vue'
import workbookUtils from '../../../mixins/workbookUtils'
export default {
    components: { BaseSelectButtonsContextMenu },
    name: 'uploadFileSection',
    mixins: [workbookUtils],
    props: ['selectedCompany'],
    data: function() {
        return {
            fileRows: [],
            fileHeaders: [],
            hasHeaderRow: true,
            result: [],
        }
    },
    computed: {
        ...mapGetters('integrationDkc', {
            availableCompanies: 'getCompanyMap',
        }),
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
            if (this.fileHeaders.length == 1) {
                this.getColumnValues(this.fileHeaders[0])
            }
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
        getColumnValues(columnName) {
            const values = this.fileRows.map(row => row[columnName])
            const uniqueValues = [...new Set(values)]
            this.result = uniqueValues
            this.$emit('submit', uniqueValues)
            return uniqueValues
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.upload-file-section {
}
</style>
