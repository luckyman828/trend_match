<template>
    <div class="action-distribution-tooltip">
        <div class="header">
            <h4>{{type}}</h4>
        </div>

        <ActionDistributionList
        :feedbackActions="product.feedbacks.filter(x => x.action == type)" 
        :alignmentActions="product.actions.filter(x => x.action == type)"
        :defaultTab="actionDistributionTooltipTab"
        @changeTab="event => $emit('changeTab', event)"/>
    </div>
</template>

<script>
import ActionDistributionList from './ActionDistributionList'

export default {
    name: 'actionDistributionTooltip',
    props: [
        'product',
        'type',
        'actionDistributionTooltipTab'
    ],
    components: {
        ActionDistributionList
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

div.header {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-bottom: solid 1px $divider;
    margin-bottom: 12px;
    h4 {
        font-size: 12px;
        color: $primary;
        font-weight: 700;
        margin: 0;
        max-width: 148px;
        word-break: break-all;
    }
}

.action-list {
    margin: 8px auto 12px;
    display: flex;
    justify-content: center;
    ::v-deep {
        .action-list-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            button {
                width: 32px;
                max-width: 32px;
                border-radius: 0;
            }
            .count {
                margin-top: 4px;
                line-height: 1;
                font-size: 14px;
            }
            &:first-child button {
                border-radius: 4px 0 0 4px;
            }
            &:last-child button {
                border-radius: 0 4px 4px 0;
            }
        }
    }
}
</style>