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
                        v-tooltip="{
                            content:
                                sizeWeights &&
                                `${sizeWeights.name}<br>Weight: ${
                                    sizeWeights.weights.find(x => x.name == sizeObj.size)
                                        ? sizeWeights.weights.find(x => x.name == sizeObj.size).weight
                                        : 'not found'
                                }`,
                            delay: { show: 500 },
                        }"
                        v-for="sizeObj in currentVariantDeliverySizeQuantities"
                        :key="sizeObj.size"
                    >
                        <div class="size-label ft-10">{{ sizeObj.size }}</div>
                        <div class="size-label ft-12 ft-bd">
                            {{ sizeObj.quantity }}
                        </div>
                    </div>
                </div>
                <div class="qty-wrapper">
                    <div class="square white qty" v-if="!hasAssortments">
                        <span>{{
                            currentVariantDelivery && currentVariantDelivery.quantity
                                ? currentVariantDelivery.quantity
                                : 0
                        }}</span>
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
import findBestAssortmentCombination from '../../../../helpers/findBestAssortmentCombinationDiffMinimize'
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
        currentVariantDelivery() {
            return this.variant.deliveries.find(
                delivery => delivery.delivery_date == this.variant.product.currentDeliveryDate
            )
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
        variantQuantity() {
            return this.currentVariantDelivery?.quantity || 0
        },
        currentVariantDeliverySizeQuantities() {
            return this.variant.sizes.map(size => {
                const sizeObj = {
                    size: size.size,
                }
                const currentDeliverySizeQuantity = this.currentVariantDelivery?.sizeQuantities.find(
                    sizeQty => sizeQty.size == sizeObj.size
                )
                sizeObj.quantity = currentDeliverySizeQuantity ? currentDeliverySizeQuantity.quantity : 0
                return sizeObj
            })
        },
    },
    watch: {
        variantQuantity(newVal) {
            this.localQuantity = newVal
        },
    },
    methods: {
        ...mapActions('buyProducts', ['updateQuantity']),
        ...mapActions('actions', ['updateAlignments']),
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

            if (!result.combination) return

            this.localQuantity = result.quantity

            // Loop through the assortments in the generated combination and set their quantities
            for (const assortmentName of Object.keys(result.combination)) {
                // Find the assortment
                const assortment = this.variant.assortments.find(assortment => assortment.name == assortmentName)
                if (!assortment) {
                    console.log('something has gone wrong')
                    return
                }
                const pcs = result.combination[assortmentName]
                const newQty = parseInt(assortment.box_size) * pcs
                await this.updateQuantity({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    assortment: assortment.name,
                    deliveryDate: this.variant.product.currentDeliveryDate,
                    quantity: newQty,
                })
            }
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.variant.selectionAlignment.feedback = 'In'
            this.updateAlignments([alignment])
        },
    },
    created() {
        this.localQuantity = this.variantQuantity
    },
}
</script>

<style scoped lang="scss">
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
