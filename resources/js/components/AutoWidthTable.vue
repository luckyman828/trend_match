<template>
    <div class="auto-width-table" ref="table">
        <table>
            <thead>
                <tr class="header">
                    <slot name="header" :sort="sort">
                    </slot>
                </tr>
            </thead>
            <slot name="body" :sort="sort"/>
        </table>
        <div class="table-footer">
            <slot name="footer" :sort="sort">
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'autoWidthTable',
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

<style lang="scss">
    @import '~@/_variables.scss';
    $rowRadius: 4px;

    .auto-width-table table {
        white-space: nowrap;
        border-spacing: 0 2px;
        tr {
            &:hover {
                td {
                    background: $light1;
                    &.title {
                        i {
                            color: $dark05;
                            transition: 0;
                        }
                    }
                }
            }
            &.header {
                > :first-child {
                    border-radius: $rowRadius 0 0 0;
                }
                > :last-child {
                    border-radius: 0 $rowRadius 0 0;
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
            padding: 4px 12px;
            &.action {
                width: 100%;
                text-align: right;
            }
        }
        td {
            height: 48px;
        }
    }
</style>

<style lang="scss" scoped>
    @import '~@/_variables.scss';
    $rowRadius: 4px;

    .table-footer {
        min-height: 16px;
        padding: 6px 10%;
        width: 100%;
        border-radius: 0 0 $rowRadius $rowRadius;
        background: white;
    }

</style>