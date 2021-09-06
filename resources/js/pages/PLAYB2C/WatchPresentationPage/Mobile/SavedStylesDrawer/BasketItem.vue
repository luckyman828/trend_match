<template>
    <div class="basket-item flex-list md">
        <BaseImageSizer fit="cover" class="image">
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
                    <!-- <AddToWishlistButton class="circle" :variants="[variant]" /> -->
                    <button class="circle sm no-bg bg-hover" @click="onRemoveFromBasket">
                        <i class="far fa-trash"></i>
                    </button>
                </div>
            </div>
            <!-- Bottom row -->
            <div class="flex-list justify flex-end-v">
                <!-- COLOR -->
                <div class="ui-square" @click="$emit('edit-basket-variants', $event)">
                    <div class="flex-list flex-v xs truncate">
                        <label>Color</label>
                        <div class="ft-bd ft-12 truncate">{{ variant.name }}</div>
                    </div>
                </div>
                <!-- SIZE -->
                <v-popover trigger="click" ref="sizePopover" class="fill">
                    <div class="ui-square size-square">
                        <div class="flex-list flex-v xs">
                            <label>Size</label>
                            <div class="ft-bd ft-12">{{ item.sizeDetail.size }}</div>
                        </div>
                    </div>
                    <ChooseSizePopover
                        slot="popover"
                        :variant="item.variant"
                        ref="sizeSelector"
                        v-model="item.sizeDetail"
                        @submit="$refs.sizePopover.hide()"
                    />
                </v-popover>
                <div class="ui-square flex-list justify quantity-selector pos-bot-right pad-sm">
                    <div class="decrement flex-list center-v center-h" @click="decrementQty">
                        <i class="fas fa-minus ft-color-soft"></i>
                    </div>
                    <div class="flex-list flex-v quantity-col space-min justify">
                        <span class="ft-bd ft-color-soft ft-10">QTY</span>
                        <span class="ft-bd" style="text-align: center;">{{ item.quantity }}</span>
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
import ChooseSizePopover from '../../ChooseSizePopover'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'basketItem',
    components: { AddToWishlistButton, ChooseSizePopover, CurrentPrice, OldPrice, SavingPercentagePill },
    props: ['item'],
    computed: {
        ...mapGetters('basket', {
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        variant() {
            return this.item.variant
        },
        sizeDetail() {
            return this.item.sizeDetail
        },
    },
    watch: {
        sizeDetail(newSizeDetail, oldSizeDetail) {
            this.changeItemSize({
                item: this.item,
                newSizeDetail,
                oldSizeDetail,
            })
        },
    },
    methods: {
        ...mapActions('basket', ['updateItemQty', 'removeFromBasket', 'changeItemSize', 'addToBasket']),
        decrementQty() {
            this.updateItemQty({ item: this.item, quantity: this.item.quantity - 1 })
        },
        incrementQty() {
            this.updateItemQty({ item: this.item, quantity: this.item.quantity + 1 })
        },
        onRemoveFromBasket() {
            this.removeFromBasket({ variant: this.item.variant, sizeDetail: this.item.sizeDetail })
        },
        onChangeVariant(newVariant) {
            this.addToBasket({ variant: newVariant, sizeDetail: this.item.sizeDetail })
            this.onRemoveFromBasket()
        },
    },
}
</script>

<style lang="scss" scoped>
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
        height: 48px;
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
    .v-popover.fill {
        overflow: hidden;
        > .trigger {
            width: 100%;
            > .ui-square {
                width: 100%;
            }
        }
    }
    .labels {
        position: absolute;
        bottom: 4px;
        left: 4px;
    }
    img.sold-out {
        opacity: 0.5;
    }
}
</style>
