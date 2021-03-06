<template>
    <div class="wishlist-item flex-list bg-theme-white theme-border">
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
            <div class="flex-list">
                <div class="color pill sm" @click="$emit('edit-wishlist-variants', $event)">
                    <span
                        class="circle xxs color-preview"
                        :style="{ backgroundImage: `url(${variantImage(variant)})` }"
                    ></span>
                    <span class="ft-bd truncate">{{ variant.name }}</span>
                    <i class="fas fa-caret-down"></i>
                </div>
            </div>
        </div>
        <!-- ACTIONS  -->
        <div class="action-list flex-list center-v">
            <AddToWishlistButton class="circle sm" :variants="[variant]" />
            <AddToBasketButton buttonClass="pill sm" :variant="variant" />
        </div>
        <!-- END ACTIONS  -->
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'
import AddToBasketButton from '../../AddToBasketButton'
import variantImage from '../../../../../mixins/variantImage'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'
import SavingPercentagePill from '../../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'wishlistItem',
    components: { AddToWishlistButton, AddToBasketButton, CurrentPrice, OldPrice, SavingPercentagePill },
    mixins: [variantImage],
    props: ['variant'],
    computed: {
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
        }),
        ...mapGetters('basket', {
            getVariantIsInBasket: 'getVariantIsInBasket',
        }),
        variantAddedToBasket() {
            return this.getVariantIsInBasket(this.variant)
        },
    },
    methods: {
        ...mapMutations('playPresentation', ['SET_PDP_ITEM']),
        onChangeVariant(newVariant) {
            // Replace the item on the index of this variant if our newly selected variant
            const index = this.wishlist.findIndex(wishlistVariant => wishlistVariant.id == this.variant.id)
            this.wishlist.splice(index, 1, newVariant)
            this.$emit('update')
        },
    },
}
</script>

<style lang="scss" scoped>
.wishlist-item {
    background: white;
    border-radius: $borderRadiusMd;
    padding: 8px;
    position: relative;
    .image {
        width: 100px;
        cursor: pointer;
        border-radius: $borderRadiusMd;
        overflow: hidden;
    }
    .color-preview {
        background-size: 50000%;
        background-position: center;
        margin: 0 -2px;
    }
    .details {
        overflow: hidden;
        flex: 1;
        position: relative;
        .name-section {
            overflow: hidden;
            margin-top: 24px;
            padding-left: 4px;
        }
        .add-to-basket {
            position: absolute;
            bottom: 4px;
            right: 4px;
        }
    }
    .action-list {
        position: absolute;
        top: 8px;
        right: 8px;
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
