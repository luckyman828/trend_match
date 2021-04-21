<template>
    <div class="action-list flex-list sm">
        <product-action-button action="Focus" :product="product" displayStyle="iconOnly" buttonClass="true-square" />
        <product-action-button action="In" :product="product" displayStyle="iconOnly" buttonClass="true-square" />
        <product-action-button action="Out" :product="product" displayStyle="iconOnly" buttonClass="true-square" />
    </div>
</template>

<script>
import ProductActionButton from '../../components/common/ProductActionButton.vue'
export default {
    name: 'actionListPopover',
    components: { ProductActionButton },
    props: ['product'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.action-list {
    padding: 8px;
}
</style>
