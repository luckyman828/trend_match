<template>
    <div
        class="product-timing-list-item"
        :class="{ current: index == currentTimingIndex }"
        @click="seekTo(timing.start)"
    >
        <div class="name-wrapper">
            <span class="name">{{ product ? product.name : 'Not found' }}</span>
        </div>
        <div class="img-wrapper">
            <BaseVariantImage v-if="product" :variant="product.variants[0]" size="sm" />
        </div>
        <span class="timestamp">{{ timing.start | timestampify }}</span>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timingListItem',
    props: ['timing', 'index'],
    computed: {
        ...mapGetters('videoPlayer', {
            currentTimingIndex: 'getCurrentTimingIndex',
        }),
        product() {
            return this.timing.product
        },
    },
    methods: {
        ...mapActions('videoPlayer', ['seekTo']),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.product-timing-list-item {
    width: 100px;
    min-width: 100px;
    overflow: hidden;
    &:not(:first-child) {
        margin-left: 32px;
    }
    &:not(.current) {
        cursor: pointer;
    }
}
.name-wrapper {
    font-size: 11px;
    font-weight: 400;
    max-width: 75px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-flex;
    padding: 4px;
    padding-right: 8px;
    background: $borderColorEl;
    color: $font;
    border-radius: 2px 2px 0 0;
    margin-bottom: -6px;
    max-width: calc(100% - 12px);
    overflow: hidden;
    text-overflow: ellipsis;
    .current & {
        background: $primary;
        color: white;
        font-weight: 500;
    }
    .name {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.img-wrapper {
    height: 100px;
    width: 75px;
    border: $borderElHard;
    box-shadow: $shadowEl;
    margin-bottom: 4px;
    border-radius: 2px;
    overflow: hidden;
    .current & {
        border-color: $primary;
        border-width: 3px;
    }
}
img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    // Make not draggable
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
</style>
