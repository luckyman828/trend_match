<template>
    <div class="add-to-basket-selector flex-list bg-blur">
        <AddToWishlistButton class="white circle" :variants="[variant]" />
        <div class="flex-list justify equal-width flex-1">
            <v-popover trigger="click" class="size-button">
                <button class="white full-width pill">
                    <i class="far fa-ruler"></i>
                    <span v-if="selectedSize">Size: {{ selectedSize }}</span>
                    <span v-else>Choose size</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <ChooseSizePopover
                    slot="popover"
                    class="size-selector"
                    v-model="selectedSize"
                    :variant="variant"
                    ref="sizeSelector"
                />
            </v-popover>

            <AddToBasketButton
                class="add-to-basket-button"
                :variant="variant"
                baseClass="white"
                buttonClass="pill full-width"
                :size.sync="selectedSize"
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
    props: ['variant', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSize: null,
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
                this.presetSize()
            }
        },
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
                this.selectedSize = itemInBasket.size
                this.$refs.sizeSelector.selectedSize = itemInBasket.size
            }
        },
    },
    mounted() {
        this.presetSize()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
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
