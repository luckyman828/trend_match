<template>
    <BaseDrawer class="timing-list-drawer" position="bottom" :show="show" @close="$emit('close')">
        <div class="timing-list flex-list" v-dragscroll v-horizontal-scroll>
            <TimingListItem v-for="timing in timings" :key="timing.id" :timing="timing" />
        </div>
    </BaseDrawer>
</template>

<script>
import { mapGetters } from 'vuex'
import TimingListItem from './TimingListItem'

export default {
    name: 'TimingListDrawer',
    components: { TimingListItem },
    props: ['show'],
    computed: {
        ...mapGetters('playPresentation', {
            timings: 'getTimings',
        }),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
::v-deep {
    &.timing-list-drawer {
        z-index: 1;
        .overlay {
            opacity: 0;
        }
        .drawer {
            height: auto;
            @include bg-blur;
            > .body {
                padding: 0 16px 52px;
            }
        }
    }
}
.timing-list {
    padding-bottom: 8px;
    width: 100%;
    overflow-x: scroll;
    &::-webkit-scrollbar-track {
        border-radius: 4px;
        background: transparent;
    }
    &:hover {
        &::-webkit-scrollbar-thumb {
            background: #a7b2c2;
        }
    }
    &::-webkit-scrollbar-thumb {
        background: transparent;
        transition: 0.3s;
    }
}
</style>
