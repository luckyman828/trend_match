<template>
    <BaseFloatyBar
        classes="add-to-basket-selector flex-list justify bg-blur rounded"
        :show="show"
        :autoHide="autoHide"
        @hide="onHide"
    >
        <AddToWishlistButton v-if="!hideWishlist" class="lg circle" :variants="[item]" />
        <div class="flex-list justify equal-width flex-1">
            <v-popover trigger="click" ref="sizePopover" class="size-button" :disabled="item && !item.inStock">
                <button class="pill lg white full-width" :disabled="item && !item.inStock">
                    <i class="far fa-ruler"></i>
                    <span v-if="selectedSizeDetail">{{ $t('play.sizeShort') }}: {{ selectedSizeDetail.size }}</span>
                    <span v-else>{{ $t('play.chooseSize') }}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <BaseSelectButtons
                    v-if="item"
                    :header="$t('play.chooseSize')"
                    slot="popover"
                    type="radio"
                    :submitOnChange="true"
                    :options="item.ean_sizes"
                    optionNameKey="size"
                    :disabledOptions="item.ean_sizes.filter(sizeObj => !sizeObj.inStock)"
                    v-model="selectedSizeDetail"
                    @change="onChangeSize"
                />
            </v-popover>
            <BaseButton
                class="full-width add-button"
                buttonClass="dark pill lg full-width"
                :disabled="!selectedSizeDetail"
                @click="onAddToBasket"
            >
                <i class="far fa-shopping-bag"></i>
                <span>{{ $t('play.basket.addLong') }}</span>
            </BaseButton>
        </div>
    </BaseFloatyBar>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton'

export default {
    name: 'addToBasketSelector',
    components: { AddToWishlistButton },
    props: ['item', 'size', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSizeDetail: null,
        }
    },
    watch: {
        size(newSize) {
            this.selectedSizeDetail = newSize
        },
    },
    methods: {
        ...mapActions('basket', ['addToBasket']),
        onAddToBasket() {
            this.addToBasket({ variant: this.item, sizeDetail: this.selectedSizeDetail })
            this.onHide()
        },
        onHide() {
            this.selectedSizeDetail = null
            this.$emit('hide')
        },
        onClickOutside() {
            if (!this.autoHide) return
            this.onHide()
        },
        onChangeSize(sizeDetail) {
            this.$emit('submit', sizeDetail)
            this.selectedSizeDetail = sizeDetail
            this.$nextTick(() => {
                this.$refs.sizePopover.hide()
            })
        },
    },
}
</script>

<style scoped lang="scss">
.size-button,
.add-button {
    display: block;
    &::v-deep {
        .trigger {
            width: 100%;
        }
    }
    .trigger {
        width: 100%;
    }
}
</style>
