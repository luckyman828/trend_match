<template>
    <div class="upload-files">
        <form @submit.prevent>
            <div class="form-element" style="text-align: center;">
                <p>Add to or overwrite existing product data in this file.</p>
                <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
            </div>

            <div class="form-element">
                <BaseDroparea multiple="true" 
                accept="text/csv, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                ref="droparea"
                @input="onFilesChange">
                    <template v-slot="slotProps">
                        <template v-if="filesToUpload.length < 1">
                            <strong>Drop your file(s) here or click to upload</strong>
                            <i class="fal fa-file-csv big-icon primary"></i>
                            <button type="button" class="dark md" @click="slotProps.activate">
                                <i class="far fa-file-csv"></i>
                                <span>Browse files</span>
                            </button>
                        </template>
                        <template v-else>
                            <strong>Drag and drop files here to upload</strong>
                            <div class="files-wrapper">
                                <div class="file-to-upload" v-for="(file, index) in filesToUpload" :key="index">
                                    <span>{{file.name}}</span>
                                    <button class="ghost" type="button" @click="removeFile(index)">
                                        <i class="remove far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="button" class="dark md" @click="slotProps.activate">
                                <i class="far fa-file-csv"></i>
                                <span>Browse files</span>
                            </button>
                        </template>
                    </template>
                    <template v-slot:dragDisplay>
                        <i class="big-icon fas fa-smile-beam"></i>
                        <span>Drop file(s) here</span>
                    </template>
                </BaseDroparea>
            </div>
            <div class="form-controls">
                <button type="button" class="lg primary" :disabled="filesToUpload.length <= 0"
                @click="$emit('goToNextScreen')">
                    <span>Next: Select fields to replace</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'uploadFilesScreen',
    props: [
        'filesToUpload',
    ],
    data: function () { return {
    }},
    computed: {
    },
    methods: {
        onFilesChange(fileList) {
            // Function that runs when we add new files to the droparea
            const files = fileList
            // Loop trough the files
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                // const extension = file.name.split('.').pop();

                // // Check that the file is of an accepted type
                // if (extension == 'csv' || extension == 'tsv') {
                    if (!this.filesToUpload.find(x => x.name == file.name)) {
                        this.$emit('addFileToUpload', file)
                    }
                // } else {
                //     // Throw error
                //     alert('Invalid file type for file: '+ file.name)
                // }
            }
        },
        removeFile(index) {
            this.$emit('removeFileToUpload', index)
        },
        // reset() {
        //     this.$refs.droparea.reset()
        // }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .upload-to-file-modal {
        .form-controls {
            display: flex;
            justify-content: flex-end;
            > :not(:last-child) {
                margin-right: 16px;
            }
        }
        .big-icon {
            font-size: 60px;
            margin: 32px 0 48px;
        }
        .files-wrapper {
            margin: 32px 0 32px;
            width: 100%;
            .file-to-upload {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                height: 40px;
                padding: 4px 4px 4px 8px;
                border: solid 1px $divider;
                border-radius: 4px;
                span {
                    color: $primary;
                }
                &:not(:last-child) {
                    margin-bottom: 4px;
                }
            }
        }
    }
    .map-fields {
        display: flex;
        justify-content: center;
        h3 {
            padding-left: 24px;
            margin: 48px 0 12px;
            i {
                margin-left: 8px;
            }
            &:hover {
                i {
                    color: $font;
                }
            }
        }
        table {
            tr {
                &.disabled {
                    .input-field {
                        opacity: .5;
                    }
                }
                .input-field {
                    width: 240px;
                }
            }
        }
        .link-ids {
            .map-fields-table {
                padding-left: 24px;
            }
        }
        .map-currencies {
            .single-currency-file-table {
                margin-bottom: 32px;
                td {
                    padding-right: 4px
                }
            }
            .currency-wrapper {
                margin-bottom: 32px;
                h4 {
                    padding-left: 28px;
                    margin-top: 0;
                    margin-bottom: 4px;
                }
                .currency-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    align-items: flex-end;
                    padding-left: 20px;
                     p {
                        padding-left: 24px;
                        .small {
                            font-size: 12px;
                        }
                    }
                }
                .input-field {
                    width: 240px;
                }
            }
        }
        .available-fields {
            margin-top: 116px;
            background: $grey2;
            border-radius: 4px;
            padding: 12px 4px 8px 8px;
            margin-left: 12px;
            .inner {
                max-height: 800px;
                overflow-y: auto;
                padding-right: 4px;
            }
            .fields-wrapper {
                margin-top: 12px;
            }
            .field {
                background: white;
                border-radius: 4px;
                height: 32px;
                line-height: 32px;
                padding: 0 8px;
                margin-top: 4px;
                width: 200px;
                white-space: nowrap;
            }
        }
        .form-controls {
            margin-top: 32px;
        }
    }

</style>