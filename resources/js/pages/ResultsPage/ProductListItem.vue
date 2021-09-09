<template>
    <section class="product-list-item">
        <div class="product-header flex-list justify">
            <div class="left flex-list center-v">
                <div class="name">{{ product.name }}</div>
                <div class="id">#{{ product.datasource_id }}</div>
            </div>
            <div class="right flex-list center-v">
                <div class="quantity">{{ totalQuantity }} pcs</div>
                <div class="total">{{ totalPrice }} {{ product.yourPrice.currency }}</div>
            </div>
        </div>
        <div class="variant-list">
            <VariantListItem
                v-for="variant in variantsFiltered"
                :key="variant.id"
                :variant="variant"
                :product="product"
                :selectionInput="selectionInput"
                :selectionId="selectionId"
                :userId="userId"
                :isPDF="isPDF"
            />
        </div>
    </section>
</template>

<script>
import VariantListItem from './VariantListItem'
export default {
    name: 'productListItem',
    components: { VariantListItem },
    props: ['product', 'actionFilter', 'selectionId', 'userId', 'isPDF'],
    computed: {
        selectionInput() {
            return this.product.selectionInputList.find(x => x.selection.id == this.selectionId)
        },
        variantsFiltered() {
            const selectionInput = this.selectionInput
            const actionFilter = this.actionFilter
            const variants = selectionInput ? selectionInput.variants : this.product.variants
            if (!actionFilter || actionFilter == 'All') return variants

            return variants.filter(variant => {
                const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                let variantAction = variantSelectionInput.action
                if (this.userId) {
                    const userFeedback = variantSelectionInput.feedbacks.find(x => {
                        return x.selection_id == this.selectionId && x.user_id == this.userId
                    })
                    variantAction = userFeedback && userFeedback.action
                }
                if (actionFilter == 'In') return ['In', 'Focus'].includes(variantAction)
                return actionFilter == variantAction
            })
        },
        totalQuantity() {
            return Math.round(
                this.variantsFiltered.reduce((total, variant) => {
                    const selectionInput = this.selectionInput
                    if (!selectionInput) return total
                    const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                    if (!variantSelectionInput) return total
                    let variantQuantity = variantSelectionInput.quantity
                    if (this.userId) {
                        const userFeedback = variantSelectionInput.feedbacks.find(x => {
                            return x.selection_id == this.selectionId && x.user_id == this.userId
                        })
                        variantQuantity = userFeedback ? userFeedback.quantity : 0
                    }
                    return (total += variantQuantity)
                }, 0)
            )
        },
        totalPrice() {
            return Math.round(
                this.variantsFiltered.reduce((total, variant) => {
                    const selectionInput = this.selectionInput
                    if (!selectionInput) return total
                    const variantSelectionInput = selectionInput.variants.find(x => x.id == variant.id)
                    if (!variantSelectionInput) return total
                    let variantQuantity = variantSelectionInput.quantity
                    if (this.userId) {
                        const userFeedback = variantSelectionInput.feedbacks.find(x => {
                            return x.selection_id == this.selectionId && x.user_id == this.userId
                        })
                        variantQuantity = userFeedback ? userFeedback.quantity : 0
                    }
                    return (total += variantQuantity * this.product.yourPrice.wholesale_price)
                }, 0)
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.product-list-item {
    &:not(:first-child) {
        margin-top: 40px;
    }
    // margin-bottom: 40px;
    .product-header {
        margin-bottom: 6px;
        > * {
            line-height: 1;
        }
    }
    .name {
        font-size: 16px;
        font-weight: 700;
        line-height: 1;
    }
}
</style>
