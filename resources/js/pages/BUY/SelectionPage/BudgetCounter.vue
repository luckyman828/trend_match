<template>
    <div class="budget-counter">
        <div class="bar">
            <svg width="100%" height="8px" :class="spendPercentage > 100 ? 'over' : 'under'">
                <defs>
                    <linearGradient id="budget-gradient">
                        <stop offset="0%" class="stop1" />
                        <stop offset="100%" class="stop2" />
                    </linearGradient>
                </defs>

                <rect class="total" width="100%" height="8px" rx="4px" />

                <rect
                    class="remaining"
                    :x="`${spendPercentageCapped - 2}%`"
                    :width="`${100 - spendPercentageCapped + 2}%`"
                    height="8px"
                    rx="4px"
                    v-tooltip.bottom="
                        `            
                    <div>Budget: <strong>${seperateThousands(theSelectionBudget)} ${selection.currency}</strong></div>
                    <div>Remaining: <strong>${seperateThousands(theSelectionBudget - totalSpend)} ${
                            selection.currency
                        }</strong></div>
                `
                    "
                />

                <rect
                    class="spend"
                    :width="`${spendPercentageCapped}%`"
                    height="8px"
                    rx="4px"
                    v-tooltip.bottom="
                        `
                    <div>Budget: <strong>${seperateThousands(theSelectionBudget)} ${selection.currency}</strong></div>
                    <div>Spend: <strong>${seperateThousands(totalSpend)} ${selection.currency}</strong>
                    ${
                        spendPercentage > 100
                            ? `Remaining: <strong class='over-tooltip'>${seperateThousands(
                                  theSelectionBudget - totalSpend
                              )} ${selection.currency}</strong></div>`
                            : ''
                    }`
                    "
                >
                    <linearGradient id="Gradient1">
                        <stop class="stop1" offset="0%" />
                        <stop class="stop2" offset="50%" />
                        <stop class="stop3" offset="100%" />
                    </linearGradient>
                </rect>
            </svg>
        </div>
        <!-- <div class="indicator circle xs spend primary" :style="{left: `calc(${spendPercentageCapped}% - 4px - ${(76 * spendPercentageCapped) / 100}px)`}"
        v-tooltip="`${seperateThousands(totalSpend)} ${selection.currency}`">
        </div> -->
        <div class="indicator budget flex-list justify" v-if="!hideLabel">
            <span>{{ separateThousands(totalSpend.toFixed(0)) }} {{ selection.currency }} ({{ totalQty }} pcs.)</span>
            <span>{{ theSelectionBudget | thousandSeparated }} {{ selection.currency }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'budgetCounter',
    props: ['hideLabel', 'selection'],
    data() {
        return {
            // spendPercentage: 50
        }
    },
    computed: {
        ...mapGetters('products', {
            products: 'getProducts',
        }),
        ...mapGetters('selections', {
            allSelections: 'getSelections',
        }),
        totalQty() {
            let total = 0
            this.products.map(product => {
                product.variants.map(variant => {
                    total += variant.quantity
                })
            })
            return total
        },
        totalSpend() {
            let total = 0
            this.products.map(product => {
                product.variants.map(variant => {
                    if (!this.selection.currency) return
                    const productPrice = product.prices.find(x => x.currency == this.selection.currency)
                    if (!productPrice) return
                    total += variant.quantity * productPrice.wholesale_price
                })
            })
            return total
        },
        spendPercentage() {
            if (!this.theSelectionBudget) return 0
            return (this.totalSpend / this.theSelectionBudget) * 100
        },
        spendPercentageCapped() {
            return Math.min(this.spendPercentage, 100)
        },
        theSelectionBudget() {
            return this.selection.type == 'Summed'
                ? this.allSelections.reduce((total, curr) => (total += curr.budget), 0)
                : this.selection.budget
        },
    },
    methods: {
        seperateThousands(value) {
            return (Math.round(value * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
    },
}
</script>

<style lang="scss">
.over-tooltip {
    color: $red;
}
</style>

<style scoped lang="scss">
.budget-counter {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    svg {
        display: block;
        &.over {
            .stop1 {
                stop-color: $red;
            }
            .stop2 {
                stop-color: $red700;
            }
        }
    }
    .bar {
        .stop1 {
            stop-color: $green;
        }
        .stop2 {
            stop-color: $green700;
        }
        rect.spend {
            fill: $bluegrey800;
            fill: url(#budget-gradient) #fff;
            transition: width 0.2s ease-out;
            &:hover {
                opacity: 0.7;
            }
        }
        rect.remaining {
            fill: transparent;
            &:hover {
                opacity: 0.7;
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
