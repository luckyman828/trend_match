<template>
    <tr class="tooltip-list-item row">
        <td><span v-if="label" class="label">{{label}}</span></td>
        <td><strong class="value">{{value}}</strong></td>
    </tr>
</template>

<script>
export default {
    name: 'baseTooltipListItem',
    props: [
        'label',
        'value',
    ],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .row {
        font-size: 12px;
        padding: 4px 12px;
        margin: 0;
        border-bottom: solid 1px $divider;
        // display: flex;
        min-width: 152px;
        &:first-child {
            border-top: solid 1px $divider;
        }
        > * {
            // width: 50%;
            border-top: solid 1px $divider;
            padding: 4px 12px;
        }
        .label {
            + .value {
                text-align: right;
            }
        }
        .value {
            min-width: 44px;
        }
    }

</style>