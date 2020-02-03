<template>
    <tr class="subfiles-table-row">
        <td class="title clickable">
            <i v-if="subfile.master" class="fad fa-file-certificate master"></i> 
            <i v-else class="fas fa-file light-2"></i> 
            {{subfile.name}}
        </td>
        <td class="items">-</td>
        <td class="in">-</td>
        <td class="out">-</td>
        <td class="nd">-</td>
        <td class="users">
            <button class="ghost editable sm" @click="$emit('showSubfileOwnersFlyin', subfile)">
                <i class="far fa-user"></i><span>{{subfile.users.length}}</span>
            </button>
        </td>
        <td class="status">
            <span class="square ghost icon-right" @click="onToggleLocked(subfile)">{{subfile.locked ? 'Locked' : 'Open'}} 
                <i class="far" :class="subfile.locked ? 'fa-lock' : 'fa-lock-open'"></i></span>
            <span class="square ghost icon-right" @click="onToggleHidden(subfile)">{{subfile.hidden ? 'Hidden' : 'Visible'}} 
                <i class="far" :class="subfile.hidden ? 'fa-eye-slash' : 'fa-eye'"></i></span>
        </td>
        <td class="actions">
            <span class="button invisible ghost-hover true-square" @click="toggleExpanded(subfile.id)"><i class="fas fa-ellipsis-h"></i></span>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'subfilesTableRow',
    props: [
        'subfile'
    ],
    methods: {
        toggleExpanded(id) {
            this.$emit('toggleExpanded', id)
        },
        onToggleLocked(selection) {
            // Dispatch action in store
            selection.locked = !selection.locked
            this.$forceUpdate()
        },
        onToggleHidden(selection) {
            selection.hidden = !selection.hidden
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .title {
        i {
            font-size: 20px;
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
    td {
        &.actions {
            text-align: right;
        }
    }

</style>