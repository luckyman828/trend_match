<template>
    <div class="product-action-selector" v-if="product">
        <div class="flex-list center-v md">
            <button class="circle lg white out" @click="onSetAction('Out')">
                <i class="far fa-times red"></i>
            </button>
            <button class="circle white focus" @click="onSetAction('Focus')">
                <i class="far fa-star primary"></i>
            </button>
            <button class="circle white lg in" @click="onSetAction('In')">
                <i class="far fa-heart green"></i>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'productActionSelector',
    data: function() {
        return {}
    },
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
    methods: {
        ...mapActions('actions', ['updateCurrentProductAction']),
        onSetAction(action) {
            this.product.yourAction = this.product.yourAction == action ? 'None' : action
            this.updateCurrentProductAction(this.product)
        },
    },
}
</script>

<style scoped lang="scss">
.product-action-selector {
    position: fixed;
    bottom: 28px;
    transition: transform 0.1s ease-out;
    width: 100%;
    text-align: center;
    .paused & {
        transform: translateY(-24px);
    }
    .flex-list {
        pointer-events: all;
        display: inline-flex;
    }
}
</style>
