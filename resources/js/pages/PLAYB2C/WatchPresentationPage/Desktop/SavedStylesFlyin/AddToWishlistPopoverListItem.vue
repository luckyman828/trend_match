<template>
    <div class="add-to-wishlist-popover-list-item flex-list justify">
        <BaseImageSizer
            fit="contain"
            class="image clickable"
            @click.native="$store.commit('playPresentation/SET_PDP_ITEM', { variant, product: variant.product })"
        >
            <VariantImage class="resize-target" :variant="variant" labelSize="xxs" />
        </BaseImageSizer>

        <div class="flex-list justify details flex-1">
            <!-- LEFT  -->
            <div class="name-section flex-list flex-v space-sm">
                <div class="flex-list flex-v lh-min space-xs">
                    <div class="product-name ft-bd ft-12">
                        <span class="truncate">{{ variant.name }}</span>
                    </div>
                </div>
                <div class="price flex-list center-v">
                    <CurrentPrice :variant="variant" />
                    <OldPrice :variant="variant" />
                </div>
            </div>

            <!-- RIGHt  -->
            <div class="flex-list">
                <AddToWishlistButton class="circle sm" :variants="[variant]" />
            </div>
        </div>
    </div>
</template>

<script>
import ChooseSizePopover from '../../ChooseSizePopover'
import AddToWishlistButton from '../../AddToWishlistButton'
import CurrentPrice from '../../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../../components/PLAY/prices/OldPrice'
import VariantImage from '../../../../../components/PLAY/VariantImage'

export default {
    name: 'AddToWishlistPopoverListItem',
    components: { ChooseSizePopover, AddToWishlistButton, CurrentPrice, OldPrice, VariantImage },
    props: ['variant'],
    data() {
        return {}
    },
}
</script>

<style scoped lang="scss">
.add-to-wishlist-popover-list-item {
    padding: 8px;
    border-radius: $borderRadiusMd;
    border: $borderEl;
    .image {
        width: 60px;
        border-radius: $borderRadiusSm;
        overflow: hidden;
    }
    .name-section {
        max-width: 160px;
        padding-right: 8px;
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
