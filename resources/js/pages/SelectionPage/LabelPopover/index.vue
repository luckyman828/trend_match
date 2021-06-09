<template>
    <div class="label-popover">
        <div class="header flex-list justify">
            <div class="flex-list center-v">
                <span class="ft-14 ft-bd">Votes</span>
                <div class="pill xxs dark w-xxs" v-if="totalVotes > 0">{{ totalVotes }}</div>
            </div>
            <button v-if="hasWriteAccess" class="pill sm" :class="hasUserVote ? 'red-hover dark' : ''" @click="onVote">
                <template v-if="hasUserVote">
                    <span class="hover-only">Remove vote</span>
                    <span class="no-hover">Voted</span>
                </template>
                <span v-else>Vote</span>
            </button>
        </div>
        <div class="body flex-list flex-v space-md">
            <div class="vote-list flex-list flex-v space-xs" v-if="noneChapterVotes.length > 0">
                <VoteListItem
                    class="vote-list-item flex-list justify center-v"
                    v-for="(vote, index) in noneChapterVotes"
                    :key="index"
                    :vote="vote"
                />
            </div>
            <div
                class="vote-list chapter flex-list flex-v space-xs"
                v-for="chapterChunk in votesChunkedByChapter"
                :key="chapterChunk.chapter.id"
            >
                <div class="chapter">
                    <div class="chapter-square square light xxs">{{ chapterChunk.chapter.name.toUpperCase() }}</div>
                </div>
                <VoteListItem
                    class="vote-list-item flex-list justify center-v"
                    v-for="(vote, index) in chapterChunk.votes"
                    :key="index"
                    :vote="vote"
                />
            </div>
        </div>
    </div>
</template>

<script>
import VoteListItem from './VoteListItem'
import SelectionChapterPill from '../../../components/common/SelectionChapterPill'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'labelPopover',
    components: { VoteListItem, SelectionChapterPill },
    props: ['labelInput', 'product'],
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', {
            selectionMode: 'getCurrentSelectionMode',
            selection: 'getCurrentSelection',
            getUserWriteAccess: 'getAuthUserSelectionWriteAccess',
        }),
        totalVotes() {
            return this.labelInput.votes.length
        },
        hasUserVote() {
            const userLabels = this.product.yourLabels
            return userLabels.includes(this.labelInput.label)
        },
        noneChapterVotes() {
            return this.labelInput.votes.filter(vote => !vote.selection.chapter)
        },
        hasWriteAccess() {
            const userWriteAccess = this.getUserWriteAccess(this.selection, this.product)
            return userWriteAccess && userWriteAccess.actions.hasAccess
        },
        votesChunkedByChapter() {
            const chapters = []
            this.labelInput.votes.map(vote => {
                if (!vote.selection.chapter) return
                const matchingChapter = chapters.find(chunk => chunk.chapter.id == vote.selection.chapterId)
                if (!matchingChapter) {
                    chapters.push({
                        chapter: vote.selection.chapter,
                        votes: [vote],
                    })
                } else {
                    matchingChapter.votes.push(vote)
                }
            })
            return chapters
        },
    },
    methods: {
        ...mapActions('actions', ['updateProductLabelInput']),
        ...mapMutations('products', ['UPDATE_FEEDBACKS', 'UPDATE_ACTIONS']),
        onVote() {
            const labelIndex = this.product.yourLabels.findIndex(label => label == this.labelInput.label)
            if (labelIndex < 0) {
                this.product.yourLabels.push(this.labelInput.label)
            } else {
                this.product.yourLabels.splice(labelIndex, 1)
            }
            this.onUpdateLabels()
        },
        async onUpdateLabels() {
            await this.updateProductLabelInput(this.product)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.label-popover {
    padding: 16px 2px 20px;
    width: 256px;
    .header {
        padding: 0 14px;
        background: white;
    }
    .body {
        padding: 8px 14px 0;
        max-height: 200px;
        overflow-y: auto;
    }
    .vote-list.chapter:first-child {
        margin-top: -8px;
    }
    .chapter-square {
        padding-left: 8px;
        padding-right: 8px;
    }
}
</style>
