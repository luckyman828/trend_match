<template>
    <div class="files-page">
        <Breadcrumbs />

        <h1 v-if="!currentFolder">Files</h1>
        <h1 v-else>{{ currentFolder.name }}</h1>

        <FilesTable
            @setCurrentFolder="onSetCurrentFolder"
            @showSingleFile="showSingleFile"
            @showFileOwnersFlyin="showFileOwnersFlyin"
        />

        <FileFlyin
            :file="currentFile"
            :show="getFileFlyinIsVisible"
            @close="SET_FILE_FLYIN_VISIBLE(false)"
            @showFileOwnersFlyin="showFileOwnersFlyin"
            @showFileApproversFlyin="showFileApproversFlyin"
        />

        <!-- <FileOwnersFlyin :file="currentFile" :show="fileOwnersFlyinVisible" @close="fileOwnersFlyinVisible = false"/> -->

        <!-- <FileApproversFlyin :file="currentFile" :show="fileApproversFlyinVisible" @close="fileApproversFlyinVisible = false"/> -->
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FilesTable from './FilesTable'
import FileFlyin from './FileFlyin'
import FileOwnersFlyin from '../../components/FileOwnersFlyin'
import FileApproversFlyin from '../../components/FileApproversFlyin'
import Breadcrumbs from '../../components/common/Breadcrumbs'

export default {
    name: 'filesPage',
    components: {
        FilesTable,
        FileFlyin,
        FileOwnersFlyin,
        FileApproversFlyin,
        Breadcrumbs,
    },
    data: function() {
        return {
            fileOwnersFlyinVisible: false,
            fileApproversFlyinVisible: false,
        }
    },
    computed: {
        ...mapGetters('files', [
            'files',
            'currentFile',
            'currentFolder',
            'currentFolderId',
            'getCurrentFilePath',
            'getFileFlyinIsVisible',
        ]),
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
    },
    methods: {
        ...mapActions('files', ['setCurrentFolder', 'fetchFile', 'fetchFolder']),
        ...mapMutations('files', ['SET_CURRENT_FILE', 'SET_FILE_FLYIN_VISIBLE']),
        showSingleFile(file) {
            // Set the current file id
            this.SET_CURRENT_FILE(file)
            // Show the flyin
            this.SET_FILE_FLYIN_VISIBLE(true)
        },
        showFileOwnersFlyin(file) {
            // Set the current file id
            this.SET_CURRENT_FILE(file)
            this.fileOwnersFlyinVisible = true
        },
        showFileApproversFlyin(file) {
            // Set the current file id
            this.SET_CURRENT_FILE(file)
            this.fileApproversFlyinVisible = true
        },
        onSetCurrentFolder(folder) {
            this.setCurrentFolder(folder)
        },
    },
    async created() {
        console.log('created files page')
        // If the route has a fileId param set, then show that file in a flyin and set the current folder to the files parent
        const routeFileId = this.$route.params.fileId
        if (routeFileId) {
            // Set the file as current file
            // Check if we already have the file fetched as current
            let file
            if (!this.currentFile || this.currentFile.id != routeFileId) {
                file = await this.fetchFile(routeFileId)
            } else {
                file = this.currentFile
            }
            // Show the file flyin
            this.showSingleFile(file)
        }
        const routeFolderId = this.$route.params.folderId
        if (routeFolderId && routeFolderId != 0) {
            const folder = await this.fetchFolder(routeFolderId)
            this.setCurrentFolder(folder)
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
h1 {
    margin-bottom: 16px;
}
.underline {
    width: 100%;
    border-bottom: solid 2px $light2;
    margin-bottom: 20px;
}
.filters {
    display: flex;
    justify-content: space-between;
}
.item-filter-button {
    min-width: 120px;
    background: $light2;
}
</style>
