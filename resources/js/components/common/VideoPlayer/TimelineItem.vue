<template>
    <div class="timeline-item" :style="itemStyle" :class="{ current: timing.isCurrent }" @click="onSeekTo">
        <v-popover placement="top" popoverClass="min" :container="$el">
            <div class="timeline-marker">
                <div class="inner"></div>
            </div>
            <div class="product-card" slot="popover">
                <span class="name">
                    {{ timing.product ? timing.product.name : 'Not found' }}
                </span>
                <BaseVariantImage
                    v-if="timing.product"
                    :variant="timing.product.variants && timing.product.variants[0]"
                    size="sm"
                />
            </div>
        </v-popover>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timelineItem',
    props: ['timing'],
    computed: {
        ...mapGetters('videoPlayer', {
            videoDuration: 'getDuration',
        }),
        itemStyle() {
            const videoDuration = this.videoDuration
            return {
                left: `${(this.timing.start / this.videoDuration) * 100}%`,
                right: `${100 - (this.timing.end / this.videoDuration) * 100}%`,
            }
        },
    },
    methods: {
        ...mapActions('videoPlayer', {
            seekTo: 'seekTo',
        }),
        onSeekTo() {
            this.seekTo(this.timing.start)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.timeline-item {
    position: absolute;
    bottom: 0px;
    &:hover {
        .timeline-marker {
            opacity: 1;
            box-shadow: $shadowEl;
        }
    }
    .timeline-marker {
        transition: 0.1s ease-out;
        opacity: 0.8;
        box-sizing: content-box;
        padding: 8px 0;
        .inner {
            border-radius: 50px;
            background: white;
            height: 6px;
        }
    }
    &.current {
        .timeline-marker {
            .inner {
                background: $primary;
            }
        }
    }
}
.product-card {
    width: 72px;
    padding: 4px 4px 8px;
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
    }
}
</style>
