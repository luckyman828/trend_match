<template>
    <div class="scanner-mode-controls" :class="{ hide: !scannerMode }">
        <div class="header">
            <p><strong>Scan action:</strong></p>
            <BaseSegmentedControl
                class="segmented-controls"
                :options="['Product', 'Variant']"
                sizeClass="xs"
                :currentOptionIndex="variantModeActive ? 1 : 0"
                v-slot="segmentProps"
                @change="newIndex => (variantModeActive = newIndex == 1)"
            >
                <span>{{ segmentProps.option }}</span>
            </BaseSegmentedControl>
            <button class="circle white" @click="SET_SCANNER_MODE(null)">
                <i class="far fa-times"></i>
            </button>
        </div>
        <div class="action-list">
            <div class="action-list-item" :class="{ active: scannerMode == 'product' }">
                <button class="white circle" @click="SET_SCANNER_MODE('product')">
                    <i class="far fa-eye dark"></i>
                </button>
                <span>View</span>
            </div>

            <div class="action-list-item" :class="{ active: scannerMode == 'Focus' }">
                <button class="white circle" @click="SET_SCANNER_MODE('Focus')">
                    <i class="far fa-star primary"></i>
                </button>
                <span>Focus</span>
            </div>

            <div class="action-list-item" :class="{ active: scannerMode == 'In' }">
                <button class="white circle" @click="SET_SCANNER_MODE('In')">
                    <i class="far fa-heart green"></i>
                </button>
                <span>In</span>
            </div>

            <div class="action-list-item" :class="{ active: scannerMode == 'Out' }">
                <button class="white circle" @click="SET_SCANNER_MODE('Out')">
                    <i class="far fa-times red"></i>
                </button>
                <span>Out</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'scannerModeControls',
    data: function() {
        return {
            scanStarted: false,
            scanStr: '',
        }
    },
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
            },
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks', 'setActions', 'setFeedbacks']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE', 'SET_SCANNER_VARIANT_MODE']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('products', ['SET_CURRENT_PDP_VARIANT_INDEX']),
        scanHandler(e) {
            // Check if we get at least 12 concecutive inputs with very small interval
            // If that is the case, we have a scan
            const digit = e.code.substr(e.code.length - 1)
            // Check that the digit is actually a numberc
            const regex = /[0-9]/
            const isNumber = !!regex.exec(digit)
            console.log('scanhandler', e.code, digit, isNumber)
            if (isNumber) this.scanStr += digit
            if (!this.scanStarted) {
                this.scanStarted = true
                setTimeout(() => {
                    if (this.scanStr.length >= 10) {
                        this.onScan(this.scanStr)
                    }
                    this.scanStr = ''
                    this.scanStarted = false
                }, 50)
            }
        },
        onScan(scanCode) {
            console.log('scanCode', scanCode)
            const succesAudio = new Audio('/assets/SFX/pling.mp3')
            const failAudio = new Audio('/assets/SFX/error.mp3')
            if (!this.scannerMode) {
                this.SET_SCANNER_MODE('product')
            }

            // Find the matched product / variant
            const product = this.products.find(product => product.eans.includes(scanCode))
            if (!product) {
                failAudio.play()
                this.SHOW_SNACKBAR({
                    msg: `Scan didn't match any products`,
                    type: 'info',
                    iconClass: 'fa-exclamation-circle',
                })
                return
            }

            const selectionInput = this.getActiveSelectionInput(product)
            const variantIndex = selectionInput.variants.findIndex(
                variant => variant.ean == scanCode || variant.ean_sizes.find(size => size.ean == scanCode)
            )
            const variant = selectionInput.variants[variantIndex]

            if (this.scannerMode == 'product') {
                succesAudio.play()
                this.showSelectionProductPDP({ product, selection: this.getCurrentSelection })
                if (this.variantModeActive && variant) {
                    // Show the scanned variant
                    this.SET_CURRENT_PDP_VARIANT_INDEX(variantIndex)
                }
            } else {
                if (product.is_completed) {
                    failAudio.play()
                    this.SHOW_SNACKBAR({
                        msg: `Scan ignored. Product is marked as completed`,
                        type: 'info',
                        iconClass: 'fa-exclamation-circle',
                    })
                    return
                }
                if (this.variantModeActive) {
                    if (!variant) {
                        failAudio.play()
                        this.SHOW_SNACKBAR({
                            msg: `Scan didn't match any variant`,
                            type: 'info',
                            iconClass: 'fa-exclamation-circle',
                        })
                        return
                    }
                    this.updateVariantAction(this.scannerMode, product, selectionInput, variant)
                } else {
                    succesAudio.play()
                    if (this.selectionMode == 'Feedback') {
                        const selectionFeedback = selectionInput.yourSelectionFeedback
                        this.updateFeedbacks({ actions: [selectionFeedback], newAction: this.scannerMode })
                    }
                    if (this.selectionMode == 'Alignment') {
                        const selectionAction = selectionInput.selectionAction
                        this.updateActions({ actions: [selectionAction], newAction: this.scannerMode })
                    }
                }
            }
        },
        updateVariantAction(newAction, product, selectionInput, variant) {
            // If the new action to set is the same as the one already set, return
            // if (this.variant[this.currentAction] == newAction) return

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

            // Loop through all the variants. If their action is None, then give them a default action
            selectionInput.variants.map(productVariant => {
                if (productVariant.id != variant.id && productVariant[this.currentAction] == 'None') {
                    productVariant[this.currentAction] = 'Out'
                }
            })

            // If the product has no action, set it's action to the variants new action
            if (currentAction.action == 'None') {
                currentAction.action = newAction
            }
            // If all variants are marked OUT, mark the product OUT
            else if (
                !selectionInput.variants.find(selectionVariant =>
                    ['Focus', 'In', 'None'].includes(selectionVariant[this.currentAction])
                )
            ) {
                currentAction.action = 'Out'
            }
            // If at least ONE varaint in IN or FOCUS mark the product as IN
            else if (
                selectionInput.variants.find(selectionVariant =>
                    ['Focus', 'In'].includes(selectionVariant[this.currentAction])
                )
            ) {
                if (selectionInput[this.currentAction] != 'Focus') {
                    currentAction.action = 'In'
                }
            }

            if (this.selectionMode == 'Feedback') {
                this.setFeedbacks([currentAction])
                // this.updateFeedbacks({ actions: [currentAction], newAction: newProductAction })
            }
            if (this.selectionMode == 'Alignment') {
                this.setActions([currentAction])
                // this.updateActions({ actions: [currentAction], newAction: newProductAction })
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
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.scanner-mode-controls {
    background: $dark;
    color: white;
    strong {
        color: white;
    }
    box-shadow: $shadowModule;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    position: fixed;
    left: calc(50% - 200px);
    margin: auto;
    bottom: 20px;
    padding: 8px 16px 12px;
    z-index: 11;
    transition: transform 0.1s ease-out;
    width: 400px;
    &.hide {
        transform: translateY(calc(100% + 20px));
    }
    .close {
        position: absolute;
        right: -12px;
        top: -12px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        position: relative;
        align-items: center;
        padding-bottom: 12px;
        .segmented-controls {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .action-list {
        margin-top: 8px;
        display: flex;
        justify-content: space-around;
        .action-list-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0.5;
            &:hover {
                opacity: 1;
            }
            &.active {
                opacity: 1;
            }
            span {
                font-size: 12px;
                margin-top: 4px;
            }
        }
    }
}
</style>
