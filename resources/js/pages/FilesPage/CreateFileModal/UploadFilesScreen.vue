<template>
    <form class="upload-files-screen">
        <div class="form-element" style="text-align: center;">
            <p>A file is a collection of products that users will be able to view in the dashboard and/or app</p>
            <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
        </div>

        <div class="form-element">
            <label for="file-name-input">File name* (required)</label>
            <input ref="fileNameInput" type="text" id="file-name-input" class="input-wrapper" placeholder="unnamed file" v-model="newFile.name">
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
            <button type="button" class="lg primary ghost" :disabled="newFile.name.length < 1"
            @click="$emit('create-empty')">
                <span>Create Empty</span>
            </button>
            <button type="button" class="lg primary" :disabled="fileList.length <= 0 || newFile.name.length <= 0"
            @click="$emit('go-to-next-screen')">
                <span>Next: Map fields</span>
            </button>
        </div>
    </form>
</template>

<script>
import UploadFilesDroparea from '../../../components/common/UploadFilesDroparea'
export default {
    name: 'uploadFilesScreen',
    components: {
        UploadFilesDroparea
    },
    props: [
        'fileList',
        'newFile'
    ],
    mounted() {
        this.$refs.fileNameInput.focus()
        this.$refs.fileNameInput.select()
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