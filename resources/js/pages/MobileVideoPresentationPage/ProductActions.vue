<template>
    <div class="product-actions" v-if="product">
        <div class="flex-list center-v md">
            <!-- <button class="circle lg white out" @click="onSetAction('Out')">
                <i class="far fa-times red"></i>
            </button>
            <button class="circle white focus" @click="onSetAction('Focus')">
                <i class="far fa-star primary"></i>
            </button>
            <button class="circle white lg in" @click="onSetAction('In')">
                <i class="far fa-heart green"></i>
            </button> -->
            <ProductActionButton action="Out" :product="product" displayStyle="coleredIcons" buttonClass="circle lg" />
            <ProductActionButton action="Focus" :product="product" displayStyle="coleredIcons" buttonClass="circle" />
            <ProductActionButton action="In" :product="product" displayStyle="coleredIcons" buttonClass="circle lg" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductActionButton from '../../components/common/ProductActionButton.vue'
export default {
    name: 'productActions',
    components: {
        ProductActionButton,
    },
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
@import '~@/_variables.scss';

.product-actions {
    position: fixed;
    bottom: 28px;
    transition: transform $videoPauseTransition;
    width: 100%;
    text-align: center;
    z-index: 3;
    .paused & {
        transform: translateY(-24px);
    }
    .flex-list {
        pointer-events: all;
        display: inline-flex;
    }
    ::v-deep {
        button {
            border: $borderEl;
        }
    }
}
</style>
