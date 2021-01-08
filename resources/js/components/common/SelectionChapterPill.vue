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
            getSelectionChapter: 'getSelectionChapter',
        }),
        chapter() {
            this.getSelectionChapter(this.selection)
        },
    },
}
</script>

<style scoped lang="scss">
i {
    margin-left: 4px;
}
</style>
