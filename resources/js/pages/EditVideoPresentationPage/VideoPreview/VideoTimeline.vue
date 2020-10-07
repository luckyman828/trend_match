<template>
    <div class="timeline" @click="onClickToTimestamp" :class="{ 'drag-active': isDragging }">
        <div class="rail" :style="railStyle">
            <div class="knob" :style="knobStyle" @mousedown="onDragStart"></div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'videoTimeline',
    data: function() {
        return {
            dragTime: 0,
            stopDragTimeout: null,
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
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.timeline {
    width: 100%;
    background: #bbbbbb;
    cursor: pointer;
    &.drag-active {
        .rail,
        .knob {
            transition: none;
            cursor: grabbing;
        }
    }
    &:hover {
        .rail {
            height: 12px;
        }
        .knob {
            height: 18px;
            width: 18px;
        }
    }
    .rail {
        cursor: pointer;
        height: 8px;
        position: relative;
        margin-right: 14px;
        background: $primary;
        transition: width 0.05s, height 0.1s;
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
    }
}
</style>
