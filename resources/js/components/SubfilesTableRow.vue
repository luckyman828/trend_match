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
        <td class="users">-</td>
        <td class="status">
            <span class="square ghost icon-right">Locked <i class="far fa-lock"></i></span>
            <span class="square ghost icon-right">Hidden <i class="far fa-eye"></i></span>
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