<template>
    <button
        class="white lg circle wishlist-button"
        :class="{ active: currentTimingIsInWishlist }"
        @click="onAddToWishlist"
    >
        <i class="fa-heart" :class="currentTimingIsInWishlist ? 'fas' : 'far'"></i>
    </button>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'addToWishlistButton',
    computed: {
        ...mapGetters('videoPlayer', {
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('wishlist', {
            wishlist: 'getWishlist',
        }),
        currentTimingIsInWishlist() {
            return this.currentTiming && this.wishlist.find(product => product.id == this.currentTiming.product.id)
        },
    },
    methods: {
        ...mapMutations('wishlist', ['REMOVE_ITEM', 'ADD_ITEM']),
        onAddToWishlist() {
            // Check if we should add or remove
            if (this.currentTimingIsInWishlist) {
                // Remove
                const index = this.wishlist.findIndex(product => product.id == this.currentTiming.product.id)
                this.REMOVE_ITEM(index)
            } else {
                // Add
                this.ADD_ITEM(this.currentTiming.product)
            }
        },
    },
}
</script>

<style></style>
