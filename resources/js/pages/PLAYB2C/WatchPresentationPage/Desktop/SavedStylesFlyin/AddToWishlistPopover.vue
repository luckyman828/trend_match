<template>
    <div class="add-to-wishlist-popover flex-list flex-v" v-click-outside="onClickOutside">
        <AddToWishlistPopoverListItem v-for="variant in variants" :key="variant.id" :variant="variant" />
    </div>
</template>

<script>
import AddToWishlistPopoverListItem from './AddToWishlistPopoverListItem'

export default {
    name: 'AddToWishlistPopover',
    components: { AddToWishlistPopoverListItem },
    props: ['product'],
    computed: {
        variants() {
            return this.product ? this.product.variants : []
        },
    },
    methods: {
        onClickOutside(e) {
            if (e.target.classList.contains('popover') || e.target.closest('.popover')) return
            this.$emit('hide')
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.add-to-wishlist-popover {
    padding: 8px;
    border-radius: $borderRadiusMd;
}
</style>
