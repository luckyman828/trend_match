<template>
    <div
        class="product-timing-list-item"
        :class="{ current: index == currentTimingIndex }"
        @click="seekTo(timing.start)"
    >
        <v-popover placement="top" popoverClass="min dark">
            <div class="card">
                <div class="name-wrapper">
                    <span class="name">{{ product ? product.name : 'Not found' }}</span>
                </div>
                <div class="img-wrapper">
                    <BaseVariantImage v-if="product" :variant="product.variants[0]" size="sm" :key="timing.id" />
                </div>
            </div>

            <action-list-popover slot="popover" :product="product" />
        </v-popover>
        <span class="timestamp">{{ timing.start | timestampify }}</span>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ActionListPopover from '../ActionListPopover.vue'
export default {
    name: 'timingListItem',
    components: { ActionListPopover },
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
    width: 84px;
    min-width: 84px;
    .card {
        box-shadow: $shadowEl;
        transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 2px;
    }
    &:hover {
        .card {
            box-shadow: $shadowElHard;
            transform: translateY(-1px);
        }
    }
    &:not(:first-child) {
        margin-left: 12px;
    }
    &:not(.current) {
        cursor: pointer;
    }
    .timestamp {
        display: block;
        font-size: 11px;
        text-align: center;
    }
}
.name-wrapper {
    font-size: 11px;
    font-weight: 400;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-flex;
    padding: 3px 6px;
    background: white;
    color: $font;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

    width: 100%;
    .current & {
        background: $primary;
        color: white;
    }
    .name {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.img-wrapper {
    height: 112px;
    width: 84px;
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
