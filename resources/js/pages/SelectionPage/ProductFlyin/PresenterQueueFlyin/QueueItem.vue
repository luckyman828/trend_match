<template>
    <div class="queue-item">
        <div class="left">
            <img :src="variantImage(product.variants[0])">
            <strong class="name">{{product.title | truncate(16)}}</strong>
            <span class="id">#{{product.datasource_id}}</span>
        </div>
        <div class="right">
            <button-invisible>
                <i class="fas fa-grip-vertical"></i>
            </button-invisible>
            <button class="invisible red-hover">
                <i class="fas fa trash"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'queueItem',
    mixins: [
        variantImage
    ],
    props: [
        'product'
    ],
    methods: {
        ...mapActions('products', ['removeProductFromPresenterQueue']),
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

// ITEMS
.queue-item {
    padding: 8px;
    border: solid $divider 1px;
    border-radius: 4px;
    height: 100px;
    display: flex;
    .right {
        width: 48px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}

</style>