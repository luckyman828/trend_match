<template>
    <div class="timeline-item" :style="style" :id="`timeline-item-${timing.id}`" :class="[{ current: isCurrent }]">
        <div class="inner">
            <div class="img-wrapper">
                <div class="img-sizer">
                    <BaseVariantImage :variant="product.variants && product.variants[0]" size="sm" />
                </div>
            </div>
            <div class="details">
                <span class="name">
                    {{ product.title }}
                </span>
                <div class="time">
                    <span class="start">{{ timing.start | timestampify }}</span>
                    <span class="end">{{ timing.end | timestampify }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timelineItem',
    props: ['timing', 'index'],
    data: function() {
        return {}
    },
    computed: {
        ...mapGetters('videoPlayer', {
            videoDuration: 'getDuration',
            cursorTimestamp: 'getTimestamp',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
            rail: 'getTimelineRail',
            snapThreshold: 'getSnapThreshold',
        }),
        product() {
            return this.timing.product
        },
        style() {
            const width = (this.timing.duration / this.videoDuration) * 100
            const start = (this.timing.start / this.videoDuration) * 100
            const end = (1 - this.timing.end / this.videoDuration) * 100
            const prevEnd = this.timing.prevTiming ? (this.timing.prevTiming.end / this.videoDuration) * 100 : 0
            return {
                // left: `${start}%`,
                // right: `${end}%`,
                width: `${width}%`,
                minWidth: `${width}%`,
                maxWidth: `${width}%`,
                marginLeft: `${start - prevEnd}%`,
            }
        },
        isCurrent() {
            return this.currentTiming && this.currentTiming.id == this.timing.id
        },
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timeline-item {
    background: white;
    border: solid 2px white;
    border-radius: $borderRadiusEl;
    box-shadow: 0 3px 6px rgba(black, 0.2);
    padding: 4px;
    padding-right: 0;
    pointer-events: all;
    position: relative; // DON'T CHANGE !! - We need it to be relative for draggable to work
    transition: width 0.05s ease-out;

    // Make not draggable
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    .controls {
        position: absolute;
        top: -14px;
        right: 4px;
        opacity: 0;
        pointer-events: none;
        transition: 0.1s ease-out;
        z-index: 2;
    }
    &.current {
        background: $primary;
        border-color: $primary;
        color: white;
    }
    &.error {
        opacity: 0.8;
        background: $red;
    }
    .inner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
    .img-wrapper {
        overflow: hidden;
        width: 48px;
        min-width: 48px;
        border: $borderEl;
        border-radius: 50px;
        .img-sizer {
            height: 0;
            padding-top: 100%;
            position: relative;
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
                position: absolute;
                left: 0;
                top: 0;
                // Make not draggable
                user-drag: none;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-drag: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
        }
    }
    .details {
        display: flex;
        flex-direction: column;
        margin-left: 4px;
        justify-content: space-between;
        padding-right: 6px;
        .name {
            font-size: 14px;
            font-weight: 500;
        }
        .time {
            font-size: 12px;
            .end {
                margin-left: 8px;
            }
        }
    }
}
</style>
