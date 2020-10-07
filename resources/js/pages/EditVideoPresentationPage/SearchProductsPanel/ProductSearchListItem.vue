<template>
    <!-- <Draggable
        :list="[product]"
        tag="div"
        :group="{ name: 'videoTimings', pull: 'clone', put: false }"
        :forceFallback="true"
        fallbackTolerance="20"
        fallbackOnBody="true"
        fallbackClass="sortable-drag"
        @start="SET_SEARCH_ITEM_DRAG_ACTIVE(true)"
        @end="SET_SEARCH_ITEM_DRAG_ACTIVE(false)"
        :key="product.id"
        :clone="onClone"
    > -->
    <div class="drag-wrapper" :key="product.id">
        <div class="product-search-list-item drag-item">
            <div class="image">
                <BaseVariantImage :key="product.id" :variant="product.variants[0]" size="sm" />
            </div>
            <div class="details">
                <span class="id">#{{ product.datasource_id }}</span>
                <strong class="name">{{ product.title }}</strong>
            </div>
            <div class="actions">
                <!-- If the product is not already in the queue -->
                <BaseButton buttonClass="ghost" targetAreaPadding="20px" @click="onAddTiming">
                    <i class="fas fa-plus"></i>
                </BaseButton>
            </div>
        </div>
    </div>
    <!-- </Draggable> -->
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Draggable from 'vuedraggable'

export default {
    name: 'productSearchListItem',
    components: {
        Draggable,
    },
    props: ['product'],
    methods: {
        ...mapMutations('videoPresentation', ['SET_SEARCH_ITEM_DRAG_ACTIVE', 'SET_TIMING_CLONE']),
        ...mapActions('videoPresentation', ['addTiming']),
        onClone(original) {
            const newTiming = {
                start: 0,
                duration: 5,
                product: original,
            }
            this.SET_TIMING_CLONE(newTiming)
        },
        onAddTiming() {
            const newTiming = {
                start: 0,
                end: 5,
                product: this.product,
            }
            this.addTiming({ newTiming })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.product-search-list-item {
    height: 138px;
    padding: 8px;
    display: flex;
    border: solid $divider 1px;
    border-radius: 4px;
    background: white;
    margin-bottom: 8px;
    img {
        height: 120px;
        width: 90px;
        border-radius: 4px;
        object-fit: contain;
    }
    .details {
        padding: 8px 16px 0;
        .title {
            line-height: 1.4;
            margin-left: 4px;
        }
        > * {
            display: block;
        }
    }
    .actions {
        margin-left: auto;
    }
    .sortable-ghost & {
        height: 100%;
        width: 200px;
        > * {
            visibility: visible;
        }
        > .actions {
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
