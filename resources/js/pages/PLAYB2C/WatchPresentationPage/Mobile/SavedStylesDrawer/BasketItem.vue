<template>
    <div class="basket-item flex-list md">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" />
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
                            {{ variant.yourPrice.wholesale_price }} {{ variant.yourPrice.currency }}
                        </div>
                        <div class="old-price">
                            {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                        </div>
                    </div>
                </div>
                <div class="action-list flex-list center-v">
                    <AddToWishlistButton :variants="[variant]" />
                    <div class="button invisible ghost-hover dark circle">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>
            <!-- Bottom row -->
            <div class="flex-list justify flex-end-v">
                <div class="ui-square">
                    <div class="flex-list flex-v xs truncate">
                        <label>Color</label>
                        <div class="ft-bd ft-12 truncate">{{ variant.name }}</div>
                    </div>
                </div>
                <div class="ui-square size-square">
                    <div class="flex-list flex-v xs">
                        <label>Size</label>
                        <div class="ft-bd ft-12">{{ item.size }}</div>
                    </div>
                </div>
                <div class="ui-square flex-list justify quantity-selector pos-bot-right pad-sm">
                    <div class="decrement flex-list center-v center-h" @click="decrementQty">
                        <i class="fas fa-minus ft-color-soft"></i>
                    </div>
                    <div class="flex-list flex-v quantity-col space-min justify">
                        <span class="ft-bd ft-color-soft ft-10">QTY</span>
                        <span class="ft-bd">{{ item.qty }}</span>
                    </div>
                    <div class="increment sm light flex-list center-v center-h" @click="incrementQty">
                        <i class="fas fa-plus ft-color-soft"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'

export default {
    name: 'basketItem',
    components: { AddToWishlistButton },
    props: ['item'],
    computed: {
        ...mapGetters('basket', {
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        variant() {
            return this.item.variant
        },
    },
    methods: {
        ...mapActions('basket', ['updateItemQty']),
        decrementQty() {
            this.updateItemQty({ item: this.item, qty: this.item.qty - 1 })
        },
        incrementQty() {
            this.updateItemQty({ item: this.item, qty: this.item.qty + 1 })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.basket-item {
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
    .size-square {
        min-width: 48px;
    }
    .quantity-selector {
        .quantity-col {
            padding: 4px 0;
            height: 100%;
        }
        .decrement,
        .increment {
            height: 100%;
            width: 16px;
            transition: background 0.1s ease-in;
            cursor: pointer;
            &:hover {
                background: $themeGreyBgHover;
            }
            &:active {
                background: $themeGreyBgActive;
            }
        }
        i {
            font-size: 8px;
        }
    }
}
</style>
