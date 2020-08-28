<template>
    <form class="upload-files-screen">
        <div class="form-element" style="text-align: center;">
            <p><strong>Select workbooks (CSV, Excel, etc.) to upload</strong></p>
        </div>

        <div class="form-element">
            <UploadFilesDroparea
                :multiple="true"
                accept="text/csv, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                iconClass="fal fa-file-csv"
                :acceptedExtensions="['tsv', 'csv', 'xlsx', 'xml']"
                :fileList="fileList"
                @update:fileList="e => $emit('update:fileList', e)"
            />
        </div>

        <div class="form-controls">
            <button type="button" class="lg primary" :disabled="fileList.length <= 0"
            @click="$emit('go-to-next-screen')">
                <span>Next: Upload settings</span>
            </button>
        </div>
    </form>
</template>

<script>
import UploadFilesDroparea from '../common/UploadFilesDroparea'
export default {
    name: 'uploadFilesScreen',
    components: {
        UploadFilesDroparea
    },
    props: [
        'fileList',
    ],
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