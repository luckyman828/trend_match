<template>
    <div class="subfiles-table">
        <FlexTable class="flex-table-root">
            <template v-slot:header="slotProps">
                <th class="expand"></th>
                <th class="title">Name <i class="fas fa-sort"></i></th>
                <th class="items">Items <i class="fas fa-sort"></i></th>
                <th class="in">In <i class="fas fa-sort"></i></th>
                <th class="out">Out <i class="fas fa-sort"></i></th>
                <th class="nd">ND <i class="fas fa-sort"></i></th>
                <th class="users">Users <i class="fas fa-sort"></i></th>
                <th class="status">Status <i class="fas fa-sort"></i></th>
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
    methods: {
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
                &:last-child { // Actions
                    min-width: 72px;
                }
            }
        }
    }
    
</style>