<template>
    <div class="budget-counter">
        <div class="bar">
            <svg width="100%" height="8px">
                <rect class="total" width=100% height="8px" rx="4px"/>

                <rect class="remaining" :x="`${spendPercentageCapped - 2}%`" :width="`${100 - spendPercentageCapped + 2}%`" height="8px" rx="4px"
                v-tooltip="`Remaining: <strong>${seperateThousands(currentSelection.budget - totalSpend)} ${currentSelection.currency}</strong>`"/>

                <rect class="spend" :width="`${spendPercentageCapped}%`" height="8px" rx="4px"
                :class="spendPercentage > 100 ? 'over' : 'under'"
                v-tooltip="`Spend: <strong>${seperateThousands(totalSpend)} ${currentSelection.currency}</strong>${spendPercentage > 100 ? `<br>Remaining: <strong class='over-tooltip'>${seperateThousands(currentSelection.budget - totalSpend)} ${currentSelection.currency}</strong>` : ''}`"/>
            </svg>
        </div>
        <!-- <div class="indicator circle xs spend primary" :style="{left: `calc(${spendPercentageCapped}% - 4px - ${(76 * spendPercentageCapped) / 100}px)`}"
        v-tooltip="`${seperateThousands(totalSpend)} ${currentSelection.currency}`">
        </div> -->
        <div class="indicator budget">
            <span>{{currentSelection.budget | thousandSeparated}} {{currentSelection.currency}}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'budgetCounter',
    data() { return {
        // spendPercentage: 50
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
        spendPercentage() {
            return ((this.totalSpend / this.currentSelection.budget) * 100)
        },
        spendPercentageCapped() {
            return Math.min(((this.totalSpend / this.currentSelection.budget) * 100), 100)
        }
    },
    methods: {
        seperateThousands(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    }
}
</script>

<style lang="scss">
@import '~@/_variables.scss';
.over-tooltip {
    color: $red;
}
</style>

<style scoped lang="scss">
@import '~@/_variables.scss';
.budget-counter {
    width: 100%;
    max-width: 400px;
    margin: auto;
    margin-top: 12px;
    svg {
        display: block;
    }
    .bar {
        rect.spend {
            fill: $bluegrey800;
            &:hover {
                fill: $primary;
            }
            &.over {
                fill: $red;
                &:hover {
                    fill: $red400;
                }
            }
        }
        rect.remaining {
            fill: transparent;
            &:hover {
                fill: $primary;
            }
        }
        rect.total {
            fill: $grey400;
        }
    }
    .indicator {
            font-weight: 500;
            font-size: 11px;
            line-height: 1;
            margin-top: 2px;
        &.budget {
            text-align: right;
        }
    }
}
</style>