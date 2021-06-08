<template>
    <div class="add-to-basket-popover-list-item flex-list justify">
        <BaseImageSizer fit="cover" class="image">
            <BaseVariantImage :variant="variant" size="sm" />
        </BaseImageSizer>

        <div class="flex-list flex-v justify details">
            <!-- TOP -->

            <div class="name-section flex-list flex-v space-sm">
                <div class="flex-list flex-v lh-min space-xs">
                    <div class="brand ft-8 ft-md ft-color-soft ft-uppercase">
                        {{ variant.product.brand }}
                    </div>
                    <div class="product-name ft-bd ft-12">
                        <span class="truncate">{{ variant.product.name }}</span>
                    </div>
                </div>
                <div class="price flex-list center-v">
                    <div class="current-price ft-bd ft-10">
                        {{ variant.yourPrice.wholesale_price }} {{ variant.yourPrice.currency }}
                    </div>
                    <div class="old-price ft-strike ft-10 ft-bd">
                        {{ variant.yourPrice.recommended_retail_price }} {{ variant.yourPrice.currency }}
                    </div>
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list">
                <v-popover trigger="click">
                    <button class="dark ghost full-width pill sm">
                        <i class="far fa-ruler"></i>
                        <span v-if="selectedSize">Size: {{ selectedSize }}</span>
                        <span v-else>Choose size</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <ChooseSizePopover slot="popover" :variant="variant" v-model="selectedSize" />
                </v-popover>
                <AddToBasketButton
                    buttonClass="pill sm w-lg"
                    :variant="variant"
                    :size="selectedSize"
                    textStyle="short"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ChooseSizePopover from './ChooseSizePopover'
import AddToBasketButton from './AddToBasketButton'

export default {
    name: 'AddToBasketPopoverListItem',
    components: { ChooseSizePopover, AddToBasketButton },
    props: ['variant'],
    data() {
        return {
            selectedSize: this.variant.ean_sizes[0].size,
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.add-to-basket-popover-list-item {
    padding: 8px;
    border-radius: $borderRadiusMd;
    border: $borderEl;
    .image {
        width: 60px;
        border-radius: $borderRadiusSm;
        overflow: hidden;
    }
}
</style>
