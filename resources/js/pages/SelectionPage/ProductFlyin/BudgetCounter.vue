<template>
    <div class="budget-counter" :class="{vertical: vertical}">
        <div class="bar">
            <svg height="100%" width="8px">
                <rect class="total" width="8px" height="100%" rx="4px"/>

                <rect class="remaining" rx="4px" 
                :x="0"
                width="8px" :height="`${100 - spendPercentageCapped + 2}%`"
                v-tooltip.right="`
                    Budget: <strong>${seperateThousands(currentSelection.budget)} ${currentSelection.currency}</strong>
                    <br>Remaining: <strong>${seperateThousands(currentSelection.budget - totalSpend)} ${currentSelection.currency}</strong>`
                "/>

                <rect class="spend" rx="4px"
                :y="`${100 - spendPercentageCapped}%`"
                width="8px" :height="`${spendPercentageCapped}%`"
                :class="spendPercentage > 100 ? 'over' : 'under'"
                v-tooltip.right="
                    `Budget: <strong>${seperateThousands(currentSelection.budget)} ${currentSelection.currency}</strong>
                    <br>Spend: <strong>${seperateThousands(totalSpend)} ${currentSelection.currency}</strong>
                    ${spendPercentage > 100 ? `<br>Remaining: <strong class='over-tooltip'>${seperateThousands(currentSelection.budget - totalSpend)} ${currentSelection.currency}</strong>` : ''}`
                "/>
            </svg>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'budgetCounter',
    props: [
        'vertical'
    ],
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
    width: auto;
    max-width: none;
    height: 100vh;
    max-height: calc(100vh - 140px);
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 60px;
    position: absolute;
    left: -32px;
    svg {
        display: block;
    }
    .bar {
        height: 100%;
        border: solid 2px #ffffff;
        border-radius: 6px;
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
}
</style>