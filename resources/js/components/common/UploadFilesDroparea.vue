<template>
    <div class="upload-drop-area">
        <BaseDroparea 
            :multiple="multiple" 
            :accept="accept"
            ref="droparea"
            @input="onFilesChange"
        >
            <template v-slot="slotProps">
                <strong>{{msg ? msg : 'Drop your file(s) here or click to upload'}}</strong>
                <template v-if="!fileList || fileList.length < 1">
                    <i class="big-icon primary" :class="iconClass"></i>
                    <button type="button" class="dark md" @click="slotProps.activate">
                        <i class="far fa-file-csv"></i>
                        <span>Browse files</span>
                    </button>
                </template>
                <template v-else>
                    <div class="files-wrapper">
                        <div class="file-to-upload" v-for="(file, index) in fileList" :key="index">
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
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'uploadFilesDroparea',
    props: [
        'msg',
        'accept',
        'multiple',
        'iconClass',
        'fileList',
        'acceptedExtensions',
    ],
    data: function() { return {
    }},
    computed: {
        localFileList: {
            get() {
                return this.fileList
            },
            set(value) {
                this.$emit('update:fileList', value)
            }
        }
    },
    methods: {
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onFilesChange(fileList) {
            const files = fileList
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const extension = file.name.split('.').pop();

                // Check that the file is a csv
                if (this.acceptedExtensions.includes(extension)) {
                    if (!this.localFileList.find(x => x.name == file.name)) {
                        this.localFileList.push(file)
                    }
                } else {
                    this.SHOW_SNACKBAR({
                        msg: 'Invalid file type',
                        type: 'warning', 
                        iconClass: 'fa-exclamation-triangle',
                    })

                }
            }
        },
        removeFile(index){
            this.localFileList.splice(index, 1)
        }

    }

}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

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
</style>