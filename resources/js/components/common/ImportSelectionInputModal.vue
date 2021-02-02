<template>
    <BaseModal
        class="import-selection-input-modal"
        header="Import Input"
        :subHeader="`To: ${currentSelection ? currentSelection.name : ''}`"
        :show="show"
        @close="$emit('close')"
    >
        <div class="form-wrapper" v-if="!isSubmitting">
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
                            descriptionKey="chapterName"
                        />
                    </div>
                    <div class="form-element"></div>
                </template>
                <BaseLoader v-if="loadingFiles || loadingSelections" msg="Loading" />
            </div>
            <div class="form-section">
                <h3>What to do?</h3>
                <BaseTableV2>
                    <template v-slot:header>
                        <BaseTableHeader />
                        <BaseTableHeader class="center">Copy</BaseTableHeader>
                        <BaseTableHeader class="center"
                            >Convert
                            <i
                                class="far fa-info-circle"
                                v-tooltip="'Convert feedback to alignment, or comments to requests/tickets.'"
                            ></i
                        ></BaseTableHeader>
                    </template>
                    <BaseTableV2Row>
                        <td>Feedback</td>
                        <td class="center">
                            <BaseCheckbox
                                :value="true"
                                v-model="importOptions.FeedbackToFeedback"
                                @change="importOptions.FeedbackToAlignment = false"
                            />
                        </td>
                        <td class="center">
                            <BaseCheckbox
                                :value="true"
                                v-model="importOptions.FeedbackToAlignment"
                                @change="importOptions.FeedbackToFeedback = false"
                            />
                        </td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Alignment</td>
                        <td class="center">
                            <BaseCheckbox :value="true" v-model="importOptions.AlignmentToAlignment" />
                        </td>
                        <td class="center"></td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Comment</td>
                        <td class="center">
                            <BaseCheckbox
                                :value="true"
                                v-model="importOptions.CommentToComment"
                                @change="importOptions.CommentToRequest = false"
                            />
                        </td>
                        <td class="center">
                            <BaseCheckbox
                                :value="true"
                                v-model="importOptions.CommentToRequest"
                                @change="importOptions.CommentToComment = false"
                            />
                        </td>
                    </BaseTableV2Row>
                    <BaseTableV2Row>
                        <td>Requests / Tickets</td>
                        <td class="center"><BaseCheckbox :value="true" v-model="importOptions.RequestToRequest" /></td>
                        <td class="center"></td>
                    </BaseTableV2Row>
                </BaseTableV2>
            </div>
            <div class="form-section" v-if="userIsRequired">
                <h3>What user?</h3>
                <template v-if="!loadingSelections">
                    <div class="form-element">
                        <label>Choose user to import from</label>
                        <BaseDropdownInputField type="radio" :options="availableUsers" v-model="selectedUser" />
                    </div>
                    <div class="form-element"></div>
                </template>
                <BaseLoader v-else msg="Loading Users" />
            </div>
            <BaseButton
                class="full-width"
                buttonClass="primary lg full-width"
                :disabled="!selectedSelection || (userIsRequired && !selectedUser)"
                @click="onSubmit"
            >
                <span>Do it!</span>
            </BaseButton>
        </div>
        <BaseLoader v-else msg="Importing.." />
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'importSelectionInputModal',
    props: ['show', 'destinationSelection'],
    data: function() {
        return {
            loadingSelections: false,
            loadingFiles: false,
            loadingUsers: false,
            availableSelections: [],
            availableFiles: [],
            availableUsers: [],
            selectedFile: null,
            selectedSelection: null,
            selectedUser: null,
            importOptions: {
                FeedbackToFeedback: false,
                FeedbackToAlignment: false,
                CommentToComment: false,
                CommentToRequest: false,
                AlignmentToAlignment: false,
                RequestToRequest: false,
            },
            isSubmitting: false,
        }
    },
    computed: {
        ...mapGetters('files', {
            currentFile: 'getCurrentFile',
        }),
        ...mapGetters('selections', ['getSelectionChapter', 'getCurrentSelection']),
        userIsRequired() {
            return this.importOptions.CommentToRequest || this.importOptions.FeedbackToAlignment
        },
        currentSelection() {
            return this.destinationSelection ? this.destinationSelection : this.getCurrentSelection
        },
    },
    watch: {
        selectedFile(newFile) {
            if (newFile) this.onNewFile()
        },
        selectedSelection(newSelection) {
            if (newSelection) this.onNewSelection()
        },
    },
    methods: {
        ...mapActions('files', ['fetchAllFiles']),
        ...mapActions('selections', ['fetchSelections', 'initSelections', 'fetchSelection', 'importSelectionInput']),
        async onNewFile() {
            this.selectedSelection = null
            this.loadingSelections = true
            const selections = await this.fetchSelections({ fileId: this.selectedFile.id, addToState: false })
            selections.map(selection => {
                const chapter = this.getSelectionChapter(selection)
                selection.chapterName = chapter ? chapter.name : ''
            })
            if (this.selectedFile.id == this.currentFile.id) {
                this.selectedSelection = selections.find(selection => selection.id == this.currentSelection.id)
            }
            this.availableSelections = selections
            this.loadingSelections = false
        },
        async onNewSelection() {
            this.selectedUser = null
            this.loadingUsers = true
            const selection = await this.fetchSelection({ selectionId: this.selectedSelection.id, addToState: false })
            this.availableUsers = selection.users.filter(user => user.role == 'Member')
            this.loadingUsers = false
        },
        async onSubmit() {
            this.isSubmitting = true
            await this.importSelectionInput({
                destinationSelection: this.currentSelection,
                sourceSelection: this.selectedSelection,
                sourceUser: this.selectedUser,
                importOptions: this.importOptions,
            })
            this.isSubmitting = false
            this.$emit('close')
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
