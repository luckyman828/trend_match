<template>
    <BaseButton
        class="wishlist-button"
        v-bind="$attrs"
        :class="{ active: variantIsInWishlist }"
        @click="onAddToWishlist"
    >
        <i class="fa-heart" :class="variantIsInWishlist ? 'fas green' : 'far dark'"></i>
    </BaseButton>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'addToWishlistButton',
    props: ['variant'],
    computed: {
        ...mapGetters('playPresentation', {
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        variantToAdd() {
            return this.variant ? this.variant : this.currentTiming.product.variants[0]
        },
        variantIsInWishlist() {
            if (!this.currentTiming) return
            return this.getVariantIsInWishlist(this.variantToAdd)
        },
    },
    methods: {
        ...mapMutations('wishlist', ['REMOVE_ITEM', 'ADD_ITEM']),
        onAddToWishlist() {
            // const targetWindow = window.parent
            // const targetOrigin = `https://kollektteststore.myshopify.com`
            // targetWindow.postMessage({ action: 'addToWishlist', variantId: this.variantToAdd.id }, targetOrigin)
            // Check if we should add or remove
            if (this.variantIsInWishlist) {
                // Remove
                const index = this.wishlist.findIndex(item => item.id == this.variantToAdd.id)
                this.REMOVE_ITEM(index)
            } else {
                // Add
                this.ADD_ITEM(this.variantToAdd)
            }
        },
    },
}
</script>

<style></style>
