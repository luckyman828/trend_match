<template>
    <v-popover
        trigger="manual"
        :open="editActive || showSizes"
        placement="top-end"
        popoverClass="min invisible"
        :autoHide="false"
    >
        <div
            class="assortment-list-item ui-square flex-list space-md"
            :class="[{ active: editActive }, { 'view-sizes': showSizes }]"
            tabindex="0"
            v-click-outside="onClickOutside"
            @focus.self="onFocus"
            @focus.capture="editActive = true"
        >
            <div class="inner flex-list flex-v lh-sm space-sm center-v detail-col">
                <div
                    class="name-wrapper flex-list space-xs center-v"
                    v-tooltip="
                        `Ass.: ${assortment.displayName} (box size: ${assortment.box_size}) (${assortment.pcs} pcs.)`
                    "
                >
                    <div class="box-size">
                        <i class="far fa-box"></i>
                        <span>{{ assortment.box_size }}</span>
                    </div>
                    <span class="ft-12 ft-bd name"> Ass.: {{ assortment.displayName }} </span>
                </div>

                <!-- Edit Active -->
                <div class="size-list flex-list" v-dragscroll v-horizontal-scroll>
                    <div
                        class="size-list-item ui-square white sm flex-list flex-v"
                        v-for="(sizeObj, index) in currentAssortment.sizeQuantities"
                        :key="index"
                    >
                        <div class="size-label ft-10">{{ sizeObj.size }}</div>
                        <div class="size-label ft-12 ft-bd">{{ sizeObj.quantity }}</div>
                    </div>
                </div>

                <!-- End Edit Active -->
            </div>
            <div class="qty-wrapper">
                <BaseInputShape
                    ref="input"
                    class="qty-input square lg white"
                    placeholder="0"
                    :disabled="!actionWriteAccess"
                    v-model="localQuantity"
                    :pattern="/^[0-9]*$/"
                    :isNumber="true"
                    @focus="editActive = true"
                    @keydown.enter="onSubmitQty"
                    @keydown.tab.native="$emit('tab', $event)"
                    @blur="onBlurQty"
                    :selectOnFocus="true"
                />
                <div class="pieces-wrapper" v-if="deliveryAssortment.pcs > 0 || editActive">
                    <div class="pill xs box-pieces" :class="editActive ? 'primary' : 'invisible'">
                        <span>{{ deliveryAssortment.pcs }}</span>
                        <i class="far fa-box"></i>
                    </div>
                </div>
            </div>
        </div>
        <div slot="popover" class="action-list flex-list sm" ref="actionPopover">
            <button v-if="!showSizes" class="black sm" @click="showSizes = !showSizes">
                <span>View split</span>
                <i class="far fa-eye"></i>
            </button>
            <button v-else class="black sm" @click="onHideSizes">
                <span>Hide split</span>
                <i class="far fa-eye-slash"></i>
            </button>
            <template v-if="actionWriteAccess">
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
            </template>
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
    computed: {
        ...mapGetters('selections', {
            writeAccess: 'getCurrentSelectionWriteAccess',
        }),
        actionWriteAccess() {
            return this.writeAccess && this.writeAccess.actions
        },
        currentAssortment() {
            return !this.deliveryAssortment.quantity || this.showSizes ? this.assortment : this.deliveryAssortment
        },
        deliveryAssortment() {
            return this.assortment.deliveries.find(delivery => delivery.delivery_date == this.deliveryDate)
        },
        assortmentQuantity() {
            return this.deliveryAssortment.quantity
        },
    },
    watch: {
        deliveryDate() {
            this.localQuantity = this.deliveryAssortment.quantity
        },
        assortmentQuantity(newVal) {
            this.localQuantity = newVal
        },
    },
    methods: {
        ...mapActions('actions', ['updateAlignments']),
        ...mapActions('buyProducts', ['updateQuantity']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onQtyInput(newQty) {
            if (!newQty || newQty < 0) newQty = 0
            this.updateQuantity({
                alignment: this.variant.selectionAlignment.productAlignment,
                variantId: this.variant.id,
                assortment: this.assortment.name,
                deliveryDate: this.deliveryDate,
                quantity: parseInt(newQty),
            })
        },
        onSubmitQty() {
            this.onQtyInput(this.localQuantity)
            // Make sure the new QTY is divisible by the size of it
            if (this.assortment.box_size) {
                const newQty =
                    Math.round(this.deliveryAssortment.quantity / this.assortment.box_size) * this.assortment.box_size
                if (newQty != this.deliveryAssortment.quantity) {
                    this.SHOW_SNACKBAR({
                        type: 'info',
                        iconClass: 'far fa-info-circle',
                        msg: 'Rounded to nearest whole assortment',
                    })
                }
                this.onQtyInput(newQty)
            }
            this.editActive = false
            if (
                document.activeElement == this.$refs.input.$el ||
                this.$refs.input.$el.contains(document.activeElement)
            ) {
                document.activeElement.blur()
            }
            if (!this.variant.selectionAlignment) return
            const alignment = this.variant.selectionAlignment.productAlignment
            alignment.action = 'In'
            this.variant.selectionAlignment.feedback = 'In'
            this.updateAlignments([alignment])
            this.localQuantity = this.deliveryAssortment.quantity
        },
        onClearQty() {
            this.localQuantity = 0
            this.onQtyInput(0)
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
        onClickOutside(e) {
            if (e.target == this.$refs.actionPopover || this.$refs.actionPopover.contains(e.target)) return
            this.editActive = false
            this.showSizes = false
        },
        onFocus() {
            this.$refs.input.setFocus()
        },
    },
    created() {
        this.localQuantity = this.deliveryAssortment.quantity
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.assortment-list-item {
    position: relative;
    min-height: 52px;
    flex-shrink: 0;
    border: solid 1px $light;
    align-items: stretch;
    padding-right: 4px;
    &:focus-within,
    &.active {
        border-color: $primary300;
        .size-list {
            opacity: 1;
        }
    }
    &.view-sizes {
        .qty-input {
            // display: none;
        }
        .size-list {
            opacity: 1;
        }
    }
    .detail-col {
        position: relative;
        padding-top: 24px;
        .name-wrapper {
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            position: absolute;
            top: 2px;
            .box-size {
                font-size: 12px;
                margin-right: 8px;
                color: $font;
                i {
                    font-size: 14px;
                }
            }
        }
    }
    .inner {
        width: 100%;
    }
    .qty-wrapper {
        position: relative;
        .pieces-wrapper {
            position: absolute;
            bottom: 0;
            right: 0;
            .box-pieces {
            }
        }
    }
    .size-list {
        max-width: 100%;
        overflow-x: auto;
        opacity: 0.5;
        display: flex;
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
