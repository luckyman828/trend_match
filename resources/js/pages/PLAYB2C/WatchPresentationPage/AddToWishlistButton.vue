<template>
    <button
        class="add-to-wishlist"
        :class="isInWishlist ? 'active red' : theme != 'invisible' && 'white'"
        @click="onAddToWishlist"
    >
        <i class="fa-heart ft-12" style="margin-top: 1px;" :class="isInWishlist ? 'fas' : 'far'"></i>
    </button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'addToWishlistButton',
    props: ['variants', 'theme'],
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
