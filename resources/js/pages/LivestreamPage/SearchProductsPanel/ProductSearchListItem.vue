<template>
    <div class="drag-wrapper" :key="product.id">
        <div class="product-search-list-item drag-item" :class="{ current: isCurrent }">
            <div class="image">
                <BaseVariantImage :key="product.id" :variant="product.variants[0]" size="sm" />
            </div>
            <div class="details">
                <span class="id">#{{ product.datasource_id }}</span>
                <strong class="name">{{ product.title }}</strong>
            </div>
            <div class="actions">
                <BaseButton v-if="!isCurrent" buttonClass="ghost" targetAreaPadding="20px" @click="onAddTiming">
                    <i class="fas fa-plus"></i>
                </BaseButton>
                <BaseButton
                    v-else
                    class="stop-current"
                    buttonClass="square primary"
                    targetAreaPadding="20px"
                    @click="onStopCurrent"
                >
                    <i class="far fa-check"></i>
                </BaseButton>
            </div>
        </div>
    </div>
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
    computed: {
        ...mapGetters('videoPlayer', {
            videoDuration: 'getDuration',
            currentTiming: 'getCurrentTiming',
        }),
        isCurrent() {
            return this.currentTiming && this.currentTiming.product_id == this.product.id
        },
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_SEARCH_ITEM_DRAG_ACTIVE', 'SET_TIMING_CLONE']),
        ...mapActions('videoPresentation', ['addTiming']),
        async onAddTiming() {
            console.log('add new timing', this.videoDuration)
            this.onStopCurrent()
            const newTiming = {
                start: 0,
                end: 10,
                product_id: this.product.id,
            }
            await this.addTiming({ newTiming })
        },
        onStopCurrent() {
            // Set the end of the current timing if any
            if (this.currentTiming) {
                this.currentTiming.end = Math.ceil(this.videoDuration)
            }
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
    &.current {
        // background: $primary;
        // color: white;
        border: solid 2px $primary;
    }
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
