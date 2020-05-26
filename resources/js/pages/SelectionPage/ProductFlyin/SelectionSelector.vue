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
                    <i v-if="selection.type == 'Master'" class="far fa-crown" style="margin-right: 4px;"
                    v-tooltip="'<strong>Master</strong> selection'"></i>
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
        ...mapActions('products', ['showSelectionProductPDP']),
        ...mapMutations('selections', ['SET_CURRENT_PDP_SELECTION']),
        async onSetCurrentSelection(selection) {
            // const productToSet = this.currentProduct.selectionInputArray 
            //     ? this.currentProduct.selectionInputArray.find(x => x.selection.id == selection)
            //     : this.currentProduct
            this.showSelectionProductPDP({product: this.currentProduct, selection})
        },
    },
    created() {
        // Check the current selection
        this.selectedSelection = this.availableSelections.find(x => x.id == this.currentSelection.id)
    }
}
</script>

<style>

</style>