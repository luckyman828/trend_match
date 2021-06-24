<template>
    <div class="variant-list-item ui-square flex-list justify space-md hover-shadow">
        <div :key="variant.id" class="square lg variant-color white" :style="imageBackground"></div>
        <div class="details-wrapper flex-list flex-v space-sm">
            <div class="name ft-12 ft-bd">
                {{ variant.name }}
            </div>
            <div class="flex-list">
                <div class="size-list flex-list">
                    <div
                        class="size-list-item ui-square white sm flex-list flex-v"
                        v-for="(sizeObj, index) in variant.sizes"
                        :key="index"
                    >
                        <div class="size-label ft-10">{{ sizeObj.size }}</div>
                        <div class="size-label ft-12 ft-bd">{{ sizeObj.quantity }}</div>
                    </div>
                </div>
                <div class="qty-wrapper">
                    <div class="square white qty" v-if="!hasAssortments">
                        <span>{{ variant.quantity ? variant.quantity : 0 }}</span>
                    </div>
                    <BaseInputShape
                        @click.native.stop
                        v-else
                        class="qty-input square lg white"
                        ref="input"
                        v-model.number="localQuantity"
                        :disabled="!actionWriteAccess"
                        :pattern="/^[0-9]*$/"
                        @focus="editActive = true"
                        @blur="onSubmitQty"
                        @keydown.enter="onEnter"
                        @keydown.tab.native="$emit('tab', $event)"
                        :selectOnFocus="true"
                        :isNumber="true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getWeightedSplit } from '../../../../helpers/sizeSplit'
import variantImage from '../../../../mixins/variantImage'
import { getVariantBackgroundStyle } from '../../../../helpers/dkcIntegration'
import generateAssortmentCombinations from '../../../../helpers/generateAssortmentCombinations'
import findBestAssortmentCombination from '../../../../helpers/findBestAssortmentCombination'
import dkcSizeSplit from '../../../../assets/dkc/sizeSplit.json'

export default {
    name: 'variantListItem',
    props: ['variant'],
    mixins: [variantImage],
    data() {
        return {
            localQuantity: 0,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            enabledFeatures: 'getEnabledFeatures',
        }),
        ...mapGetters('selections', {
            writeAccess: 'getCurrentSelectionWriteAccess',
        }),
        ...mapGetters('integrationDkc', {
            brandMap: 'getBrandMap',
        }),
        actionWriteAccess() {
            return this.writeAccess && this.writeAccess.actions
        },
        imageBackground() {
            return getVariantBackgroundStyle(this.variant)
        },
        hasAssortments() {
            return this.variant.assortments.length > 0
        },
        sizeWeights() {
            if (this.enabledFeatures.dkc_integration) {
                const sizes = this.variant.ean_sizes
                // If the brand is just 2 characters long we have the code and should get the full brandname instead
                const productBrand = this.variant.product.brand
                const brand =
                    productBrand.length == 2
                        ? this.brandMap.find(brand => brand.code == productBrand).name
                        : productBrand

                const brandWeights = dkcSizeSplit[brand]
                if (!brandWeights) return { name: 'no weights found', weights: [] }
                const sizeType = isFinite(sizes[0].size) ? 'numeric' : 'alphanumeric'
                const sizeSubType =
                    sizeType == 'alphanumeric'
                        ? 'standard'
                        : // : this.variant.product.extra_data.topBottom == 'Bottom' && brandWeights[sizeType].bottomsIn
                        this.variant.product.extra_data.topBottom == 'Bottom' &&
                          this.variant.product.category == 'Jeans' &&
                          brandWeights[sizeType].bottomsIn &&
                          this.variant.sizes.find(size => parseInt(size.size) % 2)
                        ? 'bottomsIn'
                        : 'standard'
                const weights = brandWeights[sizeType][sizeSubType]
                return {
                    name: `${brand}: ${sizeType} - ${sizeSubType}`,
                    weights,
                }
            }
            return { name: 'no weights found', weights: [] }
        },
    },
    methods: {
        ...mapMutations('products', ['SET_QUANTITY']),
        onEnter() {
            document.activeElement.blur()
        },
        async onSubmitQty() {
            const newQty = this.localQuantity
            // Find the weight split of the style and brand
            const sizes = this.variant.ean_sizes
            const weights = this.sizeWeights.weights
            const sizeSplit = await getWeightedSplit(newQty, sizes, weights)

            // Find a possible combination
            const precision = 5
            const attemptCount = 20
            const result = findBestAssortmentCombination(
                this.variant.assortments,
                sizeSplit,
                newQty,
                precision,
                attemptCount
            )

            if (!result.combination) console.log('result', result, 'desired sizesplit', sizeSplit)

            // Loop through the assortments in the generated combination and set their quantities
            Object.keys(result.combination).map(assortmentName => {
                // Find the assortment
                const assortment = this.variant.assortments.find(assortment => assortment.name == assortmentName)
                if (!assortment) {
                    console.log('something has gone wrong')
                    return
                }
                const pcs = result.combination[assortmentName]
                const newQty = parseInt(assortment.box_size) * pcs
                this.SET_QUANTITY({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    assortment: assortment.name,
                    deliveryDate: this.variant.delivery_dates[0],
                    quantity: newQty,
                })
            })

            // // Generate assortments combinations
            // const precision = 5
            // console.log('size split', sizeSplit)
            // const combinations = generateAssortmentCombinations(this.variant.assortments, newQty, precision)
            // console.log('combinations', combinations)

            // // Find the best combination
            // const result = combinations.reduce(
            //     (best, current) => {
            //         const currentSizeSplit = {}
            //         let boxCount = 0
            //         // Calculate the sizesplit of the combination
            //         Object.keys(current).map(assortmentName => {
            //             // Find the assortment
            //             const assortment = this.variant.assortments.find(
            //                 assortment => assortment.name == assortmentName
            //             )
            //             if (!assortment) {
            //                 console.log('something has gone wrong')
            //                 return
            //             }
            //             const pcs = current[assortmentName]
            //             // Count how many assortments are in the combination
            //             boxCount += pcs

            //             // Add the size split contribution from this assortment
            //             assortment.sizeQuantities.map(sizeQuantity => {
            //                 // check if we have already added this size to our current size split
            //                 const alreadyAdded = currentSizeSplit[sizeQuantity.size] != null
            //                 if (alreadyAdded) {
            //                     currentSizeSplit[sizeQuantity.size] += parseInt(sizeQuantity.quantity * pcs)
            //                 } else {
            //                     currentSizeSplit[sizeQuantity.size] = parseInt(sizeQuantity.quantity * pcs)
            //                 }
            //             })
            //         })

            //         // Calculate the total difference between the desired sizesplit and the actual
            //         let diff = 0
            //         for (const currentSizeName of Object.keys(currentSizeSplit)) {
            //             const matchingSize = sizeSplit.find(x => x.name == currentSizeName)
            //             const desiredQuantity = matchingSize ? matchingSize.qty : 0
            //             diff += Math.abs(currentSizeSplit[currentSizeName] - desiredQuantity)
            //         }

            //         // Test if the current combination is better than the current best
            //         if (diff < best.diff || (diff == best.diff && boxCount < best.boxCount)) {
            //             return { diff, boxCount, combination: current }
            //         } else {
            //             return best
            //         }
            //     },
            //     { diff: 999, boxCount: 999, combination: null }
            // )

            // console.log('result', result)

            // sizeSplit.map(sizeObj => {
            //     this.SET_QUANTITY({
            //         alignment: this.variant.selectionAlignment.productAlignment,
            //         variantId: this.variant.id,
            //         size: sizeObj.name,
            //         deliveryDate: this.varaint.delivery_dates[0],
            //         quantity: sizeObj.qty,
            //     })
            // })
        },
    },
    created() {
        this.localQuantity = this.variant.quantity
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.variant-list-item {
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    padding-bottom: 8px;
    .details-wrapper {
        overflow: hidden;
    }
    .name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .qty {
        min-width: 32px;
        height: 100%;
    }
    .variant-color {
        background-position: center;
        background-size: 400%;
        margin-top: 4px;
        height: 100%;
    }
    .size-list-item {
        opacity: 0.7;
        transition: width 0.1s ease-out, min-width 0.1s ease-out;
        flex-shrink: 0;
        &:focus-within {
            opacity: 1;
            min-width: 40px;
        }
        .size-label {
            width: 100%;
            text-align: center;
            pointer-events: none;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        ::v-deep {
            input {
                padding-top: 12px;
                font-weight: 700;
                text-align: center;
                margin: auto;
            }
        }
    }
    .qty-input {
        height: 100%;
        min-width: 42px;
        color: $fontSoft;
        background: rgba(white, 0.8);
        &:focus-within {
            background: white;
            color: $font;
        }
        ::v-deep {
            input {
                font-weight: 700;
                text-align: center;
                font-size: 12px;
            }
        }
        &:not(.active) {
            cursor: pointer;
        }
    }
}
</style>
