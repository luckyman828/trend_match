<template>
    <BaseInputShape
        class="size-list-item ui-square white sm"
        placeholder="0"
        :disabled="!actionWriteAccess"
        v-model.number="quantity"
        :selectOnFocus="true"
        type="number"
        :pattern="/^[0-9]*$/"
        @blur="$emit('submit')"
        @keydown.enter="$emit('submit')"
        @focus="$emit('focus')"
    >
        <div class="size-label ft-10">{{ sizeObj.size }}</div>
    </BaseInputShape>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'deliveryListItemSizeInput',
    props: ['variant', 'deliveryDate', 'sizeObj'],
    computed: {
        ...mapGetters('selections', {
            writeAccess: 'getCurrentSelectionWriteAccess',
        }),
        actionWriteAccess() {
            return this.writeAccess && this.writeAccess.actions
        },
        quantity: {
            get() {
                const qtyDetail = this.variant.getQtyDetail({
                    size: this.sizeObj.size,
                    deliveryDate: this.deliveryDate,
                })
                return qtyDetail ? qtyDetail.quantity : 0
            },
            set(quantity) {
                this.SET_QUANTITY({
                    alignment: this.variant.selectionAlignment.productAlignment,
                    variantId: this.variant.id,
                    size: this.sizeObj.size,
                    deliveryDate: this.deliveryDate,
                    quantity,
                })
            },
        },
    },
    methods: {
        ...mapMutations('products', ['SET_QUANTITY']),
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.size-list-item {
    opacity: 0.7;
    transition: width 0.1s ease-out, min-width 0.1s ease-out;
    flex-shrink: 0;
    padding: 4px 1px;
    &:focus-within {
        opacity: 1;
        min-width: 40px;
    }
    .size-label {
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;
        text-align: center;
        pointer-events: none;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    ::v-deep {
        input {
            padding-top: 16px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
            margin: auto;
        }
    }
}
</style>
