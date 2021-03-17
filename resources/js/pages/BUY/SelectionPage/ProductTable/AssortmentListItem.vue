<template>
    <v-popover
        trigger="manual"
        :open="editActive || showSizes"
        placement="top-end"
        popoverClass="min invisible"
        :autoHide="false"
    >
        <div
            class="assortment-list-item ui-square"
            :class="[{ active: editActive }, { 'view-sizes': showSizes }]"
            tabindex="0"
        >
            <div class="inner flex-list flex-v lh-sm space-sm">
                <div class="ft-10 ft-md">Assortment: {{ assortment.displayName }}</div>

                <!-- Edit Active -->
                <div class="size-list flex-list" v-dragscroll v-horizontal-scroll>
                    <div
                        class="size-list-item ui-square white sm flex-list flex-v"
                        v-for="(sizeObj, index) in assortment.sizes"
                        :key="index"
                    >
                        <div class="size-label ft-10">{{ sizeObj.size }}</div>
                        <div class="size-label ft-12 ft-bd">{{ sizeObj.quantity }}</div>
                    </div>
                </div>

                <!-- End Edit Active -->
                <BaseInputShape
                    ref="input"
                    class="qty-input square lg white"
                    placeholder="0"
                    v-model="localQuantity"
                    :pattern="/^[0-9]*$/"
                    :isNumber="true"
                    @focus="editActive = true"
                    @keydown.enter="onSubmitQty"
                    @input="onQtyInput"
                    @blur="onBlurQty"
                    :selectOnFocus="true"
                />
            </div>
        </div>
        <div slot="popover" class="action-list flex-list sm">
            <button v-if="!showSizes" class="black sm" @click="showSizes = !showSizes">
                <span>View split</span>
                <i class="far fa-eye"></i>
            </button>
            <button v-else class="black sm" @click="onHideSizes">
                <span>Hide split</span>
                <i class="far fa-eye-slash"></i>
            </button>
            <button
                class="green sm"
                @click="
                    onSubmitQty()
                    showSizes = false
                "
            >
                <i class="fas fa-check"></i>
            </button>
            <button class="red sm" v-tooltip="'Clear input'" @click="onClearQty">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>
    </v-popover>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'AssortmentListItem',
    props: ['assortment', 'index', 'variant', 'deliveryDate'],
    data() {
        return {
            editActive: false,
            oldSizeQty: 0,
            showSizes: false,
            localQuantity: 0,
        }
    },
    computed: {},
    methods: {
        ...mapActions('actions', ['updateAlignments']),
        ...mapMutations('products', ['SET_QUANTITY']),
        onQtyInput(newQty) {
            if (!newQty || newQty < 0) newQty = 0
            this.SET_QUANTITY({
                alignment: this.variant.selectionAlignment.productAlignment,
                variantId: this.variant.id,
                assortment: this.assortment.name,
                deliveryDate: this.deliveryDate,
                quantity: parseInt(newQty),
            })
        },
        onSubmitQty() {
            this.editActive = false
            document.activeElement.blur()
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.variant.selectionAlignment.feedback = 'In'
            this.updateAlignments([alignment])
            this.localQuantity = this.assortment.quantity
        },
        onClearQty() {
            this.onQtyInput(0)
            this.editActive = false
        },
        onHideSizes() {
            this.showSizes = false
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
    },
    created() {
        this.localQuantity = this.assortment.quantity
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.assortment-list-item {
    width: 164px;
    // overflow: hidden;
    position: relative;
    min-height: 52px;
    flex-shrink: 0;
    border: solid 1px $light;
    &:focus-within,
    &.active {
        border-color: $primary300;
    }
    &.view-sizes {
        .qty-input {
            display: none;
        }
        .size-list {
            opacity: 1;
        }
    }
    .inner {
        width: 100%;
    }
    .size-list {
        max-width: 100%;
        overflow-x: auto;
        opacity: 0.5;
        display: flex;
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
    .size-list-item {
        opacity: 0.7;
        transition: width 0.1s ease-out, min-width 0.1s ease-out;
        flex-shrink: 0;
        &:focus-within {
            opacity: 1;
            min-width: 40px;
        }
        .size-label {
            // position: absolute;
            // top: 4px;
            // left: 0;
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
}
</style>
