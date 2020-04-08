<template>
    <div class="selection-selector">
        <v-popover trigger="click">
            <button class="white">
                <!-- <i class="fas primary" :class="currentSelections.length > 1 ? 'fa-users-class' : 'fa-user'"></i> -->
                <i class="fas primary fa-users-class"></i>
                <span>{{currentSelections[0].name}} {{`${currentSelections.length > 1 ? '+ ' + Math.abs(currentSelections.length - 1) : ''}`}}</span>
                <i class="fas fa-caret-down"></i>
            </button>
            <template slot="popover">
                <BaseSelectButton v-for="theSelection in availableSelections" :key="theSelection.id"
                :modelValue="theSelection" v-model="selectedSelections">
                    <i v-if="!theSelection.is_visible" class="far fa-eye-slash" style="margin-right: 4px;"
                    v-tooltip="'Selection is <strong>Hidden</strong>. You can still make new input, even though the selection is hidden'"></i>
                    <i v-if="!theSelection.is_open" class="far fa-lock" style="margin-right: 4px;"
                    v-tooltip="'Selection is <strong>Locked</strong>. You can view input from a locked selection, but not make any new'"></i>
                    {{theSelection.name}}
                </BaseSelectButton>
                <div class="item-group actions">
                    <button class="primary" v-close-popover @click="onSetCurrentSelections"><span>Apply</span></button>
                    <button class="invisible ghost-hover" v-close-popover><span>Cancel</span></button>
                </div>
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'multipleSelectionSelector',
    data: function() { return {
        selectedSelections: [],
    }},
    computed: {
        ...mapGetters('selections', ['getCurrentSelections', 'getSelectionsAvailableForAlignment', 'currentSelectionMode']),
        currentSelections() {
            return this.getCurrentSelections
        },
        availableSelections() {
            return this.getSelectionsAvailableForAlignment
        },
    },
    methods: {
        ...mapActions('products', ['fetchSelectionProducts']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async onSetCurrentSelections() {
            const selections = this.selectedSelections
            // Fetch data for all the selections
            // Process all their data
            this.SET_CURRENT_SELECTIONS(selections)
            await this.fetchSelectionProducts({selections, addToState: true})
            // Set them as current
            this.selectedSelections = selections
        },
    },
    created() {
        // Find the corresponding selection in our available selections
        this.currentSelections.forEach(selection => {
            const selectionToPush = this.availableSelections.find(x => x.id == selection.id)
            if (selectionToPush) this.selectedSelections.push(selectionToPush)
        })
    }
}
</script>

<style>

</style>