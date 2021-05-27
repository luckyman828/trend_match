<template>
    <ChooseSizePopover
        :variant="localVariant"
        @submit="onAddToBasket"
        :disabled="!variant || !!variantAddedToBasket || !!size"
        ref="sizeSelector"
    >
        <BaseStateAlternatingButton
            :buttonClass="[buttonClass, variantAddedToBasket && 'active']"
            :active="variantAddedToBasket"
            :baseState="{
                class: baseClass,
                text: textStyle == 'short' ? 'Add' : textStyle == 'none' ? '' : 'Add to basket',
                iconLeft: 'far fa-shopping-bag',
            }"
            :activeState="{
                text: textStyle == 'short' ? 'Added' : textStyle == 'none' ? '' : 'Added',
                class: ['primary', activeClass],
                iconLeft: 'far fa-shopping-bag',
                nestedIconLeft: 'far fa-check pos-right pos-bottom',
            }"
            :activeHoverState="{
                text: textStyle == 'short' ? 'Remove' : textStyle == 'none' ? '' : 'Remove',
                class: ['primary', activeHoverClass],
                iconLeft: 'far fa-shopping-bag',
                nestedIconLeft: 'far fa-times pos-right pos-bottom',
            }"
            :disabled="!variant"
            @click="
                localVariant = variant
                variantAddedToBasket ? onRemoveFromBasket(localVariant) : size && onAddToBasket(size)
            "
        >
        </BaseStateAlternatingButton>
    </ChooseSizePopover>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChooseSizePopover from './ChooseSizePopover'

export default {
    name: 'AddToBasketButton',
    components: { ChooseSizePopover },
    props: [
        'variant',
        'textStyle',
        'buttonClass',
        'baseClass',
        'activeClass',
        'activeHoverClass',
        'size',
        'resetOnSubmit',
    ],
    data() {
        return {
            localVariant: null,
        }
    },
    computed: {
        ...mapGetters('basket', {
            basket: 'getBasket',
            getItemIsInBasket: 'getItemIsInBasket',
        }),
        variantAddedToBasket() {
            if (!this.variant) return false
            return this.getItemIsInBasket({ variant: this.variant, size: this.size })
        },
    },
    methods: {
        ...mapActions('basket', ['addToBasket', 'removeFromBasket']),
        onAddToBasket(size) {
            this.addToBasket({ variant: this.localVariant, size })
            if (this.resetOnSubmit) {
                this.$refs.sizeSelector.reset()
            }
            this.$emit('update:size', size)
            this.$emit('submit')
        },
        onRemoveFromBasket(variant) {
            // Use a timeout here to avoid this event from triggering the popover
            setTimeout(() => {
                this.removeFromBasket({ variant, size: this.size })
                if (this.resetOnSubmit) {
                    this.$refs.sizeSelector.reset()
                }
            }, 5)
        },
    },
}
</script>

<style></style>
