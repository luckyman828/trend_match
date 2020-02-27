<template>
    <div class="selections-table">
        <BaseFlexTable class="flex-table-root">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:right>
                        <span>{{selections.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="expand"></BaseTableHeader>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" @sort="onSort">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'items'" :currentSortKey="sortKey" @sort="onSort">Items</BaseTableHeader>
                <BaseTableHeader :sortKey="'in'" :currentSortKey="sortKey" @sort="onSort">In</BaseTableHeader>
                <BaseTableHeader :sortKey="'out'" :currentSortKey="sortKey" @sort="onSort">Out</BaseTableHeader>
                <BaseTableHeader :sortKey="'nd'" :currentSortKey="sortKey" @sort="onSort">ND</BaseTableHeader>
                <BaseTableHeader :sortKey="'team_count'" :currentSortKey="sortKey" @sort="onSort">Teams</BaseTableHeader>
                <BaseTableHeader :sortKey="'user_count'" :currentSortKey="sortKey" @sort="onSort">Users</BaseTableHeader>
                <BaseTableHeader :sortKey="'status'" :currentSortKey="sortKey" @sort="onSort">Status</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <div class="body">
                    <SelectionsTableRow :ref="'selection-row-'+selection.id" v-for="selection in selections" :key="selection.id"
                    :selection="selection" :depth="0" :path="[selection.id]" :moveSelectionActive="moveSelectionActive" :file="currentFile"
                    :selectionToEdit="selectionToEdit" :isMaster="true"
                    @submitToEdit="clearToEdit" @cancelToEdit="clearUnsaved($event);clearToEdit()"
                    @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin',$event)" @showContext="showContextMenuSelection"
                    @endMoveSelection="endMoveSelection" @showOptionsContext="showOptionsContext" @onClick="rowClick"/>
                </div>
            </template>
            <template v-slot:footer>
                <td><button class="primary invisible" @click="onNewSelection()"><i class="far fa-plus"></i><span>Add new: Master Selection</span></button></td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuSelection" class="context-selection">
            <div class="item-group">
                <div class="item" @click="$router.push({name: 'selection', params: {fileId: contextSelection.file_id, selectionId: contextSelection.id}})">
                    <div class="icon-wrapper">
                        <i class="far fa-users"></i>
                    </div>
                    <u>G</u>o to selection 
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="selectionToEdit = {selection: contextSelection, field: 'name'}">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>ename
                </div>
                <div class="item" @click="$emit('showSelectionUsersFlyin', contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-user-cog"></i></div>
                    <u>M</u>embers and Access
                </div>
                <div class="item" @click.stop="showOptionsContext(contextMouseEvent, contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-cog"></i></div>
                    <u>S</u>ettings
                </div>
                <div class="item" @click="onNewSelection(contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-plus"></i></div>
                    <u>C</u>reate sub-selection
                </div>
                <div class="item" v-if="contextSelection && !contextSelection.master"
                @click="onMoveSelection(contextSelection, contextSelectionParent)">
                    <div class="icon-wrapper"><i class="far fa-file"><i class="fas fa-long-arrow-alt-right"></i></i></div>
                    <u>M</u>ove selection
                </div>
            </div>
            <div class="item-group" @click="onDeleteSelection(contextSelection, contextSelectionParent)">
                <div class="item">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>D</u>elete selection
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuMove" class="context-move">
            <div class="item-group" v-if="contextSelectionComponent && selectionToMove && !contextSelectionComponent.path.includes(selectionToMove.id)"
            @click="endMoveSelection(contextSelection, contextSelectionComponent)">
                <div class="item">
                    <div class="icon-wrapper">
                        <i class="far fa-arrow-left"></i>
                    </div>
                    <u>M</u>ove here
                </div>
            </div>
            <div class="item-group" v-else-if="contextSelectionComponent && selectionToMove">
                <div class="item disabled">
                    <div class="icon-wrapper">
                        <i class="far fa-exclamation-circle"></i>
                    </div>
                    Cannot place inside self
                </div>
            </div>
            <div class="item-group" @click="clearMoveSelection">
                <div class="item">
                    <div class="icon-wrapper"><i class="far fa-times"></i></div>
                    <u>C</u>ancel
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuOptions" class="context-options" columns="4">
            <template v-slot:header v-if="contextSelection">
                Settings for {{contextSelection.name}}
            </template>
            <template v-slot="slotProps">
                <div class="columns">
                    <div class="item-group">
                        <strong class="header">Comments</strong>
                        <BaseSelectButtons header="Broadcast" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors', 'siblings']"
                        v-model="contextSelection.options.comments.broadcast" :submitOnChange="true"/>
                        <BaseSelectButtons header="Listen" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.comments.listen" :submitOnChange="true"/>
                        <BaseSelectButton header="Anomyze comments" class="item-wrapper" label="Anonymize" :value="contextSelection.options.comments.anonymize" 
                        v-model="contextSelection.options.comments.anonymize"/>
                    </div>
                    <div class="item-group">
                        <strong class="header">Requests</strong>
                        <BaseSelectButtons header="Broadcast" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.requests.broadcast" :submitOnChange="true"/>
                        <BaseSelectButtons header="Listen" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.requests.listen" :submitOnChange="true"/>
                    </div>
                    <div class="item-group">
                        <strong class="header">Actions</strong>
                        <BaseSelectButtons header="Broadcast" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.actions.broadcast" :submitOnChange="true"/>
                        <BaseSelectButtons header="Listen" :type="'checkbox'" :options="['all','children','descendants','parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.actions.listen" :submitOnChange="true"/>
                        <BaseSelectButton header="Anomyze actions" class="item-wrapper" label="Anonymize" :value="contextSelection.options.actions.anonymize" 
                        v-model="contextSelection.options.actions.anonymize"/>
                    </div>
                    <div class="item-group">
                        <strong class="header">Feedback</strong>
                        <BaseSelectButtons header="Broadcast" :type="'checkbox'" :options="['all','children','descendants', 'parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.feedback.broadcast" :submitOnChange="true"/>
                        <BaseSelectButtons header="Listen" :type="'checkbox'" :options="['all','children','descendants', 'parent', 'ancestors','siblings']"
                        v-model="contextSelection.options.feedback.listen" :submitOnChange="true"/>
                        <BaseSelectButton header="Anomyze feedback" class="item-wrapper" label="Anonymize" :value="contextSelection.options.feedback.anonymize" 
                        v-model="contextSelection.options.feedback.anonymize"/>
                    </div>
                </div>
                <div class="item-group">
                    <div class="item-wrapper" style="text-align: right;">
                        <button class="primary" @click="slotProps.hide()"><span>Save</span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide()"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <div ref="moveSelectionIndicator" class="move-selection-indicator" :class="{'active': moveSelectionActive}">
            <span>Click selection to move to</span>
        </div>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'
import sortArray from '../../../mixins/sortArray'

export default {
    name: 'selectionsTable',
    props: [
        'selections',
    ],
    components: {
        SelectionsTableRow,
    },
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        selectionToEdit: null,
        contextSelection: null,
        contextSelectionComponent: null,
        contextSelectionParent: null,
        contextMouseEvent: null,
        moveSelectionActive: false,
        selectionToMove: null,
        selectionToMoveParent: null,
    }},
    computed: {
        ...mapGetters('files', ['currentFile']),
    },
    methods: {
        onSort(sortAsc, sortKey) {
            this.sortKey = sortKey
            this.sortArray(this.selections, sortAsc, sortKey)
        },
        rowClick(e, component) {
            if (this.moveSelectionActive) {
                e.stopPropagation()
                this.endMoveSelection(component.selection, component)
            }
        },
        showContextMenuSelection(e, selection, component, parent) {
            // Set the current context menu item
            this.contextSelection = selection
            this.contextSelectionComponent = component
            this.contextSelectionParent = parent
            // Save a reference to the clicked element
            this.contextMouseEvent = e

            // Show the move context instead if we are in the proces of moving something
            if(this.moveSelectionActive) {
                this.showContextMenuMove(e)
            } else {
                const selectionContext = this.$refs.contextMenuSelection
                // Position the contextual menu
                selectionContext.show(e)
            }
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
                    const index = this.selections.findIndex(x => x.id == this.selectionToMove.id)
                    this.selections.splice(index, 1)
                }

                // Expand the component
                component.childrenExpanded = true

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
        showOptionsContext(e, selection) {
            const contextMenu = this.$refs.contextMenuOptions
            this.contextSelection = selection
            // Position the contextual menu
            contextMenu.show(e)
        },
        async onNewSelection(parent) {
            // First check that we don't already have an unsaved new selection
            if (this.selections.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                name: '',
                type: 'Master',
                currency: null,
                user_count: 0,
                children: [],
            }
            // Push new selection to the parent
            if (parent) {
                // If we are creating a sbu selection
                newSelection.name = 'New Sub Selection'
                newSelection.parent_id = parent.id
                newSelection.type = 'Normal'
                // Instantiate a children array on the parent
                if (!parent.children) {
                    this.$set(parent, 'children', [])
                }
                parent.children.push(newSelection)
                // Expand the selection the new selection is added to
                // Loop through the children to find the selectionrow in question
                this.contextSelectionComponent.childrenExpanded = true
            } else {
                // If no parent, we are creating a new master
                newSelection.name = 'New Master Selection'
                newSelection.parent_id = 0
                this.selections.push(newSelection)
            }
            // Wait for changes to the dom to take effect
            this.$nextTick(() => {
                // Activate title edit of new folder
                this.selectionToEdit = {selection: newSelection, field: 'name'}
            })
        },
        onDeleteSelection(selection, parent) {
            // Send request to API
            

            // Delete the selection from state
            // Check if the selection has a parent
            if (parent) {
                const unsavedSelectionIndex = parent.children.findIndex(x => x.id == selection.id)
                parent.children.splice(unsavedSelectionIndex, 1)
            } else {
                const unsavedSelectionIndex = this.selections.findIndex(x => x.id == selection.id)
                this.selections.splice(unsavedSelectionIndex, 1)
            }
        },
        clearToEdit() {
            // Clear the current edit
            this.selectionToEdit = null
        },
        clearUnsaved(selection) {
            // Check if the selection is saved
            if (!selection.id) {
                // Check if the current selection has a parent
                if (selection.parent_id) {
                    const parent = this.selections.find(x => x.id == selection.id)
                    const unsavedSelectionIndex = parent.children.findIndex(x => x.id == null)
                    parent.children.splice(unsavedSelectionIndex, 1)
                } else {
                    const unsavedSelectionIndex = this.selections.findIndex(x => x.id == null)
                    this.selections.splice(unsavedSelectionIndex, 1)
                }
            }
        }
    },
    destroyed() {
        document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
    
    .selections-table {
        // Target child style
        ::v-deep tr {
            > * {
                &.expand { // Title
                    min-width: 48px;
                    max-width: 48px
                }
                &.title { // Title
                    min-width: 240px;
                    max-width: 240px;
                }
                &.status { // Status
                    min-width: 202px;
                    max-width: 202px;
                }
                // &.items, &.in, &.out, &.nd {
                //     min-width: 72px;
                //     max-width: 72px;
                // }
                &.action { // Actions
                    min-width: 76px;
                    max-width: 76px;
                }
            }
        }
    }
    .move-selection-indicator {
        position: fixed;
        display: none;
        background: white;
        padding: 2px 8px;
        box-shadow: 0 3px 8px rgba($dark,0.2);
        font-weight: 700;
        border-radius: 4px;
        &.active {
            display: block;
        }
    }
    
</style>