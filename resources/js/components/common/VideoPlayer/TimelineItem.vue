<template>
    <div class="timeline-item" :style="itemStyle">
        <v-popover placement="top" popoverClass="min" :container="$el">
            <div class="timeline-marker">
                <div class="inner"></div>
            </div>
            <div class="product-card" slot="popover">
                <span class="name">
                    {{ timing.product.name }}
                </span>
                <BaseVariantImage :variant="timing.product.variants && timing.product.variants[0]" size="sm" />
            </div>
        </v-popover>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.timeline-item {
    position: absolute;
    bottom: 4px;
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
        padding: 4px 0;
        .inner {
            border-radius: 50px;
            background: white;
            height: 6px;
        }
    }
}
.product-card {
    width: 72px;
    padding: 2px;
    .name {
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    img {
        width: 100%;
    }
}
</style>
