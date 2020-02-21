<template>
    <div class="grid-table" ref="table">
        <table>
            <tr class="header">
                <slot name="header" :sort="sort">
                    <p>No headers</p>
                </slot>
            </tr>
            <slot name="body" :sort="sort">
                <tr>No body</tr>
            </slot>
        </table>
    </div>
</template>

<script>
export default {
    name: 'gridTable',
    props: [
        'select'
    ],
    methods: {
        sort() {

        },
        resizeTable() {
             // First find out how many columns we have
            const table = this.$refs.table
            const countColumns = table.querySelector('.header > tr').children.length
            
            // Loop through the columns to find the greatest width
            const columnWidths = []
            for (var i = 0; i < countColumns; i++) {
                // Loop through the rows in the first column
                table.querySelectorAll(`tr > :nth-child(${i+1})`).forEach(cell => {
                    if (!columnWidths[i]) {
                        columnWidths[i] = cell.scrollWidth
                    } else if (columnWidths[i] < cell.scrollWidth) {
                        columnWidths[i] = cell.scrollWidth
                    }
                })
            }
            console.log(columnWidths)
        }
    },
    updated() {
       this.resizeTable()
    },
    mounted() {
       this.resizeTable()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .grid-table {
        white-space: nowrap;
        th, td {
            overflow: hidden;
            &.action {
                width: 100%;
                text-align: right;
            }
        }
        th.action, td.action {
            
        }
    }
</style>