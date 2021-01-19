<template>
    <BaseDrawer position="bottom" :show="show" class="cart-drawer" @close="$emit('close')">
        <template v-slot:header v-if="show">
            <div class="header-inner flex-list justify">
                <h3>Shopping bag</h3>
                <span>{{ actionGroups[cartView].length }} styles</span>
            </div>
        </template>
        <template v-slot:default v-if="show">
            <div class="body">
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
        </template>
    </BaseDrawer>
</template>

<script>
import CartItem from './CartItem'
import TabList from './TabList'
export default {
    name: 'cartDrawer',
    components: {
        CartItem,
        TabList,
    },
    props: ['show', 'cart', 'actionGroups', 'cartTotal', 'currentAction'],
    data: function() {
        return {
            cartView: 'ins',
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.body {
    display: flex;
    flex-direction: column;
    height: 100%;
    .main {
        overflow: auto;
        flex: 1;
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
