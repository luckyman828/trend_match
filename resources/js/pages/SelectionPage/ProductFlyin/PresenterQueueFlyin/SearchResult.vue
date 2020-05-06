<template>
    <Draggable :list="[product]" tag="div"
    :group="{name: 'presenterQueue', pull: 'clone', put: false}"
    :disabled="isInQueue" 
    :forceFallback="true" fallbackOnBody=true
    fallbackClass="sortable-drag" @start="SET_SEARCH_ITEM_DRAG_ACTIVE(true)"
    @end="SET_SEARCH_ITEM_DRAG_ACTIVE(false)" :key="product.id">
        <div class="drag-wrapper" :key="product.id">
            <div class="search-result drag-item">
                <div class="image">
                    <img :key="product.id" :src="variantImage(product.variants[0])">
                </div>
                <div class="details">
                    <span class="id">#{{product.datasource_id}}</span>
                    <strong class="name">{{product.title}}</strong>
                </div>
                <div class="actions">
                    <!-- If the product is not already in the queue -->
                    <BaseButton buttonClass="ghost" v-if="!isInQueue"
                    @click="onAddToQueue(product)" targetAreaPadding="20px">
                        <i class="fas fa-plus"></i>
                    </BaseButton>

                    <!-- Else  -->
                    <BaseButton v-else buttonClass="square primary red-hover added-indicator"
                    v-tooltip="'Remove product from queue'" targetAreaPadding="20px"
                    @click="onRemoveFromQueue(product)">
                        <i class="default fas fa-check"></i>
                        <i class="hover fas fa-trash"></i>
                    </BaseButton>
                </div>
            </div>
        </div>
    </Draggable>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import variantImage from '../../../../mixins/variantImage'
import Draggable from 'vuedraggable'

export default {
    name: 'searchResult',
    mixins: [
        variantImage
    ],
    components: {
        Draggable,
    },
    props: [
        'product',
    ],
    // data: function() { return {
    // }},
    computed: {
        ...mapGetters('presenterQueue', ['getPresenterQueue']),
        isInQueue() {
            return this.getPresenterQueue.find(x => x.id == this.product.id)
        }
    },
    methods: {
        ...mapActions('presenterQueue', ['addProductToPresenterQueue', 'broadcastProduct', 'removeProductFromPresenterQueue']),
        ...mapMutations('presenterQueue', ['SET_SEARCH_ITEM_DRAG_ACTIVE']),
        onAddToQueue(product) {
            // If the presenterQueue is empty, then set this product as the current
            this.addProductToPresenterQueue({product})
        },
        onRemoveFromQueue(product) {
            this.removeProductFromPresenterQueue(product)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.search-result {
    height: 168px;
    padding: 8px;
    display: flex;
    border: solid $divider 1px;
    border-radius: 4px;
    background: white;
    margin-bottom: 8px;
    img {
        height: 145px;
        width: 116px;
        border-radius: 4px;
        object-fit: contain;
    }
    .details {
        padding: 8px 16px 0;
        .title {
            line-height: 1.4;
            margin-left: 4px;
        }
        >* {
            display: block;
        }
    }
    .actions {
        margin-left: auto;
    }
    .sortable-ghost & {
        height: 191px;
        > * {
            display: none;
        }
    }
    .added-indicator {
        cursor: pointer;
        .hover {
            display: none;
        }
        &:hover {
            .default {
                display: none;
            }
            .hover {
                display: inline-block;
            }
        }
    }
}

</style>