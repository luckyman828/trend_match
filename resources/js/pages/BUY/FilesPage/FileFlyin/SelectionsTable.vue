<template>
    <div class="selections-table" v-click-outside="rowClick">
        <BaseFlexTable
            class="flex-table-root"
            :contentStatus="readyStatus"
            :loadingMsg="loadingMsg"
            errorMsg="error loading selections"
            :errorCallback="() => initData()"
        >
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:right>
                        <div class="pill sm">
                            <span
                                ><strong>{{ allSelections.length }}</strong> selections</span
                            >
                        </div>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox
                        :value="selectedSelections.length > 0"
                        :modelValue="true"
                        @change="
                            checked => (checked ? (selectedSelections = [...allSelections]) : (selectedSelections = []))
                        "
                    />
                </BaseTableHeader>
                <BaseTableHeader class="expand"></BaseTableHeader>
                <BaseTableHeader class="title">Name</BaseTableHeader>
                <BaseTableHeader class="budget">Budget</BaseTableHeader>
                <BaseTableHeader class="currency">Currency</BaseTableHeader>
                <BaseTableHeader class="budget-spend">Spend</BaseTableHeader>
                <BaseTableHeader class="users">Users</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <div class="body">
                    <!-- Show Selections -->
                    <template v-if="getSelectionsTree.length > 0">
                        <SelectionsTableRow
                            v-for="selection in getSelectionsTree"
                            :key="selection.id"
                            :ref="'selection-row-' + selection.id"
                            :selection="selection"
                            :depth="0"
                            :path="[selection.id]"
                            :moveSelectionActive="moveSelectionActive"
                            :file="currentFile"
                            :selectionToEdit="selectionToEdit"
                            :selectedSelections="selectedSelections"
                            v-model="selectedSelections"
                            :focusId="focusSelection ? focusSelection.id : null"
                            @submitToEdit="clearToEdit"
                            @cancelToEdit="
                                clearUnsaved($event)
                                clearToEdit()
                            "
                            @showSelectionUsersContext="showSelectionUsersContext"
                            @showContext="showContextMenuSelection"
                            @endMoveSelection="endMoveSelection"
                            @showSettingsContext="showSettingsContext"
                            @onClick="rowClick"
                            @showSelectionCurrencyContext="showSelectionCurrencyContext"
                        />
                    </template>
                    <!-- No selections  -->
                    <template v-else>
                        <div class="setup-wrapper">
                            <!-- Admin -->
                            <template v-if="authUserWorkspaceRole == 'Admin'">
                                <button class="primary lg" @click="onShowCloneSetupContext">
                                    <i class="fas fa-clone"></i>
                                    <span>Copy Setup From Existing File</span>
                                </button>
                                <button class="primary ghost lg" @click="onNewSelection({ type: 'Master' })">
                                    <i class="fas fa-plus"></i>
                                    <span>Manually add new Master Selection</span>
                                </button>
                            </template>
                            <!-- No Access -->
                            <template v-else>
                                <h3>You don't have access to any selections in this file</h3>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can create new masters"
                        tooltip="Create a new Master"
                        @click="onNewSelection({ type: 'Master' })"
                    >
                        <i class="far fa-crown"></i><span>Add Master</span>
                    </BaseButton>
                </td>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="
                            authUserWorkspaceRole != 'Admin' || (getSelectionsTree.length != 1 && !focusSelection)
                        "
                        :disabledTooltip="
                            getSelectionsTree.length != 1 && !focusSelection
                                ? 'Selections cannot be made in the root'
                                : 'Only admins can create new selections'
                        "
                        tooltip="Create a new selection. Will be added under the currently focused selection."
                        @click="
                            onNewSelection({
                                type: 'Normal',
                                parent: focusSelection
                                    ? focusSelection
                                    : getSelectionsTree.length == 1
                                    ? getSelectionsTree[0]
                                    : null,
                            })
                        "
                    >
                        <i class="far fa-poll"></i><span>Add Selection</span>
                    </BaseButton>
                </td>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="
                            authUserWorkspaceRole != 'Admin' ||
                                (getSelectionsTree.length != 1 && !focusSelection) ||
                                (!!focusSelection && focusSelection.type != 'Master')
                        "
                        :disabledTooltip="
                            (getSelectionsTree.length != 1 && !focusSelection) ||
                            (!!focusSelection && focusSelection.type != 'Master')
                                ? 'Chapters must be children of a Master'
                                : 'Only admins can create new chapters'
                        "
                        tooltip="Create a new chapter. Will be added under the currently focused selection."
                        @click="
                            onNewSelection({
                                type: 'Chapter',
                                parent: focusSelection
                                    ? focusSelection
                                    : getSelectionsTree.length == 1
                                    ? getSelectionsTree[0]
                                    : null,
                            })
                        "
                    >
                        <i class="far fa-project-diagram"></i><span>Add Chapter</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuSelection" class="context-selection">
            <template v-slot v-if="!!contextSelection">
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-users"
                        :disabled="
                            !(
                                !contextSelection.is_presenting ||
                                (contextSelection.your_role == 'Owner' && contextSelection.type == 'Master')
                            )
                        "
                        disabledTooltip="Selection is in presentation mode. To join the presentation login to the Kollekt mobile app"
                        hotkey="KeyG"
                        @click="
                            $router.push({
                                name: 'selection',
                                params: { fileId: contextSelection.file_id, selectionId: contextSelection.id },
                            })
                        "
                    >
                        <span><u>G</u>o to selection </span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-pen"
                        hotkey="KeyR"
                        @click="selectionToEdit = { selection: contextSelection, field: 'name' }"
                    >
                        <u>R</u>ename
                    </BaseContextMenuItem>

                    <BaseContextMenuItem iconClass="far fa-plus" hotkey="KeyC">
                        <template>
                            <span><u>C</u>reate</span>
                        </template>

                        <template v-slot:submenu>
                            <div class="item-group">
                                <BaseContextMenuItem
                                    iconClass="far fa-poll"
                                    hotkey="KeyS"
                                    @click="onNewSelection({ parent: contextSelection, type: 'Normal' })"
                                >
                                    <span><u>S</u>election</span>
                                </BaseContextMenuItem>

                                <BaseContextMenuItem
                                    iconClass="far fa-project-diagram"
                                    hotkey="KeyC"
                                    :disabled="contextSelection.type != 'Master'"
                                    disabledTooltip="Can only create Master sub-selections on another Master selection"
                                    @click="onNewSelection({ parent: contextSelection, type: 'Chapter' })"
                                >
                                    <span><u>C</u>hapter</span>
                                </BaseContextMenuItem>
                            </div>
                        </template>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-user-cog"
                        hotkey="KeyM"
                        @click="showSelectionUsersContext({ selection: contextSelection, e: contextMouseEvent })"
                    >
                        <u>M</u>embers and Access
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-trash-alt"
                        hotkey="KeyD"
                        @click="onDeleteSelection(contextSelection, contextSelectionParent)"
                    >
                        <u>D</u>elete selection
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedSelections" class="context-selection">
            <template v-slot:header>
                <span>Choose action for {{ selectedSelections.length }} selections</span>
            </template>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="selectedSelections = []">
                    <span><u>C</u>lear Selected</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-cog"
                    hotkey="KeyS"
                    @click="showSettingsContext(contextMouseEvent, contextSelection)"
                >
                    <u>S</u>ettings
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-lock"
                    hotkey="KeyL"
                    @click="onToggleAllSelectionsLocked(selectedSelections)"
                >
                    <span><u>L</u>ock / Unlock</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-eye"
                    hotkey="KeyH"
                    @click="onToggleAllSelectionsVisibility(selectedSelections)"
                >
                    <span><u>H</u>ide / Unhide</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    hotkey="KeyD"
                    @click="onDeleteSelection(contextSelection, contextSelectionParent)"
                >
                    <u>D</u>elete selections
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuMove" class="context-move">
            <div
                class="item-group"
                v-if="
                    contextSelectionComponent &&
                        selectionToMove &&
                        !contextSelectionComponent.path.includes(selectionToMove.id)
                "
            >
                <BaseContextMenuItem
                    iconClass="far fa-arrow-left"
                    hotkey="KeyM"
                    @click="endMoveSelection(contextSelection, contextSelectionComponent)"
                >
                    <u>M</u>ove here
                </BaseContextMenuItem>
            </div>
            <div class="item-group" v-else-if="contextSelectionComponent && selectionToMove">
                <BaseContextMenuItem iconClass="far fa-exclamation-circle" :disabled="true">
                    <span>Cannot place inside self</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyC" @click="clearMoveSelection">
                    <u>C</u>ancel
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <div ref="moveSelectionIndicator" class="move-selection-indicator" :class="{ active: moveSelectionActive }">
            <span>Click selection to move to</span>
        </div>

        <BaseContextMenu ref="contextMenuCloneSetup" class="context-move">
            <template v-slot:header>
                <span>Select file to copy selections from</span>
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons
                        type="radio"
                        search="true"
                        :options="allFiles.filter(x => x.type == 'File' && x.id != currentFile.id)"
                        optionNameKey="name"
                        optionDescriptionKey="parentName"
                        v-model="fileToClone"
                        :submitOnChange="true"
                    />
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button
                            class="primary"
                            @click="
                                onClone(fileToClone)
                                slotProps.hide()
                            "
                        >
                            <span>Clone</span>
                        </button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;" @click="slotProps.hide()">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu
            v-if="contextSelection"
            ref="contextUsers"
            header="Add users to selection"
            v-model="selectedUsers"
            :options="users"
            optionNameKey="name"
            optionDescriptionKey="email"
            uniqueKey="id"
            :search="true"
            :loading="loadingUsers"
            submitText="Save users"
            @submit="onSaveUsers"
        />

        <BaseSelectButtonsContextMenu
            v-if="contextSelection"
            ref="contextCurrency"
            header="Change Selection Currency"
            v-model="contextSelection.currency"
            unsetOption="Clear"
            :unsetValue="null"
            type="radio"
            :options="availableCurrencies"
            :search="true"
            @submit="updateSelection(contextSelection)"
        />

        <BaseDialog
            ref="deleteSelectionDialog"
            type="confirm"
            :confirmText="selectedSelections.length > 1 ? 'Yes, delete them' : 'Yes, delete it'"
            :cancelText="selectedSelections.length > 1 ? 'No, keep them' : 'No, keep it'"
            confirmColor="red"
        >
            <div class="icon-graphic">
                <i class="far fa-poll primary lg"></i>
                <i class="far fa-arrow-right lg"></i>
                <i class="far fa-trash lg dark"></i>
            </div>
            <h3>
                Really delete {{ selectedSelections.length > 1 ? selectedSelections.length : 'this' }} selection{{
                    selectedSelections.length > 1 ? 's' : ''
                }}?
            </h3>
            <p>All input of the selection{{ selectedSelections.length > 1 ? 's' : '' }} will be permanently deleted.</p>
            <p><strong>Please beware:</strong> All sub-selections will be deleted as well.</p>
        </BaseDialog>

        <ChapterFilterModal
            :selection="contextSelection"
            :show="showChapterFilterModal"
            @close="showChapterFilterModal = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'
import ChapterFilterModal from './ChapterFilterModal'
import sortArray from '../../../../mixins/sortArray'

export default {
    name: 'selectionsTable',
    components: {
        SelectionsTableRow,
        ChapterFilterModal,
    },
    mixins: [sortArray],
    data: function() {
        return {
            focusSelection: null,
            showChapterFilterModal: false,
            loadingData: false,
            fileSelectionMagicLinkSent: false,
            selectedSelections: [],
            sortKey: null,
            selectionToEdit: null,
            contextSelection: null,
            contextSelectionComponent: null,
            contextSelectionParent: null,
            contextMouseEvent: null,
            moveSelectionActive: false,
            selectionToMove: null,
            selectionToMoveParent: null,
            fileToClone: null,
            cloningSetup: false,
            settingsSelections: [],
            selectedUsers: [],
            workspaceUsersFetched: false,
        }
    },
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('files', ['currentFile', 'files', 'allFiles', 'getCurrentFileChanged']),
        ...mapGetters('users', ['users']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('selections', [
            'getAuthUserHasSelectionEditAccess',
            'selections',
            'getSelectionsTree',
            'getSelectionsStatus',
            'getSelections',
        ]),
        allSelections() {
            return this.selections
        },
        readyStatus() {
            if (this.getSelectionsStatus == 'error') return 'error'
            if (this.getSelectionsStatus == 'loading' || this.cloningSetup || this.loadingData) return 'loading'
            return 'success'
        },
        loadingMsg() {
            if (this.cloningSetup) return 'Cloning selections'
            return 'Loading selections'
        },
    },
    watch: {
        currentFile(newVal, oldVal) {
            this.initData(true)
        },
    },
    methods: {
        ...mapActions('selections', [
            'fetchSelections',
            'createSelectionTree',
            'insertSelection',
            'updateSelection',
            'addTeamsToSelection',
            'addUsersToSelection',
            'fetchSelection',
            'deleteSelection',
            'sendSelectionLink',
            'getSelectionLink',
        ]),
        ...mapMutations('selections', ['insertSelections', 'DELETE_SELECTION']),
        ...mapActions('presentation', ['fetchFilePresentations']),
        ...mapActions('files', ['fetchAllFiles', 'cloneFileSelections']),
        ...mapActions('users', ['fetchUsers']),
        ...mapMutations('files', ['SET_CURRENT_FILE_CHANGED']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async initData(forceRefresh) {
            if (
                forceRefresh ||
                this.getCurrentFileChanged ||
                (this.getSelectionsStatus != 'success' && this.getSelectionsStatus != 'loading')
            ) {
                this.loadingData = true
                await Promise.all([
                    this.fetchSelections({ fileId: this.currentFile.id }),
                    this.fetchFilePresentations(this.currentFile.id),
                ])
                this.SET_CURRENT_FILE_CHANGED(false)
                this.loadingData = false
            }
        },
        async onGetSelectionLink(selectionId) {
            const link = await this.getSelectionLink({ selectionId })
            this.copyToClipboard(link)
            this.SHOW_SNACKBAR({
                msg: 'Link copied',
                iconClass: 'fa-clipboard-check',
                type: 'success',
            })
        },
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.getSelectionsTree, sortAsc, sortKey)
        },
        rowClick(e, component) {
            if (!component) {
                this.focusSelection = null
                return
            }
            const selection = component.selection
            this.focusSelection = this.focusSelection && this.focusSelection.id == selection.id ? null : selection
            this.contextSelectionComponent = component
            if (this.moveSelectionActive) {
                e.stopPropagation()
                this.endMoveSelection(selection, component)
            }
        },
        async showSettingsContext(e, selection) {
            if (this.contextSelection) {
                this.contextSelection = selection
                Vue.set(this.contextSelection, selection)
            } else {
                this.contextSelection = selection
            }

            const contextMenu = this.$refs.contextMenuSettings

            // If the parsed selection is part of the selected selection, edit settings for all of them
            if (this.selectedSelections.find(x => x.id == selection.id)) {
                this.settingsSelections = this.selectedSelections
            }

            // If the parsed selection is not part of the selected selections, only display settings for that one
            else {
                this.settingsSelections = [selection]
            }

            // this.contextSelection = selection
            // Position the contextual menu
            this.$nextTick(() => {
                contextMenu.show(e)
            })
        },
        onSaveUsers(newUsers) {
            const oldUsers = this.contextSelection.users
            const usersToAdd = newUsers.filter(newUser => !oldUsers.find(oldUser => oldUser.id == newUser.id))
            const usersToRemove = oldUsers.filter(oldUser => !newUsers.find(newUser => newUser.id == oldUser.id))
            console.log('on save users', usersToAdd, usersToRemove)
        },
        showSelectionCurrencyContext({ selection, e }) {
            this.contextSelection = selection
            this.$nextTick(() => {
                this.$refs.contextCurrency.show(e)
            })
        },
        async showSelectionUsersContext({ selection, e }) {
            this.contextSelection = selection
            this.$nextTick(() => {
                this.$refs.contextUsers.show(e)
            })
            this.loadingUsers = true
            const selectionWithUsers = await this.fetchSelection({ selectionId: selection.id, addToState: false })
            this.selectedUsers = selectionWithUsers.users.slice()
            // If we have not and are not fetching the users then fetch them
            if (!this.workspaceUsersFetched) {
                await this.fetchUsers()
                this.workspaceUsersFetched = true
            }

            this.loadingUsers = false
        },
        showContextMenuSelection(e, selection, component, parent) {
            if (!this.getAuthUserHasSelectionEditAccess(selection)) return
            e.preventDefault()
            // Set the current context menu item
            if (this.selectedSelections.length > 0) {
                this.contextSelection = this.selectedSelections[0]
            } else {
                this.contextSelection = selection
            }
            this.contextSelectionComponent = component
            this.contextSelectionParent = parent
            // Save a reference to the clicked element
            this.contextMouseEvent = e

            // Show the move context instead if we are in the proces of moving something
            if (this.moveSelectionActive) {
                this.showContextMenuMove(e)
            } else {
                let selectionContext = this.$refs.contextMenuSelection
                if (this.selectedSelections.length > 1) {
                    selectionContext = this.$refs.contextMenuSelectedSelections
                }
                // Position the contextual menu
                selectionContext.show(e)
            }
        },
        onShowChapterFilterModal(selection) {
            this.showChapterFilterModal = true
            this.contextSelection = selection
        },
        onMoveSelection(selection, parent) {
            this.selectionToMove = selection
            this.selectionToMoveParent = parent
            this.moveSelectionActive = true

            // Add event listener to listen for mousemove
            document.addEventListener('mousemove', this.moveSelectionMouseFollowHandler)
            // Call the event handler to set the initial position
            this.moveSelectionMouseFollowHandler(this.contextMouseEvent)
            // Add event listener to listen for right clicks to show a special context menu
            document.addEventListener('contextmenu', this.moveSelectionClickHandler)
        },
        endMoveSelection(selection, component) {
            if (this.moveSelectionActive) {
                // Add the selection to the selected selection
                selection.children.push(this.selectionToMove)

                // Remove the selection from it's old position
                const parent = this.selectionToMoveParent
                if (parent) {
                    const index = parent.children.findIndex(x => x.id == this.selectionToMove.id)
                    parent.children.splice(index, 1)
                } else {
                    const index = this.getSelectionsTree.findIndex(x => x.id == this.selectionToMove.id)
                    this.getSelectionsTree.splice(index, 1)
                }

                // Remove event listener to listen for mousemove
                document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
                // Remove event listener to listen for right clicks to show a special context menu
                document.removeEventListener('contextmenu', this.moveSelectionClickHandler)

                // --- Send request to API --- //

                // Reset the selection to move
                this.clearMoveSelection()
            }
        },
        clearMoveSelection() {
            // Reset the selection to move
            this.selectionToMove = null
            this.selectionToMoveParent = null
            this.moveSelectionActive = false
        },
        moveSelectionMouseFollowHandler(e) {
            const el = this.$refs.moveSelectionIndicator
            el.style.left = `${e.clientX + 20}px`
            el.style.top = `${e.clientY}px`
        },
        moveSelectionClickHandler(e) {
            this.contextSelection = null
            this.contextSelectionParent = null
            this.contextSelectionComponent = null
            this.showContextMenuMove(e)
        },
        showContextMenuMove(e) {
            e.preventDefault()
            e.stopPropagation()
            const moveContext = this.$refs.contextMenuMove
            this.contextMouseEvent = e
            // Position the contextual menu
            moveContext.show(e)
        },
        async onNewSelection({ parent, type }) {
            // First check that we don't already have an unsaved new selection
            if (this.getSelectionsTree.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                file_id: this.currentFile.id,
                name: type == 'Master' ? 'New Master' : type == 'Chapter' ? 'New Chapter' : 'New Selection',
                type,
                currency: null,
                user_count: 0,
                team_count: 0,
                children: [],
                visible_from: null,
                visible_to: null,
                open_from: null,
                open_to: null,
                completed_at: null,
                your_role: null,
                is_presenting: null,
                budget: 0,
                budget_spend: 0,
            }
            // Push new selection to the parent
            if (parent) {
                // If we are creating a sbu selection
                newSelection.parent_id = parent.id
                // Instantiate a children array on the parent
                if (!parent.children) {
                    this.$set(parent, 'children', [])
                }
                // parent.children.push(newSelection)
                this.insertSelections({ selections: [newSelection], method: 'add' })
            } else {
                // If no parent, we are creating a new master
                newSelection.parent_id = 0
                // this.selections.push(newSelection)
                this.insertSelections({ selections: [newSelection], method: 'add' })
            }
            // Wait for changes to the dom to take effect
            this.$nextTick(() => {
                // Activate title edit of new folder
                this.selectionToEdit = { selection: newSelection, field: 'name' }
            })
        },
        async onDeleteSelection(selection) {
            // Send request to API
            if (await this.$refs.deleteSelectionDialog.confirm()) {
                // If we have a selection, delete all those selections
                if (this.selectedSelections.length > 1) {
                    for (const selectionToDelete of this.selectedSelections) {
                        // Check that the selction still exists on the file
                        if (!this.selections.find(x => x.id == selectionToDelete.id)) continue
                        await this.deleteSelection(selectionToDelete)
                    }
                    // Reset the selected selections
                    this.selectedSelections = []
                }
                // If we don't have a selection just delete the provided selection
                else {
                    this.deleteSelection(selection)
                }
            }
        },
        clearToEdit() {
            // Clear the current edit
            this.selectionToEdit = null
        },
        clearUnsaved({ selection, parent }) {
            // Check if the selection is saved
            if (!selection.id) {
                this.DELETE_SELECTION(selection)
            }
        },
        async onShowCloneSetupContext(e) {
            // Check if we alreday fetched all files -> else fetch them
            // if (this.allFiles.length <= 0) {
            await this.fetchAllFiles()
            // }
            const contextMenu = this.$refs.contextMenuCloneSetup
            contextMenu.show(e)
        },
        async onClone(file) {
            this.cloningSetup = true
            await this.cloneFileSelections({ destination: this.currentFile, from: file })
            this.cloningSetup = false
            // Force refresh the data, to fetch the cloned selections
            this.initData(true)
        },
        onSendSelectionLink(selection) {
            let selectionsToPost = [selection]
            this.sendSelectionLink({ selectionList: selectionsToPost })
            Vue.set(selection, 'selectionLinkSent', true)
        },
        onToggleAllSelectionsLocked(selections) {
            let makeLocked = null
            selections.map(selection => {
                if (selection.is_presenting) return
                let hasChange = false
                if (makeLocked == null) makeLocked = selection.is_open
                // Check if the selection is locked
                if (makeLocked && !selection.is_open) return
                if (!makeLocked && selection.is_open) return

                if (makeLocked) {
                    selection.open_from = new Date('9999')
                    selection.open_to = null
                    hasChange = true
                } else {
                    selection.open_from = null
                    selection.open_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
        onToggleAllSelectionsVisibility(selections) {
            // Use the first selection to determine if we are opening or closing all
            let makeHidden = null
            selections.map(selection => {
                if (selection.is_presenting) return
                if (makeHidden == null) makeHidden = selection.is_visible
                let hasChange = false

                if (makeHidden && !selection.is_visible) return
                if (!makeHidden && selection.is_visible) return
                // Check if the selection is visible
                if (makeHidden) {
                    // Set To to now
                    selection.visible_from = new Date('9999')
                    selection.visible_to = null
                    hasChange = true
                } else {
                    selection.visible_from = null
                    selection.visible_to = null
                    hasChange = true
                }
                if (hasChange) this.updateSelection(selection)
            })
        },
        onSendMagicLinkToAll() {
            this.fileSelectionMagicLinkSent = true
            this.sendSelectionLink({ selectionList: this.getSelections })
        },
    },
    created() {
        this.initData()
    },
    destroyed() {
        document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.selections-table {
    // Target child style
    ::v-deep {
        .flex-table tr:not(.table-top-bar) > * {
            flex: 0 1 auto;
        }
        tr {
            > * {
                &.locked {
                    // Title
                    min-width: 16px;
                    max-width: 16px;
                    margin: 0;
                    i {
                        margin: 0;
                    }
                }
                &.expand {
                    // Title
                    min-width: 48px;
                    max-width: 48px;
                }
                &.title {
                    // Title
                    min-width: 220px;
                    max-width: 220px;
                }
                &.teams {
                    margin-left: auto;
                }
                &.budget {
                    min-width: 100px;
                    max-width: 100px;
                    margin-left: auto;
                    text-align: right;
                }
                &.budget-spend {
                    min-width: 64px;
                    max-width: 64px;
                    text-align: right;
                    padding-right: 8px;
                }
                &.currency {
                    min-width: 100px;
                    max-width: 100px;
                    // margin-left: auto;
                }
                &.teams,
                &.users {
                    min-width: 76px;
                    max-width: 76px;
                }
                &.status {
                    // Status
                    min-width: 156px;
                    max-width: 156px;
                    margin-left: auto;
                    // display: flex;
                    // align-items: center;
                    // > *:not(:first-child) {
                    //     margin-left: 4px;
                    // }
                }
                &.presentation {
                    min-width: 116px;
                    max-width: 116px;
                    margin-left: auto;
                }
                // &.items, &.in, &.out, &.nd {
                //     min-width: 72px;
                //     max-width: 72px;
                // }
                &.action {
                    // Actions
                    min-width: 112px;
                    max-width: 112px;
                    margin-left: auto;
                }
            }
            // > td {
            //     &.budget {
            //         text-align: right;
            //     }
            // }
        }
    }
}
.move-selection-indicator {
    position: fixed;
    display: none;
    background: white;
    padding: 2px 8px;
    box-shadow: 0 3px 8px rgba($dark, 0.2);
    font-weight: 700;
    border-radius: 4px;
    &.active {
        display: block;
    }
}
.setup-wrapper {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: white;
    margin-bottom: 2px;
    button {
        width: 280px;
    }
    > *:not(:last-child) {
        margin-bottom: 24px;
    }
}
</style>
