<template>
    <div class="add-to-basket-popover flex-list flex-v bg-theme-white theme-border" v-click-outside="onClickOutside">
        <AddToBasketPopoverListItem
            v-for="variant in variants"
            :key="variant.id"
            :variant="variant"
            :sizePopoverContainer="sizePopoverContainer"
        />
    </div>
</template>

<script>
import AddToBasketPopoverListItem from './AddToBasketPopoverListItem'

export default {
    name: 'AddToBasketPopover',
    components: { AddToBasketPopoverListItem },
    props: ['variants', 'sizePopoverContainer'],
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

.add-to-basket-popover {
    padding: 8px;
    border-radius: $borderRadiusMd;
}
</style>
