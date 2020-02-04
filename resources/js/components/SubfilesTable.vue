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
                    <SubfilesTableRow v-for="subfile in subfiles.filter(x => !x.parent_id)" :subfile="subfile" :key="subfile.id" :depth="0"
                    @showSelectionUsersFlyin="$emit('showSelectionUsersFlyin',$event)" @showSelectionOwnersFlyin="$emit('showSelectionOwnersFlyin',$event)"/>
                </div>
            </template>
        </FlexTable>
    </div>
</template>

<script>
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
    }},
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