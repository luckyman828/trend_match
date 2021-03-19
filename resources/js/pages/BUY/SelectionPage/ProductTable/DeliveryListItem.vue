<template>
    <v-popover
        trigger="manual"
        :open="editActive || editSplit"
        placement="top-end"
        popoverClass="min invisible"
        :autoHide="false"
    >
        <div
            class="delivery-list-item ui-square flex-list space-md"
            :class="[{ active: editActive }, { 'edit-split': editSplit }]"
            tabindex="0"
            v-click-outside="onClickOutside"
            @focus.capture="editActive = true"
        >
            <div class="inner flex-list flex-v lh-sm space-sm center-v">
                <div class="ft-10 ft-md">Delivery {{ index + 1 }}</div>
                <div class="ft-12 ft-bd">{{ getPrettyDate(delivery.delivery_date, 'medium') }}</div>

                <!-- Edit Active -->
                <div class="size-list flex-list" v-dragscroll v-horizontal-scroll>
                    <DeliveryListItemSizeInput
                        class="size-list-item ui-square white sm"
                        v-for="(size, index) in variant.ean_sizes"
                        :key="index"
                        :sizeObj="size"
                        :deliveryDate="delivery.delivery_date"
                        :variant="variant"
                        @submit="onSubmitQty"
                        @focus="editSplit = true"
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
                    @input="onQtyInput"
                    :selectOnFocus="true"
                    :isNumber="true"
                />
            </div>
        </div>
        <div slot="popover" class="action-list flex-list sm">
            <button class="black sm" v-if="!editSplit" @click="editSplit = !editSplit">
                <span v-if="actionWriteAccess">Edit split</span>
                <span v-else>View split</span>
                <i class="far fa-pen"></i>
            </button>
            <button class="black sm" v-else @click="onHideSizes">
                <span>Done</span>
                <i class="far fa-check"></i>
            </button>
            <template v-if="actionWriteAccess">
                <button
                    class="green sm"
                    @click="
                        onSubmitQty()
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
        ...mapGetters('selections', {
            writeAccess: 'getCurrentSelectionWriteAccess',
        }),
        actionWriteAccess() {
            return this.writeAccess && this.writeAccess.actions
        },
    },
    methods: {
        ...mapActions('actions', ['updateAlignments']),
        ...mapMutations('products', ['SET_QUANTITY']),
        async onQtyInput(newQty) {
            if (!newQty || newQty < 0) newQty = 0
            const sizes = this.variant.ean_sizes
            const brandWeights = dkcSizeSplit[this.variant.product.brand]
            const sizeType = isFinite(this.variant.sizes[0].size) ? 'numeric' : 'alphanumeric'
            const sizeSubType =
                sizeType == 'alphanumeric'
                    ? 'standard'
                    : this.variant.product.extra_data.topBottom == 'Bottom' && brandWeights[sizeType].bottomsIn
                    ? 'bottomsIn'
                    : 'standard'
            const weights = brandWeights[sizeType][sizeSubType]
            const sizeSplit = await getWeightedSplit(newQty, sizes, weights)
            sizeSplit.map(sizeObj => {
                this.SET_QUANTITY({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    size: sizeObj.name,
                    deliveryDate: this.delivery.delivery_date,
                    quantity: sizeObj.qty,
                })
            })
        },
        onClickOutside() {
            this.editActive = false
        },
        onSubmitQty() {
            this.editActive = false
            document.activeElement.blur()
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.variant.selectionAlignment.feedback = 'In'
            this.updateAlignments([alignment])
            this.localQuantity = this.delivery.quantity
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
                this.onSubmitQty()
            }, delay)
        },
        onClearQty() {
            this.onQtyInput(0)
        },
    },
    created() {
        this.localQuantity = this.delivery.quantity
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
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
    &.edit-split {
        .size-list {
            display: flex;
        }
    }
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
        display: none;
        max-width: 100%;
        overflow-x: auto;
        opacity: 0.5;
    }
    .qty-input {
        height: 100%;
        min-width: 42px;
        background: $grey200;
        color: $fontSoft;
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
