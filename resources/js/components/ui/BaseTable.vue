<template>
    <div class="base-table" ref="table">
        <div ref="stickyHeader" class="sticky-header">
            <div ref="stickyBg" class="sticky-bg"></div>
            <div ref="stickyInner" class="inner">
                <div class="tabs" v-if="$slots.tabs">
                    <slot name="tabs"/>
                </div>
                <div class="rounded-top">
                    <slot name="topBar"/>
                </div>
            </div>
        </div>
        <table>
            <tr class="header">
                <slot name="header"/>
            </tr>
            <slot name="body"/>
            <tr class="footer">
                <td class="select"></td>
                <slot name="footer"/>
            </tr>
        </table>
        <!-- <div ref="stickyPlaceholder" class="sticky-placeholder"></div> -->
        <!-- <div class="body">
            <slot name="body"/>
        </div>
        <tr class="footer">
            <td class="select"></td>
            <slot name="footer"/>
        </tr> -->
    </div>
</template>

<script>
export default {
    name: 'baseTable',
    data: function() { return {

    }},
    props: {
        hasStickyHeader: {
            default: true
        }
    },
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
    $rowRadius: 4px;

    .base-table {
        white-space: nowrap;
        border-spacing: 0 2px;
        .tabs {
            display: flex;
            margin-bottom: -$rowRadius;
        }
        .sticky-bg {
            display: none;
        }
        // &.sticky {
        //     .sticky-bg {
        //         background: $bg;
        //         box-shadow: 0 10px 7px -6px rgba(0, 0, 0, 0.05) inset;
        //         position: fixed;
        //         z-index: -1;
        //         display: block;
        //     }
        //     .sticky-header {
        //         position: fixed;
        //         z-index: 1;
        //         .header {
        //             box-shadow: 0px 4px 10px #0000002A;
        //             position: static;
        //         }
        //     }
        //     .sticky-placeholder {
        //         display: block;
        //     }
        // }
        .rounded-top {
            > :first-child {
                border-radius: $rowRadius $rowRadius 0 0;
            }
        }
        tr {
            background: white;
            min-height: 48px;
            vertical-align: middle;
            padding: 8px;
            position: relative;
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
                color: $fontTableHeader;
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
            // overflow: hidden;
        }
        th, td {
            padding: 0 4px;
            &:first-child:not(.select) {
                margin-left: 8px;
            }
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
                    margin-right: 4px;
                }
            }
            &.select {
                flex: 0 1 auto;
                min-width: 40px;
                max-width: 40px;
                display: flex;
                align-items: center;
                height: 100%;
                padding-left: 8px;
                cursor: pointer;
            }
        }
    }
</style>