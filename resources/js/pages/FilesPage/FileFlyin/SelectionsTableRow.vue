<template>
    <div class="selections-table-row">
        <tr class="selection" @contextmenu.prevent="emitShowContext" @click="onClick">
            <td class="expand" :class="{active: childrenExpanded}" @click.stop="toggleExpanded" :style="indent">
                <span class="square invisible" v-if="selection.children.length > 0">
                    <i class="fas fa-caret-down"></i>
                </span>
            </td>
            <td class="title" v-if="selectionToEdit && selectionToEdit.selection.id == selection.id && selectionToEdit.field == 'name'" :style="selectionWidth">
                <i v-if="selection.master" class="fa-file-certificate master" :class="selection.id ? 'fad' : 'far'"></i> 
                <i v-else class="fa-file light-2" :class="selection.id ? 'fas' : 'far'"></i> 
                <BaseEditInputWrapper activateOnMount=true type="text"
                :value="selectionToEdit.selection.name" :oldValue="selection.name" v-model="selectionToEdit.selection.name"
                @submit="onUpdateSelection(selection); $emit('submitToEdit')" @cancel="$emit('cancelToEdit', selection)"/>
            </td>
            <td v-else class="title clickable" @click="onGoToSelection" :style="selectionWidth">
                <i v-if="selection.master" class="fa-file-certificate master" :class="selection.id ? 'fad' : 'far'"></i> 
                <i v-else class="fa-file light-2" :class="selection.id ? 'fas' : 'far'"></i> 
                <span :title="selection.name">{{selection.name}}</span>
            </td>
            <td class="items">-</td>
            <td class="in">-</td>
            <td class="out">-</td>
            <td class="nd">-</td>
            <td class="users">
                <button class="ghost editable sm" @click="$emit('showSelectionUsersFlyin', selection)">
                    <i class="far fa-user"></i><span>{{selection.users.length}}</span>
                </button>
            </td>
            <td class="status">
                <button class="editable ghost" @click="onToggleLocked(selection)"><span>{{selection.locked ? 'Locked' : 'Open'}}</span>
                    <i class="far" :class="selection.locked ? 'fa-lock' : 'fa-lock-open'"></i></button>
                <button class="editable ghost" @click="onToggleHidden(selection)"><span>{{selection.hidden ? 'Hidden' : 'Visible'}}</span>
                    <i class="far" :class="selection.hidden ? 'fa-eye-slash' : 'fa-eye'"></i></button>
            </td>
            <td class="action">
                <button class="invisible ghost-hover" @click="$emit('showOptionsContext', $event, selection)"><i class="fas fa-cog"></i></button>
                <button class="invisible ghost-hover" @click="emitShowContext"><i class="fas fa-ellipsis-h"></i></button>
            </td>
        </tr>
        <template v-if="childrenExpanded">
            <selectionsTableRow v-for="selection in selection.children" :parent="selection" :selection="selection" :path="path.concat(selection.id)"
            :selectionToEdit="selectionToEdit" :key="selection.id" :depth="depth+1" :moveSelectionActive="moveSelectionActive"
            @submitToEdit="$emit('submitToEdit')" @cancelToEdit="$emit('cancelToEdit', $event)" @showContext="emitEmissionShowContext" @emitOnClick="emitOnClick"/>
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
        'path'
    ],
    data: function() { return {
        childrenExpanded: false
    }},
    computed: {
        indent() {
            const baseIndent = 48
            const indentAmount = 20
            return {maxWidth: `${this.depth * indentAmount + baseIndent}px`, minWidth: `${this.depth * indentAmount + baseIndent}px` }
        },
        selectionWidth() {
            const baseWidth = 240
            const indentAmount = 20
            return {maxWidth: `${baseWidth - this.depth * indentAmount}px`, minWidth: `${baseWidth - this.depth * indentAmount}px` }
        }
    },
    methods: {
        ...mapGetters('entities/subfiles', ['updateSelection']),
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
            // Dispatch action in store
            selection.locked = !selection.locked
            // Temp fix to display change
            this.$forceUpdate() // <-- Remember to remove
        },
        onToggleHidden(selection) {
            // Dispatch action in store
            selection.hidden = !selection.hidden
            // Temp fix to display change
            this.$forceUpdate() // <-- Remember to remove
        },
        onUpdateSelection(selection) {
            this.updateSelection
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .title {
        display: flex;
        align-items: center;
        i {
            margin-right: 8px;
            width: 24px;
            font-size: 16px;
            color: $dark2;
            &.master {
                --fa-primary-color: #3b86ff;
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