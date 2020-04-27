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
            <button class="ghost"
            @click="onAddToQueue">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    </div>
</template>

<script>
import variantImage from '../../../../mixins/variantImage'
import { mapActions } from 'vuex'

export default {
    name: 'searchResult',
    mixins: [
        variantImage
    ],
    props: [
        'product'
    ],
    methods: {
        ...mapActions('products', ['addProductToPresenterQueue']),
        onAddToQueue() {
            this.addProductToPresenterQueue(this.product)
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