<template>
    <table class="flex-table" ref="table">
        <tr class="header">
            <slot name="header" :sort="sort">
            </slot>
        </tr>
        <slot name="body" :sort="sort"/>
        <tr class="footer">
            <slot name="footer" :sort="sort">
            </slot>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'flexTable',
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

    .flex-table {
        white-space: nowrap;
        border-spacing: 0 2px;
        display: flex;
        flex-direction: column;
        tr {
            background: white;
            height: 48px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            > * {
                flex: 1;
            }
            &:hover {
                background: $light1;
                td {
                    &.title {
                        i {
                            color: $dark05;
                            transition: 0;
                        }
                    }
                }
            }
            &.header, &.footer {
                height: 32px;
                color: #707070;
            }
            &.header {
                border-radius: $rowRadius $rowRadius 0 0;
            }
            &.footer {
                border-radius: 0 0 $rowRadius $rowRadius;
                margin-bottom: 0;
                height: 16px;
            }
        }
        th, td {
            padding: 0 12px;
            overflow: hidden;
            &.action {
                flex: 1;
                text-align: right;
            }
        }
    }
</style>