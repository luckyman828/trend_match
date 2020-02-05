<template>
    <div class="subfiles-table-row">
        <tr class="subfile" @contextmenu.prevent="emitShowContext">
            <td class="expand" :class="{active: childrenExpanded}" @click="toggleExpanded" :style="indent">
                <span class="square invisible" v-if="subfile.children.length > 0">
                    <i class="fas fa-caret-down"></i>
                </span>
            </td>
            <td class="title" v-if="selectionToEdit && selectionToEdit.selection.id == subfile.id && selectionToEdit.field == 'name'" :style="selectionWidth">
                <i v-if="subfile.master" class="fa-file-certificate master" :class="subfile.id ? 'fad' : 'far'"></i> 
                <i v-else class="fa-file light-2" :class="subfile.id ? 'fas' : 'far'"></i> 
                <EditInputWrapper activateOnMount=true type="text"
                :value="selectionToEdit.selection.name" :oldValue="subfile.name" v-model="selectionToEdit.selection.name"
                @submit="onUpdateSelection(subfile); $emit('submitToEdit')" @cancel="$emit('cancelToEdit', subfile)"/>
            </td>
            <td v-else class="title clickable" @click="$router.push({name: 'subfile', params: {fieId: subfile.file_id, subfileId: subfile.id}})" :style="selectionWidth">
                <i v-if="subfile.master" class="fa-file-certificate master" :class="subfile.id ? 'fad' : 'far'"></i> 
                <i v-else class="fa-file light-2" :class="subfile.id ? 'fas' : 'far'"></i> 
                <span :title="subfile.name">{{subfile.name}}</span>
            </td>
            <td class="items">-</td>
            <td class="in">-</td>
            <td class="out">-</td>
            <td class="nd">-</td>
            <td class="owner">
                <button class="ghost editable sm" @click="$emit('showSelectionOwnersFlyin', subfile)">
                    <i class="far fa-user-shield"></i><span>{{subfile.owners.length}}</span>
                </button>
            </td>
            <td class="users">
                <button class="ghost editable sm" @click="$emit('showSelectionUsersFlyin', subfile)">
                    <i class="far fa-user"></i><span>{{subfile.feedback_users.length}}</span>
                </button>
            </td>
            <td class="status">
                <button class="editable ghost" @click="onToggleLocked(subfile)"><span>{{subfile.locked ? 'Locked' : 'Open'}}</span>
                    <i class="far" :class="subfile.locked ? 'fa-lock' : 'fa-lock-open'"></i></button>
                <button class="editable ghost" @click="onToggleHidden(subfile)"><span>{{subfile.hidden ? 'Hidden' : 'Visible'}}</span>
                    <i class="far" :class="subfile.hidden ? 'fa-eye-slash' : 'fa-eye'"></i></button>
            </td>
            <td class="action">
                <button class="invisible ghost-hover" @click="toggleExpanded(subfile.id)"><i class="fas fa-ellipsis-h"></i></button>
            </td>
        </tr>
        <template v-if="childrenExpanded">
            <subfilesTableRow v-for="selection in subfile.children" :parent="subfile" :subfile="selection" :path="path.concat(selection.id)"
            :selectionToEdit="selectionToEdit" :key="selection.id" :depth="depth+1" :moveSelectionActive="moveSelectionActive"
            @submitToEdit="$emit('submitToEdit')" @cancelToEdit="$emit('cancelToEdit', $event)" @showContext="emitEmissionShowContext"/>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SubfilesTableRow from './SubfilesTableRow'

export default {
    name: 'subfilesTableRow',
    components: {
        'subfilesTableRow': SubfilesTableRow,
    },
    props: [
        'subfile',
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
        emitShowContext(mouseEvent) {
            this.$emit('showContext', mouseEvent, this.subfile, this, this.parent)
        },
        emitEmissionShowContext(mouseEvent, selection, component, parent) {
            // This is the event that goes to the subfilesTable component
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