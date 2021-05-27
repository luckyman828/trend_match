<template>
    <div class="wishlist-item flex-list space-min bg-theme-white">
        <BaseImageSizer
            fit="cover"
            class="image"
            @click.native="SET_SIDEBAR_ITEM({ variant, product: variant.product })"
        >
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
                        {{ variant.yourPrice.wholesale_price }} {{ variant.yourPrice.currency }}
                    </div>
                    <div class="old-price ft-strike ft-12 ft-md">
                        {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                    </div>
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list flex-v space-sm">
                <div class="ft-12 ft-color-soft ft-md">Color</div>
                <div class="color-wrapper">
                    <div class="square color">
                        <span class="ft-bd">{{ variant.name }}</span>
                    </div>
                </div>
            </div>

            <!-- ACTIONS  -->
            <div class="action-list flex-list center-v">
                <AddToWishlistButton class="true-square white" :variants="[variant]" />
                <div class="button invisible ghost-hover circle">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <button
                class="primary pill ghost-hover add-to-basket"
                :class="variantAddedToBasket ? '' : 'invisible'"
                @click="$emit('add-to-basket', variant)"
            >
                <i class="far fa-shopping-bag">
                    <i v-if="variantAddedToBasket" class="far fa-check pos-right pos-bottom"></i>
                </i>
                <span v-if="variantAddedToBasket">Added</span>
                <span v-else>Add</span>
            </button>
            <!-- END ACTIONS  -->
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton'

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
    methods: {
        ...mapMutations('playPresentation', ['SET_SIDEBAR_ITEM']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.wishlist-item {
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
        .add-to-basket {
            position: absolute;
            bottom: 4px;
            right: 4px;
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
