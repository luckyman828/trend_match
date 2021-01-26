<template>
    <div class="cart-drawer-wrapper">
        <BaseButton class="trigger" buttonClass="white circle" @click="showCart = true">
            <i class="far fa-heart"></i>
            <template v-slot:count>
                <div class="circle dark xs" v-if="actionGroups.ins.length > 0">
                    {{ actionGroups.ins.length }}
                </div>
            </template>
        </BaseButton>
        <CartDrawer
            :show="showCart"
            :cart="cart"
            :cartTotal="cartTotal"
            :actionGroups="actionGroups"
            :currentAction="currentAction"
            @close="showCart = false"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import CartDrawer from './CartDrawer'
export default {
    name: 'cartDrawerWrapper',
    components: {
        CartDrawer,
    },
    props: ['show'],
    data: function() {
        return {
            cartView: 'ins',
            showCart: false,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
            isPlaying: 'getIsPlaying',
        }),
        ...mapGetters('videoPresentation', {
            timings: 'getVideoTimings',
        }),
        ...mapGetters('selections', {
            currentSelectionMode: 'currentSelectionMode',
        }),
        ...mapGetters('products', {
            getActiveSelectionInput: 'getActiveSelectionInput',
        }),
        currentAction() {
            return this.currentSelectionMode == 'Feedback' ? 'your_feedback' : 'action'
        },
        cart() {
            const cartProducts = []
            this.timings.map(timing => {
                const alreadyAdded = cartProducts.find(x => x.id == timing.product.id)
                if (alreadyAdded) return
                cartProducts.push(timing.product)
            })
            return cartProducts
        },
        actionGroups() {
            const currentAction = this.currentAction
            return {
                ins: this.cart.filter(x => {
                    const selectionInput = this.getActiveSelectionInput(x)
                    return ['In', 'Focus'].includes(selectionInput[currentAction])
                }),
                focus: this.cart.filter(x => {
                    const selectionInput = this.getActiveSelectionInput(x)
                    return selectionInput[currentAction] == 'Focus'
                }),
                outs: this.cart.filter(x => {
                    const selectionInput = this.getActiveSelectionInput(x)
                    return selectionInput[currentAction] == 'Out'
                }),
                nds: this.cart.filter(x => {
                    const selectionInput = this.getActiveSelectionInput(x)
                    return selectionInput[currentAction] == 'None'
                }),
                all: this.cart,
            }
        },
        cartTotal() {
            return this.actionGroups.ins.reduce((acc, curr) => (acc += curr.yourPrice.wholesale_price), 0)
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.cart-drawer-wrapper {
    .trigger {
        position: fixed;
        right: 16px;
        top: 16px;
        i {
            font-weight: 400;
        }
        .count {
            position: absolute;
            right: -20px;
            top: -10px;
        }
    }
}
::v-deep {
    .drawer-wrapper {
        &.show {
            z-index: 4;
        }
    }
}
</style>
