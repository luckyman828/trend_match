<template>
    <div class="subfiles-table">
        <FlexTable class="flex-table-root">
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:right>
                        <span>{{subfiles.length}} records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="expand"></TableHeader>
                <TableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc">Name</TableHeader>
                <TableHeader :sortKey="'items'" :currentSortKey="sortKey" :sortAsc="sortAsc">Items</TableHeader>
                <TableHeader :sortKey="'in'" :currentSortKey="sortKey" :sortAsc="sortAsc">In</TableHeader>
                <TableHeader :sortKey="'out'" :currentSortKey="sortKey" :sortAsc="sortAsc">Out</TableHeader>
                <TableHeader :sortKey="'nd'" :currentSortKey="sortKey" :sortAsc="sortAsc">ND</TableHeader>
                <TableHeader :sortKey="'owners'" :currentSortKey="sortKey" :sortAsc="sortAsc">Owners</TableHeader>
                <TableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc">Users</TableHeader>
                <TableHeader :sortKey="'status'" :currentSortKey="sortKey" :sortAsc="sortAsc">Status</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <div class="body">
                    <SubfilesTableRow :ref="'selection-row-'+subfile.id" v-for="subfile in currentFile.subfiles.filter(x => !x.parent_id)" :key="subfile.id"
                    :subfile="subfile" :depth="0" :path="[subfile.id]"
                    :selectionToEdit="selectionToEdit" @submitToEdit="clearToEdit" @cancelToEdit="clearUnsaved($event);clearToEdit()"
                    @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin',$event)" @showSelectionOwnersFlyin="$emit('showSelectionOwnersFlyin',$event)"
                    @showContext="showContextMenuSelection" :moveSelectionActive="moveSelectionActive" 
                    @endMoveSelection="endMoveSelection"/>
                </div>
            </template>
            <template v-slot:footer>
                <td><button class="primary invisible" @click="onNewSelection()"><i class="far fa-plus"></i><span>Add new: Master Selection</span></button></td>
            </template>
        </FlexTable>

        <ContextMenu ref="contextMenuSelection" class="context-selection">
            <div class="item-group">
                <div class="item">
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
                <div class="item" @click="$emit('showSelectionOwnersFlyin', contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-users"></i></div>
                    Add <u>f</u>eedback users
                </div>
                <div class="item" @click="$emit('showSelectionUsersFlyin', contextSelection)">
                    <div class="icon-wrapper"><i class="far fa-user-shield"></i></div>
                    Add <u>O</u>wner(s)
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
        </ContextMenu>

        <ContextMenu ref="contextMenuMove" class="context-move">
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
        </ContextMenu>

        <div ref="moveSelectionIndicator" class="move-selection-indicator" :class="{'active': moveSelectionActive}">
            <span>Right-click selection to move to</span>
        </div>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FlexTable from './FlexTable'
import SubfilesTableRow from './SubfilesTableRow'

export default {
    name: 'subfilesTable',
    props: [
        'subfiles',
    ],
    components: {
        SubfilesTableRow,
        FlexTable,
    },
    data: function() { return {
        sortKey: null,
        sortAsc: true,
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
        ...mapGetters('entities/collections', ['currentFile']),
    },
    methods: {
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
                    const index = this.subfiles.findIndex(x => x.id == this.selectionToMove.id)
                    this.subfiles.splice(index, 1)
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
            console.log('show context move')
            e.preventDefault()
            e.stopPropagation()
            const moveContext = this.$refs.contextMenuMove
            this.contextMouseEvent = e
            // Position the contextual menu
            moveContext.show(e)
        },
        onNewSelection(parent) {
            // First check that we don't already have an unsaved new subfile
            if (this.subfiles.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                name: '',
                children: [],
                locked: true,
                hidden: true,
                master: !parent,
                owners: [],
                feedback_users: []
            }
            // Push new selection to the parent
            if (parent) {
                // If we are creating a sbu selection
                newSelection.name = 'New Sub Selection'
                parent.children.push(newSelection)
                // Expand the selection the new selection is added to
                // Loop through the children to find the selectionrow in question
                this.contextSelectionComponent.childrenExpanded = true
            } else {
                // If no parent, we are creating a new master
                newSelection.name = 'New Master Selection'
                this.subfiles.push(newSelection)
            }
            // Wait for changes to the dom to take effect
            this.$nextTick(() => {
                // Activate title edit of new folder
                this.selectionToEdit = {selection: newSelection, field: 'name'}
            })
        },
        onDeleteSelection(selection, parent) {
            // Send request to API
            console.log('Delete selection')
            console.log(selection)

            // Delete the selection from state
            // Check if the selection has a parent
            if (parent) {
                const unsavedSelectionIndex = parent.children.findIndex(x => x.id == selection.id)
                parent.children.splice(unsavedSelectionIndex, 1)
            } else {
                const unsavedSelectionIndex = this.subfiles.findIndex(x => x.id == selection.id)
                this.subfiles.splice(unsavedSelectionIndex, 1)
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
                    const parent = this.subfiles.find(x => x.id == selection.id)
                    const unsavedSelectionIndex = parent.children.findIndex(x => x.id == null)
                    parent.children.splice(unsavedSelectionIndex, 1)
                } else {
                    const unsavedSelectionIndex = this.subfiles.findIndex(x => x.id == null)
                    this.subfiles.splice(unsavedSelectionIndex, 1)
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
    
    .subfiles-table {
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
                    min-width: 40px;
                    max-width: 40px;
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