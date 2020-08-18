<template>
    <div class="scanner-mode-controls">
        <p><strong>Scanner:</strong> Choose what happens to scanned products</p>
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
            scannerMode: 'getScannerMode'
        }),
        ...mapGetters('products', ['products', 'getActiveSelectionInput']),
        ...mapGetters('selections', ['getCurrentSelection', 'currentSelectionMode']),
    },
    methods: {
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapActions('actions', ['updateActions', 'updateFeedbacks']),
        ...mapMutations('scanner', ['SET_SCANNER_MODE']),
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
            // Find the matched product
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

                if (this.currentSelectionMode == 'Feedback') {
                    const selectionFeedback = selectionInput.yourSelectionFeedback
                    this.updateFeedbacks({actions: [selectionFeedback], newAction: this.scannerMode})
                }
                if (this.currentSelectionMode == 'Alignment') {
                    const selectionAction = selectionInput.selectionAction
                    this.updateActions({actions: [selectionAction], newAction: this.scannerMode})
                }
            }
        }

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