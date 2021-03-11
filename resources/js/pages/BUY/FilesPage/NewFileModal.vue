<template>
    <BaseModal :show="show" @close="$emit('close')" classes="sm">
        <div class="form-wrapper">
            <h3>Create new file</h3>
            <div class="form-element">
                <label>File name</label>
                <BaseInputField
                    v-model="fileName"
                    placeholder="New file name. Finish with ENTER"
                    :focusOnMount="true"
                    :selectOnFocus="true"
                    @submit="onSubmit"
                >
                    <button class="circle primary" @click="onSubmit">
                        <i class="far fa-arrow-right"></i>
                    </button>
                </BaseInputField>
            </div>
            <BaseCheckboxInputField class="form-element sm" v-model="viewNewFile">
                <span>View created file</span>
            </BaseCheckboxInputField>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'newFileModal',
    props: ['show'],
    data: function() {
        return {
            fileName: '',
        }
    },
    computed: {
        ...mapGetters('files', {
            folder: 'getCurrentFolder',
            getViewNewFile: 'getViewNewFile',
        }),
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
        }),
        viewNewFile: {
            get() {
                return this.getViewNewFile
            },
            set(val) {
                this.SET_VIEW_NEW_FILE(val)
            },
        },
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile']),
        ...mapMutations('files', ['INSERT_FILE', 'SET_VIEW_NEW_FILE']),
        async onSubmit() {
            const newFile = await this.onNewFile()
            if (this.viewNewFile) {
                this.$router.push({ name: 'buy.editFile', params: { fileId: newFile.id } })
            } else {
                this.$emit('close')
            }
        },
        async onNewFile() {
            const newFile = {
                id: 0,
                name: this.fileName.length > 0 ? this.fileName : 'New file',
                type: 'File',
                parent_id: this.folder ? this.folder.id : 0,
                workspace_id: this.workspace.id,
            }
            await this.insertOrUpdateFile({ file: newFile })
            this.fileName = ''
            return newFile
        },
    },
}
</script>

<style></style>
