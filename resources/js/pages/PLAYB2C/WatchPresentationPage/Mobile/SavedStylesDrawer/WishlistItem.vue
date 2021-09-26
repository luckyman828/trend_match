<template>
    <div class="wishlist-item flex-list md">
        <BaseImageSizer
            fit="contain"
            class="image"
            @click.native="$store.commit('playPresentation/SET_PDP_ITEM', { product: variant.product, variant })"
        >
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <SavingPercentagePill :variant="variant" />
                <button class="pill red xs" v-if="!variant.inStock">
                    <span>Sold out</span>
                </button>
            </div>
        </BaseImageSizer>
        <div class="flex-list flex-v justify details">
            <!-- Top row -->
            <div class="flex-list justify">
                <div class="flex-list flex-v min">
                    <div class="brand">
                        {{ variant.product.brand }}
                    </div>
                    <div class="product-name">{{ variant.name }}</div>
                    <div class="price flex-list md">
                        <CurrentPrice :variant="variant" />
                        <OldPrice :variant="variant" />
                    </div>
                </div>
                <div class="action-list flex-list">
                    <AddToWishlistButton :variants="[variant]" class="circle" />
                </div>
            </div>
            <!-- Bottom row -->
            <div class="flex-list justify flex-end-v">
                <div class="ui-square" @click="$emit('edit-wishlist-variants', $event)">
                    <div class="flex-list flex-v xs truncate">
                        <label>Color</label>
                        <div class="ft-bd truncate ft-12">{{ variant.name }}</div>
                    </div>
                </div>
                <button
                    class="primary pill ghost-hover"
                    :class="variantAddedToBasket ? '' : 'no-bg'"
                    :disabled="!variant.inStock"
                    @click="variantAddedToBasket ? onRemoveFromBasket() : $emit('add-to-basket', variant)"
                >
                    <i class="far fa-shopping-bag" :class="{ 'sold-out': !variant.inStock }">
                        <i v-if="variantAddedToBasket" class="far fa-check pos-right pos-bottom"></i>
                    </i>
                    <span v-if="variantAddedToBasket">Added</span>
                    <span v-else>Add</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'wishlistItem',
    components: { AddToWishlistButton, CurrentPrice, OldPrice, SavingPercentagePill },
    props: ['variant'],
    computed: {
        ...mapGetters('basket', {
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        variantAddedToBasket() {
            return this.getVariantIsInBasket(this.variant)
        },
    },
    methods: {
        onRemoveFromBasket() {
            this.$store.dispatch('basket/removeFromBasket', { variant: this.variant })
        },
    },
}
</script>

<style lang="scss" scoped>
.wishlist-item {
    padding: 6px 18px;
    border-top: $borderElSoft;
    border-bottom: $borderElSoft;
    .image {
        width: 80px;
    }
    .details {
        flex: 1;
        overflow: hidden;
    }
    .brand {
        font-size: 10px;
        font-weight: 700;
        color: $fontSoft;
    }
    .product-name {
        font-size: 12px;
        font-weight: 700;
    }
    .price {
        font-weight: 700;
        font-size: 12px;
    }
    .old-price {
        text-decoration: line-through;
        opacity: 0.5;
    }
    .labels {
        position: absolute;
        bottom: 4px;
        left: 4px;
    }
    img.sold-out {
        opacity: 0.5;
    }
    i.sold-out {
        &::after {
            position: absolute;
            content: '|';
            font-weight: 900;
            font-size: 26px;
            left: 7px;
            top: -7px;
            transform: rotateZ(45deg);
        }
    }
}
</style>
