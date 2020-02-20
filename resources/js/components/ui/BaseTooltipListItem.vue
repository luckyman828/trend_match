<template>
    <div class="tooltip-list-item">

        <p class="row">
            <span v-if="label" class="label">{{label}}</span>
            <strong class="value">{{value}}</strong>
        </p>

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
        padding: 0 12px;
        margin: 0;
        border: solid 1px $darkAlt;
        height: 32px;
        line-height: 32px;
        display: flex;
        justify-content: space-between;
        min-width: 152px;
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