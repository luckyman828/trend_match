<template>
    <div
        class="presenter-queue"
        :class="[{ 'flyin-visible': flyinVisible }, { 'drag-active': getSearchItemDragActive }]"
    >
        <!-- Header -->
        <div class="header">
            <div class="left">
                <span>QUEUE</span>
                <span class="pill primary xs" style="margin-left: 4px"
                    ><span>{{ presentationQueue.length }}</span></span
                >
            </div>
            <div class="right">
                <button class="primary no-bg ghost-hover sm" @click="onShowSearchFlyin">
                    <i class="far fa-plus"></i>
                    <span>Add</span>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="body">
            <Draggable
                class="draggable"
                v-model="presentationQueue"
                tag="div"
                :forceFallback="true"
                group="presentationQueue"
                draggable=".queue-item-wrapper"
                fallbackClass="sortable-drag"
                :fallbackTolerance="10"
            >
                <QueueItem v-for="product in presentationQueue" :key="product.id" :product="product" />
            </Draggable>

            <div class="queue-item add-new" @click="onShowSearchFlyin" v-if="!getSearchItemDragActive">
                <div class="square-sizer">
                    <div class="inner">
                        <i class="fas fa-plus primary"></i>
                        <span>Add to queue</span>
                    </div>
                </div>
            </div>
        </div>

        <button class="red clear-queue" @click="SET_PRESENTER_QUEUE([])" v-if="presentationQueue.length > 0">
            <i class="far fa-trash-alt"></i>
            <span>Clear queue</span>
        </button>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import QueueItem from './QueueItem'
import Draggable from 'vuedraggable'

export default {
    name: 'presentationQueue',
    components: {
        QueueItem,
        Draggable,
    },
    props: ['flyinVisible'],
    data: function() {
        return {
            testList: [],
        }
    },
    computed: {
        ...mapGetters('presentationQueue', ['getpresentationQueue', 'getSearchItemDragActive']),
        presentationQueue: {
            get() {
                return this.getpresentationQueue
            },
            set(newQueue) {
                this.SET_PRESENTER_QUEUE(newQueue)
            },
        },
    },
    methods: {
        ...mapMutations('presentationQueue', ['SET_PRESENTER_QUEUE']),
        onShowSearchFlyin() {
            this.$emit('showSearchFlyin')
        },
    },
}
</script>

<style lang="scss" scoped>
.presenter-queue {
    position: absolute;
    top: 74px;
    right: -16px;
    width: calc(242px - 32px);
    height: calc(100% - 74px - 32px - 68px);
    display: flex;
    flex-direction: column;
    align-items: center;
    right: calc(-16px - 242px + 32px);
    background: white;
    // overflow: hidden;
    border-radius: $borderRadiusModule;
    border: $borderModule;
    box-shadow: $shadowModule;
    &.drag-active {
        .draggable {
            flex: 1;
            padding-bottom: 200px;
        }
        .add-new {
            pointer-events: none;
        }
    }
    .header {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid $dividerWidth $dividerColor;
        padding: 8px 16px;
    }
    .body {
        width: 100%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        scroll-behavior: smooth;
    }

    // ITEMS
    .queue-item {
        border: solid $divider 1px;
        border-radius: 4px;
        padding: 1px;
        cursor: pointer;
        &:hover {
            border-color: $primary;
            border-width: 2px;
            padding: 0;
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
    }

    .queue-item.add-new {
        .inner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            span {
                margin-top: 8px;
                font-size: 12px;
                color: $primary;
                font-weight: 700;
            }
        }
    }
    .clear-queue {
        position: absolute;
        bottom: -48px;
    }
}
</style>
