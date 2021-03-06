<template>
    <div class="add-to-basket-popover-list-item flex-list justify">
        <BaseImageSizer fit="contain" class="image">
            <BaseVariantImage :variant="variant" size="sm" :class="{ 'sold-out': !variant.inStock }" />
            <div class="labels">
                <SavingPercentagePill :variant="variant" size="xxs" />
                <button class="pill red xxs" v-if="!variant.inStock">
                    <span>{{ $t('play.product.soldOut') }}</span>
                </button>
            </div>
        </BaseImageSizer>

        <div class="flex-list flex-v justify details fill">
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
                    <CurrentPrice :variant="variant" />
                    <OldPrice :variant="variant" />
                </div>
            </div>

            <!-- BOTTOM -->
            <div class="flex-list">
                <v-popover
                    trigger="click"
                    ref="sizePopover"
                    :container="sizePopoverContainer"
                    :disabled="!variant.inStock"
                >
                    <button class="dark ghost full-width pill sm" :disabled="!variant.inStock">
                        <i class="far fa-ruler"></i>
                        <span v-if="selectedSizeDetail">{{ $t('play.sizeShort') }}: {{ selectedSizeDetail.size }}</span>
                        <span v-else>{{ $t('play.chooseSize') }}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <ChooseSizePopover
                        slot="popover"
                        :variant="variant"
                        v-model="selectedSizeDetail"
                        @submit="$refs.sizePopover.hide()"
                    />
                </v-popover>
                <AddToBasketButton
                    buttonClass="pill sm w-lg"
                    :variant="variant"
                    :sizeDetail="selectedSizeDetail"
                    :resetOnSubmit="true"
                    textStyle="short"
                    :popoverContainer="sizePopoverContainer"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ChooseSizePopover from '../ChooseSizePopover'
import AddToBasketButton from '../AddToBasketButton'
import CurrentPrice from '../../../../components/PLAY/prices/CurrentPrice'
import OldPrice from '../../../../components/PLAY/prices/OldPrice'
import SavingPercentagePill from '../../../../components/PLAY/prices/SavingPercentagePill'

export default {
    name: 'AddToBasketPopoverListItem',
    components: { ChooseSizePopover, AddToBasketButton, CurrentPrice, OldPrice, SavingPercentagePill },
    props: ['variant', 'sizePopoverContainer'],
    data() {
        return {
            selectedSizeDetail: null,
        }
    },
}
</script>

<style scoped lang="scss">
.add-to-basket-popover-list-item {
    padding: 8px;
    border-radius: $borderRadiusMd;
    border: $borderEl;
    .image {
        width: 60px;
        border-radius: $borderRadiusSm;
        overflow: hidden;
    }
    .product-name {
        max-width: 120px;
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
