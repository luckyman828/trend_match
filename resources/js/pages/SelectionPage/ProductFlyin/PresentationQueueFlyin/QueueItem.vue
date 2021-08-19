<template>
    <div class="queue-item-wrapper">
        <div
            class="queue-item drag-item"
            :class="[{ 'before-current': isBeforeCurrent }, { 'is-current': isCurrent }]"
            @click="onBroadcastProduct(product)"
        >
            <div class="square-sizer">
                <div class="inner">
                    <div class="current-item-marker" v-if="isCurrent">
                        <div class="pill dark sm">
                            <i class="fas fa-eye"></i>
                            <span>Showing</span>
                        </div>
                    </div>

                    <div class="left">
                        <img :src="variantImage(product.variants[0], { size: 'sm' })" />
                        <strong class="name">{{ product.title | truncate(20) }}</strong>
                        <span class="id">#{{ product.datasource_id }}</span>
                    </div>
                    <div class="right">
                        <div class="top">
                            <button
                                class="no-bg drag-button ghost-hover true-square"
                                v-tooltip="{ content: 'Drag to reposition product in queue', delay: { show: 300 } }"
                            >
                                <i class="fas fa-grip-vertical"></i>
                            </button>
                            <button
                                class="no-bg ghost-hover true-square"
                                v-if="!isCurrent"
                                v-tooltip="{ content: 'Broadcast this product', delay: { show: 300 } }"
                                @click.stop="onBroadcastProduct(product)"
                            >
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <BaseButton
                            buttonClass="no-bg ghost-hover true-square"
                            :key="product.id"
                            :disabled="isCurrent"
                            v-tooltip="isCurrent && 'You cannot remove the currently broadcast product'"
                            @click.stop="onRemoveProductFrompresentationQueue(product)"
                        >
                            <i class="fas fa-trash"></i>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'queueItem',
    mixins: [variantImage],
    props: ['product'],
    watch: {
        isCurrent(newVal, oldVal) {
            if (newVal) {
                // When a product becomes the current product, scroll it into view
                this.$el.scrollIntoView()
            }
        },
    },
    computed: {
        ...mapGetters('presentationQueue', ['getpresentationQueueCurrentProductId', 'getpresentationQueue']),
        ...mapGetters('selections', ['getCurrentSelection']),
        isCurrent() {
            return this.product.id == this.getpresentationQueueCurrentProductId
        },
        isBeforeCurrent() {
            const productIndex = this.getpresentationQueue.findIndex(x => x.id == this.product.id)
            const currentProductIndex = this.getpresentationQueue.findIndex(
                x => x.id == this.getpresentationQueueCurrentProductId
            )
            return productIndex < currentProductIndex
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapActions('presentationQueue', ['removeProductFrompresentationQueue']),
        onRemoveProductFrompresentationQueue(product) {
            this.removeProductFrompresentationQueue(product)
        },
        onBroadcastProduct(product) {
            // Show the product in the PDP. The PDP will then trigger a broadcast event
            this.showSelectionProductPDP({ product, selection: this.getCurrentSelection })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.queue-item {
    border: solid $divider 1px;
    border-radius: 4px;
    padding: 1px;
    cursor: pointer;
    margin-bottom: 8px;
    background: white;
    &:hover {
        border-color: $primary;
        border-width: 2px;
        padding: 0;
    }
    &.is-current {
        cursor: default;
    }
    &.before-current {
        opacity: 0.5;
    }
    > .square-sizer {
        width: 100%;
        height: 0;
        padding-top: 100%;
        position: relative;
        > .inner {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            padding: 8px;
        }
    }
    .inner {
        display: flex;
        justify-content: space-between;
        > * {
            height: 100%;
        }
    }
    img {
        height: calc(100% - 32px);
        width: 94px;
        object-fit: contain;
        border-radius: 4px;
        margin-bottom: 4px;
    }
    .name,
    .id {
        font-size: 11px;
        white-space: nowrap;
    }
    .left {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .right {
        padding-left: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top {
            display: flex;
            flex-direction: column;
        }
    }
    .drag-button {
        cursor: grab;
    }
    .current-item-marker {
        opacity: 0.9;
        position: absolute;
        left: 0;
        width: 100%;
        height: auto;
        top: 16px;
        z-index: 1;
        display: flex;
        justify-content: center;
        pointer-events: none;
    }
}
</style>
