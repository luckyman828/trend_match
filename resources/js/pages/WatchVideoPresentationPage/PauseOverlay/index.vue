<template>
    <div class="pause-overlay" :class="[{ 'controls-hidden': controlsHidden }, { show: show }]">
        <BaseLoader v-if="isLoading" />
        <div class="rail" v-else-if="isVisible">
            <RecycleScroller
                class="product-timing-list"
                :items="timings"
                direction="horizontal"
                :item-size="96"
                key-field="id"
                ref="scroller"
                v-horizontal-scroll
                v-dragscroll
                v-slot="{ item, index }"
                @visible="onScrollerVisible"
            >
                <TimingListItem class="product-timing-list-item" :timing="item" :index="index" />
            </RecycleScroller>
            <!-- <div class="product-timing-list" v-horizontal-scroll v-dragscroll>
                <TimingListItem
                    class="product-timing-list-item"
                    v-for="(timing, index) in timings"
                    :key="timing.id"
                    :timing="timing"
                    :index="index"
                />
            </div> -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TimingListItem from './TimingListItem'
export default {
    name: 'pauseOverlay',
    components: {
        TimingListItem,
    },
    props: ['show'],
    data: function() {
        return {
            isVisible: false,
            isLoading: false,
            showTimeout: null,
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.isLoading = true
                this.showTimeout = setTimeout(() => {
                    this.onShow()
                }, 100)
            } else {
                this.isVisible = false
                clearTimeout(this.showTimeout)
            }
        },
    },
    computed: {
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
        ...mapGetters('videoPlayer', {
            controlsHidden: 'getControlsHidden',
            currentTiming: 'getCurrentTiming',
            currentTimingIndex: 'getCurrentTimingIndex',
        }),
    },
    methods: {
        onShow() {
            this.isVisible = true
            this.isLoading = false
        },
        onScrollerVisible() {
            if (!this.currentTiming) return
            this.$refs.scroller.scrollToItem(this.currentTimingIndex)
        },
    },
    destroyed() {
        if (this.showTimeout) clearTimeout(this.showTimeout)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.pause-overlay {
    position: absolute;
    color: white;
    width: 100%;
    z-index: 1;
    transition: 0.1s ease-out;
    transform: translateY(100%);
    box-shadow: $shadowModule;
    border-radius: 8px 8px 0 0;
    height: $heightPauseOverlay;
    bottom: calc(#{$heightPlayerControls} + 8px);
    pointer-events: all;
    border-radius: 20px 20px 0 0;
    backdrop-filter: blur(20px);
    background: rgba(black, 0.6);
    padding-top: 16px;
    &.controls-hidden {
        bottom: 0;
    }
    &.show {
        transform: none;
    }
    .rail {
        height: 100%;
    }
    .product-timing-list {
        display: flex;
        height: 100%;
        padding: 0 28px;
        align-items: center;
        width: 100%;
        overflow-x: auto;
    }
    @media screen and (max-width: $screenXs) {
        display: none;
    }
}
</style>
