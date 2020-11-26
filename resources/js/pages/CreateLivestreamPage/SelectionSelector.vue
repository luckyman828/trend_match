<template>
    <div class="selection-selector">
        <v-popover trigger="click">
            <button class="white">
                <i class="fas primary fa-users-class"></i>
                <span>{{ currentSelection ? currentSelection.name : 'Choose selection' }}</span>
                <i class="fas fa-caret-down"></i>
            </button>
            <template slot="popover">
                <BaseSelectButton
                    v-for="selection in availableSelections"
                    :key="selection.id"
                    type="radio"
                    :modelValue="selection"
                    v-model="selectedSelection"
                    @input="onSetCurrentSelection"
                    v-close-popover
                >
                    <i
                        v-if="selection.type == 'Master'"
                        class="far fa-crown"
                        style="margin-right: 4px;"
                        v-tooltip="'<strong>Master</strong> selection'"
                    ></i>
                    <i
                        v-if="!selection.is_visible"
                        class="far fa-eye-slash"
                        style="margin-right: 4px;"
                        v-tooltip="
                            'Selection is <strong>Hidden</strong>. You can still make new input, even though the selection is hidden'
                        "
                    ></i>
                    <i
                        v-if="!selection.is_open"
                        class="far fa-lock"
                        style="margin-right: 4px;"
                        v-tooltip="
                            'Selection is <strong>Locked</strong>. You can view input from a locked selection, but not make any new'
                        "
                    ></i>
                    {{ selection.name }}
                </BaseSelectButton>
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'selectionSelector',
    data: function() {
        return {
            selectedSelection: null,
        }
    },
    computed: {
        ...mapGetters('selections', ['currentSelection', 'getSelectionsAvailableForAlignment']),
        ...mapGetters('products', ['products', 'currentProduct']),
        availableSelections() {
            return this.getSelectionsAvailableForAlignment
        },
    },
    watch: {
        currentSelection(newVal) {
            this.SET_CURRENT_SELECTION()
        },
    },
    methods: {
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async onSetCurrentSelection(selection) {
            this.SET_CURRENT_SELECTIONS([selection])
        },
        SET_CURRENT_SELECTION() {
            // Check the current selection
            this.selectedSelection = this.availableSelections.find(x => x.id == this.currentSelection.id)
        },
    },
}
</script>

<style scoped lang="scss"></style>
