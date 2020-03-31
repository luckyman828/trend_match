<template>
    <div class="selections-table-row">
        <tr class="selection" :class="{'is-hidden': isHidden}"
        @contextmenu="emitShowContext" @click="onClick">
            <td class="locked"><i class="far fa-lock" v-if="!selection.is_open" v-tooltip="'Locked: Selection is read-only'"></i></td>
            <td class="expand" :class="{active: childrenExpanded}" @click.stop="toggleExpanded" :style="indent">
                <span class="square invisible" v-if="selection.children.length > 0">
                    <i class="fas fa-caret-down"></i>
                </span>
            </td>
            <!-- Editing -->
            <td class="title" v-if="selectionToEdit && selectionToEdit.selection.id == selection.id && selectionToEdit.field == 'name'" :style="selectionWidth">
                <i v-if="isMaster" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"><i class="fas fa-crown"></i></i> 
                <i v-else class="fa-poll light-2" :class="selection.id ? 'fas' : 'far'"></i>
                <BaseEditInputWrapper activateOnMount=true type="text"
                :value="selectionToEdit.selection.name" :oldValue="selection.name" v-model="selectionToEdit.selection.name"
                @submit="$emit('submitToEdit');onUpdateSelection(selection)" @cancel="$emit('cancelToEdit', {selection, parent})"/>
            </td>
            <!-- Viewing -->
            <td v-else class="title clickable" @click="onGoToSelection" :style="selectionWidth">
                <i v-if="isMaster" class="fa-poll master" :class="selection.id ? 'fas' : 'far'"><i class="fas fa-crown"></i></i> 
                <i v-else class="fa-poll light-2" :class="selection.id ? 'fas' : 'far'"></i> 
                <span :title="selection.name">{{selection.name}}</span>
            </td>
            <!-- <td class="items">-</td>
            <td class="in">-</td>
            <td class="out">-</td>
            <td class="nd">-</td> -->
            <td class="currency">
                <button class="ghost editable sm" @click="$event => $emit('showSelectionCurrencyContext', {selection, e: $event})" v-if="userHasEditAccess">
                    <span>{{selection.currency || 'Set currency'}}</span>
                </button>
                <span v-else>{{selection.currency || 'No currency set'}}</span>
            </td>
            <td class="teams">
                <button class="ghost editable sm" v-if="userHasEditAccess"
                @click="$emit('showSelectionUsersFlyin', selection)">
                    <i class="far fa-users"></i><span>{{selection.team_count}}</span>
                </button>
                <span v-else>-</span>
            </td>
            <td class="users">
                <button class="ghost editable sm" v-if="userHasEditAccess"
                @click="$emit('showSelectionUsersFlyin', selection)">
                    <i class="far fa-user"></i><span>{{selection.user_count}}</span>
                </button>
                <span v-else>-</span>
            </td>
            <td class="status">
                <template v-if="userHasEditAccess">
                    <button class="editable" :class="selection.is_open && 'ghost'" 
                    @click="onToggleLocked(selection)">
                        <span>{{selection.is_open ? 'Open' : 'Locked'}}</span>
                        <i class="far" :class="selection.is_open ? 'fa-lock-open' : 'fa-lock'"></i></button>
                    <button class="editable" :class="selection.is_visible && 'ghost'"
                    @click="onToggleHidden(selection)">
                        <span>{{!selection.is_visible ? 'Hidden' : 'Visible'}}</span>
                        <i class="far" :class="!selection.is_visible ? 'fa-eye-slash' : 'fa-eye'"></i></button>
                </template>
                <span v-else>-</span>
            </td>
            <td class="action">
                <button v-if="userHasEditAccess" class="invisible ghost-hover" @click="$emit('showSettingsContext', $event, selection)"><i class="fas fa-cog"></i></button>
                <button v-if="userHasEditAccess" class="invisible ghost-hover" @click="emitShowContext"><i class="fas fa-ellipsis-h"></i></button>
                <BaseButton v-else buttonClass="invisible ghost-hover primary"
                @click="onGoToSelection">
                    <span>Go to Selection</span>
                </BaseButton>
            </td>
        </tr>
        <template v-if="childrenExpanded">
            <selectionsTableRow v-for="selectionChild in selection.children" :parent="selection" :selection="selectionChild" :path="path.concat(selection.id)"
            :selectionToEdit="selectionToEdit" :key="selectionChild.id" :depth="selectionDepth" :moveSelectionActive="moveSelectionActive"
            @submitToEdit="$emit('submitToEdit')" @cancelToEdit="$emit('cancelToEdit', $event)" @showContext="emitEmissionShowContext" @emitOnClick="emitOnClick"
            @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin', $event)" @showSelectionCurrencyContext="$emit('showSelectionCurrencyContext', $event)" 
            @showSettingsContext="($event, selection) => {$emit('showSettingsContext', $event, selection)}"/>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionsTableRow from './SelectionsTableRow'

export default {
    name: 'selectionsTableRow',
    components: {
        'selectionsTableRow': SelectionsTableRow,
    },
    props: [
        'selection',
        'depth',
        'selectionToEdit',
        'parent',
        'moveSelectionActive',
        'path',
        'file',
        'isMaster'
    ],
    data: function() { return {
        childrenExpanded: true
    }},
    computed: {
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess']),
        indent() {
            const baseIndent = 48
            const indentAmount = 24
            return {maxWidth: `${this.depth * indentAmount + baseIndent}px`, minWidth: `${this.depth * indentAmount + baseIndent}px` }
        },
        selectionWidth() {
            const baseWidth = 400
            const indentAmount = 24
            return {maxWidth: `${baseWidth - this.depth * indentAmount}px`, minWidth: `${baseWidth - this.depth * indentAmount}px` }
        },
        isHidden() {
            return !this.userHasEditAccess && !this.selection.is_visible
        },
        selectionDepth() {
            // If the selection is not visible to the user, then set the depth equal to the previous depth
            if (this.isHidden) return this.depth
            else return this.depth+1
        },
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        }
    },
    methods: {
        ...mapActions('selections', ['insertSelection', 'updateSelection']),
        toggleExpanded() {
            this.childrenExpanded = !this.childrenExpanded
        },
        onGoToSelection() {
            if (!this.moveSelectionActive) {
                this.$router.push({name: 'selection', params: {fileId: this.selection.file_id, selectionId: this.selection.id}})
            }
        },
        onClick(e) {
            if (this.path.length <= 1) {
                this.$emit('onClick', e, this)
            }
            this.$emit('emitOnClick', e, this)
        },
        emitOnClick(e, component) {
            if (this.path.length <= 1) {
                this.$emit('onClick', e, component)
            }
            this.$emit('emitOnClick', e, component)
        },
        emitShowContext(mouseEvent) {
            this.$emit('showContext', mouseEvent, this.selection, this, this.parent)
        },
        emitEmissionShowContext(mouseEvent, selection, component, parent) {
            // This is the event that goes to the selectionsTable component
            this.$emit('showContext', mouseEvent, selection, component, parent)

        },
        onToggleLocked(selection) {
            // Check if the selection is locked
            if (selection.is_open) {
                selection.open_from = null
                // Set To to now
                selection.open_to = new Date()
                } else {
                selection.open_from = new Date()
                selection.open_to = null
            }
            this.updateSelection(selection)
        },
        onToggleHidden(selection) {
            // Check if the selection is visible
            if (selection.is_visible) {
                // Set To to now
                selection.visible_from = null
                selection.visible_to = new Date()
            } else {
                selection.visible_from = new Date()
                selection.visible_to = null
            }
            this.updateSelection(selection)
        },
        onUpdateSelection(selection) {
            // Check if we are inserting or updating
            if (!selection.id) {
                this.insertSelection({file: this.file, selection, addToState: false})
            } else {
                this.updateSelection(selection)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.selection {
    &.is-hidden {
        display: none;
    }
}

    .title {
        display: flex;
        align-items: center;
        i {
            margin-right: 8px;
            width: 24px;
            font-size: 16px;
            color: $dark2;
            &:first-child {
                margin-right: 8px;
            }
            &.master {
                position: relative;
                i {
                    position: absolute;
                    left: -2px;
                    bottom: 5px;
                    font-size: 10px;
                    color: #3b86ff;
                    margin: 0;
                    width: auto;
                 } 
                &::after {
                    opacity: 1;
                }
            }
        }
    }
    .expand {
        i {
            font-size: 16px;
            color: $dark2;
        }
        &.active {
            i {
                transform: rotate(180deg);
                color: $dark15;
            }
        }
        &:hover {
            cursor: pointer;
            i {
                color: $primary;
            }
        }
    }
    .status {
        button {
            min-width: 84px;
        }
    }
    
</style>