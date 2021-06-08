<template>
    <div class="wishlist-item flex-list bg-theme-white theme-border">
        <BaseImageSizer
            fit="cover"
            class="image"
            @click.native="SET_SIDEBAR_ITEM({ variant, product: variant.product })"
        >
            <BaseVariantImage :variant="variant" size="sm" />
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
                    <div class="current-price ft-bd ft-12">
                        {{ variant.yourPrice.wholesale_price }} {{ variant.yourPrice.currency }}
                    </div>
                    <div class="old-price ft-strike ft-12 ft-bd">
                        {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                    </div>
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list">
                <v-popover trigger="click">
                    <div class="color pill sm">
                        <span
                            class="circle xxs color-preview"
                            :style="{ backgroundImage: `url(${variantImage(variant)})` }"
                        ></span>
                        <span class="ft-bd truncate">{{ variant.name }}</span>
                        <i class="fas fa-caret-down"></i>
                    </div>
                    <BaseSelectButtons
                        header="Change color"
                        slot="popover"
                        type="radio"
                        :submitOnChange="true"
                        :options="variant.product.variants"
                        :value="variant"
                        optionNameKey="name"
                        @change="onChangeVariant"
                    />
                </v-popover>
            </div>
        </div>
        <!-- ACTIONS  -->
        <div class="action-list flex-list center-v">
            <div class="button invisible circle sm">
                <i class="far fa-ellipsis-h"></i>
            </div>
            <AddToWishlistButton class="circle sm" :variants="[variant]" />
            <AddToBasketButton buttonClass="circle sm invisible" :variant="variant" textStyle="none" />
        </div>
        <!-- END ACTIONS  -->
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../../AddToWishlistButton'
import AddToBasketButton from '../../AddToBasketButton'
import variantImage from '../../../../../mixins/variantImage'

export default {
    name: 'wishlistItem',
    components: { AddToWishlistButton, AddToBasketButton },
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
        ...mapMutations('playPresentation', ['SET_SIDEBAR_ITEM']),
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
@import '~@/_variables.scss';

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
    }
    .details {
        overflow: hidden;
        flex: 1;
        position: relative;
        .name-section {
            overflow: hidden;
            margin-top: 20px;
            padding-left: 4px;
        }
        .add-to-basket {
            position: absolute;
            bottom: 4px;
            right: 4px;
        }
        // .color {
        //     font-weight: ;
        // }
    }
    .action-list {
        position: absolute;
        top: 8px;
        right: 8px;
    }
}
</style>
