<template>
    <tr class="products-table-row" :class="'action-'+product.currentAction"
    @contextmenu.prevent="$emit('showContextMenu', $event, product)">

        <span v-if="product.newComment" class="circle tiny primary"></span>
        
        <td class="select" 
        @click.self="$refs.selectCheckbox.check()">
            <BaseCheckbox ref="selectCheckbox" :value="product" :modelValue="localSelectedProducts" v-model="localSelectedProducts"/>
        </td>
        <td class="image clickable" @click="onViewSingle">
            <div class="img-wrapper">
                <img :key="product.id" v-if="product.variants[0] != null" :src="variantImage(product.variants[0])">
            </div>
        </td>
        <td class="id clickable" @click="onViewSingle">
            <span>{{product.datasource_id}}</span>
        </td>
        <td class="title"><span class="clickable" @click="onViewSingle">
            <span v-tooltip="!!product.title && product.title.length > titleTruncateSize && product.title">{{product.title | truncate(titleTruncateSize)}}</span>
            <div class="variant-list">
                <div class="variant-list-item pill ghost xs" v-for="(variant, index) in product.variants.slice(0,7)" :key="index">
                    <span>{{variant.name || 'Unnamed'}}</span>
                </div>
                <div class="variant-list-item pill ghost xs" v-if="product.variants.length > 7">
                    <span>+ {{product.variants.length - 7}} more</span>
                </div>
            </div>
        </span></td>
        <td class="delivery">
            <span>{{
                new Date(product.delivery_date).toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric',
                })
            }}</span>
        </td>

        <!-- Start Prices -->
        <td class="wholesale-price hide-screen-xs">
            <span>{{product.yourPrice.wholesale_price}}</span>
        </td>
        <td class="recommended-retail-price hide-screen-xs">
            <span>{{product.yourPrice.recommended_retail_price}}</span>
        </td>
        <td class="mark-up hide-screen-xs">
            <span>{{product.yourPrice.mark_up}}</span>
        </td>
        <td class="currency hide-screen-xs"><span>{{product.yourPrice.currency}}</span></td>
        <!-- End Prices -->

        <td class="minimum">
            <div class="square ghost xs">
                <span>
                    <template v-if="product.min_variant_order">
                    <span>{{product.min_variant_order}}/</span>
                    </template>
                    <span>{{product.min_order}}</span>
                </span>
                <i class="far fa-box"></i>
            </div>
        </td>

        <td class="action">
            <button class="invisible ghost-hover" 
            @click="onViewSingle"><span>View / Edit</span></button>
        </td>

    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import variantImage from '../../mixins/variantImage'

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts'
    ],
    mixins: [
        variantImage,
    ],
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        }
    },
    computed: {
        localSelectedProducts: {
            get() { return this.selectedProducts },
            set(localSelectedProducts) {this.$emit('input', localSelectedProducts)}
        },
        titleTruncateSize () {
            return window.innerWidth < 1260 ? 16 : 24
        }
    },
    methods: {
        productImg(variant) {
            if (!variant || (!variant.blob_id && !variant.image)) return `/images/placeholder.JPG`
            if (variant.blob_id)
                return `https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/${variant.blob_id}_thumbnail.jpg`
            else return variant.image
        },
        onViewSingle() {
            this.$emit('onViewSingle',this.product)
        }
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    .products-table-row {
        height: 98px;
        .img-wrapper {
            border: solid 1px $light2;
            height: 100%;
            width: 100%;
            // width: 48px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
    td.title {
        position: relative;
    }
    .variant-list {
        position: absolute;
        left: 0;
        bottom: -6px;
        // max-width: 700px;
        // overflow: hidden;
        // &::after {
        //     content: "";
        //     display: block;
        //     height: 100%;
        //     width: 80px;
        //     background: linear-gradient(90deg, transparent, white);
        //     position: absolute;
        //     top: 0;
        //     right: 0;
        //     tr:hover & {
        //         background: linear-gradient(90deg, transparent, $bgContentAlt);
        //     }
        // }
    }
    .variant-list-item:not(:first-child) {
        margin-left: 4px;
    }
</style>