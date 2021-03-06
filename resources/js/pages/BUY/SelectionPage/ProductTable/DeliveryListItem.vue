<template>
    <v-popover
        trigger="manual"
        :open="editActive || editSplit"
        placement="top-end"
        popoverClass="min no-bg"
        :autoHide="false"
    >
        <div
            class="delivery-list-item ui-square flex-list space-md"
            :class="[{ active: editActive }, { 'edit-split': editSplit }]"
            tabindex="0"
            @focus.self="onFocus"
            v-click-outside="onClickOutside"
            @focus.capture="editActive = true"
        >
            <div class="inner flex-list flex-v lh-sm center-v">
                <div class="flex-list flex v space-xs">
                    <div class="ft-10 ft-md">Delivery {{ index + 1 }}</div>
                    <div class="ft-12 ft-bd lh-min">{{ getPrettyDate(delivery.delivery_date, 'medium') }}</div>
                </div>

                <!-- Edit Active -->
                <div class="size-list flex-list" v-dragscroll v-horizontal-scroll>
                    <DeliveryListItemSizeInput
                        class="size-list-item ui-square white sm"
                        v-for="(size, index) in variant.ean_sizes"
                        :sizeWeights="sizeWeights"
                        :key="index"
                        :sizeObj="size"
                        :deliveryDate="delivery.delivery_date"
                        :variant="variant"
                        @submit="onSubmitSize"
                        @focus="editSplit = true"
                        @input="onSizeInput"
                    />
                </div>
                <!-- End Edit Active -->
            </div>
            <div class="qty-wrapper">
                <BaseInputShape
                    class="qty-input square lg white"
                    ref="input"
                    v-model="localQuantity"
                    :disabled="!actionWriteAccess"
                    :pattern="/^[0-9]*$/"
                    @focus="editActive = true"
                    @blur="onBlurQty"
                    @keydown.enter="onSubmitQty"
                    @keydown.tab.native="$emit('tab', $event)"
                    :selectOnFocus="true"
                    :isNumber="true"
                />
            </div>
        </div>
        <div slot="popover" class="action-list flex-list sm">
            <!-- <button class="black sm" v-if="!editSplit" @click="editSplit = !editSplit">
                <span v-if="actionWriteAccess">Edit split</span>
                <span v-else>View split</span>
                <i class="far fa-pen"></i>
            </button> -->
            <!-- <button class="black sm" v-else @click="onHideSizes">
                <span>Done</span>
                <i class="far fa-check"></i>
            </button> -->
            <template v-if="actionWriteAccess">
                <button
                    class="green sm"
                    @click="
                        onUpdateQuantity()
                        editActive = false
                        editSplit = false
                    "
                >
                    <i class="fas fa-check"></i>
                </button>
                <button class="red sm" v-tooltip="'Clear input'" @click="onClearQty">
                    <i class="far fa-trash-alt"></i>
                </button>
            </template>
        </div>
    </v-popover>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DeliveryListItemSizeInput from './DeliveryListItemSizeInput'
import { getWeightedSplit } from '../../../../helpers/sizeSplit'
import dkcSizeSplit from '../../../../assets/dkc/sizeSplit.json'

export default {
    name: 'DeliveryListItem',
    components: { DeliveryListItemSizeInput },
    props: ['delivery', 'index', 'variant'],
    data() {
        return {
            editActive: false,
            oldSizeQty: 0,
            editSplit: false,
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
                        : this.variant.product.category == 'Footwear' && brandWeights[sizeType].footwear
                        ? 'footwear'
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
        ...mapActions('actions', ['updateAlignments']),
        ...mapActions('buyProducts', ['updateQuantity']),
        async onQtyInput(newQty) {
            if (!newQty || newQty < 0) newQty = 0
            const sizes = this.variant.ean_sizes
            const weights = this.sizeWeights.weights
            const sizeSplit = await getWeightedSplit(newQty, sizes, weights)
            sizeSplit.map(sizeObj => {
                this.updateQuantity({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    size: sizeObj.name,
                    deliveryDate: this.delivery.delivery_date,
                    quantity: sizeObj.qty,
                })
            })
        },
        async onUpdateQuantity() {
            if (this.localQuantity != this.delivery.quantity) {
                await this.onQtyInput(this.localQuantity)
            }
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.variant.selectionAlignment.feedback = 'In'
            this.updateAlignments([alignment])
            this.localQuantity = this.delivery.quantity
        },
        onClickOutside() {
            this.editActive = false
            this.editSplit = false
        },
        async onSubmitQty() {
            await this.onQtyInput(this.localQuantity)
            this.editActive = false
            if (
                document.activeElement == this.$refs.input.$el ||
                this.$refs.input.$el.contains(document.activeElement)
            ) {
                document.activeElement.blur()
            }
            await this.onUpdateQuantity()
        },
        onSizeInput() {
            this.localQuantity = this.delivery.quantity
        },
        onSubmitSize() {
            this.onUpdateQuantity()
            document.activeElement.blur()
            this.editSplit = false
            this.editActive = false
        },
        onHideSizes() {
            this.editSplit = false
            this.$nextTick(() => {
                this.$refs.input.setFocus()
            })
        },
        onBlurQty() {
            const delay = 300
            setTimeout(() => {
                this.onUpdateQuantity()
            }, delay)
        },
        onFocus() {
            this.$refs.input.setFocus()
        },
        onClearQty() {
            this.localQuantity = 0
            this.onQtyInput(0)
        },
        onTab(e) {
            console.log('on tab', e)
        },
    },
    created() {
        this.localQuantity = this.delivery.quantity
    },
}
</script>

<style scoped lang="scss">
.delivery-list-item {
    // width: 164px;
    // overflow: hidden;
    position: relative;
    min-height: 52px;
    border: solid 1px $light;
    align-items: stretch;
    padding-right: 4px;
    &:focus-within,
    &.active {
        border-color: $primary300;
    }
    &.active,
    // &.edit-split {
    //     .size-list {
    //         display: flex;
    //     }
    // }
    &.edit-split {
        // .qty-input {
        //     display: none;
        // }
        .size-list {
            opacity: 1;
        }
    }
    .inner {
        width: 100%;
    }
    .action-list {
        position: absolute;
        top: -28px;
        right: -28px;
    }
    .size-list {
        // display: none;
        max-width: 100%;
        overflow-x: auto;
        opacity: 0.5;
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
