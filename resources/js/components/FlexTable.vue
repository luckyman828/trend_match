<template>
    <table class="flex-table" ref="table">
        <slot name="topBar"/>
        <tr class="header">
            <slot name="header"/>
        </tr>
        <slot name="body"/>
        <tr class="footer">
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
            height: 48px;
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
                height: 32px;
                color: #707070;
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
            > i {
                color: $dark15;
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
            }
            &.select {
                flex: 0 1 auto;
                min-width: 40px;
                max-width: 40px;
            }
        }
    }
</style>