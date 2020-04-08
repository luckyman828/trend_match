<template>
    <div class="selection-selector">
        <v-popover trigger="click">
            <button class="white">
                <i class="fas primary fa-users-class"></i>
                <span>{{currentSelection.name}}</span>
                <i class="fas fa-caret-down"></i>
            </button>
            <template slot="popover">
                <BaseSelectButton v-for="selection in availableSelections" :key="selection.id"
                type="radio" :modelValue="selection" v-model="selectedSelection"
                @input="onSetCurrentSelection" v-close-popover>
                    <i v-if="!selection.is_visible" class="far fa-eye-slash" style="margin-right: 4px;"
                    v-tooltip="'Selection is <strong>Hidden</strong>. You can still make new input, even though the selection is hidden'"></i>
                    <i v-if="!selection.is_open" class="far fa-lock" style="margin-right: 4px;"
                    v-tooltip="'Selection is <strong>Locked</strong>. You can view input from a locked selection, but not make any new'"></i>
                    {{selection.name}}
                </BaseSelectButton>
                <!-- <div class="item-group actions">
                    <button class="primary" v-close-popover @click="onSetCurrentSelections"><span>Apply</span></button>
                    <button class="invisible ghost-hover" v-close-popover><span>Cancel</span></button>
                </div> -->
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'selectionSelector',
    data: function() { return {
        selectedSelection: null,
    }},
    computed: {
        ...mapGetters('selections', ['getCurrentPDPSelection', 'getSelectionsAvailableForAlignment', 'getCurrentSelections']),
        ...mapGetters('products', ['products', 'currentProduct']),
        currentSelection() {
            return this.getCurrentPDPSelection
        },
        availableSelections() {
            return this.getSelectionsAvailableForAlignment
        },
    },
    methods: {
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        ...mapMutations('products', ['setCurrentProduct', 'setAvailableProducts']),
        async onSetCurrentSelection(selection) {
            // Set the current PDP selection
            this.SET_CURRENT_PDP_SELECTION(selection)

            // If we have already fetched the product data from this selection as selectionInput on our current product, simply use that data
            // Find the product in our products map, to be sure we get the original product, since the current product will be overwritten by us now.
            const stateProduct = this.products.find(x => x.id == this.currentProduct.id)
            const existingSelectionInput = stateProduct.selectionInputArray.find(x => x.selection.id == selection.id)
            if (existingSelectionInput) {
                // Set the current product
                this.setCurrentProduct(existingSelectionInput.product)
                // Set our avaialble products to the products from the chosen selection so we can navigate back and forth
                this.setAvailableProducts(this.products.map(product => {
                    const selectionInput = product.selectionInputArray.find(x => x.selection.id == selection.id)
                    return selectionInput.product
                    }
                ))
            } 
            
            // If we have not already fetched the data for this selection
            else {
                // Fetch the products for this selection, but don't save them to our state, since we only need them for our available products
                const selectionProducts = await this.fetchSelectionProducts({selections: [selection], addToState: false})
                // Set our available products equal to the recently fetched products
                this.setAvailableProducts(selectionProducts)
                // Set the currnet product
                this.setCurrentProduct(selectionProducts.find(x => x.id == this.currentProduct.id))
            }
        },
    },
    created() {
        // Check the current selection
        this.selectedSelection = this.currentSelection
    }
}
</script>

<style>

</style>