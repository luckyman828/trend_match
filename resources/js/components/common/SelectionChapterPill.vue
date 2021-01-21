<template>
    <div class="chapter pill xs chapter-pill" v-if="chapter">
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
            getSelectionChapter: 'getSelectionChapter',
        }),
        chapter() {
            return this.getSelectionChapter(this.selection)
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
    }
}
</style>
