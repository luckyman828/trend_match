<template>
    <div class="queue-item-wrapper">
        <div class="queue-item" :class="[{'before-current': isBeforeCurrent},{'is-current': isCurrent}]"
        @click="onBroadcastProduct(product)">
            <div class="square-sizer">
                <div class="inner">
                    <div class="current-item-marker" v-if="isCurrent">
                        <div class="pill dark sm">
                            <i class="fas fa-eye"></i>
                            <span>Showing</span>
                        </div>
                    </div>

                    <div class="left">
                        <img :src="variantImage(product.variants[0])">
                        <strong class="name">{{product.title | truncate(20)}}</strong>
                        <span class="id">#{{product.datasource_id}}</span>
                    </div>
                    <div class="right">
                        <button class="invisible drag-button">
                            <i class="fas fa-grip-vertical"></i>
                        </button>
                        <button class="invisible red-hover" :key="product.id"
                        @click.stop="onRemoveProductFromPresenterQueue(product)">
                            <i class="fas fa-trash"></i>
                        </button>
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
    mixins: [
        variantImage
    ],
    props: [
        'product'
    ],
    computed: {
        ...mapGetters('presenterQueue', ['getPresenterQueueCurrentProductId', 'getPresenterQueue']),
        ...mapGetters('selections', ['getCurrentSelection']),
        isCurrent() {
            return this.product.id == this.getPresenterQueueCurrentProductId
        },
        isBeforeCurrent() {
            const productIndex = this.getPresenterQueue.findIndex(x => x.id == this.product.id)
            const currentProductIndex = this.getPresenterQueue.findIndex(x => x.id == this.getPresenterQueueCurrentProductId)
            return productIndex < currentProductIndex
        }
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapActions('presenterQueue', ['removeProductFromPresenterQueue']),
        onRemoveProductFromPresenterQueue(product) {
            this.removeProductFromPresenterQueue(product)
        },
        onBroadcastProduct(product) {
            // Show the product in the PDP. The PDP will then trigger a broadcast event
            this.showSelectionProductPDP({product, selection: this.getCurrentSelection})
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

// ITEMS
.queue-item-wrapper.sortable-drag {
    opacity: 1 !important;
}
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
        opacity: .5;
    }
    .sortable-ghost & {
        background: $grey;
        > * {
            visibility: hidden;
        }
        // &:hover {
        //     border-color: $divider;
        //     border-width: 1px;
        //     padding: 1px;
        // }
    }
    .sortable-drag & {
        box-shadow: 0 3px 6px rgba(0,0,0,0.5) !important;
        transform: rotateZ(3deg) !important;
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
    .name, .id {
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
    }
}

</style>