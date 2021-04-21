<template>
    <BaseModal :show="show" @close="$emit('close')" classes="sm">
        <div class="form-wrapper">
            <h3>Create new folder</h3>
            <div class="form-element">
                <label>Folder name</label>
                <BaseInputField
                    v-model="fileName"
                    placeholder="New folder name. Finish with ENTER"
                    :focusOnMount="true"
                    :selectOnFocus="true"
                    @submit="onSubmit"
                >
                    <button class="circle primary" @click="onSubmit">
                        <i class="far fa-arrow-right"></i>
                    </button>
                </BaseInputField>
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'newFolderModal',
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
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile']),
        ...mapMutations('files', ['INSERT_FILE']),
        async onSubmit() {
            const newFile = await this.onNewFile()
            this.$emit('close')
        },
        async onNewFile() {
            const newFile = {
                id: 0,
                name: this.fileName.length > 0 ? this.fileName : 'New folder',
                type: 'Folder',
                parent_id: this.folder ? this.folder.id : 0,
                workspace_id: this.workspace.id,
            }
            await this.insertOrUpdateFile({ file: newFile })
            this.fileName = ''
        },
    },
}
</script>

<style></style>
