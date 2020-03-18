<template>
    <div class="tooltip-list-item row">
            <span v-if="label" class="label">{{label}}</span>
            <strong class="value">{{value}}</strong>
    </div>
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
        display: flex;
        min-width: 152px;
        &:first-child {
            border-top: solid 1px $divider;;
        }
        > * {
            width: 50%;
        }
        .label {
            margin-right: 16px;
            + .value {
                text-align: right;
            }
        }
        .value {
            min-width: 44px;
        }
    }

</style>