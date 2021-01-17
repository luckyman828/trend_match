<template>
    <section class="variant-list-item theme-light flex-list md">
        <div class="img-wrapper">
            <div class="img-sizer">
                <BaseVariantImage :variant="variant" size="sm" />
            </div>
        </div>
        <div class="flex-list flex-v md">
            <div class="list-item name">
                <label>Name</label>
                <div class="value">
                    {{ variant.name }}
                </div>
            </div>
            <div class="ean list-item">
                <label>EAN</label>
                <div class="value">
                    {{ variant.ean }}
                </div>
            </div>
            <div class="assortment list-item" v-if="variant.extra_data && variant.extra_data.assortment">
                <label>Assortment</label>
                <div class="value">
                    {{ variant.extra_data.assortment }}
                </div>
            </div>
        </div>
        <div class="delivery list-item">
            <label>Delivery</label>
            <div class="value" v-for="delivery in product.delivery_dates" :key="delivery">
                {{ getPrettyDate(delivery) }}
            </div>
        </div>
        <div class="cost flex-list flex-v md">
            <div class="list-item qty" v-if="variantQuantity">
                <label>Quantity</label>
                <div class="value">{{ variantQuantity }}</div>
            </div>
            <div class="price list-item">
                <label>WHS</label>
                <div class="value">{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</div>
            </div>
            <div class="total list-item" v-if="variantQuantity">
                <label>Total</label>
                <div class="value">
                    {{
                        product.yourPrice.wholesale_price
                            ? variantQuantity * product.yourPrice.wholesale_price
                            : 'No Price'
                    }}
                    {{ product.yourPrice.currency }}
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'variantListItem',
    props: ['variant', 'selectionInput', 'product', 'selectionId', 'userId'],
    computed: {
        variantSelectionInput() {
            if (!this.selectionInput) return
            return this.selectionInput.variants.find(x => x.id == this.variant.id)
        },
        variantAction() {
            const selectionInput = this.selectionInput
            if (!selectionInput) return
            let variantAction = selectionInput.action
            if (this.userId) {
                const userFeedback = selectionInput.feedbacks.find(x => {
                    return x.selection_id == this.selectionId && x.user_id == this.userId
                })
                variantAction = userFeedback && userFeedback.action
            }
            return variantAction
        },
        variantQuantity() {
            const selectionInput = this.variantSelectionInput
            if (!selectionInput) return
            let variantQuantity = selectionInput.quantity
            if (this.userId) {
                const userFeedback = selectionInput.feedbacks.find(x => {
                    return x.selection_id == this.selectionId && x.user_id == this.userId
                })
                variantQuantity = userFeedback ? userFeedback.quantity : 0
            }
            return variantQuantity
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.variant-list-item {
    padding: 8px 12px 12px 8px;
    border-radius: 4px;
    background: white;
    margin-bottom: 12px;
    .img-wrapper {
        width: 84px;
    }
    .img-sizer {
        height: 0;
        padding-top: 133.33%;
        position: relative;
        width: 100%;
        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }
    }
    .cost,
    .delivery {
        margin-left: auto;
    }
    .list-item {
        min-width: 72px;
        > * {
            display: block;
            &:first-line {
                line-height: 1;
                white-space: normal;
            }
        }

        label {
            font-size: 10px;
            font-weight: 400;
            display: block;
            margin-bottom: 4px;
            color: $bluegrey500;
        }
        .value {
            font-size: 13px;
            font-weight: 700;
            &.description {
                white-space: pre-line;
                word-break: break-word;
                &:first-line {
                    line-height: 1.6;
                }
            }
        }
    }
}
</style>
