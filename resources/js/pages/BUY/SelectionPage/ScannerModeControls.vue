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
        <div class="label-selector" v-if="scannerMode == 'labels'">
            <BaseDropdownInputField
                v-model="selectedLabels"
                :options="availableProductLabels"
                inputClass="sm"
                placeholder="Choose labels to add"
            />
        </div>
        <div class="action-list flex-list center-h space-lg">
            <div class="action-list-item" :class="{ active: scannerMode == 'product' }">
                <button class="white circle" @click="SET_SCANNER_MODE('product')">
                    <i class="far fa-eye dark"></i>
                </button>
                <span>View</span>
            </div>

            <div class="action-list-item" v-if="labelsEnabled" :class="{ active: scannerMode == 'labels' }">
                <button class="white circle" @click="SET_SCANNER_MODE('labels')">
                    <i class="far fa-tag dark"></i>
                </button>
                <span>Labels</span>
            </div>

            <div class="action-list-item" :class="{ active: scannerMode == 'purchase' }">
                <button class="white circle" @click="SET_SCANNER_MODE('purchase')">
                    <i class="far fa-heart primary"></i>
                </button>
                <span>Set TBD</span>
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
            selectedLabels: [],
        }
    },
    computed: {
        ...mapGetters('scanner', {
            scannerMode: 'getScannerMode',
        }),
        ...mapGetters('products', ['products']),
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', ['getCurrentSelection']),
        ...mapGetters('selections', {
            currentAction: 'currentSelectionModeAction',
            currentQty: 'getCurrentSelectionModeQty',
            selectionMode: 'currentSelectionMode',
        }),
        ...mapGetters('workspaces', {
            availableProductLabels: 'getAvailableProductLabels',
        }),
        variantModeActive: {
            get() {
                return this.$store.getters['scanner/getScannerVariantMode']
            },
            set(value) {
                this.SET_SCANNER_VARIANT_MODE(value)
            },
        },
        labelsEnabled() {
            return this.availableProductLabels.length > 0
        },
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP', 'updateProduct']),
        ...mapActions('actions', ['updateAlignments']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE', 'SET_SCANNER_VARIANT_MODE']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('products', ['SET_CURRENT_PDP_VARIANT_INDEX']),
        scanHandler(e) {
            // Prevent default to avoid quirky behaviour from carriage or similar
            if (e.code == 'Enter') {
                e.preventDefault()
            }
            // Check if we get at least 12 concecutive inputs with very small interval
            // If that is the case, we have a scan
            const digit = e.code.substr(e.code.length - 1)
            // Check that the digit is actually a numberc
            const regex = /[0-9]/
            const isNumber = !!regex.exec(digit)
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

            const variantIndex = product.variants.findIndex(
                variant => variant.ean == scanCode || variant.ean_sizes.find(size => size.ean == scanCode)
            )
            const variant = product.variants[variantIndex]

            if (this.scannerMode == 'product') {
                succesAudio.play()
                this.showSelectionProductPDP({ product, selection: this.getCurrentSelection })
                if (this.variantModeActive && variant) {
                    // Show the scanned variant
                    this.SET_CURRENT_PDP_VARIANT_INDEX(variantIndex)
                }
                return
            }

            if (this.variantModeActive) {
                // VARIANT MODE
                if (!variant) {
                    failAudio.play()
                    this.SHOW_SNACKBAR({
                        msg: `Scan didn't match any variant`,
                        type: 'info',
                        iconClass: 'fa-exclamation-circle',
                    })
                    return
                }
                succesAudio.play()
                if (this.scannerMode == 'labels') {
                    this.selectedLabels.map(label => {
                        if (variant.labels.includes(label)) return
                        variant.labels.push(label)
                    })
                    this.onUpdateProduct(product)
                    return
                }
                if (this.scannerMode == 'purchase') {
                    const alignment = variant.selectionAlignment.productAlignment
                    alignment.action = 'In'
                    variant.selectionAlignment.feedback = 'In'
                    this.updateAlignments([alignment])
                    return
                }
            } else {
                // PRODUCT MODE
                succesAudio.play()
                if (this.scannerMode == 'labels') {
                    this.selectedLabels.map(label => {
                        if (product.labels.includes(label)) return
                        product.labels.push(label)
                    })
                    this.onUpdateProduct(product)
                    return
                }
                if (this.scannerMode == 'purchase') {
                    const alignment = product.selectionAlignment
                    alignment.action = 'In'
                    this.updateAlignments([alignment])
                    return
                }
            }
        },
        async onUpdateProduct(product) {
            product = Object.assign({}, product)
            delete product.selectionInputList
            await this.updateProduct(product)
        },
    },
    created() {
        // Hook up event listeners for scans
        document.addEventListener('keydown', this.scanHandler)
    },
    destroyed() {
        // Clean up event listeners
        document.removeEventListener('keydown', this.scanHandler)
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
    .label-selector {
        margin-bottom: 20px;
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
