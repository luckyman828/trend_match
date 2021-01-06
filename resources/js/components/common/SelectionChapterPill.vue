<template>
    <div class="chapter pill xs" v-if="chapter">
        <i class="fas fa-project-diagram"></i>
        <span>
            {{ chapter.name }}
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'selectionChapterPill',
    props: ['selection'],
    computed: {
        ...mapGetters('selections', {
            selections: 'getSelections',
        }),
        chapter() {
            if (!this.selection) return
            if (this.selection.type == 'Chapter') return this.selection
            if (this.selection.parent_chapter) return this.selection.parent_chapter

            // If we are out of easy options.
            if (!this.selections) return
            const stateSelection = this.selections.find(
                stateSelection =>
                    stateSelection.id == this.selection.id ||
                    stateSelection.parent_id == this.selection.id ||
                    stateSelection.id == this.selection.parent_id
            )
            if (stateSelection) {
                if (stateSelection.type == 'Chapter') return stateSelection
                if (stateSelection.parent_chapter) return stateSelection.parent_chapter
            }
        },
    },
}
</script>

<style scoped lang="scss">
i {
    margin-left: 4px;
}
</style>
