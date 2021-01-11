<template>
    <div class="timeline">
        <div class="timeline-wrapper" @click="onClickToTimestamp" :class="{ 'drag-active': isDragging }">
            <div class="rail" :style="railStyle">
                <div class="knob" :style="knobStyle" @mousedown="onDragStart"></div>
            </div>
        </div>
        <TimelineItemList v-if="timings && productsReady" :timings="timings" class="timing-list" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TimelineItemList from './TimelineItemList'

export default {
    name: 'videoTimeline',
    components: {
        TimelineItemList,
    },
    data: function() {
        return {
            dragTime: 0,
            stopDragTimeout: null,
            // watchedPercentage: 0,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            duration: 'getDuration',
            timestamp: 'getTimestamp',
            player: 'getPlayer',
            playerIframe: 'getIframe',
            isDragging: 'getTimelineKnobIsBeingDragged',
        }),
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
        ...mapGetters('products', {
            productsStatus: 'productsStatus',
        }),
        watchedPercentage() {
            const timeToUse = this.isDragging ? this.dragTime : this.timestamp
            const percentage = (timeToUse / this.duration) * 100
            const rounded = Math.round(percentage * 1e2) / 1e2
            return rounded
        },
        knobStyle() {
            const playerRect = this.playerIframe.getBoundingClientRect()
            return `transform: translateX(calc(${(playerRect.width / 100) * this.watchedPercentage}px - ${14 *
                (this.watchedPercentage / 100)}px));`
        },
        railStyle() {
            const playerRect = this.playerIframe.getBoundingClientRect()
            return `width: calc(${(playerRect.width / 100) * this.watchedPercentage}px + 0px);`
        },
        productsReady() {
            return this.productsStatus == 'success'
        },
    },
    methods: {
        ...mapActions('videoPlayer', ['seekTo']),
        ...mapMutations('videoPlayer', ['SET_IS_DRAGGING']),
        addDragListeners() {
            document.addEventListener('mouseup', this.onDragEnd)
            document.body.addEventListener('mouseleave', this.onDragEnd)
            document.addEventListener('mousemove', this.onDragMove)
        },
        removeDragListeners() {
            document.removeEventListener('mouseup', this.onDragEnd)
            document.removeEventListener('mousemove', this.onDragMove)
            document.body.removeEventListener('mouseleave', this.onDragEnd)
        },
        onClickToTimestamp(e) {
            this.getDragTime(e)
            this.seekTo(this.dragTime)
            this.dragTime = null
        },
        onDragStart(e) {
            // Remove any previous drag listener - just in case
            this.removeDragListeners()
            this.SET_IS_DRAGGING(true)
            // clearTimeout(this.stopDragTimeout)
            this.getDragTime(e)
            this.addDragListeners()
        },
        onDragMove(e) {
            this.getDragTime(e)
        },
        onDragEnd() {
            this.seekTo(this.dragTime)
            this.removeDragListeners()

            this.SET_IS_DRAGGING(false)
            this.dragTime = null
            // Use a timeout to let the player set the new timestamp before reverting to using the player timestamp
            // this.stopDragTimeout = setTimeout(() => {
            // }, 1000)
        },
        getDragTime(mouseEvent) {
            const playerRect = this.playerIframe.getBoundingClientRect()
            const mouseX = mouseEvent.clientX - playerRect.left
            const xPercentage = Math.max(Math.min(mouseX / playerRect.width, 1), 0)
            this.dragTime = this.duration * xPercentage
        },
        // getWatchedPercentage() {
        //     const timeToUse = this.isDragging ? this.dragTime : this.timestamp
        //     const percentage = (timeToUse / this.duration) * 100
        //     const rounded = Math.round(percentage * 1e2) / 1e2
        //     this.watchedPercentage = rounded
        // },
    },
    created() {
        // setInterval(this.getWatchedPercentage(), 1000)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.timeline {
    position: relative;
    .timing-list {
        transition: 0.1s ease-out;
    }
    @include mobile {
        bottom: 8px;
        .paused & {
            bottom: 12px;
            .rail {
                height: 12px;
            }
            .knob {
                top: -6px;
                height: 24px;
                width: 24px;
            }
        }
    }
}
.timeline-wrapper {
    width: 100%;
    background: #bbbbbb;
    cursor: pointer;
    position: relative;
    z-index: 3;
    &.drag-active {
        .rail,
        .knob {
            transition: none;
            cursor: grabbing;
        }
    }
    @include desktop {
        &:hover {
            .rail {
                height: 12px;
            }
            .knob {
                height: 18px;
                width: 18px;
            }
            & + .timing-list {
                transform: translateY(-4px);
            }
        }
    }
    .rail {
        cursor: pointer;
        height: $heightVideoTimeline;
        position: relative;
        margin-right: 14px;
        background: $primary;
        transition: width 0.05s, height 0.1s;
        @include mobile {
            height: 4px;
        }
    }
    .knob {
        cursor: pointer;
        transition: 0.1s;
        height: 14px;
        width: 14px;
        border-radius: 50px;
        background: white;
        position: absolute;
        top: -3px;
        left: 0;
        transition: transform 0.05s;
        // Make not draggable
        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        @include mobile {
            height: 8px;
            width: 8px;
            top: -2px;
        }
    }
}
</style>
