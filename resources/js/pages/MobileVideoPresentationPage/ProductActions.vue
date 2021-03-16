<template>
    <div class="product-actions flex-list justify">
        <button class="white lg circle" @click="$emit('show-chat')"><i class="far fa-comment"></i></button>
        <div class="right flex-list md" v-if="product">
            <ProductActionButton action="Out" :product="product" displayStyle="coleredIcons" buttonClass="circle lg" />
            <ProductActionButton
                action="Focus"
                :product="product"
                displayStyle="coleredIcons"
                buttonClass="circle lg"
            />
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
    pointer-events: none;
    padding: 0 12px;
    > * {
        pointer-events: all;
    }
    .desired-paused & {
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
