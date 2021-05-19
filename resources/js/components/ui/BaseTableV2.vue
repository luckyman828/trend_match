<template>
    <div class="base-table-v2">
        <table>
            <tr class="header">
                <BaseTableHeader class="select" v-if="selectedItems">
                    <BaseCheckbox
                        :value="selectedItems.length > 0"
                        :modelValue="true"
                        @change="
                            checked =>
                                checked ? $emit('update:selectedItems', items) : $emit('update:selectedItems', [])
                        "
                    />
                </BaseTableHeader>
                <slot name="header" />
            </tr>

            <tbody>
                <slot />
            </tbody>
        </table>
        <div class="last">
            <slot name="last" />
        </div>

        <div class="empty flex-list center-v center-h" v-if="items && items.length <= 0">
            <slot name="empty" />
        </div>

        <div class="footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseTableV2',
    props: ['items', 'selectedItems', 'showSelect'],
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

.base-table-v2 {
    table {
        border-collapse: collapse;
        width: 100%;
    }
    background: white;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    overflow: hidden;
    .empty {
        min-height: 60px;
        border-bottom: $borderModule;
    }
    tr {
        background: $bgModule;
        min-height: 48px;
        position: relative;
        &:not(.header):not(.footer):not(.table-top-bar):not(.last) {
            &:hover {
                background: $bgModuleHover;
            }
        }
        &.active {
            background: #d3daff !important;
            &:not(.table-top-bar) {
                border-color: $primary300;
            }
        }
        &.header,
        &.footer {
            color: $fontTableHeader;
        }
        &.header {
            height: 32px;
        }
    }
    .footer {
        min-height: 16px;
        height: auto;
        display: flex;
        > * {
            border-bottom: none;
        }
    }
    th,
    td {
        padding: 4px 12px;
        border-bottom: $borderModule;
        &.center {
            text-align: center;
        }
        &.select {
            width: 28px;
        }
    }
}
</style>
