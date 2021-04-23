<template>
    <div class="alignment-chapter">
        <ActionListItem
            class="list-item"
            v-for="(action, index) in actionsFiltered"
            :key="index"
            :action="action"
            :showQty="showQty"
            :expanded.sync="expanded"
        />
    </div>
</template>

<script>
import ActionListItem from './ActionListItem'
export default {
    name: 'chapterActionGroup',
    components: { ActionListItem },
    props: ['actions', 'chapter', 'showQty'],
    data() {
        return {
            expanded: true,
        }
    },
    computed: {
        actionsFiltered() {
            const filtered = this.expanded
                ? this.actions
                : this.actions.filter(action => action.selection.type == 'Chapter')
            return filtered.sort((a, b) => (a.selection.type == 'Chapter' ? -1 : 1))
        },
    },
}
</script>

<style></style>
