<template>
    <button class="add-to-wishlist" :class="isInWishlist && 'active'" @click="onAddToWishlist">
        <i class="fa-heart ft-16" :class="isInWishlist ? 'primary fas' : 'far'"></i>
    </button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'addToWishlistButton',
    props: ['variants'],
    computed: {
        ...mapGetters('wishlist', {
            getVariantIsInWishlist: 'getVariantIsInWishlist',
        }),
        isInWishlist() {
            if (!this.variants) return false
            return !this.variants.find(variant => variant != null && !this.getVariantIsInWishlist(variant))
        },
    },
    methods: {
        ...mapActions('wishlist', ['addItems', 'removeItems']),
        onAddToWishlist() {
            console.log('add to weishlist')
            // Check if we should add or remove
            if (this.isInWishlist) {
                this.removeItems(this.variants)
            } else {
                // Add
                this.addItems(this.variants)
            }
        },
    },
}
</script>

<style></style>
