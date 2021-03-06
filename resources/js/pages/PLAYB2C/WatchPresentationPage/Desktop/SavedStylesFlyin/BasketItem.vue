<template>
    <div class="basket-item flex-list bg-theme-white theme-border">
        <BaseImageSizer fit="contain" class="image" @click.native="SET_PDP_ITEM({ variant, product: variant.product })">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <SavingPercentagePill :variant="variant" />
                <button class="pill red xs" v-if="!variant.inStock">
                    <span>{{ $t('play.product.soldOut') }}</span>
                </button>
            </div>
        </BaseImageSizer>

        <div class="flex-list flex-v justify details">
            <!-- TOP -->

            <div class="name-section flex-list flex-v">
                <div class="flex-list flex-v lh-xs space-sm">
                    <div class="brand ft-10 ft-md ft-color-soft ft-uppercase">
                        {{ variant.product.brand }}
                    </div>
                    <div class="product-name ft-bd ft-14">
                        <span class="truncate">{{ variant.product.name }}</span>
                    </div>
                </div>
                <div class="price flex-list center-v">
                    <CurrentPrice :variant="variant" />
                    <OldPrice :variant="variant" />
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list justify">
                <!-- COLOR -->

                <button class="color pill sm" @click="$emit('edit-basket-variants', $event)">
                    <span
                        class="circle xxs color-preview"
                        :style="{ backgroundImage: `url(${variantImage(variant)})` }"
                    ></span>
                    <span class="ft-bd truncate" style="margin-right: auto;">{{ variant.name }}</span>
                    <i class="fas fa-caret-down"></i>
                </button>

                <!-- SIZE -->
                <v-popover trigger="click" ref="sizePopover" class="fill">
                    <button class="pill sm">
                        <span class="ft-bd truncate">Size</span>
                        <span class="ft-bd" style="margin-right: auto;">{{ item.sizeDetail.size }}</span>
                        <i class="fas fa-caret-down"></i>
                    </button>
                    <ChooseSizePopover
                        slot="popover"
                        :variant="item.variant"
                        ref="sizeSelector"
                        v-model="item.sizeDetail"
                        @submit="$refs.sizePopover.hide()"
                    />
                </v-popover>
                <div class="pill sm flex-list justify quantity-selector">
                    <div class="decrement flex-list center-v center-h" @click="decrementQty">
                        <i class="fas fa-minus ft-color-soft"></i>
                    </div>
                    <div class="quantity ft-bd">{{ item.quantity }}</div>
                    <div class="increment sm light flex-list center-v center-h" @click="incrementQty">
                        <i class="fas fa-plus ft-color-soft"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- ACTION  -->
        <div class="action-list flex-list center-v">
            <!-- <AddToWishlistButton class="circle sm" :variants="[variant]" /> -->
            <button class="circle sm no-bg bg-hover" @click="onRemoveFromBasket">
                <i class="far fa-trash"></i>
            </button>
        </div>
        <!-- END ACTIONS  -->
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'
import ChooseSizePopover from '../../ChooseSizePopover'
import variantImage from '../../../../../mixins/variantImage'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'basketItem',
    components: { AddToWishlistButton, ChooseSizePopover, CurrentPrice, OldPrice, SavingPercentagePill },
    mixins: [variantImage],
    props: ['item'],
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
    background: white;
    border-radius: $borderRadiusMd;
    padding: 8px;
    position: relative;
    .image {
        width: 100px;
        cursor: pointer;
    }
    .action-list {
        position: absolute;
        top: 8px;
        right: 8px;
    }
    .details {
        overflow: hidden;
        flex: 1;
        // padding: 8px;
        // padding-right: 0px;
        position: relative;
        .name-section {
            overflow: hidden;
            margin-top: 24px;
            padding-left: 4px;
        }
        .color-preview {
            background-size: 50000%;
            background-position: center;
            margin: 0 -2px;
        }
        .quantity-selector {
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            .decrement,
            .increment {
                height: 100%;
                width: 16px;
                // display: none;
                transition: background 0.1s ease-in;
                cursor: pointer;
                &:hover {
                    background: $themeGreyBgHover;
                }
                &:active {
                    background: $themeGreyBgActive;
                }
            }
            .decrement {
                margin-left: -6px;
            }
            .increment {
                margin-right: -6px;
            }
            .quantity {
                margin: 0 2px 0 -2px;
            }
            &:not(:hover) {
                .decrement,
                .increment {
                    display: none;
                }
                .quantity {
                    margin: 0 2px;
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
    .v-popover.fill {
        overflow: hidden;
        > .trigger {
            width: 100%;
            > button {
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
