<template>
    <div class="timeline" :class="{ 'drag-active': isDragging }">
        <div
            ref="targetArea"
            class="target-area"
            v-touch:moved="onDragStart"
            v-touch:moving="onTouchDragMove"
            v-touch:end="onDragEnd"
        />
        <div
            class="timeline-wrapper"
            @click="onClickToTimestamp"
            v-touch:moved="onDragStart"
            v-touch:moving="onTouchDragMove"
            v-touch:end="onDragEnd"
        >
            <div class="rail" :style="railStyle">
                <div
                    class="knob"
                    @mousedown="onDragStart"
                    v-touch:moved="onDragStart"
                    v-touch:moving="onTouchDragMove"
                    v-touch:end="onDragEnd"
                ></div>
            </div>
        </div>
        <TimelineItemList v-if="timings && productsReady" :timings="timings" class="timing-list" />
    </div>
</template>

<script>
import { offset } from '@popperjs/core'
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
            isMounted: false,
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
            const percentage = Math.max(Math.min((timeToUse / this.duration) * 100, 100), 0)
            const rounded = Math.round(percentage * 1e2) / 1e2
            return rounded
        },
        railStyle() {
            if (!this.isMounted) return
            const elRect = this.$el.getBoundingClientRect()
            return `width: calc(${(elRect.width / 100) * this.watchedPercentage}px + 0px);`
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
            // alert('drag start')
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
        onTouchDragMove(e) {
            if (!e.touches) return
            this.getDragTime(e.touches[0])
        },
        onDragEnd() {
            this.seekTo(this.dragTime)
            this.removeDragListeners()

            this.SET_IS_DRAGGING(false)
            this.dragTime = null
        },
        getDragTime(mouseEvent) {
            const playerRect = this.playerIframe.getBoundingClientRect()
            const mouseX = mouseEvent.clientX - playerRect.left
            // Add an offset to allow the user to reach the extremes of each side
            const offSetX = ((mouseX - playerRect.width / 2) / playerRect.width / 2) * 200

            const xPercentage = Math.max(Math.min((mouseX + offSetX) / playerRect.width, 1), 0)
            this.dragTime = this.duration * xPercentage
        },
        touchStartHandler(e) {
            e.preventDefault()
        },
    },
    mounted() {
        this.$refs.targetArea.addEventListener('touchstart', this.touchStartHandler, { passive: false })
        this.isMounted = true
    },
    destroyed() {
        if (this.$refs.targetArea) this.$refs.targetArea.removeEventListener('touchstart', this.touchStartHandler)
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
    .target-area {
        position: absolute;
        top: 0;
        left: 0;
        height: 40px;
        width: 100%;
        width: 200%;
        transform: translate(-25%, -40%);
    }
    @include mobile {
        bottom: 12px;
        transition: bottom $videoPauseTransition;
        .paused &,
        &.drag-active {
            bottom: 16px;
            .rail {
                height: 8px;
            }
            .knob {
                transform: translate(50%, -50%) scale(3);
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
    border-radius: 50px;
    .drag-active & {
        .rail,
        .knob {
            pointer-events: none;
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
    @include mobile {
        background: rgba(white, 25%);
    }
    .rail {
        cursor: pointer;
        height: $heightVideoTimeline;
        position: relative;
        margin-right: 14px;
        background: $primary;
        transition: width 0.05s, height $videoPauseTransition;
        border-radius: 50px;
        @include mobile {
            height: 4px;
            background: white;
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
        top: 50%;
        right: 0;
        transition: transform $videoPauseTransition;
        transform: translate(50%, -50%);
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
            background: $primary;
        }
    }
}
</style>
