<template>
    <div class="budget-counter">
        <div class="bar">
            <svg width="100%" height="8px">
                <rect class="total" width="100%" height="8px" rx="4px" />

                <rect
                    class="remaining"
                    :x="`${spendPercentageCapped - 2}%`"
                    :width="`${100 - spendPercentageCapped + 2}%`"
                    height="8px"
                    rx="4px"
                    v-tooltip.bottom="
                        `            
                    Budget: <strong>${seperateThousands(selection.budget)} ${selection.currency}</strong>
                    <br>Remaining: <strong>${seperateThousands(selection.budget - totalSpend)} ${
                            selection.currency
                        }</strong>
                `
                    "
                />

                <rect
                    class="spend"
                    :width="`${spendPercentageCapped}%`"
                    height="8px"
                    rx="4px"
                    :class="spendPercentage > 100 ? 'over' : 'under'"
                    v-tooltip.bottom="
                        `
                    Budget: <strong>${seperateThousands(selection.budget)} ${selection.currency}</strong>
                    <br>Spend: <strong>${seperateThousands(totalSpend)} ${selection.currency}</strong>
                    ${
                        spendPercentage > 100
                            ? `<br>Remaining: <strong class='over-tooltip'>${seperateThousands(
                                  selection.budget - totalSpend
                              )} ${selection.currency}</strong>`
                            : ''
                    }`
                    "
                />
            </svg>
        </div>
        <!-- <div class="indicator circle xs spend primary" :style="{left: `calc(${spendPercentageCapped}% - 4px - ${(76 * spendPercentageCapped) / 100}px)`}"
        v-tooltip="`${seperateThousands(totalSpend)} ${selection.currency}`">
        </div> -->
        <div class="indicator budget" v-if="!hideLabel">
            <span>{{ selection.budget | thousandSeparated }} {{ selection.currency }}</span>
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
        ...mapGetters('products', ['products']),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        totalSpend() {
            let total = 0
            this.products.map(product => {
                const selectionInput = this.getActiveSelectionInput(product)
                if (!selectionInput) return
                selectionInput.variants.map(variant => {
                    if (!this.selection.currency) return
                    const productPrice = product.prices.find(x => x.currency == this.selection.currency)
                    if (!productPrice) return
                    total += variant.quantity * productPrice.wholesale_price
                })
            })
            return total
        },
        spendPercentage() {
            return (this.totalSpend / this.selection.budget) * 100
        },
        spendPercentageCapped() {
            return Math.min((this.totalSpend / this.selection.budget) * 100, 100)
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
