<template>
    <form class="upload-files-screen" v-if="!processingFiles">
        <slot name="header"/>
        
        <div class="form-element">
            <UploadFilesDroparea
                :multiple="true"
                accept="text/csv, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                iconClass="fal fa-file-csv"
                :acceptedExtensions="['tsv', 'csv', 'xlsx', 'xml', 'xls']"
                :fileList="fileList"
                @update:fileList="e => $emit('update:fileList', e)"
            />
        </div>
        <div class="form-controls">
            <slot name="actions" 
                :submit="onSubmit"
                :fileList="fileList"
            />
        </div>
    </form>
    
    <BaseLoader v-else msg="Reading files. This may take a few minutes"/>

</template>

<script>
import workbookUtils from '../../../mixins/workbookUtils'
import UploadFilesDroparea from '../UploadFilesDroparea'
import { mapActions } from 'vuex'
export default {
    name: 'uploadWorkbooksScreen',
    components: {
        UploadFilesDroparea
    },
    mixins: [
        workbookUtils,
    ],
    props: [
        'fileList',
        'availableFiles',
    ],
    data: function() { return {
        processingFiles: false,
    }},
    methods: {
        ...mapActions('mapProductData', ['getProductFields']),
        async onSubmit() {
            this.processingFiles = true
            await Promise.all(this.fileList.map(async file => {
                await new Promise((resolve, reject) => {
                    const fileReader = new FileReader()
                    fileReader.readAsArrayBuffer(file, 'ISO-8859-4')
                    fileReader.onload = async e => {
                        await this.processFile(e.target.result, file.name)
                        resolve()
                    }
                })
            }))
            // Remove files from available files that are no longer mapped
            for (let i = this.availableFiles.length-1; i >= 0; i--) {
                const file = this.availableFiles[i]
                // Check if the file exists in uploaded files
                const shouldBeRemoved = !this.fileList.find(x => x.name == file.fileName)
                if (shouldBeRemoved) {
                    this.availableFiles.splice(i, 1)
                }
            }
            this.processingFiles = false

            //Change the current screen
            this.$emit('go-to-next-screen')
        },
        async processFile(workbook, fileName) {
            const rows = this.parseWorkbookToRowsAndCells(workbook)

            // // Check if the file already exists. If so, replace it instead of adding
            const existingFile = this.availableFiles.find(x => x.fileName == fileName)
            if (existingFile) {
                Object.assign(existingFile, rows)
            } else {
                const mappedKey = await this.getProductFields({scope: 'key'})
                const variantKey = await this.getProductFields({scope: 'variantKey'})
                // const assortmentKey = await this.getProductFields({scope: 'assortmentKey'})
                // const priceKey = await this.getProductFields({scope: 'priceKey'})
                this.availableFiles.push({
                    mappedKey: mappedKey[0],
                    variantKeyList: variantKey,
                    // assortmentKey : assortmentKey[0],
                    // priceKey : priceKey[0],
                    headers: Object.keys(rows[0]),
                    fileName,
                    rows
                })
            }
        },
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.form-controls {
    display: flex;
    justify-content: flex-end;
    > :not(:last-child) {
        margin-right: 16px;
    }
}

</style>