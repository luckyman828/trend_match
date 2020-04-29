<template>
    <div class="presenter-queue" :class="{'flyin-visible': flyinVisible}">
        <!-- Header -->
        <div class="header">
            <div class="left">
                <span>QUEUE</span>
                <span class="pill primary xs" style="margin-left: 4px"><span>{{presenterQueue.length}}</span></span>
            </div>
            <div class="right">
                <button class="primary invisible ghost-hover sm"
                @click="onShowSearchFlyin">
                    <i class="far fa-plus"></i>
                    <span>Add</span>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="body">
            <Draggable v-model="presenterQueue" tag="div" :forceFallback="true"
            fallbackClass="sortable-drag">
                <QueueItem v-for="product in presenterQueue" :key="product.id"
                :product="product"/>
            </Draggable>

            <div class="queue-item add-new" @click="onShowSearchFlyin">
                <div class="square-sizer">
                    <div class="inner">
                        <i class="fas fa-plus primary"></i>
                        <span>Add to queue</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import QueueItem from './QueueItem'
import Draggable from 'vuedraggable'

export default {
    name: 'presenterQueue',
    components: {
        QueueItem,
        Draggable,
    },
    props: [
        'flyinVisible'
    ],
    computed: {
        ...mapGetters('presenterQueue', ['getPresenterQueue']),
        presenterQueue: {
            get() {
                return this.getPresenterQueue
            },
            set(newQueue) {
                this.SET_PRESENTER_QUEUE(newQueue)
            }
        },
    },
    methods: {
        ...mapMutations('presenterQueue', ['SET_PRESENTER_QUEUE']),
        onShowSearchFlyin() {
            this.$emit('showSearchFlyin')
        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.presenter-queue {
    position: absolute;
    top: 74px;
    right: -16px;
    width: calc(242px - 32px);
    height: calc(100% - 74px - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    right: calc(-16px - 242px + 32px);
    background: white;
    border-radius: 4px;
    .header {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 2px $divider;
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
}

</style>