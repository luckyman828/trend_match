<template>
    <div class="presenter-queue" :class="{'flyin-visible': flyinVisible}">
        <!-- Header -->
        <div class="header">
            <div class="left">
                <span>QUEUE</span>
                <span class="pill primary xs"><span>{{presenterQueue.length}}</span></span>
            </div>
            <div class="right">
                <button class="primary invisible ghost-hover xs">
                    <i class="far fa-plus"></i>
                    <span>Add</span>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="body">
            <QueueItem v-for="product in presenterQueue" :key="product.id"
            :product="product"/>

            <div class="queue-item add-new" @click="onShowSearchFlyin">
                <i class="fas fa-plus primary"></i>
                <span>Add to queue</span>
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QueueItem from './QueueItem'

export default {
    name: 'presenterQueue',
    components: {
        QueueItem
    },
    props: [
        'flyinVisible'
    ],
    computed: {
        ...mapGetters('products', ['getPresenterQueue']),
        presenterQueue() {
            return this.getPresenterQueue
        },
    },
    methods: {
        onShowSearchFlyin() {
            this.$emit('showSearchFlyin')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.presenter-queue {
    position: absolute;
    top: 74px;
    right: -8px;
    width: 124px;
    height: calc(100% - 74px - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(100%);
    background: white;
    border-radius: 4px;
    &.flyin-visible {
        right: -32px;
    }
    .header {
        height: 60px;
        display: flex;
        align-items: center;
        border-bottom: solid 2px $divider;
        padding: 8px;
    }
    .body {
        width: 100%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
    }

    // ITEMS
    .queue-item {
        padding: 8px;
        border: solid $divider 1px;
        border-radius: 4px;
        height: 100px;
        &.add-new {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            padding: 1px;
            span {
                margin-top: 8px;
                font-size: 12px;
                color: $primary;
                font-weight: 700;
            }
            cursor: pointer;
            &:hover {
                border-color: $primary;
                border-width: 2px;
                padding: 0;
            }
        }
    }
}

</style>