<template>
    <div class="search-result">
        <div class="image">
            <img :key="product.id" :src="variantImage(product.variants[0])">
        </div>
        <div class="details">
            <span class="id">#{{product.datasource_id}}</span>
            <strong class="name">{{product.title}}</strong>
        </div>
        <div class="actions">
            <!-- If the product is not already in the queue -->
            <button class="ghost" v-if="!isInQueue"
            @click="onAddToQueue(product)">
                <i class="fas fa-plus"></i>
            </button>

            <!-- Else  -->
            <div class="square primary" v-else>
                <i class="fas fa-check"></i>
            </div>
        </div>
    </div>
</template>

<script>
import variantImage from '../../../../mixins/variantImage'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'searchResult',
    mixins: [
        variantImage
    ],
    props: [
        'product'
    ],
    computed: {
        ...mapGetters('presenterQueue', ['getPresenterQueue']),
        isInQueue() {
            return this.getPresenterQueue.find(x => x.id == this.product.id)
        }
    },
    methods: {
        ...mapActions('presenterQueue', ['addProductToPresenterQueue', 'setPresenterQueueCurrentProductId']),
        onAddToQueue(product) {
            // If the presenterQueue is empty, then set this product as the current
            if (this.getPresenterQueue.length <= 0) {
                this.setPresenterQueueCurrentProductId(product.id)
            }
            this.addProductToPresenterQueue(product)
        },
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
}

</style>