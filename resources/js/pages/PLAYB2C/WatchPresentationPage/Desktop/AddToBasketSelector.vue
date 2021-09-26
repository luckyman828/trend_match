<template>
    <div class="add-to-basket-selector flex-list bg-blur">
        <AddToWishlistButton class="circle" :variants="[variant]" />
        <div class="flex-list justify equal-width flex-1">
            <v-popover trigger="click" class="size-button" ref="sizePopover" :disabled="!variant.inStock">
                <button class="white full-width pill" :disabled="!variant.inStock">
                    <i class="far fa-ruler"></i>
                    <span v-if="selectedSizeDetail">Size: {{ selectedSizeDetail.size }}</span>
                    <span v-else>Choose size</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <ChooseSizePopover
                    slot="popover"
                    class="size-selector"
                    v-model="selectedSizeDetail"
                    :variant="variant"
                    ref="sizeSelector"
                    @submit="selectSize"
                />
            </v-popover>

            <AddToBasketButton
                class="add-to-basket-button"
                :variant="variant"
                baseClass="white"
                buttonClass="pill full-width"
                :sizeDetail.sync="selectedSizeDetail"
                @submit="onAddToBasket"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddToWishlistButton from '../AddToWishlistButton'
import AddToBasketButton from '../AddToBasketButton'
import ChooseSizePopover from '../ChooseSizePopover'

export default {
    name: 'addToBasketSelector',
    components: { AddToWishlistButton, ChooseSizePopover, AddToBasketButton },
    props: ['variant', 'size', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSizeDetail: null,
        }
    },
    computed: {
        ...mapGetters('basket', {
            basket: 'getBasket',
        }),
        ...mapGetters('wishlist', {
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        variantIsInWishlist() {
            if (!this.variant) return
            return this.getVariantIsInWishlist(this.variant)
        },
    },
    watch: {
        variant(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                this.selectedSizeDetail = null
                // this.presetSize()
            }
        },
        size(newSize) {
            this.selectedSizeDetail = newSize
        }
    },
    methods: {
        ...mapActions('wishlist', ['toggleInWishlist']),
        ...mapActions('basket', ['addToBasket']),
        onAddToBasket() {
            if (this.autoHide) {
                this.onHide()
            }
        },
        onHide() {
            this.selectedSize = null
            this.$emit('hide')
        },
        onClickOutside() {
            if (!this.autoHide) return
            this.onHide()
        },
        presetSize() {
            if (!this.variant) return
            // Preset the size that is in the basket
            const itemInBasket = this.basket.find(item => item.variant.id == this.variant.id)
            if (itemInBasket) {
                this.selectedSizeDetail = itemInBasket.selectedSizeDetail
                this.$refs.sizeSelector.selectedSizeDetail = itemInBasket.selectedSizeDetail
            }
        },
        selectSize(size) {
            this.$emit('submit', size)
            this.$refs.sizePopover.hide()
        }
    },
    mounted() {
        this.presetSize()
    },
}
</script>

<style scoped lang="scss">
.add-to-basket-selector {
    padding: 8px;
    border-radius: 50px;
    backdrop-filter: blur(8px) brightness(80%);
    .size-selector {
        &::v-deep {
            .trigger {
                width: 100%;
            }
        }
    }
    .size-button,
    .add-to-basket-button {
        display: block;
    }
}
</style>
