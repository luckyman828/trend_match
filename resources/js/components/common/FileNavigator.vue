<template>
    <div class="file-navigator">
        <div class="location">
            <button
                v-if="folder && folder.id != workspace.id"
                class="invisible ghost-hover"
                @click="setFolder(folder.parent_id)"
            >
                <i class="fas fa-arrow-left"></i>
            </button>
            <span v-if="folder && folder.id != workspace.id">{{ folder.name }}</span>
            <span v-else>
                <span class="square invisible"><i class="far fa-building"></i></span> {{ workspace.title }}</span
            >
        </div>
        <div class="folders-wrapper">
            <template v-for="folderItem in folderContents.filter(x => x.id != disabledId)">
                <div
                    v-if="folderItem.type == 'Folder'"
                    class="folder-item folder"
                    :key="folderItem.id"
                    @click="setFolder(folderItem.id)"
                >
                    <i class="fas fa-folder"></i>
                    <span>{{ folderItem.name }}</span>
                </div>
                <div v-else class="folder-item file" :key="folderItem.id" @click="setSelectedFile(folderItem)">
                    <i class="fas fa-file" :class="{ primary: selectedFiles.find(x => x.id == folderItem.id) }"></i>
                    <span>{{ folderItem.name }}</span>
                </div>
            </template>
            <p v-if="folderContents.length <= 0">It's empty here..</p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'fileNavigator',
    props: ['initialFolderId', 'disabledId', 'selectFile'],
    data: function() {
        return {
            folder: null,
            folderContents: [],
            selectedFiles: [],
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            workspace: 'currentWorkspace',
        }),
    },
    methods: {
        ...mapActions('files', ['fetchFiles', 'fetchFolderContent', 'fetchFolder']),
        setSelectedFile(file) {
            if (!this.selectFile) return
            if (this.selectFile == 'multiple') {
                const index = this.selectedFiles.findIndex(x => x.id == file.id)
                if (index >= 0) {
                    this.selectedFiles.splice(index, 1)
                } else {
                    this.selectedFiles.push(file)
                }
                this.$emit('input', this.selectedFiles)
            } else {
                this.selectedFiles.splice(0, 1)
                this.selectedFiles.push(file)
                this.$emit('input', this.selectedFiles[0])
            }
        },
        async setFolder(folderId) {
            // If there is no folder ID, then set the destination to the workspace
            if (folderId == 0 || !folderId) {
                this.folder = { id: this.workspace.id, parent_id: null, name: this.workspace.title }
                this.folderContents = await this.fetchFiles(false)
            } else {
                this.folder = await this.fetchFolder(folderId)
                this.folderContents = await this.fetchFolderContent(folderId)
            }
            this.$emit('update:folder', this.folder)
        },
    },
    created() {
        this.setFolder(this.initialFolderId)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.file-navigator {
    .folders-wrapper {
        display: block;
        min-height: 40px;
        border: solid 1px #f3f3f3;
        // color: #3c3b54;
        border-radius: 4px;
        padding: 4px 12px;
        background: $bgContent;
        width: 100%;
    }
    .folder-item {
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
        i {
            margin-right: 8px;
            width: 12px;
        }
        &:not(:last-child) {
            margin-bottom: 8px;
        }
        &:hover {
            font-weight: 500;
            background: $bgContentAlt;
            i {
                color: $darkAlt;
            }
        }
        .disabled {
            pointer-events: none;
            cursor: default;
        }
    }
}
</style>
