<template>
    <portal to="modals">
        <div class="call-to-action flex-list bg-blur">
            <AddToWishlistButton />
            <v-popover trigger="click">
                <button class="rounded lg white">
                    <i class="far fa-ruler"></i>
                    <span>Choose size</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <BaseSelectButtons
                    slot="popover"
                    type="radio"
                    :options="currentVariant.ean_sizes"
                    optionNameKey="size"
                />
            </v-popover>
            <button class="dark rounded lg">
                <i class="far fa-shopping-bag"></i>
                <span>Add to basket</span>
            </button>
        </div>
    </portal>
</template>

<script>
import AddToWishlistButton from '../AddToWishlistButton'

export default {
    name: 'callToAction',
    components: { AddToWishlistButton },
    props: ['product', 'currentVariant'],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.call-to-action {
    position: fixed;
    bottom: 8px;
    left: 8px;
    width: calc(100vw - 16px);
    z-index: 9;
    border-radius: 8px;
    padding: 8px;
    button {
        font-size: 12px;
    }
}
</style>
