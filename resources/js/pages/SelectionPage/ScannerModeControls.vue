<template>
    <div class="scanner-mode-controls">
        <div class="header">
            <p><strong>Scanner:</strong> Choose what happens to scanned products</p>
            <BaseToggle
                label="Variant mode"
                sizeClass="xs" 
                :isActive="variantModeActive"
                v-model="variantModeActive"
            />
        </div>
        <div class="action-list">
            <button
            :class="{ghost: scannerMode != 'product'}"
            @click="SET_SCANNER_MODE('product')">
                <i class="far fa-search"></i>
                <span>Show product</span>
            </button>

            <button class="primary" 
            :class="{ghost: scannerMode != 'Focus'}"
            @click="SET_SCANNER_MODE('Focus')">
                <i class="far fa-star"></i>
                <span>Set FOCUS</span>
            </button>

            <button class="green"
            :class="{ghost: scannerMode != 'In'}"
            @click="SET_SCANNER_MODE('In')">
                <i class="far fa-heart"></i>
                <span>Set IN</span>
            </button>

            <button class="red"
            :class="{ghost: scannerMode != 'Out'}"
            @click="SET_SCANNER_MODE('Out')">
                <i class="far fa-times"></i>
                <span>Set OUT</span>
            </button>

            <button
            :class="{ghost: scannerMode != 'None'}"
            @click="SET_SCANNER_MODE('None')">
                <span>Set Undecided</span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'scannerModeControls',
    data: function() { return {
        scanStarted: false,
        scanStr: ''
    }},
    computed: {
        ...mapGetters('scanner', {
            scannerMode: 'getScannerMode',
        }),
        ...mapGetters('products', ['products', 'getActiveSelectionInput']),
        ...mapGetters('selections', ['getCurrentSelection']),
        ...mapGetters('selections', {
            currentAction: 'currentSelectionModeAction',
            currentQty: 'getCurrentSelectionModeQty',
            selectionMode: 'currentSelectionMode',
        }),
        variantModeActive: {
            get() {
                return this.$store.getters['scanner/getScannerVariantMode']
            },
            set(value) {
                this.SET_SCANNER_VARIANT_MODE(value)
            }
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE', 'SET_SCANNER_VARIANT_MODE']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        scanHandler(e) {
            // Check if we get at least 12 concecutive inputs with very small interval
            // If that is the case, we have a scan
            this.scanStr += e.key
            if (!this.scanStarted) {
                this.scanStarted = true
                setTimeout(() => {
                    if (this.scanStr.length >= 12) {
                        this.onScan(this.scanStr)
                        this.scanStr = ''
                        this.scanStarted = false
                    }
                }, 50)
            }
        },
        onScan(scanCode) {
            // Find the matched product / variant
            const product = this.products.find(product => product.eans.includes(scanCode))
            if (!product) {
                this.SHOW_SNACKBAR({ 
                    msg: `Scan didn't match any products`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle',
                })
                return
            }


            if (this.scannerMode == 'product') {
                this.showSelectionProductPDP({product, selection: this.getCurrentSelection})
            }

            else {
                const selectionInput = this.getActiveSelectionInput(product)

                let variant
                if (this.variantModeActive) {
                    variant = selectionInput.variants.find(variant => variant.ean == scanCode || variant.ean_sizes.find(size => size.ean == scanCode))
                    if (!variant) {
                        this.SHOW_SNACKBAR({ 
                            msg: `Scan didn't match any variant`,
                            type: 'info', 
                            iconClass: 'fa-exclamation-circle',
                        })
                        return
                    }
                }

                if (this.variantModeActive) {
                    this.updateVariantAction(this.scannerMode, product, selectionInput, variant)
                }

                else {
                    if (this.selectionMode == 'Feedback') {
                        const selectionFeedback = selectionInput.yourSelectionFeedback
                        this.updateFeedbacks({actions: [selectionFeedback], newAction: this.scannerMode})
                    }
                    if (this.selectionMode == 'Alignment') {
                        const selectionAction = selectionInput.selectionAction
                        this.updateActions({actions: [selectionAction], newAction: this.scannerMode})
                    }
                }
            }
        },
        updateVariantAction(newAction, product, selectionInput, variant) {
            console.log('updatevariant action', newAction, product, selectionInput, variant)
            // If the new action to set is the same as the one already set, return
            // if (this.variant[this.currentAction] == newAction) return

            // Loop through all the variants. If their action is None, then give them a default action
            product.variants.forEach(productVariant => {
                if (productVariant.id != variant.id && productVariant[this.currentAction] == 'None') {
                    if (newAction == 'Out') productVariant[this.currentAction] = 'Out'
                    else productVariant[this.currentAction] = 'In'
                }
            })

            // Set the variant feedback
            variant[this.currentAction] = newAction
            if (newAction == 'Out') {
                variant[this.currentQty] = 0
            }
            let currentAction
            let newProductAction
            
            if (this.selectionMode == 'Feedback') {
                // Find the users feedback action for the product and make sure it is not None
                currentAction = selectionInput.yourSelectionFeedback
            }
            if (this.selectionMode == 'Alignment') {
                // Find the users feedback action for the product and make sure it is not None
                currentAction = selectionInput.selectionAction
            }

            // If the product has no action, set it's action to the variants new action
            if (currentAction.action == 'None') {
                newProductAction = newAction
            }
            // If all variants are marked OUT, mark the product OUT
            else if (!selectionInput.variants.find(selectionVariant => ['Focus', 'In', 'None'].includes(selectionVariant[this.currentAction]))) {
                newProductAction = 'Out'
            }
            // If at least ONE varaint in IN or FOCUS mark the product as IN
            else if (selectionInput.variants.find(selectionVariant => ['Focus', 'In'].includes(selectionVariant[this.currentAction]))) {
                if (selectionInput[this.currentAction] != 'Focus') {
                    newProductAction = 'In'
                }
            }

            if (this.selectionMode == 'Feedback') {
                this.updateFeedbacks({actions: [currentAction], newAction: newProductAction})
            }
            if (this.selectionMode == 'Alignment') {
                this.updateActions({actions: [currentAction], newAction: newProductAction})
            }

        },

    },
    created() {
        // Hook up event listeners for scans
        document.addEventListener('keyup', this.scanHandler)
    },
    destroyed() {
        // Clean up event listeners
        document.removeEventListener('keyup', this.scanHandler)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.scanner-mode-controls {
    background: $bgModule;
    box-shadow: $shadowModule;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    position: fixed;
    left: calc(50% - 200px);
    margin: auto;
    bottom: 20px;
    padding: 16px;
    z-index: 11;
    animation-name: flyin;
    animation-timing-function: ease-out;
    animation-duration: .1s;
    animation-iteration-count: 1;
    .header {
        display: flex;
        justify-content: space-between;
    }
    .action-list {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        >:not(:first-child) {
            margin-left: 8px;
        }
    }
}


@keyframes flyin {
  from {transform: translateY(calc(100% + 20px));}
  to {transform: none;}
}

</style>