<template>
    <div class="video-timing-list">
        <TimelineItem
            v-for="timing in timings"
            :key="timing.id"
            :timing="timing"
            v-tooltip-trigger="{
                tooltipRef: 'timingTooltip',
                showArg: timing,
            }"
        />

        <BasePopover ref="timingTooltip" @show="onShowTooltip" class="min">
            <div class="product-card" v-if="tooltipTiming">
                <span class="name">
                    {{ tooltipTiming.product ? tooltipTiming.product.name : 'Not found' }}
                </span>
                <BaseVariantImage
                    v-if="tooltipTiming.product"
                    :variant="tooltipTiming.product.variants && tooltipTiming.product.variants[0]"
                    size="sm"
                />
            </div>
        </BasePopover>
    </div>
</template>

<script>
import TimelineItem from './TimelineItem'

export default {
    name: 'timelineItemList',
    components: {
        TimelineItem,
    },
    props: ['timings'],
    data: function() {
        return {
            tooltipTiming: null,
        }
    },
    methods: {
        onShowTooltip(timing) {
            this.tooltipTiming = timing
        },
    },
}
</script>

<style lang="scss" scoped>
.video-timing-list {
    position: absolute;
    bottom: 8px;
    width: 100%;
    left: 0;
    // z-index: 1;
    height: 20px;
    overflow: hidden;
    @include mobile {
        display: none;
    }
}
.product-card {
    width: 92px;
    padding: 4px 4px 8px;
    // background: white;
    .name {
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    img {
        width: 100%;
        display: block;
        height: 112px;
        object-fit: contain;
        background: $grey;
    }
}
</style>
