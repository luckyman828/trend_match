<template>
    <div class="chapter square xs chapter-pill" v-if="chapter">
        <i v-if="showCaret" class="fas" :class="caretExpanded ? 'fa-caret-down' : 'fa-caret-right'"></i>
        <!-- <i class="fas fa-project-diagram"></i> -->

        <span>
            {{ nameToDisplay }}
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'selectionChapterPill',
    props: ['selection', 'short', 'showCaret', 'caretExpanded'],
    computed: {
        ...mapGetters('selections', {
            getSelectionChapter: 'getSelectionChapter',
        }),
        chapter() {
            return this.getSelectionChapter(this.selection)
        },
        nameToDisplay() {
            let name = this.chapter.name
            if (this.short && typeof name == 'string') {
                const nameParts = name.split(' ')
                name =
                    nameParts.length > 1 ? `${nameParts[0].slice(0, 1)}${nameParts[1].slice(0, 1)}` : name.slice(0, 2)
                name = name.toUpperCase()
            }
            return name
        },
    },
}
</script>

<style scoped lang="scss">
i {
    margin-left: 4px;
}
.chapter-pill {
    max-width: 100%;
    > span {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 10px;
    }
}
</style>
