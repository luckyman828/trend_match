<template>
    <BaseFlyinColumn class="distribution">
        <template v-slot:header>
            <div class="tab-headers">
                <div :class="{ active: currentTab == 'All' }" class="tab" @click="currentTab = 'All'">
                    ALL
                    <span class="count">{{ totalInputCount }}</span>
                </div>
                <div :class="{ active: currentTab == 'In' }" class="tab" @click="currentTab = 'In'">
                    IN
                    <span class="count">{{
                        selectionInput.ins.length +
                            selectionInput.focus.length +
                            selectionInput.alignmentIns.length +
                            selectionInput.alignmentFocus.length
                    }}</span>
                </div>
                <div :class="{ active: currentTab == 'Out' }" class="tab" @click="currentTab = 'Out'">
                    OUT
                    <span class="count">{{ selectionInput.outs.length + selectionInput.alignmentOuts.length }}</span>
                </div>
                <div :class="{ active: currentTab == 'None' }" class="tab" @click="currentTab = 'None'">
                    ND
                    <span class="count">{{ selectionInput.nds.length + selectionInput.alignmentNds.length }}</span>
                </div>
            </div>
        </template>
        <template v-slot>
            <div class="tab-body">
                <!-- Quantity / Minimum -->
                <div v-if="showQty" class="action-list">
                    <div class="list-item list-header">
                        <span>Minimum</span>
                    </div>
                    <div class="list-body">
                        <div
                            class="distribution-bar list-item"
                            v-tooltip="
                                `
                        <strong>Quantity: </strong> ${selectionInput.totalQuantity}
                        <br><strong>Minimum: </strong> ${product.min_order}
                    `
                            "
                        >
                            <svg>
                                <rect class="bg" height="8px" width="100%" />
                                <rect
                                    :class="minimumPercentage >= 100 ? 'in' : 'progress'"
                                    height="8px"
                                    :style="{ width: `${minimumPercentage}%` }"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Alignment -->
                <div class="alignment-list action-list" v-if="totalActionInputCount > 0">
                    <div class="list-item list-header">
                        <span>Alignment</span>
                        <i class="fas fa-poll-people"></i>
                    </div>
                    <div class="list-body">
                        <ActionDistributionBar class="distribution-bar list-item" :actions="selectionInput.actions" />

                        <ActionListItem
                            class="list-item"
                            v-for="(action, index) in actionsToDisplay"
                            :key="index"
                            :action="action"
                            :showQty="showQty"
                        />
                    </div>
                </div>

                <!-- Feedback -->
                <div class="feedback-list action-list" v-if="totalFeedbackInputCount > 0">
                    <div class="list-item list-header">
                        <span>Feedback</span>
                        <i class="fas fa-vote-yea"></i>
                    </div>
                    <div class="list-body">
                        <ActionDistributionBar class="distribution-bar list-item" :actions="selectionInput.feedbacks" />
                        <div
                            class="feedback-selection-section list-section"
                            v-for="chunk in feedbackSelections"
                            :key="chunk.selection.id"
                        >
                            <div class="section-header">
                                <SelectionChapterPill
                                    class="chapter-pill"
                                    :selection="chunk.selection"
                                    v-if="!chunk.selection.type == 'Chapter'"
                                />
                                <SelectionIcon :selection="chunk.selection" />
                                <span>{{ chunk.selection.name }}</span>
                            </div>
                            <FeedbackListItem
                                class="list-item"
                                v-for="(action, index) in chunk.actions"
                                :key="index"
                                :action="action"
                                :showQty="showQty"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapGetters } from 'vuex'
import ActionDistributionBar from './ActionDistributionBar'
import ActionListItem from './ActionListItem'
import FeedbackListItem from './FeedbackListItem'
import SelectionIcon from '../../../../components/common/SelectionIcon'
import SelectionChapterPill from '../../../../components/common/SelectionChapterPill'

export default {
    name: 'distibutionSection',
    components: {
        ActionDistributionBar,
        ActionListItem,
        FeedbackListItem,
        SelectionIcon,
        SelectionChapterPill,
    },
    props: ['selectionInput', 'product'],
    data: function() {
        return {
            currentTab: 'All',
            currentImgIndex: 0,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('selections', {
            showQty: 'getQuantityModeActive',
        }),
        actionsToDisplay() {
            return this.filterAndSortActions(this.selectionInput.actions)
        },
        feedbackSelections() {
            // Chunk the feedback by selections
            const chunks = []
            this.selectionInput.feedbacks.map(feedback => {
                const matchingChunk = chunks.find(x => x.selection.id == feedback.selection.id)
                if (!matchingChunk) {
                    chunks.push({
                        selection: feedback.selection,
                        actions: [],
                    })
                }
            })
            chunks.map(chunk => {
                chunk.actions = this.filterAndSortActions(
                    this.selectionInput.feedbacks.filter(x => x.selection_id == chunk.selection.id)
                )
            })
            // Filter out empty chunks
            return chunks.filter(x => x.actions.length > 0)
        },
        totalFeedbackInputCount() {
            return this.selectionInput.feedbacks.length
        },
        totalActionInputCount() {
            return this.selectionInput.actions.length
        },
        totalInputCount() {
            return this.totalFeedbackInputCount + this.totalActionInputCount
        },
        minimumPercentage() {
            return this.product.min_order
                ? Math.min((this.selectionInput.totalQuantity / this.product.min_order) * 100, 100).toFixed(0)
                : 100
        },
    },
    methods: {
        filterAndSortActions(actions) {
            if (!actions) return []
            // Filter and sort the actions
            const actionsFiltered = actions.filter(action => {
                return this.currentTab == 'All' || this.currentTab == action.action
            })
            const actionsSorted = actionsFiltered.sort((a, b) => {
                if (a.action == 'Focus' && !['Focus'].includes(b.action)) return -1
                if (a.action == 'In' && !['Focus', 'In'].includes(b.action)) return -1
                if (a.action == 'Out' && !['Focus', 'In', 'Out'].includes(b.action)) return -1
                if (a.action == b.action && a.selection.type == 'Master') return -1
                return 0
            })
            return actionsSorted
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.distribution {
    background: $bg;
    .tab-headers {
        display: flex;
        height: 100%;
        border-radius: $borderRadiusEl;
        border: $borderElSoft;
    }
    .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        background: $bg;
        height: 100%;
        text-align: center;
        font-weight: 700;
        color: $fontSoft;
        cursor: pointer;
        padding: 2px 1px 2px 2px;
        user-select: none;
        &:first-child {
            border-radius: $borderRadiusEl 0 0 $borderRadiusEl;
        }
        &:last-child {
            border-radius: 0 $borderRadiusEl $borderRadiusEl 0;
            padding: 2px;
        }
        &:not(:last-child) {
            border-right: $borderEl;
        }
        &:hover {
            padding: 0;
            color: $primary;
            border: $borderElHover;
            box-shadow: $shadowEl;
        }
        &:active {
            transform: $transformElActive;
        }
        .count {
            color: $font;
            font-size: 12px;
            font-weight: 500;
            margin-left: 8px;
        }
        &.active {
            background: white;
            color: $primary;
        }
    }
}
.action-list {
    background: white;
    margin-bottom: 28px;
    .list-body {
        border-radius: 0 0 4px 4px;
        border: $borderEl;
        border-top: none;
        padding-bottom: 8px;
    }
    .list-item {
        padding: 4px 0 4px 8px;
        border-bottom: $borderElSoft;
        &.distribution-bar {
            padding: 6px 8px;
        }
    }
    .distribution-bar {
        display: flex;
        svg {
            height: 8px;
            border-radius: 4px;
            .bg {
                fill: $grey600;
            }
            .progress {
                fill: $bluegrey800;
            }
            .in {
                fill: $green;
            }
        }
    }
    .list-header {
        background: $dark;
        color: white;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        padding: 6px 12px 6px 8px;
        align-items: center;
        border-radius: 4px 4px 0 0;
        i {
            color: white;
        }
    }
    .list-section {
        margin-bottom: 8px;
    }
    .section-header {
        font-size: 11px;
        font-weight: 700;
        color: $grey700;
        background: $grey300;
        padding: 6px 8px;
        align-items: center;
        display: flex;
        .chapter-pill {
            margin-right: 4px;
            font-weight: 400;
        }
        i {
            width: 20px;
            &.master {
                margin-left: 8px;
            }
        }
    }
}
</style>
