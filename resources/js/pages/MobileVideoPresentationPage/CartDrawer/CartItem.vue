<template>
    <div class="cart-item" :class="`action-${selectionInput[currentAction]}`">
        <div class="action-indicator"></div>
        <div class="img-wrapper">
            <BaseVariantImage :variant="product.variants[0]" size="sm" />
        </div>
        <div class="details-wrapper flex-list flex-v justify-content">
            <div class="flex-list space-between">
                <span class="brand">{{ product.brand }}</span>
                <span class="delivery">{{ getPrettyDate(product.delivery_dates[0]) }}</span>
            </div>
            <span class="name">{{ product.name }}</span>
            <div class="prices">
                <div class="flex-list md">
                    <div class="list-item">
                        <label class="sm">WSP</label>
                        <span class="price" v-if="product.yourPrice.wholesale_price">{{
                            product.yourPrice.wholesale_price.toFixed(2)
                        }}</span>
                    </div>
                    <div class="list-item">
                        <label class="sm">RRP</label>
                        <span class="price" v-if="product.yourPrice.recommended_retail_price">{{
                            product.yourPrice.recommended_retail_price.toFixed(2)
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="variant-list">
                <div class="pill dark variant-item sm" v-if="product.variants.length > 0">
                    <i class="fas fa-circle"></i>
                    <span>
                        {{ product.variants[0].name
                        }}<span v-if="product.variants.length > 1"> + {{ product.variants.length - 1 }}</span>
                    </span>
                </div>
            </div>
            <div class="focus-label" v-if="product.is_editor_choice">
                <i class="fas fa-badge-check"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'cartItem',
    props: ['product', 'index', 'currentAction'],
    computed: {
        selectionInput() {
            return this.product.getActiveSelectionInput
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.cart-item {
    height: 120px;
    // margin-bottom: 4px;
    display: flex;
    border: $borderElSoft;
    &:not(:first-child) {
        border-top: none;
    }
    &.action-Focus {
        .action-indicator {
            background: $primary;
        }
    }
    &.action-In {
        .action-indicator {
            background: $green;
        }
    }
    &.action-Out {
        .action-indicator {
            background: $red;
        }
    }
}
.action-indicator {
    width: 8px;
    margin-right: 2px;
    background: $grey600;
}
.img-wrapper {
    width: 120px;
    min-width: 120px;
    height: 100%;
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}
.details-wrapper {
    padding: 4px 12px;
    flex: 1;
    overflow: hidden;
    position: relative;
    .brand,
    .delivery {
        font-size: 10px;
        color: $fontSoft;
        font-weight: 500;
    }
    .brand {
        text-transform: uppercase;
    }
    .name {
        display: block;
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .focus-label {
        color: $primary;
        font-size: 24px;
        position: absolute;
        right: 12px;
        bottom: 4px;
    }
}
</style>
