<template>
    <v-popover trigger="click" :disabled="!variant || !!variantAddedToBasket || !!sizeDetail">
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
                variantAddedToBasket ? onRemoveFromBasket(localVariant) : sizeDetail && onAddToBasket(sizeDetail)
            "
        />
        <ChooseSizePopover slot="popover" :variant="localVariant" ref="sizeSelector" @submit="onAddToBasket" />
    </v-popover>
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
        'sizeDetail',
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
            return this.getItemIsInBasket({
                variant: this.variant,
                sizeDetail: this.sizeDetail,
            })
        },
    },
    methods: {
        ...mapActions('basket', ['addToBasket', 'removeFromBasket']),
        onAddToBasket(sizeDetail) {
            this.addToBasket({ variant: this.localVariant, sizeDetail })
            if (this.resetOnSubmit) {
                this.$refs.sizeSelector.reset()
            }
            this.$emit('update:sizeDetail', sizeDetail)
            this.$emit('submit')
        },
        onRemoveFromBasket(variant) {
            // Use a timeout here to avoid this event from triggering the popover
            setTimeout(() => {
                this.removeFromBasket({ variant, sizeDetail: this.sizeDetail })
                if (this.resetOnSubmit) {
                    this.$refs.sizeSelector.reset()
                }
            }, 5)
        },
    },
}
</script>

<style></style>
