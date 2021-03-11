<template>
    <div class="delivery-list-item ui-square" :class="{ active: editActive }" tabindex="0">
        <div class="inner flex-list flex-v lh-sm space-sm">
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
                />
            </div>
            <!-- End Edit Active -->

            <BaseInputShape
                class="qty-input square lg white"
                placeholder="0"
                :value="delivery.quantity"
                :pattern="/^[0-9]*$/"
                @focus="editActive = true"
                @blur="onSubmitQty"
                @keydown.enter="onSubmitQty"
                @input="onQtyInput"
                :selectOnFocus="true"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DeliveryListItemSizeInput from './DeliveryListItemSizeInput'

export default {
    name: 'DeliveryListItem',
    components: { DeliveryListItemSizeInput },
    props: ['delivery', 'index', 'variant'],
    data() {
        return {
            editActive: false,
            oldSizeQty: 0,
        }
    },
    computed: {},
    methods: {
        ...mapActions('actions', ['updateAlignments']),
        ...mapMutations('products', ['SET_QUANTITY']),
        onQtyInput(newQty) {
            const sizes = this.variant.ean_sizes
            sizes.map((size, index) => {
                const indexFromCenter = Math.abs(sizes.length / 2 - index)
                const total = sizes.length - 0.5
                this.SET_QUANTITY({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    size: size.size,
                    deliveryDate: this.delivery.delivery_date,
                    quantity: Math.round(newQty * (indexFromCenter / total)),
                })
            })
        },
        onSubmitQty() {
            this.editActive = false
            document.activeElement.blur()
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.updateAlignments([alignment])
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.delivery-list-item {
    width: 164px;
    overflow: hidden;
    position: relative;
    min-height: 52px;
    border: solid 1px $light;
    &:focus-within,
    &.active {
        border-color: $primary300;
        .size-list {
            display: flex;
        }
    }
    .inner {
        width: 100%;
    }
    .size-list {
        display: none;
        max-width: 100%;
        overflow-x: auto;
        &:focus-within {
            + .qty-input {
                display: none;
            }
        }
    }
    .qty-input {
        height: calc(100% - 8px);
        position: absolute;
        top: 0;
        right: 6px;
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
