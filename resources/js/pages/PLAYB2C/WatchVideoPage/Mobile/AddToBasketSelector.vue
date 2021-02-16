<template>
    <BaseFloatyBar
        classes="add-to-basket-selector flex-list justify bg-blur"
        :show="show"
        :autoHide="autoHide"
        @hide="onHide"
    >
        <AddToWishlistButton v-if="!hideWishlist" class="lg" />
        <v-popover trigger="click">
            <button class="rounded lg white">
                <i class="far fa-ruler"></i>
                <span v-if="selectedSize">Size: {{ selectedSize }}</span>
                <span v-else>Choose size</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <BaseSelectButtons
                v-if="item"
                header="Choose size"
                slot="popover"
                type="radio"
                v-close-popover
                :submitOnChange="true"
                :options="item.ean_sizes"
                optionNameKey="size"
                optionValueKey="size"
                v-model="selectedSize"
            />
        </v-popover>
        <BaseButton buttonClass="dark rounded lg" :disabled="!selectedSize" @click="onAddToBasket">
            <i class="far fa-shopping-bag"></i>
            <span>Add to basket</span>
        </BaseButton>
    </BaseFloatyBar>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import AddToWishlistButton from './AddToWishlistButton'

export default {
    name: 'addToBasketSelector',
    components: { AddToWishlistButton },
    props: ['item', 'show', 'hideWishlist', 'autoHide'],
    data() {
        return {
            selectedSize: null,
        }
    },
    methods: {
        ...mapActions('basket', ['addToBasket']),
        onAddToBasket() {
            this.addToBasket({ variant: this.item, size: this.selectedSize })
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
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
</style>
