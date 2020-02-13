<template>
    <tr class="products-table-row" :class="'action-'+product.currentAction">

        <span v-if="product.newComment" class="circle tiny primary"></span>
        
        <td class="select" 
        @click.self="$refs.selectCheckbox.check()">
            <BaseCheckbox ref="selectCheckbox" :value="product" :modelValue="localSelectedProducts" v-model="localSelectedProducts"/>
        </td>
        <td class="image clickable" @click="$emit('onViewSingle',product)">
            <div class="img-wrapper">
                <img v-if="product.color_variants[0] != null" :src="productImg(product.color_variants[0])">
            </div>
        </td>
        <td class="id clickable" @click="$emit('onViewSingle',product)">{{product.datasource_id}}</td>
        <td class="title clickable" @click="$emit('onViewSingle',product)"><span>{{product.title}}</span></td>

        <td class="action">
            <button class="invisible ghost-hover" 
            @click="$emit('onViewSingle',product)"><span>View / Edit</span></button>
        </td>

    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts'
    ],
    computed: {
        localSelectedProducts: {
            get() { return this.selectedProducts },
            set(localSelectedProducts) {this.$emit('input', localSelectedProducts)}
        }
    },
    methods: {
        productImg(variant) {
            if (variant.blob_id != null)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else if (variant.image) return variant.image
            else return `/images/placeholder.JPG`
        },
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    .products-table-row {
        height: 76px;
        .img-wrapper {
            border: solid 1px $light2;
            height: 60px;
            width: 48px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
</style>