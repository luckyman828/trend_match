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
                <tr v-for="subfile in subfiles" :key="subfile.id" class="subfile">
                    <td class="title clickable">
                        <i class="fad fa-file-certificate master"></i> 
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
                </tr>
            </template>
            <!-- <template v-slot:footer="slotProps">
            </template> -->
        </GridTable>
    </div>
</template>

<script>
import GridTable from './GridTable'

export default {
    name: 'subfilesTable',
    props: [
        'subfiles'
    ],
    components: {
        GridTable,
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .subfile {
        .title {
            i {
                font-size: 20px;
                &.master {
                    --fa-primary-color: #3b86ff;
                }
            }
        }
    }
    
</style>