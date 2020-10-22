<template>
    <div class="pause-overlay">
        <div class="rail">
            <div class="product-timing-list">
                <TimingListItem
                    class="product-timing-list-item"
                    v-for="(timing, index) in timings"
                    :key="timing.timestamp"
                    :timing="timing"
                    :index="index"
                />
            </div>
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
    computed: {
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.pause-overlay {
    position: absolute;
    background: $dark100;
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
    .paused &,
    .ended & {
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
}
</style>
