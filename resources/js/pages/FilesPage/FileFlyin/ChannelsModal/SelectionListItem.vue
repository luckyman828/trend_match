<template>
    <BaseTableV2Row
        class="selection-list-item"
        :item="selectionRules"
        :selectedItems="selectedSelections"
        @update:selectedItems="$event => $emit('update:selectedSelections', $event)"
    >
        <td class="name">
            <div class="name-inner">
                <SelectionChapterPill v-if="selection.type == 'Normal'" :selection="selection" /><span>
                    {{ selection.name }}</span
                >
            </div>
        </td>
        <td class="center">
            <BaseCheckbox
                :value="true"
                v-model="selectionRules.broadcast_alignment"
                @change="onRuleChange($event, 'broadcast_alignment')"
            />
        </td>
        <td class="center">
            <BaseCheckbox
                :value="true"
                v-model="selectionRules.broadcast_feedback"
                @change="onRuleChange($event, 'broadcast_feedback')"
            />
        </td>
        <td class="center">
            <BaseCheckbox
                :value="true"
                v-model="selectionRules.broadcast_request"
                @change="onRuleChange($event, 'broadcast_request')"
            />
        </td>
        <td class="center">
            <BaseCheckbox
                :value="true"
                v-model="selectionRules.broadcast_comment"
                @change="onRuleChange($event, 'broadcast_comment')"
            />
        </td>
        <td>
            <button class="no-bg ghost-button true-square" @click="$emit('remove', index)">
                <i class="far fa-trash"></i>
            </button>
        </td>
    </BaseTableV2Row>
</template>

<script>
import SelectionChapterPill from '../../../../components/common/SelectionChapterPill'
import { mapGetters } from 'vuex'
export default {
    name: 'selectionListItem',
    components: { SelectionChapterPill },
    props: ['selectionRules', 'selectedSelections', 'index'],
    computed: {
        ...mapGetters('selections', {
            allSelections: 'getSelections',
        }),
        selection() {
            return this.allSelections.find(x => x.id == this.selectionRules.selection_id)
        },
    },
    methods: {
        onRuleChange(isTrue, ruleName) {
            this.selectedSelections.map(selectionRules => {
                selectionRules[ruleName] = isTrue
            })
            this.$emit('update')
        },
    },
}
</script>

<style lang="scss">
.selection-list-item {
    width: 100%;
}
.checkbox {
    padding: 4px 0;
}
.name-inner {
    display: flex;
    max-width: 200px;
    white-space: nowrap;
    .chapter-pill {
        margin-right: 4px;
    }
    > span {
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
</style>
