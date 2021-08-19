<template>
    <div class="action-list-item" @click="action.selection.type == 'Chapter' && $emit('update:expanded', !expanded)">
        <template v-if="action.selection.chapter">
            <div class="chapter-wrapper">
                <SelectionChapterPill
                    :short="action.selection.type != 'Chapter'"
                    class="chapter"
                    :selection="action.selection"
                    :showCaret="action.selection.type == 'Chapter'"
                    :caretExpanded="expanded"
                    v-tooltip="action.selection.chapter && action.selection.chapter.name"
                />
            </div>
        </template>
        <i
            v-if="action.selection.type == 'Master'"
            :selection="action.selection"
            class="selection-icon fas fa-crown primary"
        />
        <span class="selection-name" v-if="action.selection.type != 'Chapter'" v-tooltip="action.selection.name">{{
            action.selection.name
        }}</span>
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
    props: ['action', 'showQty', 'expanded'],
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
.action-list-item {
    display: flex;
    align-items: center;
    padding: 4px 0 4px 8px;
    border-bottom: $borderElSoft;
    padding-right: 0px;
    > * {
        flex: 1;
    }
    .chapter-toggle {
        flex: 0 1 auto;
    }
    .chapter-wrapper {
        margin-right: 4px;
        white-space: nowrap;
        overflow: hidden;
        flex: 0 1 auto;
    }
    .selection-icon {
        margin-right: 6px;
        font-size: 12px;
        flex-grow: 0;
    }
    .selection-name {
        font-size: 12px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-right: 4px;
    }
    .action {
        margin-left: auto;
        text-transform: uppercase;
        font-size: 11px;
        flex-grow: 0;
        flex-shrink: 0;
    }
    .quantity {
        margin-left: auto;
        flex: 0 1 auto;
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
        flex-grow: 0;
        min-width: 8px;
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
