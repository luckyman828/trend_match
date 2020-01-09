<template>
    <div class="subfiles-table">
        <FlexTable class="flex-table-root">
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
                <div class="body">
                    <SubfileRow v-for="subfile in subfiles.filter(x => !x.parent_id)" :subfile="subfile" :key="subfile.id" :depth="0"/>
                </div>
            </template>
        </FlexTable>
    </div>
</template>

<script>
import GridTable from './GridTable'
import FlexTable from './FlexTable'
import SubfilesTableRow from './SubfilesTableRow'
import SubfileRow from './SubfileRow'

export default {
    name: 'subfilesTable',
    props: [
        'subfiles'
    ],
    components: {
        GridTable,
        SubfilesTableRow,
        SubfileRow,
        FlexTable,
    },
    data: function() { return {
        expandedIds: []
    }},
    methods: {
        toggleExpanded(id) {
            console.log('toggling expanded. Id: '+id)
            const idIndex = this.expandedIds.findIndex(x => x == id)
            if (idIndex >= 0) {
                this.expandedIds.splice(idIndex, 1)
            } else {
                console.log('pushing the id')
                this.expandedIds.push(id)
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
                &:nth-child(1) { // Title
                    min-width: 240px;
                }
                &:nth-child(7) { // Status
                    min-width: 202px;
                }
                &:last-child { // Actions
                    min-width: 72px;
                }
            }
        }
    }
    
</style>