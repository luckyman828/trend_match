<template>
    <div class="add-to-basket-selector flex-list bg-blur">
        <button class="white true-square add-to-wishlist" @click="toggleInWishlist(variant)">
            <i class="fa-heart ft-16" :class="variantIsInWishlist ? 'primary fas' : 'far'"></i>
        </button>
        <div class="flex-list justify equal-width flex-1">
            <v-popover class="size-selector" trigger="click" ref="sizePopover">
                <button class="white full-width">
                    <i class="far fa-ruler"></i>
                    <span v-if="selectedSize">Size: {{ selectedSize }}</span>
                    <span v-else>Choose size</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <BaseSelectButtons
                    v-if="variant"
                    header="Choose size"
                    slot="popover"
                    type="radio"
                    :submitOnChange="true"
                    :options="variant.ean_sizes"
                    optionNameKey="size"
                    optionValueKey="size"
                    v-model="selectedSize"
                    @change="onChangeSize"
                />
            </v-popover>
            <BaseButton
                class="full-width"
                buttonClass="dark full-width"
                :disabled="!selectedSize"
                @click="onAddToBasket"
            >
                <i class="far fa-shopping-bag"></i>
                <span>Add to basket</span>
            </BaseButton>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AddToWishlistButton from './AddToWishlistButton'

export default {
    name: 'addToBasketSelector',
    components: { AddToWishlistButton },
    props: ['variant', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSize: null,
        }
    },
    computed: {
        ...mapGetters('wishlist', {
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        variantIsInWishlist() {
            if (!this.variant) return
            return this.getVariantIsInWishlist(this.variant)
        },
    },
    methods: {
        ...mapActions('wishlist', ['toggleInWishlist']),
        ...mapActions('basket', ['addToBasket']),
        onAddToBasket() {
            this.addToBasket({ variant: this.variant, size: this.selectedSize })
            this.onHide()
        },
        onHide() {
            this.selectedSize = null
            this.$emit('hide')
        },
        onClickOutside() {
            if (!this.autoHide) return
            this.onHide()
        },
        onChangeSize(size) {
            this.selectedSize = size
            this.$nextTick(() => {
                this.$refs.sizePopover.hide()
            })
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.add-to-basket-selector {
    padding: 8px;
    border-radius: 8px;
    backdrop-filter: blur(8px) brightness(80%);
    .size-selector {
        &::v-deep {
            .trigger {
                width: 100%;
            }
        }
    }
}
</style>
