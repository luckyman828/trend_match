<template>
    <div class="grid-table" ref="table">
        <table>
            <tr class="header">
                <slot name="header" :sort="sort">
                </slot>
            </tr>
            <slot name="body" :sort="sort">
            </slot>
        </table>
    </div>
</template>

<script>
export default {
    name: 'gridTable',
    // props: [
    //     'select'
    // ],
    methods: {
        sort() {

        },
        // resizeTable() {
        //      // First find out how many columns we have
        //     const table = this.$refs.table
        //     const countColumns = table.querySelector('.header > tr').children.length
            
        //     // Loop through the columns to find the greatest width
        //     const columnWidths = []
        //     for (var i = 0; i < countColumns; i++) {
        //         // Loop through the rows in the first column
        //         table.querySelectorAll(`tr > :nth-child(${i+1})`).forEach(cell => {
        //             if (!columnWidths[i]) {
        //                 columnWidths[i] = cell.scrollWidth
        //             } else if (columnWidths[i] < cell.scrollWidth) {
        //                 columnWidths[i] = cell.scrollWidth
        //             }
        //         })
        //     }
        //     console.log(columnWidths)
        // }
    },
    updated() {
    //    this.resizeTable()
    },
    mounted() {
    //    this.resizeTable()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    $rowRadius: 2px;
    $headerRadius: 4px;

    .grid-table table {
        white-space: nowrap;
        border-spacing: 0 2px;
        tr {
            &:hover {
                td {
                    background: $light1;
                    i {
                        color: $dark05;
                        transition: 0;
                    }
                }
            }
            > :first-child {
                border-radius: $rowRadius 0 0 $rowRadius;
            }
            > :last-child {
                border-radius: 0 $rowRadius $rowRadius 0;
            }
            &.header {
                > :first-child {
                    border-radius: $headerRadius 0 0 $headerRadius;
                }
                > :last-child {
                    border-radius: 0 $headerRadius $headerRadius 0;
                }
                th {
                    padding: 6px 12px;
                    color: #707070;
                }
            }
        }
        th, td {
            overflow: hidden;
            background: white;
            padding: 12px 12px;
            // &:not(:first-child) {
            //     padding-left: 12px;
            // }
            // &:not(:last-child) {
            //     padding-right: 12px;
            // }
            &.action {
                width: 100%;
                text-align: right;
            }
        }
    }
</style>