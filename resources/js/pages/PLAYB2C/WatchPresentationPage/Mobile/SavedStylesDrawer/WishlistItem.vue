<template>
    <div class="wishlist-item flex-list md">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
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
                        <div class="current-price">
                            {{
                                variant.yourPrice.wholesale_price
                                    ? variant.yourPrice.wholesale_price
                                    : variant.yourPrice.recommended_retail_price
                            }}
                            {{ variant.yourPrice.currency }}
                        </div>
                        <div class="old-price" v-if="variant.yourPrice.wholesale_price">
                            {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                        </div>
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
                    @click="$emit('add-to-basket', variant)"
                >
                    <i class="far fa-shopping-bag sold-out">
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

export default {
    name: 'wishlistItem',
    components: { AddToWishlistButton },
    props: ['variant'],
    computed: {
        ...mapGetters('basket', {
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        variantAddedToBasket() {
            return this.getVariantIsInBasket(this.variant)
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
