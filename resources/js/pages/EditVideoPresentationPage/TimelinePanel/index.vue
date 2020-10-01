<template>
    <div class="timeline-panel">
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
            <TimelineItem v-for="productTiming in videoTimings" :key="productTiming.id" :timing="productTiming" />
        </Draggable>
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
            const newIndex = e.newIndex
            const movedTiming = this.videoTimings[newIndex]
            if (newIndex > 0) {
                movedTiming.start = this.videoTimings[newIndex - 1].end
            } else {
                movedTiming.start = 0
            }

            const timingsToUpdate = this.videoTimings.slice(newIndex + 1)
            timingsToUpdate.map(timing => {
                timing.start += movedTiming.duration
            })
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
    .draggable {
        width: 100%;
        height: 100%;
        display: flex;
        padding: 16px 0 24px 16px;
        &::after {
            content: '';
            display: block;
            width: 16px;
            min-width: 16px;
        }
    }
}
</style>
