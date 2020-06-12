<template>
    <div class="budget-counter">
        <div class="bar">
            <svg width="100%" height="8px">
                <rect class="total" width=100% height="8px" rx="4px"/>
                <rect class="spend" :width="`${spendPercentage}%`" height="8px" rx="4px"/>
            </svg>
        </div>
        <div class="pill xs spend white" :style="{left: `calc(${spendPercentage}% - 4px - ${(76 * spendPercentage) / 100}px)`}">
            <span>{{totalSpend | thousandSeparated}}</span>
        </div>
        <div class="pill xs budget">
            <span>{{currentSelection.budget | thousandSeparated}} {{currentSelection.currency}}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'budgetCounter',
    data() { return {
        spendPercentage: 50
    }},
    computed: {
        ...mapGetters('selections', ['currentSelection']),
        ...mapGetters('products', ['products']),
        totalSpend() {
            let total = 0
            this.products.map(product => {
                product.variants.map(variant => {
                    if (!this.currentSelection.currency) return
                    const productPrice = product.prices.find(x => x.currency == this.currentSelection.currency)
                    if (!productPrice) return 
                    total += variant.quantity * productPrice.wholesale_price
                })
            })
            return total
        },
        // spendPercentage() {
        //     return Math.min(((this.totalSpend / this.currentSelection.budget) * 100), 100)
        // }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.budget-counter {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: auto;
    .bar {
        rect.spend {
            fill: $bluegrey800;
        }
        rect.total {
            fill: $grey400;
        }
    }
    .pill {
        position: absolute;
        top: 0;
        text-align: center;
        font-weight: 500;
        &.spend {
            width: 80px;
        }
        &.budget {
            right: 0;
        }
    }
}
</style>