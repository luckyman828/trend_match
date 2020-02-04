<template>
    <div class="selection-owners-table">
        <FlexTable>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:right>
                        <span>{{selection.owners.length}} records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortOwners">Name</TableHeader>
                <TableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortOwners">E-mail</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="owner in selection.owners" :key="owner.id" class="owner-row table-row" ref="ownerRow" @contextmenu.prevent="showOwnerContext($event, owner)">
                    <td class="select"><Checkbox/></td>
                    <td class="title clickable">
                        <i class="fas fa-owner"></i>
                        <span>{{owner.name}}</span>
                    </td>
                    <td class="email">{{owner.email}}</td>
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showOwnerContext($event, owner)"><i class="far fa-ellipsis-h medium"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer="slotProps">
                <td><button class="primary invisible" @click="onAddOwner($event)"><i class="far fa-plus"></i><span>Add Owners(s) to Selection</span></button></td>
            </template>
        </FlexTable>

        <ContextMenu ref="contextMenuOwner" class="context-owner" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="onRemoveOwner(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>R</u>emove Owner
                </div>
            </div>
        </ContextMenu>

        <ContextMenu ref="contextMenuAddOwners" class="context-add-owners">
            <template v-slot:header="slotProps">
                Add Owner(s) to Selection
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <SelectButtons :type="'checkbox'" :options="availableOwners"
                    v-model="ownersToAdd" :submitOnChange="true" :optionDescriptionKey="'email'"
                    :optionNameKey="'name'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item">
                        <button class="primary" :class="{disabled: ownersToAdd.length < 1}" 
                        @click="onAddOwnersToSelection();ownersToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="ownersToAdd.length > 0">{{ownersToAdd.length}} 
                            </template>owner<template v-if="ownersToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide(); ownersToAdd = []"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </ContextMenu>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import sortArray from '../mixins/sortArray'
import User from '../store/models/User'

export default {
    name: 'selectionOwnersTable',
    props: [
        'selection'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        ownersToAdd: [],
    }},
    computed: {
        availableOwners() {
            const allOwners = User.all()
            // Filter the available owners to exclude owners already added
            return allOwners.filter(owner => !this.selection.owners.find(x => x.id == owner.id))
        }
    },
    methods: {
        ...mapActions('entities/subfiles', ['addOwnersToSelection','removeOwnerFromSelection']),
        showOwnerContext(e, owner) {
            const contextMenu = this.$refs.contextMenuOwner
            contextMenu.item = owner
            contextMenu.show(e)
        },
        onAddOwner(e) {
            const contextMenu = this.$refs.contextMenuAddOwners
            contextMenu.show(e)
        },
        onAddOwnersToSelection(ownersToAdd) {
            this.addOwnersToSelection({selection: this.selection, ownersToAdd: this.ownersToAdd})
        },
        sortOwners(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(this.selection.owners, this.sortAsc, this.sortKey)
        },
        onRemoveOwner(owner) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed owner
            this.removeOwnerFromSelection({selection: this.selection, owner: owner})
        },
    }
}
</script>

<style scoped lang="scss">
</style>