<template>
    <div class="subfiles-table">
        <GridTable>
            <template v-slot:header="slotProps">
                <th>Name <i class="fas fa-sort"></i></th>
                <th>Items <i class="fas fa-sort"></i></th>
                <th>In <i class="fas fa-sort"></i></th>
                <th>Out <i class="fas fa-sort"></i></th>
                <th>ND <i class="fas fa-sort"></i></th>
                <th>Users <i class="fas fa-sort"></i></th>
                <th>Status <i class="fas fa-sort"></i></th>
                <th class="action">Action</th>
            </template>
            <template v-slot:body>
                <template v-for="subfile in subfiles">
                    <SubfilesTableRow :key="subfile.id" class="subfile" :class="`depth-${subfile.depth}`"
                    v-if="!subfile.parent || (subfile.parent && subfile.parent.expanded)" :subfile="subfile" @toggleExpanded="toggleExpanded"/>
                    <!-- <template v-for="subfileChild in subfile.descendants">
                        <SubfilesTableRow :key="subfileChild.id" class="subfile" :class="`depth-${subfileChild.depth}`" 
                        :subfile="subfileChild" v-if="expandedIds.includes(subfileChild.parent_id)" @toggleExpanded="toggleExpanded"/>
                    </template> -->
                </template>
                <!-- <tr v-for="subfile in subfiles" :key="subfile.id" class="subfile">
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
                        <span class="button invisible ghost-hover true-square"><i class="fas fa-ellipsis-h"></i></span>
                    </td>
                </tr> -->
            </template>
            <!-- <template v-slot:footer="slotProps">
            </template> -->
        </GridTable>
    </div>
</template>

<script>
import GridTable from './GridTable'
import SubfilesTableRow from './SubfilesTableRow'

export default {
    name: 'subfilesTable',
    props: [
        'subfiles'
    ],
    components: {
        GridTable,
        SubfilesTableRow,
    },
    data: function() { return {
        expandedIds: []
    }},
    methods: {
        toggleExpanded(id) {
            console.log('toggling expanded')
            const idIndex = this.expandedIds.findIndex(x => x == id)
            if (idIndex) {
                this.expandedIds.splice(idIndex, 1)
            } else {
                expandedIds.push(id)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
    $paddingLeftBase: 12px;
    $paddingLeft: 20px;

    .subfile {
        &.depth {
            &-1 > :first-child {
                padding-left: $paddingLeftBase + $paddingLeft * 1;
            }
            &-2 > :first-child {
                padding-left: $paddingLeftBase + $paddingLeft * 2;
            }
            &-3 > :first-child {
                padding-left: $paddingLeftBase + $paddingLeft * 3;
            }
        }
    }
    td {
        &.actions {
            text-align: right;
        }
    }
    
</style>