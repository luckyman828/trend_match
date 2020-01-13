<template>
    <table class="flex-table" ref="table">
        <slot name="topBar"/>
        <tr class="header">
            <slot name="header"/>
        </tr>
        <slot name="body"/>
        <tr class="footer">
            <td class="select"></td>
            <slot name="footer"/>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'flexTable',
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
        > tr:first-child {
            border-radius: $rowRadius $rowRadius 0 0;
        }
        tr {
            background: white;
            min-height: 48px;
            display: flex;
            align-items: center;
            padding: 8px 0;
            &:not(.table-top-bar) {
                margin-bottom: 2px;
                > * {
                    flex: 1;
                }
            }
            &:not(.header):not(.footer):not(.table-top-bar) {
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
            }
            &.header, &.footer {
                color: $tableHeader;
            }
            &.header {
                height: 32px;
            }
            &.footer {
                border-radius: 0 0 $rowRadius $rowRadius;
                margin-bottom: 0;
                min-height: 16px;
                height: auto;
            }
        }
        td {
            overflow: hidden;
        }
        th, td {
            padding: 0 12px;
            > i {
                &:last-child {
                    margin-left: 12px;
                }
                &:first-child {
                    margin-right: 12px;
                }
            }
            &.action {
                flex: 1;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                >*:not(:last-child) {
                    margin-right: 8px;
                }
            }
            &.select {
                flex: 0 1 auto;
                min-width: 40px;
                max-width: 40px;
            }
        }
    }
</style>