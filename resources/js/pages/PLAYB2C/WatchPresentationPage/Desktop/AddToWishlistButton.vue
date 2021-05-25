<template>
    <button class="add-to-wishlist" @click="toggleInWishlist(variant)">
        <i class="fa-heart ft-16" :class="variantIsInWishlist ? 'primary fas' : 'far'"></i>
    </button>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'addToWishlistButton',
    props: ['variant'],
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
    },
}
</script>

<style></style>
