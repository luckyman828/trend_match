<template>
    <v-popover
        trigger="click"
        :disabled="!variant || !!variantAddedToBasket || !!sizeDetail || !variant.inStock"
        :container="popoverContainer"
        @show="$emit('update:sizePopoverOpen', true)"
        @hide="$emit('update:sizePopoverOpen', false)"
    >
        <BaseStateAlternatingButton
            :buttonClass="[buttonClass, variantAddedToBasket && 'active']"
            :active="variantAddedToBasket"
            :class="{ 'sold-out': !variant.inStock }"
            :baseState="{
                class: baseClass,
                text:
                    textStyle == 'short'
                        ? $t('play.basket.addShort')
                        : textStyle == 'none'
                        ? ''
                        : $t('play.basket.addLong'),
                iconLeft: 'far fa-shopping-bag',
            }"
            :activeState="{
                text:
                    textStyle == 'short'
                        ? $t('play.basket.addedShort')
                        : textStyle == 'none'
                        ? ''
                        : $t('play.basket.addedLong'),
                class: ['primary col-white', activeClass],
                iconLeft: 'far fa-shopping-bag',
                nestedIconLeft: 'fas fa-check pos-right pos-bottom',
            }"
            :activeHoverState="{
                text:
                    textStyle == 'short'
                        ? $t('play.basket.removeShort')
                        : textStyle == 'none'
                        ? ''
                        : $t('play.basket.removeLong'),
                class: ['primary col-white', activeHoverClass],
                iconLeft: 'far fa-shopping-bag',
                nestedIconLeft: 'fas fa-times pos-right pos-bottom',
            }"
            :disabled="!variant || !variant.inStock"
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
        'popoverContainer',
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
    watch: {
        variantAddedToBasket(isAdded) {
            if (this.resetOnSubmit) {
                setTimeout(() => {
                    this.$refs.sizeSelector.reset()
                }, 5)
            }
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
                this.removeFromBasket({ variant, sizeDetail: this.variantAddedToBasket.sizeDetail })
                if (this.resetOnSubmit) {
                    this.$refs.sizeSelector.reset()
                }
            }, 5)
        },
    },
}
</script>

<style lang="scss" scoped>
::v-deep {
    button.sold-out > i {
        &::after {
            position: absolute;
            content: '|';
            font-weight: 900;
            font-size: 26px;
            left: 7px;
            top: -7px;
            transform: rotateZ(45deg);
        }
    }
}
</style>
