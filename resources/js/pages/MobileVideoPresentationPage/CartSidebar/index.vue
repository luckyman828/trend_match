<template>
    <div class="cart-sidebar-wrapper">
        <div class="trigger">
            <slot :ins="actionGroups.ins" />
        </div>
        <div class="cart-sidebar" :class="[{ show: show }, { 'player-paused': !isPlaying }]">
            <div class="background"></div>
            <div class="body">
                <button class="trigger primary" @click="$emit('close')">
                    <span>Close</span>
                </button>
                <div class="main">
                    <CartItem
                        v-for="(product, index) in actionGroups[cartView]"
                        :key="product.id"
                        :product="product"
                        :index="index"
                        :currentAction="currentAction"
                    />
                    <p v-if="cart.length <= 0" style="text-align: center; margin: 40px auto;">
                        No items yet. Better add some!
                    </p>
                </div>
                <div class="footer">
                    <TabList :cartView.sync="cartView" :actionGroups="actionGroups" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CartItem from './CartItem'
import TabList from './TabList'
export default {
    name: 'cartSidebar',
    components: {
        CartItem,
        TabList,
    },
    props: ['show'],
    data: function() {
        return {
            cartView: 'ins',
            cartCurrency: 'EUR',
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
.cart-sidebar {
    position: absolute;
    width: 100%;
    right: 0;
    bottom: -8px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    .background {
        height: calc(100%);
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: white;
        transform: translateY(-100%);
        transition: transform 0.2s ease-out, opacity 0.2s ease-in;
        z-index: -1;
        opacity: 0;
    }
    &.show {
        z-index: 2;
        .background {
            transform: none;
            opacity: 1;
        }
        .body {
            opacity: 1;
            pointer-events: all;
        }
    }
    // &.player-paused {
    //     .footer {
    //         transform: translateY(-$heightPauseOverlay);
    //     }
    // }
}

.body {
    opacity: 0;
    transition: opacity 0.1s ease-in;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    box-shadow: $shadowModule;
    border-left: $borderModule;
    pointer-events: none;
    .main {
        overflow: auto;
        flex: 1;
        padding: 60px 0px 240px;
    }
    .footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        transition: transform 0.1s ease-out;
    }
}
</style>
