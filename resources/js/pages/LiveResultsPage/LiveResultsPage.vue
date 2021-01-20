<template>
    <div class="live-results-page">
        <div class="header flex-list min justify">
            <div class="left">
                <h1>{{ file.name }}</h1>
            </div>

            <div class="center flex-list">
                <div class="selection-list-item" v-for="selection in selectedSelections" :key="selection.id">
                    <button
                        class="white"
                        :class="{ 'is-current': currentSelectionId == selection.id }"
                        @click="onNewSelectionId(selection.id)"
                    >
                        <SelectionIcon :selection="selection" />
                        <span>{{ selection.name }}</span>
                    </button>
                    <div class="timer" v-if="cycleDuration && currentSelectionId == selection.id">
                        <svg>
                            <rect :class="{ animate: !!cycleTimer }" ref="countdown" :style="animationDuration" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="right flex-list">
                <BaseDropdownInputField
                    :options="availableSelections"
                    type="checkbox"
                    placeholder="Choose Selections"
                    v-model="selectedSelections"
                    inputClass="sm"
                />
                <BaseDropdownInputField
                    style="width:"
                    :options="[
                        { name: 'Static', value: 0 },
                        { name: '5s', value: 5000 },
                        { name: '10s', value: 10000 },
                        { name: '20s', value: 20000 },
                    ]"
                    type="radio"
                    placeholder="Set Interval"
                    valueKey="value"
                    v-model="cycleDuration"
                    inputClass="sm"
                    @input="onSetCycleDuration"
                />
                <BaseButton buttonClass="primary" :disabled="true" disabledTooltip="Not implemented yet.">
                    <span>Share</span>
                    <i class="fas fa-share"></i>
                </BaseButton>
            </div>
        </div>

        <div class="body">
            <BaseLoader v-if="fetchingData" />
            <div v-else class="columns col-3">
                <div class="product-column">
                    <h3>Top 10 Most IN</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.ins"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Focus', 'In']"
                        />
                    </div>
                </div>
                <div class="product-column">
                    <h3>Top 10 Most OUT</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.outs"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Out']"
                        />
                    </div>
                </div>
                <div class="product-column">
                    <h3>Top 10 Most FOCUS</h3>
                    <div class="product-list">
                        <ProductListItem
                            v-for="(product, index) in topProductsByAction.focus"
                            :key="product.id"
                            :product="product"
                            :index="index"
                            :actions="['Focus']"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionIcon from '../../components/common/SelectionIcon.vue'
import ProductListItem from './ProductListItem'
import Timer from '../../helpers/Timer'
export default {
    name: 'liveResults',
    components: {
        SelectionIcon,
        ProductListItem,
    },
    data: function() {
        return {
            currentSelectionId: null,
            fetchingData: false,
            selectedSelections: [],
            cycleTimer: null,
            cycleDuration: 0,
        }
    },
    computed: {
        ...mapGetters('files', {
            file: ['getCurrentFile'],
        }),
        ...mapGetters('selections', {
            availableSelections: ['getSelectionsAvailableForPresentation'],
        }),
        ...mapGetters('products', {
            allProducts: ['getProducts'],
        }),
        animationDuration() {
            return `animation-duration: ${this.cycleDuration}ms`
        },
        topProductsByAction() {
            const getFeedbackCount = function(product, actions) {
                const selectionInput = product.getActiveSelectionInput
                if (!selectionInput) return 0
                // console.log(
                //     'get feedback count',
                //     actions,
                //     selectionInput.feedbacks.filter(feedback => actions.includes(feedback.action))
                // )
                const count = selectionInput.feedbacks.filter(feedback => actions.includes(feedback.action)).length
                product[`acount_${actions[0]}`] = count
                return count
            }

            const topIn = [...this.allProducts].sort((a, b) => {
                // console.log('get top in', getFeedbackCount(a, ['Focus', 'In']), getFeedbackCount(b, ['Focus', 'In']))
                return getFeedbackCount(a, ['In', 'Focus']) > getFeedbackCount(b, ['In', 'Focus']) ? -1 : 1
            })
            const topOut = [...this.allProducts].sort((a, b) => {
                return getFeedbackCount(a, ['Out']) > getFeedbackCount(b, ['Out']) ? -1 : 1
            })
            const topFocus = [...this.allProducts].sort((a, b) => {
                return getFeedbackCount(a, ['Focus']) > getFeedbackCount(b, ['Focus']) ? -1 : 1
            })

            const limit = 10
            return {
                ins: topIn.slice(0, limit),
                outs: topOut.slice(0, limit),
                focus: topFocus.slice(0, limit),
            }
        },
    },
    methods: {
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        ...mapMutations('products', ['SET_FEEDBACKS']),
        async onNewSelectionId(selectionId) {
            this.fetchingData = true
            if (this.cycleTimer) {
                this.cycleTimer.clear()
            }
            this.disconnectSignalR()
            this.currentSelectionId = selectionId
            const selection = this.availableSelections.find(x => x.id == selectionId)
            this.SET_CURRENT_SELECTIONS([selection])
            if (!this.allProducts[0].selectionInputList.find(x => x.selection_id == selectionId)) {
                await this.fetchSelectionProducts(selection)
            }
            this.connectToLiveUpdates()
            this.fetchingData = false

            const duration = this.cycleDuration
            if (this.cycleDuration) {
                this.cycleTimer = new Timer(() => {
                    this.cycleNextSelection()
                }, duration)
            }
        },
        cycleNextSelection() {
            const index = this.selectedSelections.findIndex(x => x.id == this.currentSelectionId)
            const isLast = index == this.selectedSelections.length - 1
            const newIndex = isLast ? 0 : index + 1
            this.onNewSelectionId(this.selectedSelections[newIndex].id)
        },
        onSetCycleDuration(newDuration) {
            if (this.cycleTimer) {
                const remaining = this.cycleTimer.getRemaining()
                this.cycleTimer.clear()

                if (newDuration > 0) {
                    this.cycleTimer = new Timer(() => {
                        this.cycleNextSelection()
                    }, newDuration - remaining)
                }
            }
        },
        async connectToLiveUpdates() {
            const connection = this.$connection

            // Subscribe to our selections
            connection.invoke('Subscribe', this.currentSelectionId).catch(function(err) {
                return console.error(err.toString())
            })

            // Feedback
            connection.on('OnBulkFeedbackArrived', this.bulkFeedbackArrivedHandler)
            connection.on('OnFeedbackArrived', this.feedbackArrivedHandler)
        },
        disconnectSignalR() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')

            // Feedback
            connection.off('OnBulkFeedbackArrived', this.bulkFeedbackArrivedHandler)
            connection.off('OnFeedbackArrived', this.feedbackArrivedHandler)
        },
        bulkFeedbackArrivedHandler(selectionId, feedbacks) {
            if (feedbacks[0].user_id != this.authUser.id) {
                // console.log('bulk feedback arrived', selectionId, feedbacks)
                this.SET_FEEDBACKS(feedbacks)
            }
        },
        feedbackArrivedHandler(selectionId, feedback) {
            if (feedback.user_id != this.authUser.id) {
                // console.log('feedback arrived', selectionId, feedback)
                this.SET_FEEDBACKS([feedback])
            }
        },
    },
    destroyed() {
        this.disconnectSignalR()
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.live-results-page {
    padding: 20px;
    padding-right: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    h1 {
        margin: 0;
    }
    .header {
        padding-bottom: 20px;
        > * {
            flex: 1;
            display: flex;
        }
        .center {
            justify-content: center;
            flex: 2;
        }
        .right {
            justify-content: flex-end;
        }
        button {
            min-width: 140px;
            justify-content: flex-start;
            &:not(.is-current) {
                opacity: 0.5;
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
    .columns {
        grid-column-gap: 40px;
    }
    .product-column {
        flex: 1;
        h3 {
            margin-left: 20px;
        }
    }
    .selection-list-item {
        position: relative;
        .timer {
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 4px;
            border-radius: 4px;
            overflow: hidden;
            svg {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                rect {
                    width: 0;
                    height: 100%;
                    fill: white;
                    &.animate {
                        animation: animateWidth linear forwards;
                    }
                }
            }
        }
        // &:hover {
        //     .timer svg rect {
        //         animation-play-state: paused;
        //     }
        // }
    }
}
@keyframes animateWidth {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}
</style>
