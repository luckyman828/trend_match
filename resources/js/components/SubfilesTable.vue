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
                    <SubfilesTableRow :ref="'selection-row-'+subfile.id" v-for="subfile in currentFile.subfiles.filter(x => !x.parent_id)" :subfile="subfile" :key="subfile.id" :depth="0"
                    :selectionToEdit="selectionToEdit" @submitToEdit="clearToEdit" @cancelToEdit="clearUnsaved($event);clearToEdit()"
                    @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin',$event)" @showSelectionOwnersFlyin="$emit('showSelectionOwnersFlyin',$event)"
                    @showContext="showContextMenuSelection"/>
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
                <div class="item">
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
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FlexTable from './FlexTable'
import SubfilesTableRow from './SubfilesTableRow'

export default {
    name: 'subfilesTable',
    props: [
        'subfiles'
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
    }},
    computed: {
        ...mapGetters('entities/collections', ['currentFile']),
    },
    methods: {
        showContextMenuSelection(e, selection, component, parent) {
            const selectionContext = this.$refs.contextMenuSelection
            // Set the current context menu item
            this.contextSelection = selection
            this.contextSelectionComponent = component
            this.contextSelectionParent = parent
            // Position the contextual menu
            selectionContext.show(e)
        },
        onNewSelection(parent) {
            // First check that we don't already have an unsaved new subfile
            if (this.subfiles.find(x => x.id == null)) return
            // Else instantiate a new master object in the table
            const newSelection = {
                id: null,
                name: 'New master',
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
                parent.children.push(newSelection)
                // Expand the selection the new selection is added to
                // Loop through the children to find the selectionrow in question
                this.contextSelectionComponent.childrenExpanded = true
            } else {
                // If no parent, we are creating a new master
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
    
</style>