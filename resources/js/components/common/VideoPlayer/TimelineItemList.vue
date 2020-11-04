<template>
    <div class="video-timing-list">
        <TimelineItem v-for="timing in timings" :key="timing.id" :timing="timing" />
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
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

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
</style>
