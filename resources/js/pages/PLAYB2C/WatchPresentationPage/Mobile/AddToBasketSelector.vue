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
                    <span v-if="selectedSizeDetail">Size: {{ selectedSizeDetail.size }}</span>
                    <span v-else>Choose size</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <BaseSelectButtons
                    v-if="item"
                    header="Choose size"
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
                <span>Add to basket</span>
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
    props: ['item', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSizeDetail: null,
        }
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
