<template>
    <div class="action-list-item">
        <SelectionChapterPill
            class="chapter"
            :selection="action.selection"
            v-if="!action.selection.type == 'Chapter'"
        />
        <i
            v-if="action.selection.type == 'Master'"
            :selection="action.selection"
            class="selection-icon fas fa-crown primary"
        />
        <span class="selection-name">{{ action.selection.name }}</span>
        <span class="action" v-if="!showQty || ['None', 'Out'].includes(action.action)">{{ action.action }}</span>
        <div class="quantity pill ghost xs" v-else>
            <i class="fas fa-box"></i>
            <span>{{ totalQty }}</span>
        </div>
        <div class="action-indicator" :class="action.action" />
    </div>
</template>

<script>
import SelectionChapterPill from '../../../../components/common/SelectionChapterPill'
export default {
    name: 'actionListItem',
    components: {
        SelectionChapterPill,
    },
    props: ['action', 'showQty'],
    computed: {
        totalQty() {
            return this.action.variants.reduce((total, variant) => {
                return total + variant.quantity
            }, 0)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.action-list-item {
    display: flex;
    align-items: center;
    padding-right: 0px;
    .chapter {
        margin-right: 4px;
    }
    .selection-icon {
        margin-right: 6px;
        font-size: 12px;
    }
    .selection-name {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .action {
        margin-left: auto;
        text-transform: uppercase;
        font-size: 11px;
        flex-shrink: 0;
    }
    .quantity {
        margin-left: auto;
        flex-shrink: 0;
        i {
            margin-left: 4px;
        }
    }
    .action-indicator {
        width: 8px;
        height: 24px;
        border-radius: 8px 0 0 8px;
        margin-left: 8px;
        background: $grey500;
        flex-shrink: 0;
        &.Focus {
            background: $primary;
        }
        &.In {
            background: $green;
        }
        &.Out {
            background: $red;
        }
    }
}
</style>
