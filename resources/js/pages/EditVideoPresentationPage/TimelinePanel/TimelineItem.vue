<template>
    <div class="timeline-item" :style="style">
        <div class="inner">
            <span class="name">
                {{ product.title }}
            </span>
            <div class="img-wrapper">
                <BaseVariantImage :variant="product.variants[0]" size="sm" />
            </div>
            <span class="time"> {{ timing.start | timeStampify }} - {{ timing.end | timeStampify }} </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'timelineItem',
    props: ['timing'],
    data: function() {
        return {
            zoom: 3,
        }
    },
    computed: {
        product() {
            return this.timing.product
        },
        style() {
            return {
                width: `${this.timing.duration * this.zoom}vw`,
                minWidth: `${this.timing.duration * this.zoom}vw`,
            }
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
