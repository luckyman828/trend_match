<template>
    <div class="timeline-item" :style="style">
        <div class="controls">
            <button class="red" @click="onRemoveTiming">
                <i class="far fa-trash"></i>
            </button>
        </div>
        <div class="inner">
            <span class="name">
                {{ timing.start }} -
                {{ product.title }}
            </span>
            <div class="img-wrapper">
                <BaseVariantImage :variant="product.variants[0]" size="sm" />
            </div>
            <span class="time">
                <BaseEditableSpan :value="timing.start" pattern="^(2[0-3]|[01][0-9]):[0-5][0-9]$" maxlength="5">{{
                    timing.start | timeStampify
                }}</BaseEditableSpan>
                <span> - </span>
                <BaseEditableSpan :value="timing.start" pattern="^(2[0-3]|[01][0-9]):[0-5][0-9]$" maxlength="5">{{
                    timing.end | timeStampify
                }}</BaseEditableSpan>
            </span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timelineItem',
    props: ['timing', 'index'],
    computed: {
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
        }),
        product() {
            return this.timing.product
        },
        style() {
            return {
                // left: `${this.timing.start * this.zoom}vw`,
                marginLeft: `${this.timing.timeToPrev * this.zoom}vw`,
                width: `${this.timing.duration * this.zoom}vw`,
                minWidth: `${this.timing.duration * this.zoom}vw`,
            }
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['removeTiming']),
        onRemoveTiming() {
            this.removeTiming(this.index)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timeline-item {
    height: 100%;
    background: white;
    border-radius: $borderRadiusEl;
    border: $borderElHard;
    box-shadow: $shadowEl;
    overflow: hidden;
    padding: 8px 12px;
    // position: absolute;
    position: relative;
    .controls {
        position: absolute;
        top: 4px;
        right: 4px;
        opacity: 0;
        transition: 0.1 ease-out;
    }
    &:hover {
        .controls {
            opacity: 1;
        }
    }
    .inner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .img-wrapper {
        margin: 4px 0;
        flex: 1;
        overflow: hidden;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
            object-position: left;
        }
    }
    .name {
        font-size: 12px;
        font-weight: 500;
    }
    .time {
        font-size: 10px;
    }
}
</style>
