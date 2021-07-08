<template>
    <div class="basket-item flex-list space-min bg-theme-white">
        <BaseImageSizer fit="cover" class="image" @click.native="SET_PDP_ITEM({ variant, product: variant.product })">
            <BaseVariantImage :variant="variant" size="sm" />
        </BaseImageSizer>

        <div class="flex-list flex-v justify details">
            <!-- TOP -->

            <div class="name-section flex-list flex-v space-sm">
                <div class="flex-v lh-xs">
                    <div class="brand ft-10 ft-md ft-color-soft ft-uppercase">
                        {{ variant.product.brand }}
                    </div>
                    <div class="product-name ft-bd ft-14">
                        <span>{{ variant.product.name }}</span>
                    </div>
                </div>
                <div class="price flex-list center-v">
                    <div class="current-price ft-bd ft-14">
                        {{
                            variant.yourPrice.wholesale_price
                                ? variant.yourPrice.wholesale_price
                                : variant.yourPrice.recommended_retail_price
                        }}
                        {{ variant.yourPrice.currency }}
                    </div>
                    <div class="old-price ft-strike ft-12 ft-md" v-if="variant.yourPrice.wholesale_price">
                        {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                    </div>
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list">
                <!-- COLOR -->
                <div class="flex-list flex-v space-sm">
                    <div class="ft-12 ft-color-soft ft-md">Color</div>
                    <div class="square color">
                        <span class="ft-bd">{{ variant.name }}</span>
                    </div>
                </div>
                <!-- SIZE -->
                <v-popover trigger="click" ref="sizePopover">
                    <div class="flex-list flex-v space-sm">
                        <div class="ft-12 ft-color-soft ft-md">Size</div>
                        <div class="square color">
                            <span class="ft-bd">{{ item.sizeDetail.size }}</span>
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
            </div>

            <!-- ACTIONS  -->
            <div class="action-list flex-list center-v pos-top-right pas-sm">
                <AddToWishlistButton
                    class="invisible true-square float-icon-hover"
                    :variants="[variant]"
                    theme="invisible"
                />
                <div
                    class="button invisible ghost-hover circle"
                    v-show-contextmenu="{ ref: 'moreContext', placement: 'bottom' }"
                >
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="ui-square flex-list justify quantity-selector pos-bot-right pad-sm">
                <div class="decrement flex-list center-v center-h" @click="decrementQty">
                    <i class="fas fa-minus ft-color-soft"></i>
                </div>
                <div class="flex-list flex-v quantity-col space-min justify">
                    <span class="ft-bd ft-color-soft ft-10">QTY</span>
                    <span class="ft-bd">{{ item.quantity }}</span>
                </div>
                <div class="increment sm light flex-list center-v center-h" @click="incrementQty">
                    <i class="fas fa-plus ft-color-soft"></i>
                </div>
            </div>
            <!-- END ACTIONS  -->
        </div>

        <BaseContextMenu ref="moreContext" class="more-context">
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash" hotkey="KeyD" @click="onRemoveFromBasket">
                    <u>R</u>emove from Basket
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'
import ChooseSizePopover from '../../ChooseSizePopover'

export default {
    name: 'basketItem',
    components: { AddToWishlistButton, ChooseSizePopover },
    props: ['item', 'moreContext'],
    computed: {
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
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
        ...mapActions('basket', ['updateItemQty', 'removeFromBasket', 'changeItemSize']),
        decrementQty() {
            this.updateItemQty({ item: this.item, quantity: this.item.quantity - 1 })
        },
        incrementQty() {
            this.updateItemQty({ item: this.item, quantity: this.item.quantity + 1 })
        },
        onRemoveFromBasket() {
            this.removeFromBasket({ variant: this.item.variant, sizeDetail: this.item.sizeDetail })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.basket-item {
    background: white;
    box-shadow: $shadowXs;
    .image {
        width: 100px;
        cursor: pointer;
    }
    .details {
        overflow: hidden;
        flex: 1;
        padding: 8px;
        position: relative;
        .name-section {
            overflow: hidden;
            padding-right: 80px;
        }
        .action-list {
            position: absolute;
            top: 4px;
            right: 4px;
        }
        .quantity-selector {
            position: absolute;
            bottom: 8px;
            right: 8px;
            padding: 0;
            height: 48px;
            overflow: hidden;
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
        // .color {
        //     font-weight: ;
        // }
    }
    .product-name {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
