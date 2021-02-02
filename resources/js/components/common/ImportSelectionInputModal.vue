<template>
    <BaseModal class="import-selection-input-modal" header="Import Input" :show="show" @close="$emit('close')">
        <div class="form-wrapper">
            <div class="form-section">
                <h3>Where to import from?</h3>
                <div class="form-element" v-if="!loadingFiles">
                    <label>Choose file to import from</label>
                    <BaseDropdownInputField
                        type="radio"
                        :options="availableFiles"
                        v-model="selectedFile"
                        :descriptionKey="'parentName'"
                    />
                </div>
                <template v-if="!loadingSelections">
                    <div class="form-element">
                        <label>Choose selection to import from</label>
                        <BaseDropdownInputField
                            type="radio"
                            :options="availableSelections"
                            v-model="selectedSelection"
                        />
                    </div>
                    <div class="form-element"></div>
                </template>
            </div>
            <div class="form-section">
                <h3>What to do?</h3>
                <!-- <BaseTableV2>
                    <template v-slot:header>
                        <BaseTableHeader />
                        <BaseTableHeader>Copy</BaseTableHeader>
                        <BaseTableHeader>Convert</BaseTableHeader>
                    </template>
                    <BaseTableV2Row>
                        <td>Feedback</td>
                        <td><BaseCheckbox /></td>
                        <td><BaseCheckbox /></td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Alignment</td>
                        <td><BaseCheckbox /></td>
                        <td></td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Comment</td>
                        <td><BaseCheckbox /></td>
                        <td><BaseCheckbox /></td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Request</td>
                        <td><BaseCheckbox /></td>
                        <td></td>
                    </BaseTableV2Row>
                </BaseTableV2> -->
            </div>
            <BaseLoader v-if="loadingFiles || loadingSelections" msg="Loading" />
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'importSelectionInputModal',
    props: ['show'],
    data: function() {
        return {
            loadingSelections: false,
            loadingFiles: false,
            availableSelections: [],
            availableFiles: [],
            selectedFile: null,
            selectedSelection: null,
            importOptions: {
                FeedbackToFeedback: false,
                FeedbackToAlignment: false,
                CommentToComment: false,
                CommentToRequest: false,
                AlignmentToAlignment: false,
                RequestToRequest: false,
            },
        }
    },
    computed: {
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
    },
    watch: {
        selectedFile(newFile) {
            this.onNewFile()
        },
    },
    methods: {
        ...mapActions('files', ['fetchAllFiles']),
        ...mapActions('selections', ['fetchSelections']),
        async onNewFile() {
            this.loadingSelections = true
            const selections = await this.fetchSelections({ fileId: this.selectedFile.id, addToState: false })
            this.availableSelections = selections
            this.loadingSelections = false
        },
    },
    async created() {
        this.loadingFiles = true
        const files = await this.fetchAllFiles()
        // files.map(file => {
        //     file.parentName = file.parent ? file.parent.name : ''
        // })
        this.availableFiles = files
        this.loadingFiles = false
        this.selectedFile = this.currentFile
    },
}
</script>

<style></style>
