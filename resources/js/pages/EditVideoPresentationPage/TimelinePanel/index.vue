<template>
    <div class="timeline-panel">
        <div class="rail">
            <Draggable
                class="draggable"
                v-model="videoTimings"
                tag="div"
                :forceFallback="true"
                group="videoTimings"
                draggable=".timeline-item"
                fallbackClass="sortable-drag"
                :fallbackTolerance="10"
                @add="onAdd"
                @sort="onSort"
            >
                <TimelineItem
                    v-for="(productTiming, index) in videoTimings"
                    :key="productTiming.id"
                    :timing="productTiming"
                    :index="index"
                />
                <div class="spacer" :style="spacerStyle"></div>
            </Draggable>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TimelineItem from './TimelineItem'
import Draggable from 'vuedraggable'

export default {
    name: 'timelinePanel',
    components: {
        TimelineItem,
        Draggable,
    },
    computed: {
        ...mapGetters('videoPresentation', {
            getVideoTimings: 'getVideoTimings',
            timingClone: 'getTimingClone',
        }),
        videoTimings: {
            get() {
                return this.getVideoTimings
            },
            set(value) {
                this.SET_VIDEO_TIMINGS(value)
            },
        },
        spacerStyle() {
            const timings = this.getVideoTimings
            if (timings.length <= 0) return
            const last = timings[timings.length - 1]
            return { left: `${last.end * 3}vw` }
        },
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_VIDEO_TIMINGS', 'ADD_TIMING']),
        ...mapActions('videoPresentation', ['addTiming']),
        onAdd(e) {
            const newIndex = e.newIndex
            const newTiming = this.timingClone
            this.addTiming({ newTiming, index: newIndex })
        },
        onSort(e) {
            const triggeredByTimingAdd = e.from.classList.contains('product-result')
            if (triggeredByTimingAdd) return
            const newIndex = Math.min(e.newIndex, this.videoTimings.length - 1)
            const oldIndex = e.oldIndex
            const movedTiming = this.videoTimings[newIndex]
            console.log('on sort', movedTiming, oldIndex, newIndex)

            if (newIndex > oldIndex) {
                const timingsBefore = this.videoTimings.slice(oldIndex, newIndex)
                timingsBefore.map(timing => {
                    timing.start -= movedTiming.duration
                })
            }

            if (newIndex < oldIndex) {
                const timingsAfter = this.videoTimings.slice(newIndex)
                timingsAfter.map(timing => {
                    timing.start += movedTiming.duration
                })
            }

            if (newIndex > 0) {
                movedTiming.start = this.videoTimings[newIndex - 1].end
            } else {
                movedTiming.start = 0
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timeline-panel {
    grid-area: timeline;
    height: 200px;
    background: white;
    border-top: $borderModule;
    box-shadow: $shadowModule;
    background: $dark;
    overflow-x: auto;
    .rail {
        padding: 16px 0 24px 16px;
        height: 100%;
        &::after {
            content: '';
            display: block;
            width: 16px;
            min-width: 16px;
        }
    }
    .spacer {
        display: block;
        width: 16px;
        min-width: 16px;
        position: absolute;
        right: 0;
        height: 100%;
    }
    .draggable {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
    }
}
</style>
