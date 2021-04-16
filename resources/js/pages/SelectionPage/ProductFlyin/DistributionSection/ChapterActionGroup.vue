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
            return this.expanded ? this.actions : this.actions.filter(action => action.selection.type == 'Chapter')
        },
    },
}
</script>

<style></style>
